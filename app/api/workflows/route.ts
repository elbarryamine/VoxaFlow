import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/src/shared/utils/supabase-server';

// GET /api/workflows — list all workflows
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('workflows')
      .select(`
        *,
        executions(count)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Map counts and last run info if needed
    const workflows = data.map(wf => ({
      ...wf,
      runsCount: wf.executions?.[0]?.count || 0,
      lastRun: 'Never', // We could fetch latest finished_at if we wanted
    }));

    return NextResponse.json(workflows);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/workflows — create a new workflow
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, definition } = body;

    const { data, error } = await supabase
      .from('workflows')
      .insert({
        user_id: user.id,
        name: name || 'Untitled Workflow',
        definition: definition || { nodes: [], edges: [] },
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
