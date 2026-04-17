"use client";

import { X } from "@phosphor-icons/react/dist/ssr";
import type { Node } from "@xyflow/react";

import type {
  WorkflowNodeData,
  WorkflowNodeDataValue,
  WorkflowNodeType,
} from "../types/Workflow.types";
import { InboundCallConfig } from "./node-configs/InboundCallConfig";
import { OutboundCallConfig } from "./node-configs/OutboundCallConfig";
import { ShopifyTriggerConfig } from "./node-configs/ShopifyTriggerConfig";
import { LightfunnelsTriggerConfig } from "./node-configs/LightfunnelsTriggerConfig";
import { YoucanTriggerConfig } from "./node-configs/YoucanTriggerConfig";
import { CustomWebhookTriggerConfig } from "./node-configs/CustomWebhookTriggerConfig";
import { AICustomModelConfig } from "./node-configs/AICustomModelConfig";
import { ConditionConfig } from "./node-configs/ConditionConfig";
import { SlackIntegrationConfig } from "./node-configs/SlackIntegrationConfig";
import { SpreadsheetIntegrationConfig } from "./node-configs/SpreadsheetIntegrationConfig";
import { EmailIntegrationConfig } from "./node-configs/EmailIntegrationConfig";
import { WebhookIntegrationConfig } from "./node-configs/WebhookIntegrationConfig";
import {
  FieldLabel,
  TextInput,
  TextAreaInput,
  type NodeConfigProps,
} from "./node-configs/shared";

interface NodeConfigSidebarProps {
  node: Node<WorkflowNodeData> | null;
  onUpdateNode: (field: string, value: WorkflowNodeDataValue) => void;
  onClose: () => void;
}

const TYPE_LABELS: Record<WorkflowNodeType, string> = {
  "inbound-call": "Inbound Call",
  "outbound-call": "Outbound Call",
  "webhook-shopify": "Shopify Trigger",
  "webhook-lightfunnels": "Lightfunnels Trigger",
  "webhook-youcan": "YouCan Trigger",
  "webhook-custom": "Custom Webhook Trigger",
  "ai-custom-model": "AI Custom Model",
  condition: "Condition",
  "integration-slack": "Slack Integration",
  "integration-spreadsheet": "Spreadsheet Integration",
  "integration-email": "Email Integration",
  "integration-webhook": "Webhook Integration",
};

const CONFIG_MAP: Record<
  WorkflowNodeType,
  React.ComponentType<NodeConfigProps>
> = {
  "inbound-call": InboundCallConfig,
  "outbound-call": OutboundCallConfig,
  "webhook-shopify": ShopifyTriggerConfig,
  "webhook-lightfunnels": LightfunnelsTriggerConfig,
  "webhook-youcan": YoucanTriggerConfig,
  "webhook-custom": CustomWebhookTriggerConfig,
  "ai-custom-model": AICustomModelConfig,
  condition: ConditionConfig,
  "integration-slack": SlackIntegrationConfig,
  "integration-spreadsheet": SpreadsheetIntegrationConfig,
  "integration-email": EmailIntegrationConfig,
  "integration-webhook": WebhookIntegrationConfig,
};

export const NodeConfigSidebar = ({
  node,
  onUpdateNode,
  onClose,
}: NodeConfigSidebarProps) => {
  if (!node) return null;

  const ConfigComponent = CONFIG_MAP[node.data.type];
  const typeLabel = TYPE_LABELS[node.data.type] ?? node.data.type;

  return (
    <aside className="h-full w-[340px] shrink-0 ">
      <div className="flex h-full w-full shrink-0 flex-col rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Configure {typeLabel}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Node ID: {node.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-5">
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="node-label">Display Name</FieldLabel>
                <TextInput
                  id="node-label"
                  value={String(node.data.label ?? "")}
                  onChange={(v) => onUpdateNode("label", v)}
                  placeholder="Node name"
                />
              </div>
              <div>
                <FieldLabel htmlFor="node-description">Description</FieldLabel>
                <TextAreaInput
                  id="node-description"
                  value={String(node.data.description ?? "")}
                  onChange={(v) => onUpdateNode("description", v)}
                  placeholder="Describe what this node does…"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                {typeLabel} Settings
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <ConfigComponent
              data={node.data as unknown as Record<string, unknown>}
              onUpdate={onUpdateNode}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
