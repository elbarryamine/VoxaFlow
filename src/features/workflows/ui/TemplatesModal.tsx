"use client";

import {
  CaretRight,
  MagnifyingGlass,
  Copy,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { WORKFLOW_TEMPLATES as TEMPLATES } from "../constants/WORKFLOW_TEMPLATES";
import { ModalShell } from "@/src/shared/ui/ModalShell";
import { TopBarButton } from "@/src/shared/ui/TopBarButton";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export const TemplatesModal = ({
  isOpen,
  onClose,
  onSelect,
}: TemplatesModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Choose a template"
      description="Start with a pre-built workflow to save time"
      icon={Copy}
      onOpen={() => setSearchQuery("")}
      bodyClassName="flex flex-col p-0"
      footer={
        <TopBarButton variant="secondary" type="button" onClick={onClose}>
          Cancel
        </TopBarButton>
      }
    >
      <div className="border-b border-border/50 px-5 py-4 sm:px-6">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search templates…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/50 bg-surface-variant/30 py-2.5 pl-10 pr-4 font-manrope text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid max-h-[min(360px,50vh)] grid-cols-1 gap-2 overflow-y-auto p-4 sm:grid-cols-2 sm:p-5">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  onSelect(template.id);
                  onClose();
                }}
                className="group flex items-center gap-3 rounded-xl border border-border/50 bg-surface-container-lowest p-3 text-left transition-all duration-200 hover:border-primary/25 hover:bg-surface-variant/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container/50 text-on-secondary-container transition-transform duration-200 group-hover:scale-105">
                  <Icon className="h-4 w-4" weight="duotone" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-manrope text-[13px] font-bold text-on-surface">
                    {template.title}
                  </h4>
                  <p className="truncate font-manrope text-[11px] font-medium text-on-surface-variant">
                    {template.description}
                  </p>
                </div>
                <CaretRight className="h-4 w-4 shrink-0 text-on-surface-variant opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </button>
            );
          })
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-border/50 bg-surface-variant/20 px-4 py-10 text-center font-manrope text-[14px] font-medium text-on-surface-variant">
            No templates found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </ModalShell>
  );
};
