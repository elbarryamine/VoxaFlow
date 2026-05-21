"use client";

import { Handle, Position } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";

import { NodeTypeIcon } from "@/src/features/workflows/ui/NodeTypeIcon";
import type { WorkflowNodeData } from "@/src/features/workflows/types/Workflow.types";
import { cn } from "@/src/shared/utils/cn";

const BORDER_MAP: Partial<Record<WorkflowNodeData["type"], string>> = {
  "webhook-shopify": "border-secondary/35",
  "webhook-custom": "border-outline/45",
  "ai-custom-model": "border-primary/30",
  "integration-slack": "border-tertiary/30",
  openai: "border-primary/28",
  "send-email": "border-secondary/28",
  slack: "border-tertiary/30",
  delay: "border-outline-variant/55",
};

const NODE_BG_GRADIENT =
  "from-surface-container-highest to-surface-container-lowest";

type LandingFlowNodeType = Node<WorkflowNodeData, "landingFlowNode">;

const getConfigSummary = (data: WorkflowNodeData): string | null => {
  switch (data.type) {
    case "webhook-shopify":
    case "webhook-custom": {
      const agent = data.agentName as string | undefined;
      const webhookPath = data.webhookPath as string | undefined;
      if (data.type === "webhook-custom" && webhookPath) return webhookPath;
      return agent ?? null;
    }
    case "ai-custom-model":
      return data.outputFormat === "branch"
        ? "Branch Yes/No"
        : (data.modelName as string | undefined) ?? null;
    case "integration-slack":
      return (data.slackChannel as string | undefined) ?? null;
    case "openai":
      return (data.model as string | undefined) ?? null;
    case "send-email": {
      const to = data.to as string | undefined;
      const subject = data.subject as string | undefined;
      return to ? (subject ? `${to} — ${subject}` : to) : null;
    }
    case "slack":
      return (data.channel as string | undefined) ?? null;
    case "delay": {
      const amount = data.delayAmount as string | number | undefined;
      const unit = data.delayUnit as string | undefined;
      return amount ? `${amount} ${unit ?? "seconds"}` : null;
    }
    default:
      return null;
  }
};

export const LandingFlowNode = ({ data, selected }: NodeProps<LandingFlowNodeType>) => {
  const nodeType = data.type;
  const borderAccent = BORDER_MAP[nodeType] ?? "border-outline/40";
  const isTrigger =
    nodeType === "webhook-shopify" ||
    nodeType === "webhook-lightfunnels" ||
    nodeType === "webhook-youcan" ||
    nodeType === "webhook-custom";
  const isCondition = data.outputFormat === "branch";
  const configSummary = getConfigSummary(data);

  return (
    <div
      className={cn(
        "relative min-w-[200px] max-w-[240px] rounded-md border border-border/50 bg-card p-3 shadow-sm transition-all duration-500",
        selected
          ? cn("ring-2 ring-primary/25 ring-offset-2 ring-offset-surface", borderAccent)
          : cn("border-border/50", borderAccent),
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-md bg-linear-to-br opacity-40",
          NODE_BG_GRADIENT,
        )}
        aria-hidden
      />

      {!isTrigger && (
        <>
          <div className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-10 -translate-x-full -translate-y-1/2 bg-outline" />
          <div className="pointer-events-none absolute left-[-20px] top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-card px-1 py-0.5 font-manrope text-[8px] font-bold tracking-wider text-on-surface-variant">
            IN
          </div>
          <Handle
            type="target"
            position={Position.Left}
            className="h-3! w-3! border-2! border-card! bg-on-surface!"
            style={{ left: -40, top: "50%", transform: "translate(-50%, -50%)" }}
          />
        </>
      )}

      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <NodeTypeIcon type={nodeType} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-manrope text-[13px] font-bold tracking-tight text-on-surface">
              {data.label}
            </p>
            {data.description && (
              <p className="truncate font-manrope text-[10px] leading-relaxed text-on-surface-variant">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {configSummary && (
          <div className="truncate rounded-none bg-surface-container-low px-2 py-1 font-manrope text-[11px] font-medium text-on-surface-variant shadow-sm ring-1 ring-border/50">
            {configSummary}
          </div>
        )}
      </div>

      {isCondition ? (
        <>
          <div className="pointer-events-none absolute right-0 top-[30%] h-[2px] w-10 translate-x-full -translate-y-1/2 bg-outline" />
          <div className="pointer-events-none absolute right-[-20px] top-[30%] z-10 translate-x-1/2 -translate-y-1/2 bg-card px-1 py-0.5 font-manrope text-[8px] font-bold tracking-wider text-on-surface-variant">
            NO
          </div>
          <Handle
            id="no"
            type="source"
            position={Position.Right}
            className="h-3! w-3! border-2! border-card! bg-on-surface!"
            style={{ right: -40, top: "30%", transform: "translate(50%, -50%)" }}
          />

          <div className="pointer-events-none absolute right-0 top-[70%] h-[2px] w-10 translate-x-full -translate-y-1/2 bg-outline" />
          <div className="pointer-events-none absolute right-[-20px] top-[70%] z-10 translate-x-1/2 -translate-y-1/2 bg-card px-1 py-0.5 font-manrope text-[8px] font-bold tracking-wider text-on-surface-variant">
            YES
          </div>
          <Handle
            id="yes"
            type="source"
            position={Position.Right}
            className="h-3! w-3! border-2! border-card! bg-on-surface!"
            style={{ right: -40, top: "70%", transform: "translate(50%, -50%)" }}
          />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute right-0 top-1/2 h-[2px] w-10 translate-x-full -translate-y-1/2 bg-outline" />
          <div className="pointer-events-none absolute right-[-20px] top-1/2 z-10 translate-x-1/2 -translate-y-1/2 bg-card px-1 py-0.5 font-manrope text-[8px] font-bold tracking-wider text-on-surface-variant">
            OUT
          </div>
          <Handle
            type="source"
            position={Position.Right}
            className="h-3! w-3! border-2! border-card! bg-on-surface!"
            style={{ right: -40, top: "50%", transform: "translate(50%, -50%)" }}
          />
        </>
      )}
    </div>
  );
};
