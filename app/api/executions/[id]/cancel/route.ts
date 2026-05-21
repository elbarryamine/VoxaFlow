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

    const { data: execution, error: fetchError } = await supabase
      .from('executions')
      .select('id, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !execution) {
      return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    }

    if (execution.status !== 'running' && execution.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Only running or waiting executions can be cancelled.' },
        { status: 409 },
      );
    }

    // Mark as failed with a cancellation message
    const { error } = await supabase
      .from('executions')
      .update({ status: 'failed', error_message: 'Cancelled by user', finished_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    // Mark any pending/running node_executions as skipped
    await supabase
      .from('node_executions')
      .update({ status: 'skipped' })
      .eq('execution_id', id)
      .in('status', ['pending', 'running']);

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
