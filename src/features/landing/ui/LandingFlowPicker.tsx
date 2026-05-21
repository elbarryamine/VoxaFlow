"use client";

import { CaretDown, Check } from "@phosphor-icons/react";
import { LANDING_FLOWS } from "@/src/features/landing/constants/LANDING_FLOWS";
import { cn } from "@/src/shared/utils/cn";

interface LandingFlowPickerProps {
  flowIndex: number;
  menuOpen: boolean;
  highlightedOption: number | null;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onOptionRef: (index: number, element: HTMLLIElement | null) => void;
}

export const LandingFlowPicker = ({
  flowIndex,
  menuOpen,
  highlightedOption,
  triggerRef,
  onOptionRef,
}: LandingFlowPickerProps) => {
  const activeFlow = LANDING_FLOWS[flowIndex]!;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        tabIndex={-1}
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
        aria-label="Example workflow"
        className={cn(
          "flex items-center gap-2 rounded-xl border border-border/50 bg-surface-container-low px-3 py-2 font-manrope text-[12px] font-semibold text-on-surface shadow-sm transition-all duration-300",
          menuOpen && "border-secondary/40 bg-secondary-container/25 ring-2 ring-primary/15",
        )}
      >
        <span className="max-w-[9.5rem] truncate sm:max-w-[11rem]">
          {activeFlow.pickerLabel}
        </span>
        <CaretDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-on-surface-variant transition-transform duration-300",
            menuOpen && "rotate-180 text-secondary",
          )}
          weight="bold"
          aria-hidden
        />
      </button>

      <ul
        role="listbox"
        aria-label="Example workflows"
        className={cn(
          "absolute top-[calc(100%+6px)] right-0 z-20 max-h-52 min-w-[13rem] overflow-x-hidden overflow-y-auto rounded-xl border border-border/50 bg-card py-1 shadow-lg transition-[opacity,transform] duration-300 origin-top-right",
          menuOpen
            ? "pointer-events-none scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {LANDING_FLOWS.map((preset, index) => {
          const isActive = index === flowIndex;
          const isHighlighted = index === highlightedOption;

          return (
            <li
              key={preset.id}
              ref={(element) => onOptionRef(index, element)}
              role="option"
              aria-selected={isActive}
              className={cn(
                "flex items-center justify-between gap-3 px-3 py-2.5 font-manrope text-[12px] font-semibold transition-colors duration-200",
                isHighlighted && "bg-secondary-container/50 text-on-surface",
                !isHighlighted && isActive && "text-secondary",
                !isHighlighted && !isActive && "text-on-surface-variant",
              )}
            >
              <span className="truncate">{preset.pickerLabel}</span>
              {isActive && (
                <Check className="h-3.5 w-3.5 shrink-0 text-secondary" weight="bold" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
