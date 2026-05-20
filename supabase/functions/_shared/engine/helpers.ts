import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';
import { WorkflowDefinition } from './types.ts';

export async function maybeMarkExecutionFailed(
  supabase: SupabaseClient,
  executionId: string,
  definition: WorkflowDefinition
) {
  const { data: rows } = await supabase
    .from('node_executions')
    .select('status')
    .eq('execution_id', executionId);

  const hasFailed = rows?.some(r => r.status === 'failed');
  const hasActive = rows?.some(r => r.status === 'pending' || r.status === 'running');

  if (hasFailed && !hasActive) {
    await supabase.from('executions').update({
      status: 'failed',
      finished_at: new Date().toISOString(),
    }).eq('id', executionId);
  }
}

export async function maybeMarkExecutionComplete(
  supabase: SupabaseClient,
  executionId: string,
  definition: WorkflowDefinition
) {
  const { data: rows } = await supabase
    .from('node_executions')
    .select('status')
    .eq('execution_id', executionId);

  const allDone = rows?.every(r => ['success', 'failed', 'skipped'].includes(r.status));
  const anyFailed = rows?.some(r => r.status === 'failed');

  if (allDone) {
    await supabase.from('executions').update({
      status: anyFailed ? 'failed' : 'success',
      finished_at: new Date().toISOString(),
    }).eq('id', executionId);
  }
}
