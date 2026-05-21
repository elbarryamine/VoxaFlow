import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import {
  Building,
  Palette,
  CreditCard,
  Bell,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

export type SettingsSectionId =
  | "workspace"
  | "appearance"
  | "billing"
  | "notifications"
  | "data";

export interface SettingsNavItem {
  id: SettingsSectionId;
  label: string;
  description: string;
  icon: ComponentType<IconProps>;
}

export const SETTINGS_SECTIONS: SettingsNavItem[] = [
  {
    id: "workspace",
    label: "Workspace",
    description: "Identity, region, and retry defaults",
    icon: Building,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme and display preferences",
    icon: Palette,
  },
  {
    id: "billing",
    label: "Plan & billing",
    description: "Subscription and invoices",
    icon: CreditCard,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Email and in-app alerts",
    icon: Bell,
  },
  {
    id: "data",
    label: "Data & compliance",
    description: "Logs and retention",
    icon: ShieldCheck,
  },
];

export const DEFAULT_SETTINGS_SECTION: SettingsSectionId = "workspace";

/** Plan & billing tab — linked from dashboard usage, etc. */
export const SETTINGS_PLAN_SECTION: SettingsSectionId = "billing";

const SETTINGS_TAB_PARAM = "tab";

export function isSettingsSectionId(
  value: string | null | undefined,
): value is SettingsSectionId {
  return SETTINGS_SECTIONS.some((section) => section.id === value);
}

export function parseSettingsTab(
  tab: string | null | undefined,
): SettingsSectionId {
  return isSettingsSectionId(tab) ? tab : DEFAULT_SETTINGS_SECTION;
}

export function settingsSectionHref(sectionId: SettingsSectionId): string {
  return `/dashboard/settings?${SETTINGS_TAB_PARAM}=${sectionId}`;
}

export function settingsPlanHref(): string {
  return settingsSectionHref(SETTINGS_PLAN_SECTION);
}
