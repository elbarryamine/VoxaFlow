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
    textClass:   'text-error',
    bgClass:     'bg-error/10',
    borderClass: 'border-error/25',
    barClass:    'bg-error',
    dotClass:    'border-error bg-error',
    icon:        XCircle,
  },
  running: {
    label:       'Running',
    textClass:   'text-primary',
    bgClass:     'bg-primary/10',
    borderClass: 'border-transparent',
    barClass:    'bg-primary',
    dotClass:    'border-primary bg-primary',
    icon:        CircleNotch,
  },
  pending: {
    label:       'Pending',
    textClass:   'text-on-surface-variant',
    bgClass:     'bg-surface-variant/40',
    borderClass: 'border-transparent',
    barClass:    'bg-surface-variant',
    dotClass:    'border-surface-variant bg-surface-variant',
    icon:        Timer,
  },
  skipped: {
    label:       'Skipped',
    textClass:   'text-on-surface-variant',
    bgClass:     'bg-surface-variant/40',
    borderClass: 'border-transparent',
    barClass:    'bg-surface-variant',
    dotClass:    'border-surface-variant bg-surface-variant',
    icon:        SkipForward,
  },
  timed_out: {
    label:       'Timed Out',
    textClass:   'text-error',
    bgClass:     'bg-error/10',
    borderClass: 'border-transparent',
    barClass:    'bg-error',
    dotClass:    'border-error bg-error',
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
  info:  { dot: 'bg-primary',      text: 'text-on-surface',      dim: 'text-on-surface-variant/50'      },
  warn:  { dot: 'bg-secondary',      text: 'text-secondary',      dim: 'text-secondary/50'      },
  error: { dot: 'bg-error',  text: 'text-error',  dim: 'text-error/50'  },
};

function LogLine({ log }: { log: NodeExecutionLog }) {
  const c = LOG_COLORS[log.level] ?? LOG_COLORS.error;
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
    <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-border/50 bg-surface-variant/20 shadow-inner">
      <div className="px-4 py-3 space-y-1.5 max-h-56 overflow-y-auto">
        {isEmpty ? (
          <span className="font-mono text-[12px] text-on-surface-variant/70 italic">
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
    <div className="relative flex gap-4 pb-3 last:pb-0 font-manrope">
      {/* Timeline rail */}
      <div className="relative w-3.5 shrink-0 self-stretch">
        {!isLast && (
          <div
            className="absolute left-1/2 top-5.25 -bottom-8.25 w-px -translate-x-1/2 bg-border/50"
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
      <div className={cn('flex-1 rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300', isOpen && 'shadow-md border-outline-variant')}>
        {/* Header row */}
        <button
          onClick={() => setIsOpen(o => !o)}
          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-variant/20 transition-colors text-left"
        >
          {/* Node type icon */}
          <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', cfg.bgClass)}>
            {isRunning
              ? <ArrowsClockwise className={cn('h-5 w-5 animate-spin', cfg.textClass)} weight="bold" />
              : <NodeIcon className={cn('h-5 w-5', cfg.textClass)} weight="duotone" />
            }
          </div>

          {/* Name */}
          <span className="flex-1 text-[15px] font-bold text-on-surface truncate">{label}</span>

          {/* Status pill */}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest border shrink-0',
              cfg.bgClass, cfg.textClass, cfg.borderClass,
            )}
          >
            {cfg.label}
          </span>

          {/* Duration */}
          <span className="font-mono text-[12px] font-semibold text-on-surface-variant w-14 text-right shrink-0">
            {isRunning
              ? <span className="animate-pulse text-primary">…</span>
              : formatDuration(node.started_at, node.finished_at)
            }
          </span>

          {/* Caret */}
          <CaretDown
            className={cn(
              'h-4 w-4 text-on-surface-variant shrink-0 transition-transform duration-300',
              isOpen && 'rotate-180',
            )}
            weight="bold"
          />
        </button>

        {/* Expandable body */}
        {isOpen && (
          <div className="border-t border-border/40 pt-4">
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
    <div className={cn('flex flex-col items-center gap-1 px-5 first:pl-0 last:pr-0', className)}>
      <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/70">{label}</span>
      <span className="text-[15px] font-bold text-on-surface tabular-nums">{value}</span>
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
    <div className="space-y-6 max-w-3xl mx-auto font-manrope">

      {/* ── Header card ────────────────────────────────────────────────────── */}
      <div className="rounded-[2rem] border border-border/50 bg-card overflow-hidden shadow-sm">
        {/* Accent top bar */}
        <div className={cn('h-1.5 w-full', cfg.barClass)} />

        <div className="p-6 sm:p-8">
          {/* Top row: identity + status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Status icon circle */}
              <div className={cn('h-14 w-14 rounded-xl flex items-center justify-center shrink-0', cfg.bgClass)}>
                {isRunning
                  ? <CircleNotch className={cn('h-7 w-7 animate-spin', cfg.textClass)} weight="bold" />
                  : <ExecIcon className={cn('h-7 w-7', cfg.textClass)} weight="duotone" />
                }
              </div>

              <div className="min-w-0">
                <h2 className="text-3xl font-newsreader font-bold text-on-surface truncate">{workflowName}</h2>
                <p className="text-[13px] text-on-surface-variant font-mono mt-1 font-semibold uppercase tracking-widest">#{shortId}…</p>
              </div>
            </div>

            {/* Status badge */}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-widest border shrink-0',
                cfg.bgClass, cfg.textClass, cfg.borderClass,
              )}
            >
              {cfg.label}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50 mt-6 mb-6" />

          {/* Stats strip */}
          <div className="flex items-center divide-x divide-border/50">
            <StatChip
              label="Started"
              value={formatDate(execution.created_at)}
              className="pr-6"
            />
            <StatChip
              label="Duration"
              value={isRunning ? '…' : formatDuration(execution.created_at, execution.finished_at)}
              className="px-6"
            />
            <StatChip
              label="Steps"
              value={total === 0 ? '—' : `${successCount} / ${total}`}
              className="px-6"
            />
            {failedCount > 0 && (
              <StatChip
                label="Failed"
                value={failedCount}
                className="px-6 !text-error"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Top-level error banner ──────────────────────────────────────────── */}
      {execution.error_message && (
        <div className="flex items-start gap-4 rounded-2xl border border-error/30 bg-error/10 px-5 py-4 shadow-sm">
          <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-error" weight="fill" />
          <div>
            <p className="text-[15px] font-bold text-error">Execution failed</p>
            <p className="text-[14px] font-medium text-error/80 mt-1">{execution.error_message}</p>
          </div>
        </div>
      )}

      {/* ── Steps timeline ──────────────────────────────────────────────────── */}
      <div className="pt-2">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-2xl font-newsreader font-bold text-on-surface">Steps</h3>
          {total > 0 && (
            <span className="rounded-full bg-surface-variant/50 border border-border/50 px-2.5 py-0.5 text-[12px] font-bold text-on-surface-variant">
              {total}
            </span>
          )}
        </div>

        {nodeExecutions.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-border/60 bg-card/40 px-6 py-12 text-center transition-colors hover:bg-card/60">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-secondary-container/60 mx-auto mb-4">
              <Clock className="h-8 w-8 text-on-secondary-container" weight="duotone" />
            </div>
            <p className="text-2xl font-newsreader font-bold text-on-surface mb-2">No steps yet</p>
            <p className="text-[15px] font-medium text-on-surface-variant max-w-sm mx-auto">Steps will appear here as the execution runs.</p>
          </div>
        ) : (
          <div className="space-y-1">
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
