"use client";

import {
  MagnifyingGlass,
  SquaresFour,
  ListBullets,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils/cn";
import type { CardCollectionViewMode } from "@/src/shared/types/CardCollectionView.types";

interface CardCollectionToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: CardCollectionViewMode;
  onViewModeChange: (mode: CardCollectionViewMode) => void;
  searchPlaceholder?: string;
  resultLabel?: string;
}

const VIEW_OPTIONS: {
  mode: CardCollectionViewMode;
  label: string;
  icon: typeof SquaresFour;
}[] = [
  { mode: "grid", label: "Grid view", icon: SquaresFour },
  { mode: "list", label: "List view", icon: ListBullets },
];

export const CardCollectionToolbar = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  searchPlaceholder = "Search…",
  resultLabel,
}: CardCollectionToolbarProps) => (
  <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
    <div className="relative min-w-0 flex-1 sm:max-w-md">
      <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className="w-full rounded-xl border border-border/50 bg-surface-variant/30 py-2 pl-9 pr-3 font-manrope text-[13px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>

    <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
      {resultLabel ? (
        <p className="font-manrope text-[12px] font-semibold text-on-surface-variant">
          {resultLabel}
        </p>
      ) : null}
      <div
        className="inline-flex rounded-xl border border-border/50 bg-surface-variant/30 p-1"
        role="group"
        aria-label="View mode"
      >
        {VIEW_OPTIONS.map(({ mode, label, icon: Icon }) => {
          const isActive = viewMode === mode;
          return (
            <button
              key={mode}
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => onViewModeChange(mode)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                isActive
                  ? "bg-card text-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-variant/60 hover:text-on-surface",
              )}
            >
              <Icon className="h-4 w-4" weight={isActive ? "fill" : "regular"} />
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
