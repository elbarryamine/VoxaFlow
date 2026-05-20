import { createSupabaseClient } from './supabaseClient.ts';
import { WorkflowDefinition, WorkflowNode, ExecutionResult } from './types.ts';
import { buildExecutionContext } from './ExecutionContext.ts';
import { maybeMarkExecutionFailed, maybeMarkExecutionComplete } from './helpers.ts';
import { initExecutors } from './executors/init.ts';
import { ExecutorRegistry } from './executors/Registry.ts';
import { NodeLogger } from './NodeLogger.ts';

initExecutors();

export type RunExecuteNodeResult =
  | 'ok'
  | 'invalid'
  | 'execution not found or already failed'
  | 'node not found in definition'
  | 'skipped — parent failed or was skipped'
  | 'deferred — waiting for other parents'
  | 'node_execution row not found'
  | 'unknown executor'
  | 'node failed';

/** Run a single workflow node (used by the HTTP handler and in-process downstream calls). */
export async function runExecuteNode(
  executionId: string,
  nodeId: string,
): Promise<RunExecuteNodeResult> {
  const supabase = createSupabaseClient();

  const { data: execution, error: execError } = await supabase
    .from('executions')
    .select('*, workflows(definition, user_id)')
    .eq('id', executionId)
    .single();

  if (execError || !execution || execution.status === 'failed') {
    return 'execution not found or already failed';
  }

  const definition: WorkflowDefinition = execution.workflows.definition as unknown as WorkflowDefinition;
  const node = definition.nodes.find(n => n.id === nodeId);
  if (!node) return 'node not found in definition';

  const parentNodeIds = definition.edges
    .filter(e => e.target === nodeId)
    .map(e => e.source);

  if (parentNodeIds.length > 0) {
    const { data: parentRows } = await supabase
      .from('node_executions')
      .select('node_id, status')
      .eq('execution_id', executionId)
      .in('node_id', parentNodeIds);

    const TERMINAL_STATUSES = ['success', 'failed', 'skipped'];

    const allSuccess = parentNodeIds.every(id =>
      parentRows?.find((r: { node_id: string; status: string }) => r.node_id === id)?.status === 'success'
    );

    if (!allSuccess) {
      const allTerminal = parentNodeIds.every(id =>
        TERMINAL_STATUSES.includes(parentRows?.find((r: { node_id: string; status: string }) => r.node_id === id)?.status ?? '')
      );

      if (allTerminal) {
        await supabase.from('node_executions')
          .update({ status: 'skipped' })
          .eq('execution_id', executionId)
          .eq('node_id', nodeId);
        await maybeMarkExecutionComplete(supabase, executionId);
        return 'skipped — parent failed or was skipped';
      }

      return 'deferred — waiting for other parents';
    }
  }

  const { data: nodeExecRow, error: nodeExecRowError } = await supabase.from('node_executions')
    .update({ status: 'running', started_at: new Date().toISOString() })
    .eq('execution_id', executionId)
    .eq('node_id', nodeId)
    .select('id')
    .single();

  if (nodeExecRowError || !nodeExecRow) {
    console.error('Failed to mark node as running:', nodeExecRowError);
    return 'node_execution row not found';
  }

  const logger = new NodeLogger(nodeExecRow.id, supabase);

  const { data: completedNodes } = await supabase
    .from('node_executions')
    .select('node_id, output_data')
    .eq('execution_id', executionId)
    .eq('status', 'success');

  const state: Record<string, unknown> = {
    trigger: execution.trigger_payload,
    ...Object.fromEntries((completedNodes ?? []).map(r => [r.node_id, r.output_data])),
  };

  const context = buildExecutionContext({
    executionId,
    workflowId: execution.workflow_id,
    userId: execution.workflows.user_id,
    triggerPayload: execution.trigger_payload,
    state,
    logger,
  });

  const interpolatedNode: WorkflowNode = {
    ...node,
    data: context.interpolate(node.data) as Record<string, unknown>,
  };

  const nodeType = node.data.type as string;
  const executor = ExecutorRegistry.get(nodeType);
  if (!executor) {
    await supabase.from('node_executions')
      .update({ status: 'failed', error_message: `Unknown node type: ${nodeType}`, finished_at: new Date().toISOString() })
      .eq('execution_id', executionId)
      .eq('node_id', nodeId);
    await maybeMarkExecutionFailed(supabase, executionId);
    return 'unknown executor';
  }

  let result: ExecutionResult;
  try {
    result = await executor.execute(interpolatedNode, context);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    result = { status: 'failed', error: errorMsg };
  }

  await supabase.from('node_executions').update({
    status: result.status,
    output_data: result.output ?? {},
    input_data: interpolatedNode.data,
    error_message: result.error ?? null,
    finished_at: new Date().toISOString(),
  }).eq('execution_id', executionId).eq('node_id', nodeId);

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

      await invokeExecuteNode(executionId, nodeId);
    } else {
      await maybeMarkExecutionFailed(supabase, executionId);
    }
    return 'node failed';
  }

  const outgoingEdges = definition.edges.filter(e => e.source === nodeId);

  const activeEdges = result.branchTarget
    ? outgoingEdges.filter(e => e.sourceHandle === result.branchTarget)
    : outgoingEdges;

  if (result.branchTarget) {
    const skippedEdges = outgoingEdges.filter(e => e.sourceHandle !== result.branchTarget);
    for (const edge of skippedEdges) {
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

  const downstreamRuns: Promise<RunExecuteNodeResult>[] = [];
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

    downstreamRuns.push(invokeExecuteNode(executionId, edge.target));
  }
  await Promise.all(downstreamRuns);

  if (activeEdges.length === 0) {
    await maybeMarkExecutionComplete(supabase, executionId);
  }

  return 'ok';
}

/** In-process downstream invocation (avoids edge-to-edge HTTP JWT issues). */
export async function invokeExecuteNode(
  executionId: string,
  nodeId: string,
): Promise<RunExecuteNodeResult> {
  try {
    return await runExecuteNode(executionId, nodeId);
  } catch (err) {
    console.error(`invokeExecuteNode ${nodeId}:`, err);
    return 'node failed';
  }
}
