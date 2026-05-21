"use client";

import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import { Trash, Plus, Gear } from "@phosphor-icons/react/dist/ssr";
import { NodeTypeIcon } from "./NodeTypeIcon";
import type { WorkflowNodeData } from "../types/Workflow.types";

type WorkflowNodeProps = NodeProps<Node<WorkflowNodeData>>;

/** Per-type border accents (card background uses NODE_BG_GRADIENT). */
const COLOR_MAP = {
  "webhook-shopify": { border: "border-secondary/35" },
  "webhook-lightfunnels": { border: "border-warning/40" },
  "webhook-youcan": { border: "border-success/35" },
  "webhook-custom": { border: "border-outline/45" },
  "ai-custom-model": { border: "border-primary/30" },
  "integration-spreadsheet": { border: "border-success/30" },
  "integration-email": { border: "border-secondary/30" },
  "integration-slack": { border: "border-tertiary/30" },
  "integration-webhook": { border: "border-warning/30" },
  "api-request": { border: "border-outline/40" },
  openai: { border: "border-primary/28" },
  slack: { border: "border-tertiary/30" },
  "send-email": { border: "border-secondary/28" },
  delay: { border: "border-outline-variant/55" },
} as const;

const NODE_BG_GRADIENT =
  "from-surface-container-highest to-surface-container-lowest";

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
        className={`pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br opacity-40 ${NODE_BG_GRADIENT}`}
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
          <NodeTypeIcon type={nodeType} />
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
