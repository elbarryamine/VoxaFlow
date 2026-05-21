"use client";

import {
  CircleNotch,
  ShieldCheck,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils/cn";
import { getCredentialServiceConfig } from "../constants/CREDENTIAL_SERVICES";
import type { Credential } from "../types/Credential.types";

interface CredentialCardProps {
  credential: Credential;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const CredentialCard = ({
  credential,
  onDelete,
  isDeleting = false,
}: CredentialCardProps) => {
  const config = getCredentialServiceConfig(credential.service);
  const Icon = config.icon;
  const shortId = credential.id.substring(0, 8).toUpperCase();
  const addedAt = new Date(credential.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const serviceLabel = credential.service.replace(/-/g, " ").toUpperCase();

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-2.5 rounded-lg border border-dashed border-border/70 border-t-2 bg-surface/40 p-3.5 transition-all duration-300 sm:p-4",
        "hover:border-outline-variant hover:bg-card hover:shadow-md",
        config.railClass.replace(/^border-/, "border-t-"),
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
            config.iconClass,
          )}
        >
          <Icon weight="duotone" className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-newsreader text-base font-bold tracking-tight text-on-surface transition-colors duration-300 group-hover:text-primary sm:text-[17px]">
                {credential.name}
              </h3>
              <p className="mt-0.5 truncate font-manrope text-[11px] font-semibold text-on-surface-variant sm:text-[12px]">
                {config.label}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDelete(credential.id)}
              disabled={isDeleting}
              aria-label={`Delete ${credential.name}`}
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-on-surface-variant transition-all duration-300",
                "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
                "hover:bg-error/10 hover:text-error disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              {isDeleting ? (
                <CircleNotch className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash className="h-3.5 w-3.5" weight="duotone" />
              )}
            </button>
          </div>

          <p className="mt-1.5 line-clamp-1 font-manrope text-[11px] font-medium text-on-surface-variant/80">
            Encrypted at rest — reference by ID in workflow nodes
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/40 pt-2 font-manrope text-[10px] font-semibold text-on-surface-variant sm:text-[11px]">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 uppercase tracking-wide",
            config.pillClass,
          )}
        >
          <ShieldCheck className="h-2.5 w-2.5" weight="duotone" />
          Secured
        </span>
        <MetaDivider />
        <span className="truncate uppercase">{serviceLabel}</span>
        <MetaDivider />
        <span className="truncate">{addedAt}</span>
        <MetaDivider />
        <span className="truncate font-mono text-[10px] text-on-surface/90">
          #{shortId}
        </span>
      </div>
    </article>
  );
};

const MetaDivider = () => (
  <span aria-hidden className="text-on-surface-variant/35">
    ·
  </span>
);
