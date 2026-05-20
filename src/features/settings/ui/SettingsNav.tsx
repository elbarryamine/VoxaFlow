"use client";

import type { SettingsNavItem, SettingsSectionId } from "../constants/SETTINGS_SECTIONS";
import { cn } from "@/src/shared/utils/cn";

const navBtnClass =
  "flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 font-manrope text-left transition-colors duration-300";

interface SettingsNavProps {
  items: SettingsNavItem[];
  activeId: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
}

export const SettingsNav = ({ items, activeId, onSelect }: SettingsNavProps) => (
  <nav
    className="flex gap-1 overflow-x-auto p-3 font-manrope md:flex-col md:gap-0.5 md:overflow-visible"
    aria-label="Settings sections"
  >
    {items.map((item) => {
      const active = item.id === activeId;
      const Icon = item.icon;

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          aria-current={active ? "page" : undefined}
          className={cn(
            navBtnClass,
            "shrink-0 md:shrink",
            active
              ? "border-primary/25 bg-primary text-on-primary"
              : "border-transparent text-on-surface-variant hover:border-border/50 hover:bg-surface-variant/50 hover:text-on-surface",
          )}
        >
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-on-primary/15 text-on-primary"
                : "bg-surface-container-high text-on-surface-variant",
            )}
          >
            <Icon className="h-4 w-4" weight={active ? "duotone" : "regular"} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-semibold leading-tight">
              {item.label}
            </span>
          </span>
        </button>
      );
    })}
  </nav>
);
