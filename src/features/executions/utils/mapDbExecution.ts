import type { Execution } from '../types/Execution.types';

export interface DbExecutionRow {
  id: string;
  workflow_id: string;
  status: string;
  created_at: string;
  finished_at: string | null;
  workflows: { name: string } | null;
}

export function mapExecutionStatus(
  status: string,
): Execution['status'] {
  if (status === 'success' || status === 'failed' || status === 'running' || status === 'waiting') {
    return status;
  }
  if (status === 'timed_out') return 'failed';
  return 'waiting';
}

export function formatExecutionDuration(
  createdAt: string,
  finishedAt: string | null,
  status: string,
): string {
  if (!finishedAt) {
    return status === 'running' || status === 'pending' ? '…' : '—';
  }
  const ms = new Date(finishedAt).getTime() - new Date(createdAt).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export function mapDbExecution(exec: DbExecutionRow): Execution {
  return {
    id: exec.id,
    workflowId: exec.workflow_id,
    workflowName: exec.workflows?.name ?? 'Unknown Workflow',
    status: mapExecutionStatus(exec.status),
    duration: formatExecutionDuration(exec.created_at, exec.finished_at, exec.status),
    trigger: 'Webhook',
    startedAt: exec.created_at,
  };
}
