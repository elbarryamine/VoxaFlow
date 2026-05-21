"use client";

import type { SettingsNavItem, SettingsSectionId } from "../constants/SETTINGS_SECTIONS";
import { cn } from "@/src/shared/utils/cn";

interface SettingsNavProps {
  items: SettingsNavItem[];
  activeId: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
}

export const SettingsNav = ({ items, activeId, onSelect }: SettingsNavProps) => (
  <nav
    className="flex flex-wrap gap-1 border-b border-border/50 px-4 py-1 font-manrope sm:px-6 md:flex-col md:gap-0.5 md:border-b-0 md:p-3 md:py-3"
    aria-label="Settings sections"
    role="tablist"
  >
    {items.map((item) => {
      const active = item.id === activeId;
      const Icon = item.icon;

      return (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onSelect(item.id)}
          className={cn(
            "flex items-center gap-1.5 transition-colors duration-300",
            "border-b-2 px-3 py-3 text-[13px] font-semibold md:w-full md:gap-2.5 md:rounded-lg md:border md:px-2.5 md:py-2 md:text-left md:text-[14px]",
            active
              ? "border-primary text-on-surface md:border-primary/25 md:bg-primary md:text-on-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface md:hover:border-border/50 md:hover:bg-surface-variant/50",
          )}
        >
          <Icon
            className="h-4 w-4 shrink-0 md:hidden"
            weight={active ? "duotone" : "regular"}
          />
          <span
            className={cn(
              "hidden h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors md:flex",
              active
                ? "bg-on-primary/15 text-on-primary"
                : "bg-surface-container-high text-on-surface-variant",
            )}
          >
            <Icon className="h-4 w-4" weight={active ? "duotone" : "regular"} />
          </span>
          <span className="truncate leading-tight">{item.label}</span>
        </button>
      );
    })}
  </nav>
);
