"use client";

import { useState, useEffect } from "react";
import { X, BracketsCurly, TreeStructure } from "@phosphor-icons/react/dist/ssr";
import type { Node, Edge } from "@xyflow/react";

import type {
  WorkflowNodeData,
  WorkflowNodeDataValue,
  WorkflowNodeType,
} from "../types/Workflow.types";
import { NODE_OUTPUT_SCHEMAS } from "../constants/NODE_OUTPUT_SCHEMAS";
import { NODE_TEMPLATES } from "../constants/NODE_TEMPLATES";
import { DEFAULT_TRIGGER_MOCK_DATA } from "../constants/DEFAULT_TRIGGER_MOCK_DATA";
import { ShopifyTriggerConfig } from "./node-configs/ShopifyTriggerConfig";
import { LightfunnelsTriggerConfig } from "./node-configs/LightfunnelsTriggerConfig";
import { YoucanTriggerConfig } from "./node-configs/YoucanTriggerConfig";
import { CustomWebhookTriggerConfig } from "./node-configs/CustomWebhookTriggerConfig";
import { AICustomModelConfig } from "./node-configs/AICustomModelConfig";

import { SlackIntegrationConfig } from "./node-configs/SlackIntegrationConfig";
import { SpreadsheetIntegrationConfig } from "./node-configs/SpreadsheetIntegrationConfig";
import { EmailIntegrationConfig } from "./node-configs/EmailIntegrationConfig";
import { WebhookIntegrationConfig } from "./node-configs/WebhookIntegrationConfig";
import { ApiRequestConfig } from "./node-configs/ApiRequestConfig";
import { OpenAIConfig } from "./node-configs/OpenAIConfig";
import { SlackConfig } from "./node-configs/SlackConfig";
import { SendEmailConfig } from "./node-configs/SendEmailConfig";
import { DelayConfig } from "./node-configs/DelayConfig";
import {
  FieldLabel,
  TextInput,
  TextAreaInput,
  type NodeConfigProps,
} from "./node-configs/shared";

interface NodeConfigSidebarProps {
  node: Node<WorkflowNodeData> | null;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onUpdateNode: (field: string, value: WorkflowNodeDataValue) => void;
  onClose: () => void;
}

const TYPE_LABELS: Record<WorkflowNodeType, string> = {
  "webhook-shopify": "Shopify Trigger",
  "webhook-lightfunnels": "Lightfunnels Trigger",
  "webhook-youcan": "YouCan Trigger",
  "webhook-custom": "Custom Webhook Trigger",
  "ai-custom-model": "AI Custom Model",

  "integration-slack": "Slack Integration",
  "integration-spreadsheet": "Spreadsheet Integration",
  "integration-email": "Email Integration",
  "integration-webhook": "Webhook Integration",
  "api-request": "API Request",

  // Executor-backed nodes
  "openai": "OpenAI",
  "slack": "Slack (Bot)",
  "send-email": "Send Email (Resend)",
  "delay": "Delay",
};

const CONFIG_MAP: Record<
  WorkflowNodeType,
  React.ComponentType<NodeConfigProps>
> = {
  "webhook-shopify": ShopifyTriggerConfig,
  "webhook-lightfunnels": LightfunnelsTriggerConfig,
  "webhook-youcan": YoucanTriggerConfig,
  "webhook-custom": CustomWebhookTriggerConfig,
  "ai-custom-model": AICustomModelConfig,

  "integration-slack": SlackIntegrationConfig,
  "integration-spreadsheet": SpreadsheetIntegrationConfig,
  "integration-email": EmailIntegrationConfig,
  "integration-webhook": WebhookIntegrationConfig,
  "api-request": ApiRequestConfig,

  // Executor-backed nodes
  "openai": OpenAIConfig,
  "slack": SlackConfig,
  "send-email": SendEmailConfig,
  "delay": DelayConfig,
};

interface ExpandedField {
  name: string;
  type: string;
  description: string;
}

function expandBaseFields(fields: ExpandedField[]): ExpandedField[] {
  const expanded = [...fields];
  const existingNames = new Set(fields.map((f) => f.name));

  for (const field of fields) {
    if (field.name === "usage" && field.type === "object") {
      const subfields = [
        { name: "usage.prompt_tokens", type: "number", description: "Number of prompt tokens used" },
        { name: "usage.completion_tokens", type: "number", description: "Number of completion tokens used" },
        { name: "usage.total_tokens", type: "number", description: "Total tokens used" },
      ];
      for (const sf of subfields) {
        if (!existingNames.has(sf.name)) {
          expanded.push(sf);
          existingNames.add(sf.name);
        }
      }
    }
  }
  return expanded;
}

function flattenMockData(obj: unknown, prefix = ""): ExpandedField[] {
  if (obj === null || obj === undefined) return [];
  if (typeof obj !== "object") return [];

  if (Array.isArray(obj)) {
    if (obj.length > 0 && typeof obj[0] === "object" && obj[0] !== null) {
      return flattenMockData(obj[0], `${prefix}[]`);
    }
    return [];
  }

  const results: ExpandedField[] = [];
  const record = obj as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    const val = record[key];
    const path = prefix ? `${prefix}.${key}` : key;
    const type = Array.isArray(val) ? "array" : (val === null ? "null" : typeof val);

    results.push({
      name: path,
      type,
      description: `Nested field: ${path}`,
    });

    if (typeof val === "object" && val !== null) {
      results.push(...flattenMockData(val, path));
    }
  }
  return results;
}

function getInitialMockData(node: Node<WorkflowNodeData> | null): string {
  if (!node) return "";
  const template = NODE_TEMPLATES.find((t) => t.type === node.data.type);
  const isTriggerNode = template?.category === "trigger";
  if (!isTriggerNode) return "";
  const currentMock = node.data.testMockData;
  if (currentMock === undefined || currentMock === null || currentMock === "") {
    const defaultData = DEFAULT_TRIGGER_MOCK_DATA[node.data.type] || {};
    return JSON.stringify(defaultData, null, 2);
  }
  return typeof currentMock === "string" ? currentMock : JSON.stringify(currentMock, null, 2);
}

export const NodeConfigSidebar = ({
  node,
  nodes,
  edges,
  onUpdateNode,
  onClose,
}: NodeConfigSidebarProps) => {
  const [mockDataText, setMockDataText] = useState(() => getInitialMockData(node));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [prevNodeId, setPrevNodeId] = useState<string | null>(null);

  if (node && node.id !== prevNodeId) {
    setPrevNodeId(node.id);
    const initialText = getInitialMockData(node);
    setMockDataText(initialText);
    setJsonError(null);
  }

  useEffect(() => {
    if (!node) return;
    const template = NODE_TEMPLATES.find((t) => t.type === node.data.type);
    const isTriggerNode = template?.category === "trigger";
    if (isTriggerNode) {
      const currentMock = node.data.testMockData;
      if (currentMock === undefined || currentMock === null || currentMock === "") {
        const defaultData = DEFAULT_TRIGGER_MOCK_DATA[node.data.type] || {};
        const mockStr = JSON.stringify(defaultData, null, 2);
        const timer = setTimeout(() => {
          onUpdateNode("testMockData", mockStr);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [node, onUpdateNode]);

  const handleMockDataChange = (value: string) => {
    setMockDataText(value);
    try {
      if (value.trim() === "") {
        setJsonError(null);
        onUpdateNode("testMockData", "");
        return;
      }
      JSON.parse(value);
      setJsonError(null);
      onUpdateNode("testMockData", value);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      onUpdateNode("testMockData", value);
    }
  };

  if (!node) return null;

  const ConfigComponent = CONFIG_MAP[node.data.type];
  const template = NODE_TEMPLATES.find((t) => t.type === node.data.type);
  const isTrigger = template?.category === "trigger";
  const typeLabel = TYPE_LABELS[node.data.type] ?? node.data.type;
  
  const schemaDef = NODE_OUTPUT_SCHEMAS[node.data.type];
  const outputFields = typeof schemaDef === "function" 
    ? schemaDef(node.data as unknown as Record<string, unknown>) 
    : schemaDef;

  const getUpstreamNodes = (
    targetNodeId: string,
    allNodes: Node<WorkflowNodeData>[],
    allEdges: Edge[]
  ): Node<WorkflowNodeData>[] => {
    const visited = new Set<string>();
    const upstream: Node<WorkflowNodeData>[] = [];

    const traverse = (nodeId: string) => {
      const incomingEdges = allEdges.filter((e) => e.target === nodeId);
      for (const edge of incomingEdges) {
        if (!visited.has(edge.source)) {
          visited.add(edge.source);
          const sourceNode = allNodes.find((n) => n.id === edge.source);
          if (sourceNode) {
            upstream.push(sourceNode);
            traverse(sourceNode.id);
          }
        }
      }
    };

    traverse(targetNodeId);
    return upstream;
  };

  const upstreamNodes = getUpstreamNodes(node.id, nodes, edges);
  
  const inputVariables = upstreamNodes
    .map((upNode) => {
      const upSchemaDef = NODE_OUTPUT_SCHEMAS[upNode.data.type];
      const baseFields = typeof upSchemaDef === "function" 
        ? upSchemaDef(upNode.data as unknown as Record<string, unknown>) 
        : upSchemaDef;
      
      let fieldsList: ExpandedField[] = [];
      if (baseFields) {
        fieldsList = expandBaseFields(baseFields.map((f) => ({ ...f })));

        // Check if there is testMockData or fallback to DEFAULT_TRIGGER_MOCK_DATA
        let mockObj: unknown = null;
        if (
          upNode.data.testMockData &&
          typeof upNode.data.testMockData === "string" &&
          upNode.data.testMockData.trim() !== ""
        ) {
          try {
            mockObj = JSON.parse(upNode.data.testMockData);
          } catch {
            // JSON parse failed
          }
        } else {
          mockObj = DEFAULT_TRIGGER_MOCK_DATA[upNode.data.type as keyof typeof DEFAULT_TRIGGER_MOCK_DATA];
        }

        if (mockObj) {
          const flatMock = flattenMockData(mockObj);
          const existingNames = new Set(fieldsList.map((f) => f.name));
          for (const f of flatMock) {
            if (!existingNames.has(f.name)) {
              fieldsList.push(f);
              existingNames.add(f.name);
            }
          }
        }
      }

      return {
        nodeId: upNode.id,
        nodeLabel: upNode.data.label || upNode.id,
        fields: fieldsList,
      };
    })
    .filter((group) => group.fields.length > 0);

  return (
    <aside className="h-full w-[480px] shrink-0">
      <div className="flex h-full w-full shrink-0 flex-col rounded-xl border border-border bg-card shadow-2xl">
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
              inputVariables={inputVariables}
            />

            {isTrigger && (
              <>
                <div className="flex items-center gap-2 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    Test Mock Data
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="test-mock-data"
                    hint={
                      <span className={`text-[10px] ${jsonError ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                        {jsonError ? "Invalid JSON" : "JSON payload for Test Run"}
                      </span>
                    }
                  >
                    Mock Trigger Payload
                  </FieldLabel>
                  <TextAreaInput
                    id="test-mock-data"
                    value={mockDataText}
                    onChange={handleMockDataChange}
                    placeholder="{}"
                    rows={8}
                  />
                  {jsonError && (
                    <p className="text-[10px] font-medium text-red-500">
                      {jsonError}
                    </p>
                  )}
                </div>
              </>
            )}

            {inputVariables.length > 0 && (
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    Input Variables Tree
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-background/50">
                  <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
                    <TreeStructure className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">Available from Upstream</span>
                  </div>
                  <div className="space-y-4 p-3 max-h-[300px] overflow-y-auto">
                    {inputVariables.map((group) => (
                      <div key={group.nodeId} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {group.nodeLabel} <span className="opacity-50 font-mono">({group.nodeId})</span>
                          </span>
                          <div className="h-px flex-1 bg-border/50" />
                        </div>
                        <ul className="space-y-2">
                          {group.fields.map((field) => (
                            <li key={field.name} className="group flex flex-col gap-0.5">
                              <div className="flex items-center justify-between">
                                <code className="cursor-copy rounded bg-primary/10 px-1 py-0.5 text-xs font-semibold text-primary/90 transition-colors hover:bg-primary/20" title="Click to copy mapping">
                                  {"{{"} {group.nodeId}.{field.name} {"}}"}
                                </code>
                                <span className="rounded bg-muted/50 px-1 font-mono text-[10px] text-muted-foreground">
                                  {field.type}
                                </span>
                              </div>
                              {field.description && (
                                <span className="pl-1 text-[10px] leading-snug text-muted-foreground/80">
                                  {field.description}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {outputFields && outputFields.length > 0 && (
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    Output Schema
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-background/50">
                  <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
                    <BracketsCurly className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">Available Fields</span>
                  </div>
                  <ul className="divide-y divide-border">
                    {outputFields.map((field) => (
                      <li key={field.name} className="p-3 transition-colors hover:bg-muted/20">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-primary">
                            {field.name}
                          </span>
                          <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-secondary-foreground">
                            {field.type}
                          </span>
                        </div>
                        <p className="text-[11px] leading-snug text-muted-foreground">
                          {field.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
