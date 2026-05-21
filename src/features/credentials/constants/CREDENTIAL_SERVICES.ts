import {
  Robot,
  Lightning,
  Globe,
  EnvelopeSimple,
  Key,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { CredentialService } from "../types/Credential.types";

export interface CredentialFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  sensitive?: boolean;
}

export interface CredentialServiceConfig {
  label: string;
  icon: React.ComponentType<IconProps>;
  fields: CredentialFieldConfig[];
  railClass: string;
  iconClass: string;
  pillClass: string;
}

export const CREDENTIAL_SERVICES: Record<
  CredentialService,
  CredentialServiceConfig
> = {
  openai: {
    label: "OpenAI",
    icon: Robot,
    fields: [
      { key: "apiKey", label: "API Key", placeholder: "sk-...", sensitive: true },
    ],
    railClass: "border-success/40",
    iconClass:
      "bg-success/15 text-success group-hover:bg-success group-hover:text-white",
    pillClass: "bg-success/15 text-success",
  },
  slack: {
    label: "Slack",
    icon: Lightning,
    fields: [
      {
        key: "botToken",
        label: "Bot Token",
        placeholder: "xoxb-...",
        sensitive: true,
      },
    ],
    railClass: "border-primary/40",
    iconClass:
      "bg-primary/15 text-primary group-hover:bg-primary group-hover:text-on-primary",
    pillClass: "bg-primary/15 text-primary",
  },
  http: {
    label: "HTTP / Generic API",
    icon: Globe,
    fields: [
      {
        key: "apiKey",
        label: "API Key / Bearer Token",
        placeholder: "your-api-key",
        sensitive: true,
      },
      {
        key: "baseUrl",
        label: "Base URL (optional)",
        placeholder: "https://api.example.com",
      },
    ],
    railClass: "border-outline-variant/40",
    iconClass:
      "bg-surface-variant/40 text-on-surface-variant group-hover:bg-surface-variant group-hover:text-on-surface",
    pillClass: "bg-surface-variant/50 text-on-surface-variant",
  },
  resend: {
    label: "Resend (Email)",
    icon: EnvelopeSimple,
    fields: [
      {
        key: "apiKey",
        label: "Resend API Key",
        placeholder: "re_...",
        sensitive: true,
      },
    ],
    railClass: "border-secondary/40",
    iconClass:
      "bg-secondary-container/60 text-on-secondary-container group-hover:bg-secondary-container group-hover:text-on-secondary-container",
    pillClass: "bg-secondary-container/60 text-on-secondary-container",
  },
};

export const CREDENTIAL_SERVICE_ORDER: CredentialService[] = [
  "openai",
  "slack",
  "http",
  "resend",
];

export const DEFAULT_CREDENTIAL_SERVICE: CredentialService = "openai";

export function getCredentialServiceConfig(
  service: string,
): CredentialServiceConfig {
  const known = CREDENTIAL_SERVICES[service as CredentialService];
  if (known) return known;

  return {
    label: service,
    icon: Key,
    fields: [],
    railClass: "border-outline-variant/40",
    iconClass:
      "bg-surface-variant/40 text-on-surface-variant group-hover:bg-surface-variant group-hover:text-on-surface",
    pillClass: "bg-surface-variant/50 text-on-surface-variant",
  };
}
