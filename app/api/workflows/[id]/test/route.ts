import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/src/shared/utils/supabase-server';
import { DEFAULT_TRIGGER_MOCK_DATA } from '@/src/features/workflows/constants/DEFAULT_TRIGGER_MOCK_DATA';
import type { WorkflowDefinition, WorkflowNodeType } from '@/src/features/workflows/types/Workflow.types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Load workflow
    const { data: workflow, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const definition = workflow.definition as unknown as WorkflowDefinition;
    if (!definition || !definition.nodes) {
      return NextResponse.json({ error: 'Workflow definition is empty' }, { status: 400 });
    }

    // 2. Find trigger nodes in the workflow definition
    const nodes = definition.nodes;
    const edges = definition.edges || [];

    const nodesWithIncoming = new Set(edges.map((e) => e.target));
    const triggerNodes = nodes.filter((n) => {
      const isTriggerType = n.type?.startsWith('webhook-') || n.type === 'trigger';
      const hasNoIncoming = !nodesWithIncoming.has(n.id);
      return isTriggerType || hasNoIncoming;
    });

    if (triggerNodes.length === 0) {
      return NextResponse.json({ error: 'No trigger node found in workflow' }, { status: 400 });
    }

    const executionIds: string[] = [];

    for (const triggerNode of triggerNodes) {
      // Get mock data payload
      let mockPayload: Record<string, unknown> = {};
      if (triggerNode.data && triggerNode.data.testMockData) {
        try {
          mockPayload = typeof triggerNode.data.testMockData === 'string'
            ? JSON.parse(triggerNode.data.testMockData)
            : triggerNode.data.testMockData;
        } catch (e) {
          console.error("Failed to parse mock data for node", triggerNode.id, e);
          // Fall back to default mock data if saved mock data is invalid JSON
          mockPayload = (DEFAULT_TRIGGER_MOCK_DATA[triggerNode.type as WorkflowNodeType] || {}) as Record<string, unknown>;
        }
      } else {
        mockPayload = (DEFAULT_TRIGGER_MOCK_DATA[triggerNode.type as WorkflowNodeType] || {}) as Record<string, unknown>;
      }

      // Create execution record
      const { data: execution, error: executionError } = await supabase
        .from('executions')
        .insert({
          workflow_id: workflow.id,
          user_id: user.id,
          status: 'running',
          trigger_payload: mockPayload,
        })
        .select('id')
        .single();

      if (executionError || !execution) {
        console.error("Failed to create execution for trigger node", triggerNode.id, executionError);
        continue;
      }

      // Create node_executions for the trigger node
      const { error: nodeExecError } = await supabase.from('node_executions').insert({
        execution_id: execution.id,
        node_id: triggerNode.id,
        node_type: triggerNode.type,
        status: 'pending',
      });

      if (nodeExecError) {
        console.error("Failed to create node execution for trigger node", triggerNode.id, nodeExecError);
        continue;
      }

      // Invoke execute-node edge function via supabase functions client
      supabase.functions.invoke('execute-node', {
        body: { executionId: execution.id, nodeId: triggerNode.id },
      }).catch((err) => {
        console.error("Failed to call execute-node edge function async", err);
      });

      executionIds.push(execution.id);
    }

    if (executionIds.length === 0) {
      return NextResponse.json({ error: 'Failed to start any executions' }, { status: 500 });
    }

    return NextResponse.json({ success: true, executionIds });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
