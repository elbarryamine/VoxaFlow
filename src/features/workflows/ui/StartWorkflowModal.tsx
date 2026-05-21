"use client";

import { FilePlus, Copy, GitBranch, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ModalShell } from "@/src/shared/ui/ModalShell";

interface StartWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const options = [
  {
    href: "/dashboard/workflows/new",
    icon: FilePlus,
    label: "Start fresh",
    description: "Build a custom workflow from scratch on a blank canvas",
    badge: null,
  },
  {
    href: "/dashboard/workflows/templates",
    icon: Copy,
    label: "Use a template",
    description: "Start with a pre-built template to save time and effort",
    badge: "Recommended",
  },
] as const;

export const StartWorkflowModal = ({ isOpen, onClose }: StartWorkflowModalProps) => {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Create new workflow"
      description="How would you like to start?"
      icon={GitBranch}
      maxWidthClass="max-w-[480px]"
    >
      <div className="flex flex-col gap-2">
        {options.map(({ href, icon: Icon, label, description, badge }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="group flex h-15 items-center gap-3 rounded-xl border border-border/50 bg-surface-container-low px-3.5 transition-all duration-200 hover:border-primary/30 hover:bg-surface-variant/60 hover:shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-container/60 text-on-secondary-container transition-transform duration-200 group-hover:scale-105">
              <Icon className="h-4 w-4" weight="duotone" />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="font-manrope text-[13px] font-bold text-on-surface">
                  {label}
                </span>
                {badge && (
                  <span className="rounded-full bg-secondary-container px-2 py-0.5 font-manrope text-[10px] font-bold uppercase tracking-wide text-on-secondary-container">
                    {badge}
                  </span>
                )}
              </div>
              <p className="truncate font-manrope text-[11px] font-medium text-on-surface-variant">
                {description}
              </p>
            </div>

            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 text-on-surface-variant/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
              weight="bold"
            />
          </Link>
        ))}
      </div>
    </ModalShell>
  );
};
