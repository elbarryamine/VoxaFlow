'use client';

import { Pulse } from '@phosphor-icons/react/dist/ssr';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { TopBarLink } from '@/src/shared/ui/TopBarButton';
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
      <EmptyState
        layout="page"
        icon={Pulse}
        title="No executions yet"
        description="When your workflows run, their execution history and details will appear here."
        action={
          <TopBarLink href="/dashboard/workflows">
            Go to workflows
          </TopBarLink>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {executions.map(execution => (
        <ExecutionCard key={execution.id} execution={execution} />
      ))}
    </div>
  );
};
