import { createSupabaseClient } from '../_shared/engine/supabaseClient.ts';
import { WorkflowDefinition } from '../_shared/engine/types.ts';

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const workflowId = url.searchParams.get('workflowId');
  if (!workflowId) return new Response('missing workflowId', { status: 400 });

  let triggerPayload = {};
  try {
    if (req.body) {
      triggerPayload = await req.json();
    }
  } catch (err) {
    console.error('Failed to parse trigger payload', err);
  }

  const supabase = createSupabaseClient();

  // 1. Load workflow (verify it exists + get definition + user_id)
  const { data: workflow, error } = await supabase
    .from('workflows')
    .select('id, user_id, definition, is_active')
    .eq('id', workflowId)
    .single();

  if (error || !workflow || !workflow.is_active) {
    return new Response('workflow not found or inactive', { status: 404 });
  }

  const definition: WorkflowDefinition = workflow.definition as unknown as WorkflowDefinition;

  // 2. Create execution row
  const { data: execution, error: executionError } = await supabase
    .from('executions')
    .insert({
      workflow_id: workflow.id,
      user_id: workflow.user_id,
      status: 'running',
      trigger_payload: triggerPayload,
    })
    .select('id')
    .single();

  if (executionError || !execution) {
    return new Response('failed to create execution', { status: 500 });
  }

  // 3. Find trigger nodes: nodes with zero incoming edges
  const nodesWithIncoming = new Set(definition.edges.map(e => e.target));
  const triggerNodes = definition.nodes.filter(n => !nodesWithIncoming.has(n.id));

  if (triggerNodes.length === 0) {
    await supabase.from('executions').update({ status: 'failed', error_message: 'No trigger node found' }).eq('id', execution.id);
    return new Response('no trigger nodes', { status: 400 });
  }

  // 4. Insert pending node_executions for each trigger node
  await supabase.from('node_executions').insert(
    triggerNodes.map(n => ({
      execution_id: execution.id,
      node_id: n.id,
      node_type: (n.data?.type as string) ?? n.type,
      status: 'pending',
    }))
  );

  // 5. Fire execute-node for each trigger node via pg_net
  // Assuming pg_net is available or just using a regular Deno fetch to the edge function URL
  const functionsUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1`;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  for (const node of triggerNodes) {
    // using raw fetch to trigger the next function instead of pg_net for edge-function to edge-function call
    // pg_net is best when triggered from pg triggers. Here we're already in Deno
    // We do it asynchronously without awaiting the response
    fetch(`${functionsUrl}/execute-node`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`
      },
      body: JSON.stringify({ executionId: execution.id, nodeId: node.id }),
    }).catch(console.error);
  }

  // Immediate 200 — caller doesn't wait for execution
  return new Response(JSON.stringify({ executionId: execution.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
