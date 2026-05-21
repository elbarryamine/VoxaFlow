"use client";

import Link from "next/link";

import {
  settingsSectionHref,
  type SettingsNavItem,
  type SettingsSectionId,
} from "../constants/SETTINGS_SECTIONS";
import { cn } from "@/src/shared/utils/cn";

const navLinkBase =
  "group relative flex items-center gap-2 rounded-lg px-2 py-1.5 font-manrope text-[14px] leading-tight transition-colors duration-300 md:w-full";

interface SettingsNavProps {
  items: SettingsNavItem[];
  activeId: SettingsSectionId;
}

export const SettingsNav = ({ items, activeId }: SettingsNavProps) => (
  <nav
    className="flex w-full flex-wrap gap-1 border-b border-border/50 px-2 py-2 font-manrope md:flex-col md:gap-0.5 md:border-b-0"
    aria-label="Settings sections"
    role="tablist"
  >
    {items.map((item) => {
      const active = item.id === activeId;
      const Icon = item.icon;

      return (
        <Link
          key={item.id}
          id={`settings-tab-${item.id}`}
          href={settingsSectionHref(item.id)}
          replace
          scroll={false}
          role="tab"
          aria-selected={active}
          aria-controls={`settings-panel-${item.id}`}
          className={cn(
            navLinkBase,
            active
              ? "font-semibold text-on-surface"
              : "font-medium text-on-surface-variant hover:text-on-surface md:hover:bg-surface-variant/50",
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4 shrink-0 md:hidden",
              active ? "text-primary" : "text-on-surface-variant",
            )}
            weight={active ? "duotone" : "regular"}
          />
          <span
            className={cn(
              "hidden h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300 md:flex",
              active
                ? "text-primary"
                : "bg-surface-container-high text-on-surface-variant group-hover:bg-secondary-container/50 group-hover:text-on-secondary-container",
            )}
          >
            <Icon className="h-4 w-4" weight={active ? "duotone" : "regular"} />
          </span>
          <span className="truncate">{item.label}</span>
        </Link>
      );
    })}
  </nav>
);
