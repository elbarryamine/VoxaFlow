"use client";

import {
  Phone,
  ChatText,
  Printer,
  Robot,
  DotsThreeVertical,
} from "@phosphor-icons/react/dist/ssr";
import type {
  PhoneNumber,
  PhoneNumberCapability,
} from "../types/PhoneNumber.types";

interface PhoneNumberCardProps {
  phoneNumber: PhoneNumber;
}

const STATUS_STYLES = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted/10 text-muted-foreground",
  pending: "bg-warning/10 text-warning",
} as const;

const CAPABILITY_ICONS: Record<PhoneNumberCapability, React.ElementType> = {
  voice: Phone,
  sms: ChatText,
  fax: Printer,
};

const PROVIDER_STYLES = {
  ours: "bg-secondary text-primary",
  twilio: "bg-warning/10 text-warning",
} as const;

const PROVIDER_LABELS = {
  ours: "VoiceFlow",
  twilio: "Twilio",
} as const;

const FLAG_EMOJIS: Record<string, string> = {
  US: "🇺🇸",
  GB: "🇬🇧",
  FR: "🇫🇷",
  DE: "🇩🇪",
  ES: "🇪🇸",
};

export const PhoneNumberCard = ({ phoneNumber }: PhoneNumberCardProps) => {
  const flag = FLAG_EMOJIS[phoneNumber.countryCode] ?? "🌐";

  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-2xl">
            {flag}
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {phoneNumber.number}
            </p>
            <p className="text-xs text-muted-foreground">
              {phoneNumber.friendlyName}
            </p>
          </div>
        </div>
        <button className="rounded-lg p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-secondary-foreground group-hover:opacity-100">
          <DotsThreeVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[phoneNumber.status]}`}
        >
          {phoneNumber.status}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PROVIDER_STYLES[phoneNumber.provider]}`}
        >
          {PROVIDER_LABELS[phoneNumber.provider]}
        </span>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {phoneNumber.capabilities.map((cap) => {
            const Icon = CAPABILITY_ICONS[cap];
            return <Icon key={cap} className="h-3.5 w-3.5" />;
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Robot className="h-3.5 w-3.5 shrink-0" />
            {phoneNumber.assignedAgent ? (
              <span className="text-foreground">
                {phoneNumber.assignedAgent}
              </span>
            ) : (
              <span className="italic text-muted-foreground">
                No agent assigned
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{phoneNumber.monthlyCallCount.toLocaleString()} / mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
