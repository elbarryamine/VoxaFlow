import { createSupabaseServerClient } from '@/src/shared/utils/supabase-server';
import { PageLayout } from '@/src/shared/ui/PageLayout';
import { notFound } from 'next/navigation';
import { ExecutionDetail } from '@/src/features/executions/ui/ExecutionDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExecutionDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Unauthorized</div>;

  const { data: execution, error: executionError } = await supabase
    .from('executions')
    .select('*, workflows(name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (executionError || !execution) notFound();

  const { data: nodeExecutions } = await supabase
    .from('node_executions')
    .select('*')
    .eq('execution_id', id)
    .order('created_at', { ascending: true });

  const nodeExecutionIds = (nodeExecutions ?? []).map((n: { id: string }) => n.id);

  const { data: initialLogs } = nodeExecutionIds.length > 0
    ? await supabase
        .from('node_execution_logs')
        .select('*')
        .in('node_execution_id', nodeExecutionIds)
        .order('created_at', { ascending: true })
    : { data: [] };

  return (
    <PageLayout
      title="Execution Details"
      description={`Viewing run history for ${execution.workflows?.name || 'Workflow'}`}
    >
      <ExecutionDetail
        initialExecution={execution}
        initialNodeExecutions={nodeExecutions ?? []}
        initialLogs={initialLogs ?? []}
      />
    </PageLayout>
  );
}
