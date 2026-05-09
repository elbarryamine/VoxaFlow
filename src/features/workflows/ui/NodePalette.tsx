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
  DotsSixVertical,
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
  onDragStart: (template: NodeTemplate) => void;
  onAdd: (template: NodeTemplate) => void;
  hasNodes?: boolean;
}

export const NodePalette = ({ onDragStart, onAdd, hasNodes }: NodePaletteProps) => {
  const grouped = NODE_TEMPLATES.reduce(
    (acc, t) => {
      // Hide triggers if nodes already exist
      if (hasNodes && t.category === "trigger") return acc;

      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    },
    {} as Record<string, NodeTemplate[]>,
  );

  return (
    <div className="h-full w-full shrink-0">
      <div className="flex h-full w-full shrink-0 flex-col rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">Components</h3>
            <p className="text-xs text-muted-foreground">Drag onto the canvas</p>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("close-node-palette"))}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-3 [scrollbar-color:var(--muted-foreground)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/60 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2">
          {(Object.keys(grouped) as Array<keyof typeof CATEGORY_LABELS>).map(
            (category) => (
              <div key={category}>
                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {CATEGORY_LABELS[category]}
                </p>
                <div className="space-y-1.5">
                  {grouped[category].map((template) => {
                    const Icon =
                      TYPE_ICONS[template.type as keyof typeof TYPE_ICONS] ??
                      Globe;
                    return (
                      <div
                        key={`${template.type}-${template.label}`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          onDragStart(template);
                        }}
                        onClick={() => onAdd(template)}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background p-2.5 transition-colors hover:border-primary/30 hover:bg-secondary"
                      >
                        <DotsSixVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
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
            ),
          )}
        </div>
      </div>
    </div>
  );
};
