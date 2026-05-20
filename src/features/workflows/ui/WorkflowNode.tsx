"use client";

import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import {
  Robot,
  GitFork,
  FileXls,
  Envelope,
  ChatCircleText,
  Globe,
  ShoppingBag,
  Link,
  Lightning,
  Trash,
  Plus,
  Gear,
} from "@phosphor-icons/react/dist/ssr";
import type { WorkflowNodeData } from "../types/Workflow.types";

type WorkflowNodeProps = NodeProps<Node<WorkflowNodeData>>;

const ICON_MAP = {
  "webhook-shopify": ShoppingBag,
  "webhook-lightfunnels": Lightning,
  "webhook-youcan": Globe,
  "webhook-custom": Link,
  "ai-custom-model": Robot,
  "integration-spreadsheet": FileXls,
  "integration-email": Envelope,
  "integration-slack": ChatCircleText,
  "integration-webhook": Globe,
  "api-request": Globe,
  // Executor-backed
  openai: Robot,
  slack: ChatCircleText,
  "send-email": Envelope,
  delay: GitFork,
} as const;

/** Per-type accents: solid icon chips (on-*) + tinted card wash for contrast in both themes. */
const COLOR_MAP = {
  "webhook-shopify": {
    gradient: "from-secondary-container/55 to-secondary/8",
    border: "border-secondary/35",
    iconBg: "bg-secondary",
    icon: "text-on-secondary",
  },
  "webhook-lightfunnels": {
    gradient: "from-warning/25 to-warning/5",
    border: "border-warning/40",
    iconBg: "bg-warning",
    icon: "text-white",
  },
  "webhook-youcan": {
    gradient: "from-success/22 to-success/5",
    border: "border-success/35",
    iconBg: "bg-success",
    icon: "text-white",
  },
  "webhook-custom": {
    gradient: "from-surface-container-high/70 to-surface-container",
    border: "border-outline/45",
    iconBg: "bg-on-surface",
    icon: "text-card",
  },
  "ai-custom-model": {
    gradient: "from-primary-container/50 to-primary/8",
    border: "border-primary/30",
    iconBg: "bg-primary",
    icon: "text-on-primary",
  },
  "integration-spreadsheet": {
    gradient: "from-success/18 to-success/5",
    border: "border-success/30",
    iconBg: "bg-success",
    icon: "text-white",
  },
  "integration-email": {
    gradient: "from-secondary-container/60 to-secondary/8",
    border: "border-secondary/30",
    iconBg: "bg-secondary-container",
    icon: "text-on-secondary-container",
  },
  "integration-slack": {
    gradient: "from-tertiary-container/55 to-tertiary/8",
    border: "border-tertiary/30",
    iconBg: "bg-tertiary",
    icon: "text-on-tertiary",
  },
  "integration-webhook": {
    gradient: "from-warning/15 to-surface-container-low",
    border: "border-warning/30",
    iconBg: "bg-warning",
    icon: "text-white",
  },
  "api-request": {
    gradient: "from-surface-container to-surface-container-high",
    border: "border-outline/40",
    iconBg: "bg-inverse-surface",
    icon: "text-inverse-on-surface",
  },
  openai: {
    gradient: "from-primary-container/45 to-primary/6",
    border: "border-primary/28",
    iconBg: "bg-primary",
    icon: "text-on-primary",
  },
  slack: {
    gradient: "from-tertiary-container/55 to-tertiary/8",
    border: "border-tertiary/30",
    iconBg: "bg-tertiary",
    icon: "text-on-tertiary",
  },
  "send-email": {
    gradient: "from-secondary-container/50 to-secondary/6",
    border: "border-secondary/28",
    iconBg: "bg-secondary",
    icon: "text-on-secondary",
  },
  delay: {
    gradient: "from-surface-variant/35 to-outline-variant/15",
    border: "border-outline-variant/55",
    iconBg: "bg-outline",
    icon: "text-card",
  },
} as const;

const nodeActionBtnClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors duration-300 hover:bg-surface-variant hover:text-on-surface";

const getConfigSummary = (data: WorkflowNodeData): string | null => {
  switch (data.type) {
    case "webhook-shopify":
    case "webhook-lightfunnels":
    case "webhook-youcan":
    case "webhook-custom": {
      const agent = data.agentName as string | undefined;
      const webhookPath = data.webhookPath as string | undefined;
      if (data.type === "webhook-custom" && webhookPath) return webhookPath;
      return agent ? `Execution: ${agent}` : null;
    }
    case "ai-custom-model": {
      const modelName = data.modelName as string | undefined;
      if (data.outputFormat === "branch") {
        return "Branch Yes/No";
      }
      return modelName ?? null;
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
    case "integration-webhook":
    case "api-request": {
      const method = data.method as string | undefined;
      const url = data.url as string | undefined;
      if (method && url) {
        const short = url.length > 28 ? url.slice(0, 28) + "…" : url;
        return `${method} ${short}`;
      }
      return null;
    }
    case "openai": {
      const model = data.model as string | undefined;
      return model ?? null;
    }
    case "slack": {
      const channel = data.channel as string | undefined;
      return channel ?? null;
    }
    case "send-email": {
      const to = data.to as string | undefined;
      const subject = data.subject as string | undefined;
      if (to) return subject ? `${to} — ${subject}` : to;
      return null;
    }
    case "delay": {
      const amount = data.delayAmount as string | number | undefined;
      const unit = data.delayUnit as string | undefined;
      return amount ? `${amount} ${unit ?? "seconds"}` : null;
    }
    default:
      return null;
  }
};

export const WorkflowNode = ({ id, data, selected }: WorkflowNodeProps) => {
  const { setNodes, setEdges } = useReactFlow();
  const [isHandleHovered, setIsHandleHovered] = React.useState(false);
  const nodeType = data.type;
  const Icon = ICON_MAP[nodeType] ?? Globe;
  const colors = COLOR_MAP[nodeType] ?? COLOR_MAP["integration-webhook"];
  const isTrigger =
    nodeType === "webhook-shopify" ||
    nodeType === "webhook-lightfunnels" ||
    nodeType === "webhook-youcan" ||
    nodeType === "webhook-custom";
  const isCondition = data.outputFormat === "branch";
  const configSummary = getConfigSummary(data);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id),
    );
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("open-node-palette", { detail: { sourceNodeId: id } }),
    );
  };

  const handleConfigure = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("open-node-config", { detail: { nodeId: id } }),
    );
  };

  const handleAddIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("open-node-palette", { detail: { targetNodeId: id } }),
    );
  };

  const handleAddOut = (e: React.MouseEvent, handleId?: string) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("open-node-palette", {
        detail: {
          sourceNodeId: id,
          sourceHandle: handleId,
        },
      }),
    );
  };

  return (
    <div
      className={`group relative min-w-[200px] max-w-[240px] rounded-xl border border-border/50 bg-card p-3 shadow-lg transition-all duration-300 ${
        selected
          ? `ring-2 ring-primary/25 ring-offset-2 ring-offset-surface ${colors.border}`
          : "border-border/50 hover:border-outline-variant"
      }`}
    >
      <div
        className={`pointer-events-none absolute -top-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border border-border/50 bg-card p-1 opacity-0 shadow-sm transition-all duration-200 ${!isHandleHovered ? "group-hover:-top-11 group-hover:pointer-events-auto group-hover:opacity-100" : ""} before:absolute before:-bottom-4 before:left-0 before:right-0 before:h-4 before:content-['']`}
      >
        <button
          onClick={handleAdd}
          className={nodeActionBtnClass}
          title="Add Action"
        >
          <Plus weight="bold" className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleConfigure}
          className={nodeActionBtnClass}
          title="Configure"
        >
          <Gear weight="bold" className="h-3.5 w-3.5" />
        </button>
        <div className="mx-0.5 h-4 w-px bg-outline-variant/50" />
        <button
          onClick={handleDelete}
          className="flex h-7 w-7 items-center justify-center rounded text-error transition-colors hover:bg-error-container hover:text-on-error-container"
          title="Delete"
        >
          <Trash weight="bold" className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        className={`pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br opacity-40 ${colors.gradient}`}
      />
      {!isTrigger && (
        <>
          <div className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-10 -translate-x-full -translate-y-1/2 bg-outline" />
          <div className="pointer-events-none absolute left-[-20px] top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-card px-1 py-0.5 text-[8px] font-bold tracking-wider text-on-surface-variant">
            IN
          </div>
          <div
            className="group/handle absolute left-[-40px] top-1/2 -translate-x-1/2 -translate-y-1/2"
            onMouseEnter={() => setIsHandleHovered(true)}
            onMouseLeave={() => setIsHandleHovered(false)}
          >
            <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center rounded-lg border border-border/50 bg-card p-1 opacity-0 shadow-sm transition-all duration-200 group-hover/handle:-top-11 group-hover/handle:opacity-100 z-50">
              <button
                onClick={handleAddIn}
                className={nodeActionBtnClass}
              >
                <Plus weight="bold" className="h-3.5 w-3.5" />
              </button>
            </div>
            <Handle
              type="target"
              position={Position.Left}
              className="h-3! w-3! border-2! border-card! bg-on-surface!"
              style={{
                position: "relative",
                left: "0",
                top: "0",
                transform: "none",
              }}
            />
          </div>
        </>
      )}

      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm ${colors.iconBg} ${colors.icon} ring-1 ring-black/8 dark:ring-white/12`}
          >
            <Icon className="h-4 w-4" weight="duotone" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold tracking-tight text-on-surface">
              {data.label}
            </p>
            {data.description && (
              <p className="truncate text-[10px] leading-relaxed text-on-surface-variant">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {configSummary && (
          <div className="mt-1 truncate rounded-md bg-surface-container-low px-2 py-1 text-[11px] font-medium text-on-surface-variant shadow-sm ring-1 ring-border/50">
            {configSummary}
          </div>
        )}
      </div>

      {isCondition && (
        <>
          {/* No Branch */}
          <div className="pointer-events-none absolute right-0 top-[30%] h-[2px] w-10 translate-x-full -translate-y-1/2 bg-outline" />
          <div className="pointer-events-none absolute right-[-20px] top-[30%] z-10 translate-x-1/2 -translate-y-1/2 bg-card px-1 py-0.5 text-[8px] font-bold tracking-wider text-on-surface-variant">
            NO
          </div>
          <div
            className="group/handle absolute right-[-40px] top-[30%] -translate-y-1/2 translate-x-1/2"
            onMouseEnter={() => setIsHandleHovered(true)}
            onMouseLeave={() => setIsHandleHovered(false)}
          >
            <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center rounded-lg border border-border/50 bg-card p-1 opacity-0 shadow-sm transition-all duration-200 group-hover/handle:-top-11 group-hover/handle:opacity-100 z-50">
              <button
                onClick={(e) => handleAddOut(e, "no")}
                className={nodeActionBtnClass}
              >
                <Plus weight="bold" className="h-3.5 w-3.5" />
              </button>
            </div>
            <Handle
              id="no"
              type="source"
              position={Position.Right}
              className="h-3! w-3! border-2! border-card! bg-on-surface!"
              style={{
                position: "relative",
                right: "0",
                top: "0",
                transform: "none",
              }}
            />
          </div>

          {/* Yes Branch */}
          <div className="pointer-events-none absolute right-0 top-[70%] h-[2px] w-10 translate-x-full -translate-y-1/2 bg-outline" />
          <div className="pointer-events-none absolute right-[-20px] top-[70%] z-10 translate-x-1/2 -translate-y-1/2 bg-card px-1 py-0.5 text-[8px] font-bold tracking-wider text-on-surface-variant">
            YES
          </div>
          <div
            className="group/handle absolute right-[-40px] top-[70%] -translate-y-1/2 translate-x-1/2"
            onMouseEnter={() => setIsHandleHovered(true)}
            onMouseLeave={() => setIsHandleHovered(false)}
          >
            <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center rounded-lg border border-border/50 bg-card p-1 opacity-0 shadow-sm transition-all duration-200 group-hover/handle:-top-11 group-hover/handle:opacity-100 z-50">
              <button
                onClick={(e) => handleAddOut(e, "yes")}
                className={nodeActionBtnClass}
              >
                <Plus weight="bold" className="h-3.5 w-3.5" />
              </button>
            </div>
            <Handle
              id="yes"
              type="source"
              position={Position.Right}
              className="h-3! w-3! border-2! border-card! bg-on-surface!"
              style={{
                position: "relative",
                right: "0",
                top: "0",
                transform: "none",
              }}
            />
          </div>
        </>
      )}

      {!isCondition && (
        <>
          <div className="pointer-events-none absolute right-0 top-1/2 h-[2px] w-10 translate-x-full -translate-y-1/2 bg-outline" />
          <div className="pointer-events-none absolute right-[-20px] top-1/2 z-10 translate-x-1/2 -translate-y-1/2 bg-card px-1 py-0.5 text-[8px] font-bold tracking-wider text-on-surface-variant">
            OUT
          </div>
          <div
            className="group/handle absolute right-[-40px] top-1/2 -translate-y-1/2 translate-x-1/2"
            onMouseEnter={() => setIsHandleHovered(true)}
            onMouseLeave={() => setIsHandleHovered(false)}
          >
            <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center rounded-lg border border-border/50 bg-card p-1 opacity-0 shadow-sm transition-all duration-200 group-hover/handle:-top-11 group-hover/handle:opacity-100 z-50">
              <button
                onClick={(e) => handleAddOut(e)}
                className={nodeActionBtnClass}
              >
                <Plus weight="bold" className="h-3.5 w-3.5" />
              </button>
            </div>
            <Handle
              type="source"
              position={Position.Right}
              className="h-3! w-3! border-2! border-card! bg-on-surface!"
              style={{
                position: "relative",
                right: "0",
                top: "0",
                transform: "none",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
