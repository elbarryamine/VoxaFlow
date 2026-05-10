"use client";

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
  X,
} from "@phosphor-icons/react/dist/ssr";
import { NODE_TEMPLATES } from "../constants/NODE_TEMPLATES";
import type { NodeTemplate } from "../constants/NODE_TEMPLATES";

const CATEGORY_LABELS = {
  trigger: "Triggers",
  "intelligent-action": "Intelligent Actions",
  "normal-action": "Normal Actions",
} as const;

const TYPE_ICONS = {
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

interface NodePaletteProps {
  onAdd: (template: NodeTemplate) => void;
  hasNodes?: boolean;
  sourceNodeId?: string | null;
  targetNodeId?: string | null;
}

export const NodePalette = ({ 
  onAdd, 
  hasNodes, 
  sourceNodeId, 
  targetNodeId 
}: NodePaletteProps) => {
  const categories = Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>;

  const grouped = NODE_TEMPLATES.reduce(
    (acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    },
    {} as Record<string, NodeTemplate[]>,
  );

  // Determine if a category is "connectable" in the current context
  const isConnectable = (category: string) => {
    if (sourceNodeId || targetNodeId) {
      // Connecting from/to an existing node -> Actions are the target
      return category !== "trigger";
    }
    if (!hasNodes) {
      // Empty canvas -> Only triggers can "connect" (start)
      return category === "trigger";
    }
    // Canvas has nodes but no specific source -> Actions are prioritized
    return category !== "trigger";
  };

  // Sort categories: connectable ones on top
  const sortedCategories = [...categories].sort((a, b) => {
    const aCan = isConnectable(a);
    const bCan = isConnectable(b);
    if (aCan && !bCan) return -1;
    if (!aCan && bCan) return 1;
    return 0;
  });

  return (
    <div className="h-full w-full shrink-0">
      <div className="flex h-full w-full shrink-0 flex-col rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">Components</h3>
            <p className="text-xs text-muted-foreground">Click to add to canvas</p>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("close-node-palette"))}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-3 [scrollbar-color:var(--muted-foreground)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/60 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2">
          {sortedCategories.map((category) => {
            const templates = grouped[category] || [];
            if (templates.length === 0) return null;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {CATEGORY_LABELS[category]}
                  </p>
                </div>
                <div className="space-y-1.5">
                  {templates.map((template) => {
                    const Icon =
                      TYPE_ICONS[template.type as keyof typeof TYPE_ICONS] ??
                      Globe;
                    return (
                      <div
                        key={`${template.type}-${template.label}`}
                        onClick={() => onAdd(template)}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background p-2.5 transition-colors hover:border-primary/30 hover:bg-secondary"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {template.label}
                          </p>
                          <p className="truncate text-[10px] text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
