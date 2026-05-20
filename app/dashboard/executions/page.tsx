import { PageLayout } from "@/src/shared/ui/PageLayout";
import { ExecutionCard } from "@/src/features/executions/ui/ExecutionCard";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";
import { Execution } from "@/src/features/executions/types/Execution.types";

export default async function ExecutionsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const { data: dbExecutions } = await supabase
    .from('executions')
    .select('*, workflows(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const executions: Execution[] = (dbExecutions || []).map((exec: any) => {
    let durationStr = "—";
    if (exec.created_at && exec.finished_at) {
      const ms = new Date(exec.finished_at).getTime() - new Date(exec.created_at).getTime();
      const s = Math.floor(ms / 1000);
      if (s < 60) durationStr = `${s}s`;
      else durationStr = `${Math.floor(s / 60)}m ${s % 60}s`;
    }

    // Map 'timed_out' and 'pending' to frontend expected statuses if necessary
    // 'timed_out' -> 'failed', 'pending' -> 'waiting'
    let mappedStatus = exec.status;
    if (mappedStatus === 'timed_out') mappedStatus = 'failed';
    if (mappedStatus === 'pending') mappedStatus = 'waiting';

    return {
      id: exec.id,
      workflowId: exec.workflow_id,
      workflowName: exec.workflows?.name || "Unknown Workflow",
      status: mappedStatus,
      duration: durationStr,
      trigger: "Webhook",
      startedAt: exec.created_at,
    };
  });

  return (
    <PageLayout
      title="Executions"
      description="Monitor and manage your workflow execution history"
    >
      {executions.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center">
          <h3 className="mb-1 text-lg font-medium text-foreground">No executions yet</h3>
          <p className="text-sm text-muted-foreground">
            When your workflows run, their history will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {executions.map((execution) => (
            <ExecutionCard key={execution.id} execution={execution} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
