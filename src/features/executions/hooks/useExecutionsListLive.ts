'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSupabaseClient } from '@/src/shared/utils/supabase-client';
import { bindRealtimeAuth, subscribeRealtimeChannel } from '@/src/shared/utils/supabase-realtime';
import {
  mapDbExecution,
  mapExecutionStatus,
  formatExecutionDuration,
  type DbExecutionRow,
} from '../utils/mapDbExecution';
import type { Execution } from '../types/Execution.types';

function hasActiveRun(executions: Execution[]): boolean {
  return executions.some(e => e.status === 'running' || e.status === 'waiting');
}

interface UseExecutionsListLiveProps {
  initialExecutions: Execution[];
  userId: string;
}

export function useExecutionsListLive({ initialExecutions, userId }: UseExecutionsListLiveProps) {
  const [executions, setExecutions] = useState(initialExecutions);
  const activeRef = useRef(hasActiveRun(initialExecutions));

  useEffect(() => {
    activeRef.current = hasActiveRun(executions);
  }, [executions]);

  const refetchAll = useCallback(async () => {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('executions')
      .select('*, workflows(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) setExecutions((data as DbExecutionRow[]).map(mapDbExecution));
  }, [userId]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const startPolling = () => {
      if (pollTimer) return;
      pollTimer = setInterval(() => {
        if (cancelled || !activeRef.current) return;
        void refetchAll();
      }, 3000);
    };

    const stopPolling = () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };

    const channel = supabase
      .channel(`executions-list-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'executions', filter: `user_id=eq.${userId}` },
        async payload => {
          const row = payload.new as { id: string };
          const { data } = await supabase
            .from('executions')
            .select('*, workflows(name)')
            .eq('id', row.id)
            .single();
          if (!data) return;
          const mapped = mapDbExecution(data as DbExecutionRow);
          setExecutions(prev => (prev.some(e => e.id === mapped.id) ? prev : [mapped, ...prev]));
          startPolling();
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'executions', filter: `user_id=eq.${userId}` },
        payload => {
          const row = payload.new as DbExecutionRow;
          setExecutions(prev =>
            prev.map(exec =>
              exec.id !== row.id
                ? exec
                : {
                    ...exec,
                    status: mapExecutionStatus(row.status),
                    duration: formatExecutionDuration(row.created_at, row.finished_at, row.status),
                  },
            ),
          );
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'executions', filter: `user_id=eq.${userId}` },
        payload => {
          const id = (payload.old as { id: string }).id;
          setExecutions(prev => prev.filter(e => e.id !== id));
        },
      );

    const unbindAuth = bindRealtimeAuth(supabase);
    subscribeRealtimeChannel(supabase, channel, status => {
      if (status === 'SUBSCRIBED' && activeRef.current) startPolling();
    });

    if (activeRef.current) {
      startPolling();
      void refetchAll();
    }

    const onFocus = () => {
      if (activeRef.current) void refetchAll();
    };
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      stopPolling();
      window.removeEventListener('focus', onFocus);
      unbindAuth();
      supabase.removeChannel(channel);
    };
  }, [userId, refetchAll]);

  return executions;
}
