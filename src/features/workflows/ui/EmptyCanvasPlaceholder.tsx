"use client";

import { Plus, GitBranch } from "@phosphor-icons/react/dist/ssr";

interface EmptyCanvasPlaceholderProps {
  onClick: () => void;
}

export const EmptyCanvasPlaceholder = ({ onClick }: EmptyCanvasPlaceholderProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
      <button
        type="button"
        onClick={onClick}
        className="group pointer-events-auto flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-dashed border-border/50 bg-card/90 px-8 py-8 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-container/60 text-on-secondary-container transition-transform duration-300 group-hover:scale-105">
          <GitBranch className="h-7 w-7" weight="duotone" />
        </div>
        <div>
          <p className="font-newsreader text-xl font-bold tracking-tight text-on-surface">
            Start your workflow
          </p>
          <p className="mt-1.5 font-manrope text-[13px] font-medium text-on-surface-variant">
            Add a trigger or action from the component library
          </p>
        </div>
        <span className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 font-manrope text-[13px] font-bold text-on-primary shadow-sm transition-all group-hover:bg-primary/90">
          <Plus className="h-4 w-4" weight="bold" />
          Add first node
        </span>
      </button>
    </div>
  );
};
