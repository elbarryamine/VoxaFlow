'use client';

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
      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center">
        <h3 className="mb-1 text-lg font-medium text-foreground">No executions yet</h3>
        <p className="text-sm text-muted-foreground">
          When your workflows run, their history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {executions.map(execution => (
        <ExecutionCard key={execution.id} execution={execution} />
      ))}
    </div>
  );
};
