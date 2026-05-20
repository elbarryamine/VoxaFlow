'use client';

import { Pulse } from '@phosphor-icons/react/dist/ssr';
import { ExecutionCard } from './ExecutionCard';
import { useExecutionsListLive } from '../hooks/useExecutionsListLive';
import type { Execution } from '../types/Execution.types';

interface ExecutionsListProps {
  initialExecutions: Execution[];
  userId: string;
}

export const ExecutionsList = ({ initialExecutions, userId }: ExecutionsListProps) => {
  const executions = useExecutionsListLive({ initialExecutions, userId });

  if (executions.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border/60 bg-card/40 text-center font-manrope transition-colors hover:bg-card/60">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container/60">
          <Pulse className="h-8 w-8 text-on-secondary-container" weight="duotone" />
        </div>
        <h3 className="mb-2 font-newsreader text-2xl font-bold text-on-surface">No executions yet</h3>
        <p className="max-w-sm text-[15px] font-medium text-on-surface-variant">
          When your workflows run, their execution history and details will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {executions.map(execution => (
        <ExecutionCard key={execution.id} execution={execution} />
      ))}
    </div>
  );
};
