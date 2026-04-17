"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import {
  PhoneIncoming,
  PhoneOutgoing,
  Robot,
  GitFork,
  FileXls,
  Envelope,
  ChatCircleText,
  Globe,
  ShoppingBag,
  Link,
  Lightning,
} from "@phosphor-icons/react/dist/ssr";
import type { WorkflowNodeData } from "../types/Workflow.types";

type WorkflowNodeProps = NodeProps<Node<WorkflowNodeData>>;

const ICON_MAP = {
  "inbound-call": PhoneIncoming,
  "outbound-call": PhoneOutgoing,
  "webhook-shopify": ShoppingBag,
  "webhook-lightfunnels": Lightning,
  "webhook-youcan": Globe,
  "webhook-custom": Link,
  "ai-custom-model": Robot,
  condition: GitFork,
  "integration-spreadsheet": FileXls,
  "integration-email": Envelope,
  "integration-slack": ChatCircleText,
  "integration-webhook": Globe,
} as const;

const COLOR_MAP = {
  "inbound-call": {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-400/30",
    icon: "text-orange-500 dark:text-orange-300",
  },
  "outbound-call": {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-400/30",
    icon: "text-orange-500 dark:text-orange-300",
  },
  "webhook-shopify": {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-400/30",
    icon: "text-orange-500 dark:text-orange-300",
  },
  "webhook-lightfunnels": {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-400/30",
    icon: "text-orange-500 dark:text-orange-300",
  },
  "webhook-youcan": {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-400/30",
    icon: "text-orange-500 dark:text-orange-300",
  },
  "webhook-custom": {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-400/30",
    icon: "text-orange-500 dark:text-orange-300",
  },
  "ai-custom-model": {
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    border: "border-indigo-200 dark:border-indigo-400/30",
    icon: "text-indigo-500 dark:text-indigo-300",
  },
  condition: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-400/30",
    icon: "text-amber-500 dark:text-amber-300",
  },
  "integration-spreadsheet": {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-400/30",
    icon: "text-emerald-500 dark:text-emerald-300",
  },
  "integration-email": {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-400/30",
    icon: "text-blue-500 dark:text-blue-300",
  },
  "integration-slack": {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-200 dark:border-violet-400/30",
    icon: "text-violet-500 dark:text-violet-300",
  },
  "integration-webhook": {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-200 dark:border-violet-400/30",
    icon: "text-violet-500 dark:text-violet-300",
  },
} as const;

const getConfigSummary = (data: WorkflowNodeData): string | null => {
  switch (data.type) {
    case "inbound-call":
    case "outbound-call":
    case "webhook-shopify":
    case "webhook-lightfunnels":
    case "webhook-youcan":
    case "webhook-custom": {
      const agent = data.agentName as string | undefined;
      const webhookPath = data.webhookPath as string | undefined;
      if (data.type === "webhook-custom" && webhookPath) return webhookPath;
      return agent ? `Agent: ${agent}` : null;
    }
    case "ai-custom-model": {
      const modelName = data.modelName as string | undefined;
      return modelName ?? null;
    }
    case "condition": {
      const conditionType = data.conditionType as string | undefined;
      if (conditionType === "field") {
        const field = data.conditionField as string | undefined;
        const op = data.conditionOperator as string | undefined;
        const value = data.conditionValue as string | undefined;
        if (field && op && value) return `${field} ${op} ${value}`;
      }
      if (conditionType === "ai") return "AI condition";
      return null;
    }
    case "integration-spreadsheet": {
      const sheet = data.spreadsheetId as string | undefined;
      return sheet ? `Sheet: ${sheet}` : null;
    }
    case "integration-slack": {
      const channel = data.slackChannel as string | undefined;
      return channel ?? null;
    }
    case "integration-email": {
      const emailTo = data.emailTo as string | undefined;
      return emailTo ?? null;
    }
    case "integration-webhook": {
      const method = data.method as string | undefined;
      const url = data.url as string | undefined;
      if (method && url) {
        const short = url.length > 28 ? url.slice(0, 28) + "…" : url;
        return `${method} ${short}`;
      }
      return null;
    }
    default:
      return null;
  }
};

export const WorkflowNode = ({ data, selected }: WorkflowNodeProps) => {
  const nodeType = data.type;
  const Icon = ICON_MAP[nodeType] ?? Globe;
  const colors = COLOR_MAP[nodeType] ?? COLOR_MAP["integration-webhook"];
  const isTrigger =
    nodeType === "inbound-call" ||
    nodeType === "outbound-call" ||
    nodeType === "webhook-shopify" ||
    nodeType === "webhook-lightfunnels" ||
    nodeType === "webhook-youcan" ||
    nodeType === "webhook-custom";
  const isCondition = nodeType === "condition";
  const configSummary = getConfigSummary(data);

  return (
    <div
      className={`min-w-[200px] max-w-[260px] rounded-xl border-2 ${colors.border} ${colors.bg} p-4 shadow-sm transition-all hover:shadow-md ${selected ? "ring-2 ring-ring/50" : ""}`}
    >
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="h-3! w-3! border-2! border-white! bg-primary!"
        />
      )}

      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors.icon} bg-white/80 dark:bg-white/10`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {data.label}
          </p>
          {data.description && (
            <p className="truncate text-xs text-muted-foreground">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {configSummary && (
        <div className="mt-2.5 truncate rounded-md bg-white/60 px-2 py-1 text-[11px] font-medium text-foreground/70 dark:bg-white/5">
          {configSummary}
        </div>
      )}

      {isCondition && (
        <>
          <Handle
            id="no"
            type="source"
            position={Position.Bottom}
            style={{ left: "30%" }}
            className="h-3! w-3! border-2! border-white! bg-primary!"
          />
          <Handle
            id="yes"
            type="source"
            position={Position.Bottom}
            style={{ left: "70%" }}
            className="h-3! w-3! border-2! border-white! bg-primary!"
          />
          <div className="pointer-events-none mt-3 flex justify-between px-7 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>No</span>
            <span>Yes</span>
          </div>
        </>
      )}

      {!isCondition && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="h-3! w-3! border-2! border-white! bg-primary!"
        />
      )}
    </div>
  );
};
