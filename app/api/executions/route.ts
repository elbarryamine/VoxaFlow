import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/src/shared/utils/supabase-server';

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('executions')
      .select('*, workflows(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (workflowId) {
      query = query.eq('workflow_id', workflowId);
    }

    const { data: executions, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(executions);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
