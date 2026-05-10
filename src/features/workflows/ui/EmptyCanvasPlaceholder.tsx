"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";

interface EmptyCanvasPlaceholderProps {
  onClick: () => void;
}

export const EmptyCanvasPlaceholder = ({ onClick }: EmptyCanvasPlaceholderProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <button
        onClick={onClick}
        className="group pointer-events-auto flex h-32 w-32 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/50 bg-background/40 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-background/60 hover:shadow-xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110 group-active:scale-95">
          <Plus weight="bold" className="h-6 w-6" />
        </div>
        <span className="text-[13px] font-semibold text-muted-foreground group-hover:text-foreground">
          Add First Node
        </span>
      </button>
    </div>
  );
};
