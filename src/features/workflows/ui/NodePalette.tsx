"use client";

import {
  Robot,
  FileXls,
  Envelope,
  ChatCircleText,
  Globe,
  ShoppingBag,
  Link,
  Lightning,
  DotsSixVertical,
  X,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";
import { NODE_TEMPLATES } from "../constants/NODE_TEMPLATES";
import type { NodeTemplate } from "../constants/NODE_TEMPLATES";
import { cn } from "@/src/shared/utils/cn";

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
  onDragStart: (template: NodeTemplate) => void;
  isDraggable?: boolean;
  hasNodes?: boolean;
  sourceNodeId?: string | null;
  targetNodeId?: string | null;
}

export const NodePalette = ({
  onAdd,
  onDragStart,
  isDraggable = true,
  hasNodes,
  sourceNodeId,
  targetNodeId,
}: NodePaletteProps) => {
  const categories = Object.keys(CATEGORY_LABELS) as Array<
    keyof typeof CATEGORY_LABELS
  >;

  const grouped = NODE_TEMPLATES.reduce(
    (acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    },
    {} as Record<string, NodeTemplate[]>,
  );

  const isConnectable = (category: string) => {
    if (sourceNodeId || targetNodeId) {
      return category !== "trigger";
    }
    if (!hasNodes) {
      return category === "trigger";
    }
    return category !== "trigger";
  };

  const sortedCategories = [...categories].sort((a, b) => {
    const aCan = isConnectable(a);
    const bCan = isConnectable(b);
    if (aCan && !bCan) return -1;
    if (!aCan && bCan) return 1;
    return 0;
  });

  return (
    <div className="flex h-full w-full flex-col overflow-hidden border-l border-border/50 bg-card shadow-xl">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/50 bg-surface-container-low px-4 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <SquaresFour
              className="h-4 w-4 shrink-0 text-secondary"
              weight="duotone"
            />
            <h3 className="font-newsreader text-lg font-bold tracking-tight text-on-surface">
              Components
            </h3>
          </div>
          <p className="mt-0.5 font-manrope text-[12px] font-medium text-on-surface-variant">
            {isDraggable ? "Drag or click to add" : "Click to add to canvas"}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("close-node-palette"))
          }
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
          aria-label="Close components panel"
        >
          <X className="h-4 w-4" weight="bold" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-3">
        {sortedCategories.map((category) => {
          const templates = grouped[category] || [];
          if (templates.length === 0) return null;

          const categoryEnabled = isConnectable(category);

          return (
            <div key={category}>
              <p className="mb-2 px-1 font-manrope text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/80">
                {CATEGORY_LABELS[category]}
              </p>
              <div className="space-y-1.5">
                {templates.map((template) => {
                  const Icon =
                    TYPE_ICONS[template.type as keyof typeof TYPE_ICONS] ??
                    Globe;

                  return (
                    <div
                      key={`${template.type}-${template.label}`}
                      draggable={isDraggable && categoryEnabled}
                      onDragStart={(e) => {
                        if (isDraggable && categoryEnabled) {
                          e.dataTransfer.effectAllowed = "move";
                          onDragStart(template);
                        }
                      }}
                      onClick={() => categoryEnabled && onAdd(template)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border p-2.5 transition-all duration-200",
                        categoryEnabled
                          ? "cursor-pointer border-border/50 bg-surface-container-lowest hover:border-primary/25 hover:bg-surface-variant/50"
                          : "cursor-not-allowed border-border/30 bg-surface-variant/20 opacity-50",
                      )}
                    >
                      {isDraggable && (
                        <DotsSixVertical
                          className="h-3.5 w-3.5 shrink-0 text-on-surface-variant/40"
                          weight="bold"
                        />
                      )}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-container/50 text-on-secondary-container">
                        <Icon className="h-4 w-4" weight="duotone" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-manrope text-[13px] font-bold text-on-surface">
                          {template.label}
                        </p>
                        <p className="truncate font-manrope text-[11px] font-medium text-on-surface-variant">
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
  );
};
