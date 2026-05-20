import { createSupabaseClient } from '../_shared/engine/supabaseClient.ts';
import { WorkflowDefinition, WorkflowNode, ExecutionResult } from '../_shared/engine/types.ts';
import { buildExecutionContext } from '../_shared/engine/ExecutionContext.ts';
import { maybeMarkExecutionFailed, maybeMarkExecutionComplete } from '../_shared/engine/helpers.ts';
import { initExecutors } from '../_shared/engine/executors/init.ts';
import { ExecutorRegistry } from '../_shared/engine/executors/Registry.ts';

// Initialize the registry
initExecutors();

Deno.serve(async (req: Request) => {
  let reqBody;
  try {
    reqBody = await req.json();
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const { executionId, nodeId } = reqBody;
  if (!executionId || !nodeId) {
    return new Response('missing executionId or nodeId', { status: 400 });
  }

  const supabase = createSupabaseClient();

  // ── 1. Load execution + workflow ─────────────────────────────────────────
  const { data: execution, error: execError } = await supabase
    .from('executions')
    .select('*, workflows(definition, user_id)')
    .eq('id', executionId)
    .single();

  if (execError || !execution || execution.status === 'failed') {
    return new Response('execution not found or already failed', { status: 200 });
  }

  const definition: WorkflowDefinition = execution.workflows.definition as unknown as WorkflowDefinition;
  const node = definition.nodes.find(n => n.id === nodeId);
  if (!node) return new Response('node not found in definition', { status: 200 });

  // ── 2. Fan-in gate: all parent nodes must be 'success' ───────────────────
  const parentNodeIds = definition.edges
    .filter(e => e.target === nodeId)
    .map(e => e.source);

  if (parentNodeIds.length > 0) {
    const { data: parentRows } = await supabase
      .from('node_executions')
      .select('node_id, status')
      .eq('execution_id', executionId)
      .in('node_id', parentNodeIds);

    const allDone = parentNodeIds.every(id =>
      parentRows?.find(r => r.node_id === id)?.status === 'success'
    );

    if (!allDone) {
      // Another parallel branch hasn't finished yet.
      return new Response('deferred — waiting for other parents', { status: 200 });
    }
  }

  // ── 3. Mark this node as running ─────────────────────────────────────────
  await supabase.from('node_executions')
    .update({ status: 'running' })
    .eq('execution_id', executionId)
    .eq('node_id', nodeId);

  // ── 4. Load all previous node outputs to build interpolation state ────────
  const { data: completedNodes } = await supabase
    .from('node_executions')
    .select('node_id, output_data')
    .eq('execution_id', executionId)
    .eq('status', 'success');

  const state: Record<string, unknown> = {
    trigger: execution.trigger_payload,
    ...Object.fromEntries((completedNodes ?? []).map(r => [r.node_id, r.output_data])),
  };

  // ── 5. Build context and interpolate node config ──────────────────────────
  const context = buildExecutionContext({
    executionId,
    workflowId: execution.workflow_id,
    userId: execution.workflows.user_id,
    triggerPayload: execution.trigger_payload,
    state,
  });

  const interpolatedNode: WorkflowNode = {
    ...node,
    data: context.interpolate(node.data) as Record<string, unknown>,
  };

  // ── 6. Execute ────────────────────────────────────────────────────────────
  const nodeType = node.data.type as string;
  const executor = ExecutorRegistry.get(nodeType);
  if (!executor) {
    await supabase.from('node_executions')
      .update({ status: 'failed', error_message: `Unknown node type: ${nodeType}` })
      .eq('execution_id', executionId)
      .eq('node_id', nodeId);
    await maybeMarkExecutionFailed(supabase, executionId);
    return new Response('unknown executor', { status: 200 });
  }

  let result: ExecutionResult;
  try {
    result = await executor.execute(interpolatedNode, context);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    result = { status: 'failed', error: errorMsg };
  }

  // ── 7. Write result ───────────────────────────────────────────────────────
  await supabase.from('node_executions').update({
    status: result.status,
    output_data: result.output ?? {},
    input_data: interpolatedNode.data,
    error_message: result.error ?? null,
  }).eq('execution_id', executionId).eq('node_id', nodeId);

  // ── 8. Handle failure ─────────────────────────────────────────────────────
  if (result.status === 'failed') {
    const { data: nodeExec } = await supabase
      .from('node_executions')
      .select('retry_count')
      .eq('execution_id', executionId)
      .eq('node_id', nodeId)
      .single();

    const MAX_RETRIES = (node.data.maxRetries as number) ?? 0;
    if ((nodeExec?.retry_count ?? 0) < MAX_RETRIES) {
      await supabase.from('node_executions')
        .update({ status: 'pending', retry_count: (nodeExec?.retry_count ?? 0) + 1 })
        .eq('execution_id', executionId).eq('node_id', nodeId);

      const functionsUrl = Deno.env.get('SUPABASE_FUNCTIONS_URL');
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      fetch(`${functionsUrl}/execute-node`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`
        },
        body: JSON.stringify({ executionId, nodeId }),
      }).catch(console.error);

    } else {
      await maybeMarkExecutionFailed(supabase, executionId);
    }
    return new Response('node failed', { status: 200 });
  }

  // ── 9. Determine which downstream nodes to activate ───────────────────────
  const outgoingEdges = definition.edges.filter(e => e.source === nodeId);

  const activeEdges = result.branchTarget
    ? outgoingEdges.filter(e => e.sourceHandle === result.branchTarget)
    : outgoingEdges;

  if (result.branchTarget) {
    const skippedEdges = outgoingEdges.filter(e => e.sourceHandle !== result.branchTarget);
    for (const edge of skippedEdges) {
      // Cannot use onConflict ignoreDuplicates on RPC directly, so check existing first or handle manually
      const { data: existing } = await supabase.from('node_executions')
        .select('id')
        .eq('execution_id', executionId)
        .eq('node_id', edge.target)
        .single();
      
      if (!existing) {
        await supabase.from('node_executions').insert({
          execution_id: executionId,
          node_id: edge.target,
          node_type: (definition.nodes.find(n => n.id === edge.target)?.data?.type as string) ?? 'unknown',
          status: 'skipped',
        });
      }
    }
  }

  // ── 10. Insert pending rows and fire downstream ───────────────────────────
  for (const edge of activeEdges) {
    const nextNode = definition.nodes.find(n => n.id === edge.target);
    if (!nextNode) continue;

    const { data: existing } = await supabase.from('node_executions')
      .select('id')
      .eq('execution_id', executionId)
      .eq('node_id', edge.target)
      .single();

    if (!existing) {
      await supabase.from('node_executions').insert({
        execution_id: executionId,
        node_id: edge.target,
        node_type: nextNode.data.type as string,
        status: 'pending',
      });
    }

    const functionsUrl = Deno.env.get('SUPABASE_FUNCTIONS_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    fetch(`${functionsUrl}/execute-node`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`
      },
      body: JSON.stringify({ executionId, nodeId: edge.target }),
    }).catch(console.error);
  }

  // ── 11. Check if execution is complete ────────────────────────────────────
  if (activeEdges.length === 0) {
    await maybeMarkExecutionComplete(supabase, executionId);
  }

  return new Response('ok', { status: 200 });
});
