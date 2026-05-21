'use client';

import { useState } from 'react';

type ActionState = 'idle' | 'loading' | 'error';

interface UseWorkflowActionsResult {
  actionState: ActionState;
  deleteWorkflow: (id: string) => Promise<void>;
}

export function useWorkflowActions(
  onDeleted?: (id: string) => void,
): UseWorkflowActionsResult {
  const [actionState, setActionState] = useState<ActionState>('idle');

  async function deleteWorkflow(id: string) {
    setActionState('loading');
    try {
      const res = await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Delete failed');
      }
      onDeleted?.(id);
      setActionState('idle');
    } catch {
      setActionState('error');
    }
  }

  return { actionState, deleteWorkflow };
}
