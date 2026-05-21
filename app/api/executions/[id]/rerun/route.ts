import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/src/shared/utils/supabase-server';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // Load the original execution to get workflow_id and trigger_payload
    const { data: original, error: fetchError } = await supabase
      .from('executions')
      .select('id, workflow_id, trigger_payload, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !original) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    }

    // Load the workflow definition to find trigger nodes
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('id, definition, is_active')
      .eq('id', original.workflow_id)
      .eq('user_id', user.id)
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    if (!workflow.is_active) {
      return NextResponse.json({ error: 'Workflow is inactive. Activate it before rerunning.' }, { status: 409 });
    }

    // Create a new execution row
    const { data: newExecution, error: insertError } = await supabase
      .from('executions')
      .insert({
        workflow_id: original.workflow_id,
        user_id: user.id,
        status: 'running',
        trigger_payload: original.trigger_payload ?? {},
      })
      .select('id')
      .single();

    if (insertError || !newExecution) {
      return NextResponse.json({ error: 'Failed to create execution' }, { status: 500 });
    }

    // Find trigger nodes (nodes with zero incoming edges)
    type WorkflowDefinition = { nodes: { id: string }[]; edges: { target: string }[] };
    const definition = workflow.definition as unknown as WorkflowDefinition;
    const nodesWithIncoming = new Set(definition.edges.map((e) => e.target));
    const triggerNodes = definition.nodes.filter((n) => !nodesWithIncoming.has(n.id));

    if (triggerNodes.length === 0) {
      await supabase
        .from('executions')
        .update({ status: 'failed', error_message: 'No trigger node found' })
        .eq('id', newExecution.id);
      return NextResponse.json({ error: 'No trigger node found in workflow' }, { status: 400 });
    }

    // Insert pending node_executions for each trigger node and invoke execute-node
    await supabase.from('node_executions').insert(
      triggerNodes.map((n) => ({
        execution_id: newExecution.id,
        node_id: n.id,
        node_type: (n as { id: string; type?: string }).type ?? 'unknown',
        status: 'pending',
      })),
    );

    // Invoke the execute-node edge function for each trigger node
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      await Promise.all(
        triggerNodes.map((n) =>
          fetch(`${supabaseUrl}/functions/v1/execute-node`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              executionId: newExecution.id,
              nodeId: n.id,
            }),
          }).catch(() => null),
        ),
      );
    }

    return NextResponse.json({ executionId: newExecution.id });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
