'use client';

import { useEffect, useRef, useState } from 'react';
import { getSupabaseClient } from '@/src/shared/utils/supabase-client';
import { cn } from '@/src/shared/utils/cn';
import {
  CheckCircle,
  XCircleIcon,
  PlayCircle,
  Timer,
  ClockIcon,
  CaretRight,
} from '@phosphor-icons/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExecutionData {
  id: string;
  status: string;
  created_at: string;
  finished_at: string | null;
  error_message: string | null;
  workflows: { name: string } | null;
}

interface NodeExecutionData {
  id: string;
  node_id: string;
  node_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

interface NodeExecutionLog {
  id: string;
  node_execution_id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data: Record<string, unknown> | null;
  elapsed_ms: number | null;
  created_at: string;
}

interface ExecutionDetailProps {
  initialExecution: ExecutionData;
  initialNodeExecutions: NodeExecutionData[];
  initialLogs: NodeExecutionLog[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_LABELS: Record<string, string> = {
  'webhook-shopify': 'Shopify Trigger',
  'webhook-lightfunnels': 'Lightfunnels Trigger',
  'webhook-youcan': 'YouCan Trigger',
  'webhook-custom': 'Custom Webhook',
  'send-email': 'Send Email',
  slack: 'Slack',
  openai: 'OpenAI',
  'api-request': 'API Request',
  condition: 'Condition',
  delay: 'Delay',
  'ai-custom-model': 'AI Custom Model',
  'integration-slack': 'Slack',
  'integration-email': 'Email',
  'integration-spreadsheet': 'Spreadsheet',
  'integration-webhook': 'Webhook',
};

const STATUS_CONFIG = {
  success: {
    label: 'Success',
    badgeClass: 'bg-success/10 text-success border-success/20',
    icon: CheckCircle,
  },
  failed: {
    label: 'Failed',
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: XCircleIcon,
  },
  running: {
    label: 'Running',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    icon: PlayCircle,
  },
  pending: {
    label: 'Pending',
    badgeClass: 'bg-muted/10 text-muted-foreground border-muted/20',
    icon: Timer,
  },
  skipped: {
    label: 'Skipped',
    badgeClass: 'bg-muted/10 text-muted-foreground border-muted/20',
    icon: Timer,
  },
  timed_out: {
    label: 'Timed Out',
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: XCircleIcon,
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(startedAt: string | null, finishedAt: string | null): string {
  if (!startedAt) return '—';
  const start = new Date(startedAt).getTime();
  const end = finishedAt ? new Date(finishedAt).getTime() : Date.now();
  const ms = end - start;
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.floor((ms % 60_000) / 1000)}s`;
}

function formatElapsed(ms: number | null): string {
  if (ms === null) return '';
  if (ms < 1000) return `+${ms}ms`;
  return `+${(ms / 1000).toFixed(1)}s`;
}

function isTerminal(status: string): boolean {
  return ['success', 'failed', 'skipped', 'timed_out'].includes(status);
}

// ─── Terminal log line ────────────────────────────────────────────────────────

const LEVEL_STYLE: Record<NodeExecutionLog['level'], string> = {
  info:  'text-emerald-400',
  warn:  'text-yellow-400',
  error: 'text-red-400',
};

const LEVEL_PREFIX: Record<NodeExecutionLog['level'], string> = {
  info:  '●',
  warn:  '▲',
  error: '✕',
};

function TerminalLine({ log }: { log: NodeExecutionLog }) {
  return (
    <div className="flex items-baseline gap-2 leading-5">
      <span className={cn('text-[11px] shrink-0 mt-px', LEVEL_STYLE[log.level])}>
        {LEVEL_PREFIX[log.level]}
      </span>
      <span className={cn('font-mono text-[12px] flex-1', LEVEL_STYLE[log.level])}>
        {log.message}
      </span>
      {log.elapsed_ms !== null && (
        <span className="font-mono text-[10px] text-muted-foreground/40 shrink-0 tabular-nums">
          {formatElapsed(log.elapsed_ms)}
        </span>
      )}
    </div>
  );
}

// ─── Node accordion item ──────────────────────────────────────────────────────

function NodeAccordionItem({
  node,
  logs,
  defaultOpen,
}: {
  node: NodeExecutionData;
  logs: NodeExecutionLog[];
  defaultOpen: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const bottomRef = useRef<HTMLDivElement>(null);
  const cfg = STATUS_CONFIG[node.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const label = NODE_LABELS[node.node_type] ?? node.node_type;
  const isRunning = node.status === 'running';

  // Auto-scroll terminal to bottom when new logs arrive while open
  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [logs.length, isOpen]);

  return (
    <div className="border-b border-border last:border-b-0">
      {/* ── Header ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors text-left"
      >
        <CaretRight
          className={cn(
            'h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200',
            isOpen && 'rotate-90',
          )}
          weight="bold"
        />

        {isRunning ? (
          <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
        ) : (
          <Icon
            className={cn('h-4 w-4 shrink-0', {
              'text-success':       node.status === 'success',
              'text-destructive':   node.status === 'failed' || node.status === 'timed_out',
              'text-muted-foreground': node.status === 'pending' || node.status === 'skipped',
            })}
            weight="fill"
          />
        )}

        <span className="flex-1 text-sm font-medium text-foreground">{label}</span>

        <span
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border shrink-0',
            cfg.badgeClass,
          )}
        >
          {cfg.label}
        </span>

        <span className="text-xs text-muted-foreground font-mono w-14 text-right shrink-0">
          {isRunning
            ? <span className="animate-pulse">…</span>
            : formatDuration(node.started_at, node.finished_at)}
        </span>
      </button>

      {/* ── Terminal body ── */}
      {isOpen && (
        <div className="px-5 pb-4 pt-1 bg-muted/5">
          <div className="rounded-lg bg-[#0d0d0d] border border-border/60 overflow-hidden">
            {/* window chrome */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/40 bg-[#161616]">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground/50">{label}</span>
            </div>

            {/* log lines */}
            <div className="px-4 py-3 space-y-1 max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <span className="font-mono text-[12px] text-muted-foreground/40 italic">
                  {isRunning ? 'Waiting for logs…' : 'No logs.'}
                </span>
              ) : (
                logs.map(log => <TerminalLine key={log.id} log={log} />)
              )}

              {/* blinking cursor while running */}
              {isRunning && (
                <div className="flex items-center gap-1 pt-0.5">
                  <span className="font-mono text-[12px] text-muted-foreground/30">$</span>
                  <span className="inline-block h-3 w-1.5 bg-emerald-400/70 animate-pulse" />
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* error callout below terminal */}
          {node.error_message && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/8 px-3 py-2.5">
              <XCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" weight="fill" />
              <p className="text-xs font-medium text-destructive break-all leading-snug">
                {node.error_message}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ExecutionDetail({
  initialExecution,
  initialNodeExecutions,
  initialLogs,
}: ExecutionDetailProps) {
  const [execution, setExecution]         = useState<ExecutionData>(initialExecution);
  const [nodeExecutions, setNodeExecutions] = useState<NodeExecutionData[]>(initialNodeExecutions);
  const [logs, setLogs]                   = useState<NodeExecutionLog[]>(initialLogs);

  // Keep a ref so the realtime log handler always has the current set of IDs
  // without needing to re-subscribe every time nodeExecutions changes.
  const nodeExecIdSetRef = useRef<Set<string>>(new Set(initialNodeExecutions.map(n => n.id)));

  // Sync the ref whenever nodeExecutions state changes
  useEffect(() => {
    nodeExecIdSetRef.current = new Set(nodeExecutions.map(n => n.id));
  }, [nodeExecutions]);

  useEffect(() => {
    if (isTerminal(execution.status)) return;

    const supabase = getSupabaseClient();

    const channel = supabase
      .channel(`execution-${execution.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'node_executions', filter: `execution_id=eq.${execution.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const n = payload.new as NodeExecutionData;
            setNodeExecutions(prev => [...prev, n]);
          } else if (payload.eventType === 'UPDATE') {
            setNodeExecutions(prev =>
              prev.map(n => n.id === (payload.new as NodeExecutionData).id
                ? (payload.new as NodeExecutionData) : n),
            );
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'executions', filter: `id=eq.${execution.id}` },
        (payload) => {
          setExecution(prev => ({ ...prev, ...(payload.new as Partial<ExecutionData>) }));
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'node_execution_logs' },
        (payload) => {
          const log = payload.new as NodeExecutionLog;
          if (nodeExecIdSetRef.current.has(log.node_execution_id)) {
            setLogs(prev => [...prev, log]);
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [execution.id, execution.status]);

  // Group logs by node_execution_id
  const logsByNodeExecId = logs.reduce<Record<string, NodeExecutionLog[]>>((acc, log) => {
    (acc[log.node_execution_id] ??= []).push(log);
    return acc;
  }, {});

  const cfg        = STATUS_CONFIG[execution.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  const ExecIcon   = cfg.icon;
  const isRunning  = execution.status === 'running';

  return (
    <div className="space-y-6">
      {/* ── Execution header card ── */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">
            Execution <span className="font-mono text-muted-foreground">{execution.id.split('-')[0]}…</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            {execution.workflows?.name ?? 'Workflow'}
          </p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border w-fit',
              cfg.badgeClass,
            )}
          >
            {isRunning
              ? <span className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              : <ExecIcon className="h-4 w-4" weight="fill" />}
            {cfg.label}
          </span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <span>{new Date(execution.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Top-level error ── */}
      {execution.error_message && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p className="font-semibold mb-1">Execution Error</p>
          <p>{execution.error_message}</p>
        </div>
      )}

      {/* ── Steps ── */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">Steps</h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {nodeExecutions.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No steps executed yet.
            </div>
          ) : (
            nodeExecutions.map((node, i) => (
              <NodeAccordionItem
                key={node.id}
                node={node}
                logs={logsByNodeExecId[node.id] ?? []}
                defaultOpen={i === 0}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
