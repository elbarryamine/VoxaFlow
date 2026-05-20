'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/src/shared/utils/cn';
import {
  useExecutionLiveData,
  type ExecutionData,
  type NodeExecutionData,
  type NodeExecutionLog,
} from '../hooks/useExecutionLiveData';
import {
  CheckCircle,
  XCircle,
  CircleNotch,
  Clock,
  Timer,
  CaretDown,
  Envelope,
  Globe,
  GitBranch,
  Hourglass,
  Sparkle,
  FlowArrow,
  SkipForward,
  ArrowsClockwise,
} from '@phosphor-icons/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExecutionDetailProps {
  initialExecution: ExecutionData;
  initialNodeExecutions: NodeExecutionData[];
  initialLogs: NodeExecutionLog[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_LABELS: Record<string, string> = {
  'webhook-shopify':       'Shopify Trigger',
  'webhook-lightfunnels':  'Lightfunnels Trigger',
  'webhook-youcan':        'YouCan Trigger',
  'webhook-custom':        'Custom Webhook',
  'send-email':            'Send Email',
  slack:                   'Slack',
  openai:                  'OpenAI',
  'api-request':           'API Request',
  condition:               'Condition',
  delay:                   'Delay',
  'ai-custom-model':       'AI Custom Model',
  'integration-slack':     'Slack',
  'integration-email':     'Email',
  'integration-spreadsheet': 'Spreadsheet',
  'integration-webhook':   'Webhook',
};

// Icon per node type
const NODE_ICONS: Record<string, React.ElementType> = {
  'webhook-shopify':      FlowArrow,
  'webhook-lightfunnels': FlowArrow,
  'webhook-youcan':       FlowArrow,
  'webhook-custom':       FlowArrow,
  'send-email':           Envelope,
  slack:                  FlowArrow,
  openai:                 Sparkle,
  'api-request':          Globe,
  condition:              GitBranch,
  delay:                  Hourglass,
  'ai-custom-model':      Sparkle,
  'integration-slack':    FlowArrow,
  'integration-email':    Envelope,
  'integration-spreadsheet': Globe,
  'integration-webhook':  FlowArrow,
};

// Per-status colours (all using design-system semantic tokens)
const STATUS_CONFIG = {
  success: {
    label:       'Success',
    textClass:   'text-success',
    bgClass:     'bg-success/10',
    borderClass: 'border-success/25',
    barClass:    'bg-success',
    dotClass:    'border-success bg-success',
    icon:        CheckCircle,
  },
  failed: {
    label:       'Failed',
    textClass:   'text-destructive',
    bgClass:     'bg-destructive/10',
    borderClass: 'border-destructive/25',
    barClass:    'bg-destructive',
    dotClass:    'border-destructive bg-destructive',
    icon:        XCircle,
  },
  running: {
    label:       'Running',
    textClass:   'text-primary',
    bgClass:     'bg-primary/10',
    borderClass: 'border-primary/25',
    barClass:    'bg-primary',
    dotClass:    'border-primary bg-primary',
    icon:        CircleNotch,
  },
  pending: {
    label:       'Pending',
    textClass:   'text-muted-foreground',
    bgClass:     'bg-muted/40',
    borderClass: 'border-border',
    barClass:    'bg-muted-foreground/30',
    dotClass:    'border-muted-foreground/40 bg-muted',
    icon:        Timer,
  },
  skipped: {
    label:       'Skipped',
    textClass:   'text-muted-foreground',
    bgClass:     'bg-muted/40',
    borderClass: 'border-border',
    barClass:    'bg-muted-foreground/20',
    dotClass:    'border-muted-foreground/40 bg-muted',
    icon:        SkipForward,
  },
  timed_out: {
    label:       'Timed Out',
    textClass:   'text-destructive',
    bgClass:     'bg-destructive/10',
    borderClass: 'border-destructive/25',
    barClass:    'bg-destructive',
    dotClass:    'border-destructive bg-destructive',
    icon:        XCircle,
  },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(startedAt: string | null, finishedAt: string | null): string {
  if (!startedAt) return '—';
  const start = new Date(startedAt).getTime();
  const end   = finishedAt ? new Date(finishedAt).getTime() : Date.now();
  const ms    = end - start;
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.floor((ms % 60_000) / 1000)}s`;
}

function formatElapsed(ms: number | null): string {
  if (ms === null) return '';
  if (ms < 1000) return `+${ms}ms`;
  return `+${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getCfg(status: string) {
  return STATUS_CONFIG[status as StatusKey] ?? STATUS_CONFIG.pending;
}

// ─── Log line ─────────────────────────────────────────────────────────────────

const LOG_COLORS = {
  info:  { dot: 'bg-success',      text: 'text-success',      dim: 'text-success/50'      },
  warn:  { dot: 'bg-warning',      text: 'text-warning',      dim: 'text-warning/50'      },
  error: { dot: 'bg-destructive',  text: 'text-destructive',  dim: 'text-destructive/50'  },
};

function LogLine({ log }: { log: NodeExecutionLog }) {
  const c = LOG_COLORS[log.level];
  return (
    <div className="flex items-baseline gap-2.5 group">
      <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', c.dot)} />
      <span className={cn('font-mono text-[12px] flex-1 leading-5', c.text)}>
        {log.message}
      </span>
      {log.elapsed_ms !== null && (
        <span className={cn('font-mono text-[10px] shrink-0 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity', c.dim)}>
          {formatElapsed(log.elapsed_ms)}
        </span>
      )}
    </div>
  );
}

// ─── Step log panel ───────────────────────────────────────────────────────────

function LogPanel({
  logs,
  isRunning,
  errorMessage,
}: {
  logs: NodeExecutionLog[];
  isRunning: boolean;
  errorMessage?: string | null;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const showNodeError =
    errorMessage &&
    !logs.some(l => l.level === 'error' && l.message === errorMessage);

  const isEmpty = logs.length === 0 && !showNodeError;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [logs.length, errorMessage]);

  return (
    <div className="mx-4 mb-4 rounded-lg overflow-hidden border border-border bg-muted/30">
      <div className="px-4 py-3 space-y-1 max-h-56 overflow-y-auto">
        {isEmpty ? (
          <span className="font-mono text-[12px] text-muted-foreground italic">
            {isRunning ? 'Waiting for logs…' : 'No logs recorded.'}
          </span>
        ) : (
          <>
            {logs.map(log => <LogLine key={log.id} log={log} />)}
            {showNodeError && (
              <LogLine
                log={{
                  id: 'node-error',
                  node_execution_id: '',
                  level: 'error',
                  message: errorMessage,
                  data: null,
                  elapsed_ms: null,
                  created_at: '',
                }}
              />
            )}
          </>
        )}

        {isRunning && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="font-mono text-[12px] text-muted-foreground">$</span>
            <span className="inline-block h-3 w-1.5 rounded-[1px] bg-success/60 animate-pulse" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Timeline step card ───────────────────────────────────────────────────────

function StepCard({
  node,
  logs,
  defaultOpen,
  isLast,
}: {
  node: NodeExecutionData;
  logs: NodeExecutionLog[];
  defaultOpen: boolean;
  isLast: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const cfg       = getCfg(node.status);
  const NodeIcon  = NODE_ICONS[node.node_type] ?? FlowArrow;
  const label     = NODE_LABELS[node.node_type] ?? node.node_type;
  const isRunning = node.status === 'running';

  return (
    <div className="relative flex gap-4 pb-3 last:pb-0">
      {/* Timeline rail — stretches with card height; line bridges gap to next step */}
      <div className="relative w-3.5 shrink-0 self-stretch">
        {!isLast && (
          <div
            className="absolute left-1/2 top-5.25 -bottom-8.25 w-px -translate-x-1/2 bg-border"
            aria-hidden
          />
        )}
        <div
          className={cn(
            'relative z-10 mx-auto mt-3.5 h-3.5 w-3.5 rounded-full border-2',
            cfg.dotClass,
          )}
        />
      </div>

      {/* Card */}
      <div className={cn('flex-1 rounded-xl border bg-card overflow-hidden transition-shadow', cfg.borderClass, isOpen && 'shadow-sm')}>
        {/* Header row */}
        <button
          onClick={() => setIsOpen(o => !o)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors text-left"
        >
          {/* Node type icon */}
          <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center shrink-0', cfg.bgClass)}>
            {isRunning
              ? <ArrowsClockwise className={cn('h-3.5 w-3.5 animate-spin', cfg.textClass)} weight="bold" />
              : <NodeIcon className={cn('h-3.5 w-3.5', cfg.textClass)} weight="duotone" />
            }
          </div>

          {/* Name */}
          <span className="flex-1 text-sm font-medium text-foreground truncate">{label}</span>

          {/* Status pill */}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border shrink-0',
              cfg.bgClass, cfg.textClass, cfg.borderClass,
            )}
          >
            {cfg.label}
          </span>

          {/* Duration */}
          <span className="font-mono text-[11px] text-muted-foreground w-14 text-right shrink-0">
            {isRunning
              ? <span className="animate-pulse text-primary">…</span>
              : formatDuration(node.started_at, node.finished_at)
            }
          </span>

          {/* Caret */}
          <CaretDown
            className={cn(
              'h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
            weight="bold"
          />
        </button>

        {/* Expandable body */}
        {isOpen && (
          <div className="border-t border-border/50 pt-3">
            <LogPanel logs={logs} isRunning={isRunning} errorMessage={node.error_message} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Summary stats strip ──────────────────────────────────────────────────────

function StatChip({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-0.5 px-4 first:pl-0 last:pr-0', className)}>
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">{label}</span>
      <span className="text-sm font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ExecutionDetail({
  initialExecution,
  initialNodeExecutions,
  initialLogs,
}: ExecutionDetailProps) {
  const { execution, nodeExecutions, logs } = useExecutionLiveData({
    executionId: initialExecution.id,
    initialExecution,
    initialNodeExecutions,
    initialLogs,
  });

  // Derived stats
  const logsByNodeExecId = logs.reduce<Record<string, NodeExecutionLog[]>>((acc, log) => {
    (acc[log.node_execution_id] ??= []).push(log);
    return acc;
  }, {});

  const successCount = nodeExecutions.filter(n => n.status === 'success').length;
  const failedCount  = nodeExecutions.filter(n => n.status === 'failed').length;
  const total        = nodeExecutions.length;
  const cfg          = getCfg(execution.status);
  const ExecIcon     = cfg.icon;
  const isRunning    = execution.status === 'running';
  const workflowName = execution.workflows?.name ?? 'Workflow';
  const shortId      = execution.id.split('-')[0];

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* ── Header card ────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Accent top bar */}
        <div className={cn('h-0.75', cfg.barClass)} />

        <div className="p-5">
          {/* Top row: identity + status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Status icon circle */}
              <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', cfg.bgClass)}>
                {isRunning
                  ? <CircleNotch className={cn('h-5 w-5 animate-spin', cfg.textClass)} weight="bold" />
                  : <ExecIcon className={cn('h-5 w-5', cfg.textClass)} weight="duotone" />
                }
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-foreground truncate">{workflowName}</h2>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">#{shortId}…</p>
              </div>
            </div>

            {/* Status badge */}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border shrink-0',
                cfg.bgClass, cfg.textClass, cfg.borderClass,
              )}
            >
              {cfg.label}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mt-4 mb-4" />

          {/* Stats strip */}
          <div className="flex items-center divide-x divide-border">
            <StatChip
              label="Started"
              value={formatDate(execution.created_at)}
              className="pr-4"
            />
            <StatChip
              label="Duration"
              value={isRunning ? '…' : formatDuration(execution.created_at, execution.finished_at)}
              className="px-4"
            />
            <StatChip
              label="Steps"
              value={total === 0 ? '—' : `${successCount} / ${total}`}
              className="px-4"
            />
            {failedCount > 0 && (
              <StatChip
                label="Failed"
                value={failedCount}
                className="px-4 text-destructive"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Top-level error banner ──────────────────────────────────────────── */}
      {execution.error_message && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3.5">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" weight="fill" />
          <div>
            <p className="text-sm font-semibold text-destructive">Execution failed</p>
            <p className="text-xs text-destructive/80 mt-0.5">{execution.error_message}</p>
          </div>
        </div>
      )}

      {/* ── Steps timeline ──────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-foreground">Steps</h3>
          {total > 0 && (
            <span className="rounded-full bg-secondary border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {total}
            </span>
          )}
        </div>

        {nodeExecutions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary mx-auto mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" weight="duotone" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No steps yet</p>
            <p className="text-xs text-muted-foreground">Steps will appear here as the execution runs.</p>
          </div>
        ) : (
          <div>
            {nodeExecutions.map((node, i) => (
              <StepCard
                key={node.id}
                node={node}
                logs={logsByNodeExecId[node.id] ?? []}
                defaultOpen={i === 0}
                isLast={i === nodeExecutions.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
