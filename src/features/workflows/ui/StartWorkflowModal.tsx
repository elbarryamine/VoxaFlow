"use client";

import { FilePlus, Copy, GitBranch } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ModalShell } from "@/src/shared/ui/ModalShell";

interface StartWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartWorkflowModal = ({ isOpen, onClose }: StartWorkflowModalProps) => {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Create new workflow"
      description="How would you like to start?"
      icon={GitBranch}
      maxWidthClass="max-w-[520px]"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/workflows/new"
          onClick={onClose}
          className="group flex flex-col items-center rounded-xl border border-border/50 bg-surface-container-lowest p-6 text-center transition-all duration-200 hover:border-primary/25 hover:bg-surface-variant/50"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container/60 text-on-secondary-container transition-transform duration-200 group-hover:scale-105">
            <FilePlus className="h-6 w-6" weight="duotone" />
          </div>
          <span className="font-manrope text-[14px] font-bold text-on-surface">
            Start fresh
          </span>
          <p className="mt-2 font-manrope text-[12px] font-medium leading-relaxed text-on-surface-variant">
            Build a custom workflow from scratch on a blank canvas
          </p>
        </Link>

        <Link
          href="/dashboard/workflows/templates"
          onClick={onClose}
          className="group flex flex-col items-center rounded-xl border border-border/50 bg-surface-container-lowest p-6 text-center transition-all duration-200 hover:border-primary/25 hover:bg-surface-variant/50"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container/60 text-on-secondary-container transition-transform duration-200 group-hover:scale-105">
            <Copy className="h-6 w-6" weight="duotone" />
          </div>
          <span className="font-manrope text-[14px] font-bold text-on-surface">
            Use template
          </span>
          <p className="mt-2 font-manrope text-[12px] font-medium leading-relaxed text-on-surface-variant">
            Start with a pre-built template to save time and effort
          </p>
        </Link>
      </div>
    </ModalShell>
  );
};
