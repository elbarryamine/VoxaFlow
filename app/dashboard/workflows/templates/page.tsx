"use client";

import Link from "next/link";
import {
  CaretRight,
  Plus,
  MagnifyingGlass,
  Copy,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";
import { WORKFLOW_TEMPLATES } from "@/src/features/workflows/constants/WORKFLOW_TEMPLATES";
import { cn } from "@/src/shared/utils/cn";

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = WORKFLOW_TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageLayout
      title="Templates"
      description="Start with a pre-built workflow template"
      backHref="/dashboard/workflows"
      actions={
        <TopBarLink href="/dashboard/workflows/new" variant="secondary">
          <Plus className="h-4 w-4" weight="bold" />
          Blank workflow
        </TopBarLink>
      }
      contentClassName="space-y-8"
    >
      <div className="relative max-w-lg">
        <MagnifyingGlass className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search templates…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border/50 bg-surface-variant/30 py-3 pl-10 pr-4 font-manrope text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filteredTemplates.length > 0 ? (
        <>
          <p className="font-manrope text-[13px] font-bold text-on-surface-variant">
            {filteredTemplates.length} template
            {filteredTemplates.length === 1 ? "" : "s"} available
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Link
                  key={template.id}
                  href={`/dashboard/workflows/new?template=${template.id}`}
                  className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:border-outline-variant hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-container/60 text-on-secondary-container transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" weight="duotone" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-newsreader text-lg font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary">
                      {template.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 font-manrope text-[13px] font-medium leading-relaxed text-on-surface-variant">
                      {template.description}
                    </p>
                  </div>
                  <CaretRight className="mt-1 h-4 w-4 shrink-0 text-on-surface-variant opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-surface-container-low/50 px-8 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-container/60 text-on-secondary-container">
            <Copy className="h-7 w-7" weight="duotone" />
          </div>
          <h3 className="mt-4 font-newsreader text-xl font-bold text-on-surface">
            No templates found
          </h3>
          <p className="mt-2 max-w-sm font-manrope text-[14px] font-medium text-on-surface-variant">
            Nothing matches &quot;{searchQuery}&quot;. Try a different search or
            start from a blank workflow.
          </p>
          <TopBarLink
            href="/dashboard/workflows/new"
            variant="primary"
            className={cn("mt-6")}
          >
            <Plus className="h-4 w-4" weight="bold" />
            Blank workflow
          </TopBarLink>
        </div>
      )}
    </PageLayout>
  );
};
