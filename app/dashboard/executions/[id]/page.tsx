import { createSupabaseServerClient } from '@/src/shared/utils/supabase-server';
import { PageLayout } from "@/src/shared/ui/PageLayout";
import { notFound } from 'next/navigation';
import { CheckCircle, XCircle, PlayCircle, Timer, Clock } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils/cn";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const STATUS_CONFIG = {
  success: {
    label: "Success",
    className: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
  running: {
    label: "Running",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: PlayCircle,
  },
  pending: {
    label: "Waiting",
    className: "bg-muted/10 text-muted-foreground border-muted/20",
    icon: Timer,
  },
  skipped: {
    label: "Skipped",
    className: "bg-muted/10 text-muted-foreground border-muted/20",
    icon: Timer,
  },
  timed_out: {
    label: "Timed Out",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  }
} as const;

interface NodeExecution {
  id: string;
  node_type: string;
  node_id: string;
  status: string;
  created_at: string;
}

export default async function ExecutionDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const { data: execution, error: executionError } = await supabase
    .from('executions')
    .select('*, workflows(name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (executionError || !execution) {
    notFound();
  }

  const { data: nodeExecutions } = await supabase
    .from('node_executions')
    .select('*')
    .eq('execution_id', id)
    .order('created_at', { ascending: true });

  const config = STATUS_CONFIG[execution.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
  const ExecIcon = config.icon;

  return (
    <PageLayout
      title={`Execution Details`}
      description={`Viewing run history for ${execution.workflows?.name || 'Workflow'}`}
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Execution {execution.id.split('-')[0]}...</h2>
            <p className="text-sm text-muted-foreground">
              Triggered via <span className="capitalize font-medium text-foreground">webhook</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <span className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border w-fit",
              config.className
            )}>
              <ExecIcon className="h-4 w-4" weight="fill" />
              {config.label}
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Started: {new Date(execution.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {execution.error_message && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <p className="font-semibold mb-1">Execution Error:</p>
            <p>{execution.error_message}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Node Execution Log</h3>
          
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 text-xs uppercase font-medium text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4">Node Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Executed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {nodeExecutions?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No nodes executed yet.
                    </td>
                  </tr>
                ) : (
                  (nodeExecutions as unknown as NodeExecution[] | null)?.map((node: NodeExecution) => {
                    const nodeConfig = STATUS_CONFIG[node.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                    const NodeIcon = nodeConfig.icon;
                    return (
                      <tr key={node.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{node.node_type}</span>
                            <span className="text-[11px] text-muted-foreground font-mono">{node.node_id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border",
                            nodeConfig.className
                          )}>
                            <NodeIcon className="h-3 w-3" />
                            {nodeConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {node.created_at ? new Date(node.created_at).toLocaleTimeString() : '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
