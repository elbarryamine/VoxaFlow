'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSupabaseClient } from '@/src/shared/utils/supabase-client';
import { bindRealtimeAuth, subscribeRealtimeChannel } from '@/src/shared/utils/supabase-realtime';

export interface ExecutionData {
  id: string;
  status: string;
  created_at: string;
  finished_at: string | null;
  error_message: string | null;
  workflows: { name: string } | null;
}

export interface NodeExecutionData {
  id: string;
  node_id: string;
  node_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface NodeExecutionLog {
  id: string;
  node_execution_id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data: Record<string, unknown> | null;
  elapsed_ms: number | null;
  created_at: string;
}

const TERMINAL_EXECUTION = new Set(['success', 'failed', 'timed_out']);
const ACTIVE_NODE = new Set(['pending', 'running']);

function isRunActive(execution: ExecutionData, nodes: NodeExecutionData[]): boolean {
  if (!TERMINAL_EXECUTION.has(execution.status)) return true;
  return nodes.some(n => ACTIVE_NODE.has(n.status));
}

function appendLog(prev: NodeExecutionLog[], log: NodeExecutionLog): NodeExecutionLog[] {
  if (prev.some(l => l.id === log.id)) return prev;
  return [...prev, log];
}

interface UseExecutionLiveDataProps {
  executionId: string;
  initialExecution: ExecutionData;
  initialNodeExecutions: NodeExecutionData[];
  initialLogs: NodeExecutionLog[];
}

export function useExecutionLiveData({
  executionId,
  initialExecution,
  initialNodeExecutions,
  initialLogs,
}: UseExecutionLiveDataProps) {
  const [execution, setExecution] = useState(initialExecution);
  const [nodeExecutions, setNodeExecutions] = useState(initialNodeExecutions);
  const [logs, setLogs] = useState(initialLogs);

  const nodeExecIdSetRef = useRef(new Set(initialNodeExecutions.map(n => n.id)));
  const activeRef = useRef(isRunActive(initialExecution, initialNodeExecutions));

  useEffect(() => {
    nodeExecIdSetRef.current = new Set(nodeExecutions.map(n => n.id));
    activeRef.current = isRunActive(execution, nodeExecutions);
  }, [execution, nodeExecutions]);

  const refetchAll = useCallback(async () => {
    const supabase = getSupabaseClient();

    const [{ data: exec }, { data: nodes }] = await Promise.all([
      supabase
        .from('executions')
        .select('*, workflows(name)')
        .eq('id', executionId)
        .single(),
      supabase
        .from('node_executions')
        .select('*')
        .eq('execution_id', executionId)
        .order('created_at', { ascending: true }),
    ]);

    if (exec) setExecution(exec as ExecutionData);
    if (!nodes) return;

    setNodeExecutions(nodes as NodeExecutionData[]);
    nodeExecIdSetRef.current = new Set(nodes.map((n: NodeExecutionData) => n.id));

    const nodeIds = nodes.map((n: NodeExecutionData) => n.id);
    if (nodeIds.length === 0) {
      setLogs([]);
      return;
    }

    const { data: freshLogs } = await supabase
      .from('node_execution_logs')
      .select('*')
      .in('node_execution_id', nodeIds)
      .order('created_at', { ascending: true });

    if (freshLogs) setLogs(freshLogs as NodeExecutionLog[]);
  }, [executionId]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const startPolling = () => {
      if (pollTimer) return;
      pollTimer = setInterval(() => {
        if (cancelled || !activeRef.current) return;
        void refetchAll();
      }, 2000);
    };

    const stopPolling = () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };

    const channel = supabase
      .channel(`execution-${executionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'node_executions', filter: `execution_id=eq.${executionId}` },
        payload => {
          if (payload.eventType === 'INSERT') {
            const row = payload.new as NodeExecutionData;
            setNodeExecutions(prev => {
              if (prev.some(n => n.id === row.id)) return prev;
              return [...prev, row];
            });
          } else if (payload.eventType === 'UPDATE') {
            setNodeExecutions(prev =>
              prev.map(n => (n.id === (payload.new as NodeExecutionData).id ? (payload.new as NodeExecutionData) : n)),
            );
          }
          if (activeRef.current) startPolling();
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'executions', filter: `id=eq.${executionId}` },
        payload => setExecution(prev => ({ ...prev, ...(payload.new as Partial<ExecutionData>) })),
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'node_execution_logs' },
        payload => {
          const log = payload.new as NodeExecutionLog;
          if (nodeExecIdSetRef.current.has(log.node_execution_id)) {
            setLogs(prev => appendLog(prev, log));
          }
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
  }, [executionId, refetchAll]);

  return { execution, nodeExecutions, logs };
}
