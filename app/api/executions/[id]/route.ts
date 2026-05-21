import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/src/shared/utils/supabase-server';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: execution, error: executionError } = await supabase
      .from('executions')
      .select('*, workflows(name)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (executionError) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    }

    // Since node_executions policy checks existence of execution matching user_id
    // we can just query it by execution_id
    const { data: nodeExecutions, error: nodeError } = await supabase
      .from('node_executions')
      .select('*')
      .eq('execution_id', id)
      .order('created_at', { ascending: true });

    if (nodeError) {
      throw nodeError;
    }

    return NextResponse.json({
      ...execution,
      nodes: nodeExecutions,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // Verify ownership before deleting
    const { data: execution, error: fetchError } = await supabase
      .from('executions')
      .select('id, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !execution) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    }

    if (execution.status === 'running') {
      return NextResponse.json(
        { error: 'Cannot delete a running execution. Cancel it first.' },
        { status: 409 },
      );
    }

    const { error } = await supabase
      .from('executions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
