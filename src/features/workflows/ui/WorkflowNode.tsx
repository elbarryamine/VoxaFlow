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
} as const;

const COLOR_MAP = {
  "webhook-shopify": {
    gradient: "from-orange-500/20 to-rose-500/20 dark:from-orange-500/20 dark:to-rose-500/20",
    border: "border-orange-500/30 dark:border-orange-500/40",
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    icon: "text-orange-600 dark:text-orange-400",
  },
  "webhook-lightfunnels": {
    gradient: "from-amber-500/20 to-orange-500/20 dark:from-amber-500/20 dark:to-orange-500/20",
    border: "border-amber-500/30 dark:border-amber-500/40",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    icon: "text-amber-600 dark:text-amber-400",
  },
  "webhook-youcan": {
    gradient: "from-sky-500/20 to-blue-500/20 dark:from-sky-500/20 dark:to-blue-500/20",
    border: "border-sky-500/30 dark:border-sky-500/40",
    iconBg: "bg-sky-500/10 dark:bg-sky-500/20",
    icon: "text-sky-600 dark:text-sky-400",
  },
  "webhook-custom": {
    gradient: "from-zinc-500/20 to-slate-500/20 dark:from-zinc-500/20 dark:to-slate-500/20",
    border: "border-zinc-500/30 dark:border-zinc-500/40",
    iconBg: "bg-zinc-500/10 dark:bg-zinc-500/20",
    icon: "text-zinc-600 dark:text-zinc-400",
  },
  "ai-custom-model": {
    gradient: "from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/20 dark:to-purple-500/20",
    border: "border-indigo-500/30 dark:border-indigo-500/40",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    icon: "text-indigo-600 dark:text-indigo-400",
  },
  "integration-spreadsheet": {
    gradient: "from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/20 dark:to-teal-500/20",
    border: "border-emerald-500/30 dark:border-emerald-500/40",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  "integration-email": {
    gradient: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/20 dark:to-cyan-500/20",
    border: "border-blue-500/30 dark:border-blue-500/40",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    icon: "text-blue-600 dark:text-blue-400",
  },
  "integration-slack": {
    gradient: "from-violet-500/20 to-fuchsia-500/20 dark:from-violet-500/20 dark:to-fuchsia-500/20",
    border: "border-violet-500/30 dark:border-violet-500/40",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
    icon: "text-violet-600 dark:text-violet-400",
  },
  "integration-webhook": {
    gradient: "from-pink-500/20 to-rose-500/20 dark:from-pink-500/20 dark:to-rose-500/20",
    border: "border-pink-500/30 dark:border-pink-500/40",
    iconBg: "bg-pink-500/10 dark:bg-pink-500/20",
    icon: "text-pink-600 dark:text-pink-400",
  },
} as const;

const getConfigSummary = (data: WorkflowNodeData): string | null => {
  switch (data.type) {
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

export const WorkflowNode = ({ id, data, selected }: WorkflowNodeProps) => {
  const { setNodes, setEdges } = useReactFlow();
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
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
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

  return (
    <div
      className={`group relative min-w-[200px] max-w-[240px] rounded-xl border border-border/50 bg-background/95 p-3 shadow-lg backdrop-blur-xl transition-all duration-300 ${
        selected ? `ring-2 ring-ring ring-offset-2 ring-offset-background ${colors.border}` : "border-border/50 hover:border-border/80"
      }`}
    >
      <div className="pointer-events-none absolute -top-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border border-border bg-background p-1 opacity-0 shadow-lg transition-all duration-200 group-hover:-top-11 group-hover:pointer-events-auto group-hover:opacity-100 before:absolute before:-bottom-4 before:left-0 before:right-0 before:h-4 before:content-['']">
        <button
          onClick={handleAdd}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="Add Action"
        >
          <Plus weight="bold" className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleConfigure}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="Configure"
        >
          <Gear weight="bold" className="h-3.5 w-3.5" />
        </button>
        <div className="mx-0.5 h-4 w-[1px] bg-border" />
        <button
          onClick={handleDelete}
          className="flex h-7 w-7 items-center justify-center rounded text-red-500 transition-colors hover:bg-secondary hover:text-red-600"
          title="Delete"
        >
          <Trash weight="bold" className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        className={`pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br opacity-50 dark:opacity-40 ${colors.gradient}`}
      />
      {!isTrigger && (
        <>
          <div className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-10 -translate-x-full -translate-y-1/2 bg-foreground" />
          <div className="pointer-events-none absolute left-[-20px] top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-background px-1 py-0.5 text-[8px] font-bold tracking-wider text-foreground">
            IN
          </div>
          <Handle
            type="target"
            position={Position.Left}
            className="h-3! w-3! border-2! border-background! bg-foreground!"
            style={{ left: "-40px" }}
          />
        </>
      )}

      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors.iconBg} ${colors.icon} shadow-sm ring-1 ring-black/5 dark:ring-white/10`}
          >
            <Icon className="h-4 w-4" weight="duotone" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold tracking-tight text-foreground">
              {data.label}
            </p>
            {data.description && (
              <p className="truncate text-[10px] leading-relaxed text-muted-foreground">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {configSummary && (
          <div className="mt-1 truncate rounded-md bg-background/60 px-2 py-1 text-[11px] font-medium text-foreground/80 shadow-sm ring-1 ring-border/50 backdrop-blur-md">
            {configSummary}
          </div>
        )}
      </div>

      {isCondition && (
        <>
          {/* No Branch */}
          <div className="pointer-events-none absolute right-0 top-[30%] h-[2px] w-10 translate-x-full -translate-y-1/2 bg-foreground" />
          <div className="pointer-events-none absolute right-[-20px] top-[30%] z-10 translate-x-1/2 -translate-y-1/2 bg-background px-1 py-0.5 text-[8px] font-bold tracking-wider text-foreground">
            NO
          </div>
          <Handle
            id="no"
            type="source"
            position={Position.Right}
            className="h-3! w-3! border-2! border-background! bg-foreground!"
            style={{ top: "30%", right: "-40px" }}
          />

          {/* Yes Branch */}
          <div className="pointer-events-none absolute right-0 top-[70%] h-[2px] w-10 translate-x-full -translate-y-1/2 bg-foreground" />
          <div className="pointer-events-none absolute right-[-20px] top-[70%] z-10 translate-x-1/2 -translate-y-1/2 bg-background px-1 py-0.5 text-[8px] font-bold tracking-wider text-foreground">
            YES
          </div>
          <Handle
            id="yes"
            type="source"
            position={Position.Right}
            className="h-3! w-3! border-2! border-background! bg-foreground!"
            style={{ top: "70%", right: "-40px" }}
          />
        </>
      )}

      {!isCondition && (
        <>
          <div className="pointer-events-none absolute right-0 top-1/2 h-[2px] w-10 translate-x-full -translate-y-1/2 bg-foreground" />
          <div className="pointer-events-none absolute right-[-20px] top-1/2 z-10 translate-x-1/2 -translate-y-1/2 bg-background px-1 py-0.5 text-[8px] font-bold tracking-wider text-foreground">
            OUT
          </div>
          <Handle
            type="source"
            position={Position.Right}
            className="h-3! w-3! border-2! border-background! bg-foreground!"
            style={{ right: "-40px" }}
          />
        </>
      )}
    </div>
  );
};
