"use client";

import { useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils/cn";

type ModalIcon = ComponentType<{
  className?: string;
  weight?: "bold" | "duotone" | "regular" | "fill";
}>;

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ModalIcon;
  maxWidthClass?: string;
  children: ReactNode;
  footer?: ReactNode;
  bodyClassName?: string;
  onOpen?: () => void;
}

export const ModalShell = ({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  maxWidthClass = "max-w-[640px]",
  children,
  footer,
  bodyClassName,
  onOpen,
}: ModalShellProps) => {
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    onOpenRef.current = onOpen;
  });

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      onOpenRef.current?.();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex animate-in items-center justify-center p-4 duration-200 fade-in sm:p-6">
      <div
        className="absolute inset-0 bg-inverse-surface/40"
        onClick={onClose}
        aria-hidden
      />

      <div
        className={cn(
          "relative flex max-h-[min(640px,90vh)] w-full animate-in flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl duration-300 zoom-in-95",
          maxWidthClass,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/50 bg-surface-container-low px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon
                  className="h-6 w-6 shrink-0 text-secondary"
                  weight="duotone"
                />
              )}
              <h3
                id="modal-title"
                className="font-newsreader text-xl font-bold tracking-tight text-on-surface sm:text-2xl"
              >
                {title}
              </h3>
            </div>
            {description && (
              <p className="mt-1 font-manrope text-[13px] font-medium text-on-surface-variant">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" weight="bold" />
          </button>
        </div>

        <div
          className={cn(
            "flex-1 overflow-y-auto",
            bodyClassName ?? "px-5 py-4 sm:px-6 sm:py-5",
          )}
        >
          {children}
        </div>

        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-border/50 bg-surface-container-low px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
