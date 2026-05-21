import { getExecutionNodeLabel } from '../constants/NODE_LABELS';
import type {
  Execution,
  ExecutionNodeStep,
  ExecutionNodeStepStatus,
} from '../types/Execution.types';

export interface DbNodeExecutionRow {
  node_id: string;
  node_type: string;
  status: string;
  created_at?: string;
}

export interface DbExecutionRow {
  id: string;
  workflow_id: string;
  status: string;
  created_at: string;
  finished_at: string | null;
  workflows: { name: string } | null;
  node_executions?: DbNodeExecutionRow[];
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

function mapNodeStepStatus(status: string): ExecutionNodeStepStatus {
  if (
    status === 'success' ||
    status === 'failed' ||
    status === 'running' ||
    status === 'skipped'
  ) {
    return status;
  }
  return 'pending';
}

function mapNodePath(rows: DbNodeExecutionRow[] | undefined): ExecutionNodeStep[] {
  if (!rows?.length) return [];

  return [...rows]
    .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''))
    .map((row) => ({
      nodeId: row.node_id,
      nodeType: row.node_type,
      label: getExecutionNodeLabel(row.node_type),
      status: mapNodeStepStatus(row.status),
    }));
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

function resolveTrigger(nodePath: ExecutionNodeStep[]): string {
  const triggerNode = nodePath.find((step) =>
    step.nodeType.startsWith('webhook-'),
  );
  return triggerNode?.label ?? 'Workflow';
}

export function mapDbExecution(exec: DbExecutionRow): Execution {
  const nodePath = mapNodePath(exec.node_executions);
  const failedNodeId =
    nodePath.find((step) => step.status === 'failed')?.nodeId ?? null;

  return {
    id: exec.id,
    workflowId: exec.workflow_id,
    workflowName: exec.workflows?.name ?? 'Unknown Workflow',
    status: mapExecutionStatus(exec.status),
    duration: formatExecutionDuration(exec.created_at, exec.finished_at, exec.status),
    trigger: resolveTrigger(nodePath),
    startedAt: exec.created_at,
    nodePath,
    failedNodeId,
  };
}
