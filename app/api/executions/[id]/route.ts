import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/src/shared/utils/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
