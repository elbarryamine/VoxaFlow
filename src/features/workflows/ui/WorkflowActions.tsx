"use client";

import { Copy, MagicWand, Trash, Plus, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils/cn";

interface WorkflowActionsProps {
  onStartFromTemplate: () => void;
  onFormat: () => void;
  onClear: () => void;
  onTogglePalette: () => void;
  isPaletteOpen: boolean;
}

const iconClass = "h-4 w-4 shrink-0";

export const WorkflowActions = ({
  onStartFromTemplate,
  onFormat,
  onClear,
  onTogglePalette,
  isPaletteOpen,
}: WorkflowActionsProps) => {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/50 bg-surface-container-low px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <div className="hidden items-center gap-2 pr-2 sm:flex">
          <SquaresFour
            className="h-4 w-4 text-on-surface-variant"
            weight="duotone"
          />
          <span className="font-manrope text-[12px] font-bold tracking-wide text-on-surface-variant">
            Workflow Builder
          </span>
          <div className="h-4 w-px bg-outline-variant/50" aria-hidden />
        </div>

        <button
          type="button"
          onClick={onTogglePalette}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-xl px-3.5 font-manrope text-[13px] font-bold transition-all duration-300 active:scale-[0.98]",
            isPaletteOpen
              ? "bg-primary text-on-primary shadow-sm"
              : "border border-border/50 bg-card text-on-surface hover:bg-surface-variant",
          )}
        >
          <Plus className={iconClass} weight="bold" />
          <span className="hidden sm:inline">Add component</span>
          <span className="sm:hidden">Add</span>
        </button>

        <button
          type="button"
          onClick={onStartFromTemplate}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/50 bg-card px-3.5 font-manrope text-[13px] font-bold text-on-surface transition-all duration-300 hover:bg-surface-variant active:scale-[0.98]"
        >
          <Copy className={cn(iconClass, "text-secondary")} weight="bold" />
          <span className="hidden sm:inline">Templates</span>
        </button>
      </div>

      <div className="flex shrink-0 items-center overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
        <button
          type="button"
          onClick={onFormat}
          className="inline-flex h-9 items-center gap-2 px-3.5 font-manrope text-[13px] font-bold text-on-surface transition-colors hover:bg-surface-variant active:scale-[0.98]"
          title="Auto-format workflow"
        >
          <MagicWand className={iconClass} weight="bold" />
          <span className="hidden md:inline">Format</span>
        </button>
        <div className="h-5 w-px bg-outline-variant/50" aria-hidden />
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 items-center gap-2 px-3.5 font-manrope text-[13px] font-bold text-error transition-colors hover:bg-error-container hover:text-on-error-container active:scale-[0.98]"
          title="Clear all nodes"
        >
          <Trash className={iconClass} weight="bold" />
          <span className="hidden md:inline">Clear</span>
        </button>
      </div>
    </div>
  );
};
