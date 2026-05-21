import { PageLayout } from "@/src/shared/ui/PageLayout";
import { ExecutionsList } from "@/src/features/executions/ui/ExecutionsList";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";
import { mapDbExecution, type DbExecutionRow } from "@/src/features/executions/utils/mapDbExecution";

export default async function ExecutionsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const { data: dbExecutions } = await supabase
    .from('executions')
    .select('*, workflows(name), node_executions(node_id, node_type, status, created_at)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const executions = (dbExecutions as DbExecutionRow[] | null ?? []).map(mapDbExecution);

  return (
    <PageLayout
      title="Executions"
      description="Monitor and manage your workflow execution history"
      contentClassName={
        executions.length === 0
          ? "flex min-h-0 flex-1 flex-col"
          : undefined
      }
    >
      <ExecutionsList initialExecutions={executions} userId={user.id} />
    </PageLayout>
  );
}
