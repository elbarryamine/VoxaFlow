'use client';

import { useState } from 'react';
import type { Execution } from '../types/Execution.types';

type ActionState = 'idle' | 'loading' | 'error';

interface UseExecutionActionsResult {
  actionState: ActionState;
  deleteExecution: (id: string) => Promise<void>;
  cancelExecution: (id: string) => Promise<void>;
  rerunExecution: (execution: Execution) => Promise<void>;
}

export function useExecutionActions(
  onDelete?: (id: string) => void,
  onCancel?: (id: string) => void,
  onRerun?: (newExecutionId: string) => void,
): UseExecutionActionsResult {
  const [actionState, setActionState] = useState<ActionState>('idle');

  async function deleteExecution(id: string) {
    setActionState('loading');
    try {
      const res = await fetch(`/api/executions/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Delete failed');
      }
      onDelete?.(id);
      setActionState('idle');
    } catch {
      setActionState('error');
    }
  }

  async function cancelExecution(id: string) {
    setActionState('loading');
    try {
      const res = await fetch(`/api/executions/${id}/cancel`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Cancel failed');
      }
      onCancel?.(id);
      setActionState('idle');
    } catch {
      setActionState('error');
    }
  }

  async function rerunExecution(execution: Execution) {
    setActionState('loading');
    try {
      const res = await fetch(`/api/executions/${execution.id}/rerun`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Rerun failed');
      }
      const body = await res.json() as { executionId: string };
      onRerun?.(body.executionId);
      setActionState('idle');
    } catch {
      setActionState('error');
    }
  }

  return { actionState, deleteExecution, cancelExecution, rerunExecution };
}
