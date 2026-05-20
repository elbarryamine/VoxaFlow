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
