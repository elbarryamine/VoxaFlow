"use client";

import { Copy, MagicWand, Trash } from "@phosphor-icons/react/dist/ssr";

interface WorkflowActionsProps {
  onStartFromTemplate: () => void;
  onFormat: () => void;
  onClear: () => void;
}

export const WorkflowActions = ({
  onStartFromTemplate,
  onFormat,
  onClear,
}: WorkflowActionsProps) => {
  return (
    <div className="absolute left-6 top-6 z-40 flex items-center gap-3">
      <button
        onClick={onStartFromTemplate}
        className="flex h-10 items-center gap-2.5 rounded-xl border border-border bg-background/80 px-4 text-[13px] font-semibold text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-secondary active:scale-95"
      >
        <div className="flex h-5 w-5 items-center justify-center">
          <Copy weight="bold" className="h-4 w-4 text-primary" />
        </div>
        Templates
      </button>

      <div className="flex items-center overflow-hidden rounded-xl border border-border bg-background/80 shadow-sm backdrop-blur-md">
        <button
          onClick={onFormat}
          className="flex h-10 items-center gap-2.5 px-4 text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors active:bg-secondary/80"
          title="Auto-format Workflow"
        >
          <div className="flex h-5 w-5 items-center justify-center">
            <MagicWand weight="bold" className="h-4 w-4" />
          </div>
          Format
        </button>
        <div className="h-4 w-[1px] bg-border/60" />
        <button
          onClick={onClear}
          className="flex h-10 items-center gap-2.5 px-4 text-[13px] font-semibold text-red-500 hover:bg-red-500/5 hover:text-red-600 transition-colors active:bg-red-500/10"
          title="Clear All Nodes"
        >
          <div className="flex h-5 w-5 items-center justify-center">
            <Trash weight="bold" className="h-4 w-4" />
          </div>
          Clear
        </button>
      </div>
    </div>
  );
};
