"use client";

import Link from "next/link";
import { CaretRight, Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";
import { WORKFLOW_TEMPLATES } from "@/src/features/workflows/constants/WORKFLOW_TEMPLATES";

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = WORKFLOW_TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout
      title="Templates"
      description="Start with a pre-built workflow template"
      backHref="/dashboard/workflows"
      actions={
        <TopBarLink href="/dashboard/workflows/new" variant="secondary">
          <Plus className="h-4 w-4" weight="bold" />
          Blank Workflow
        </TopBarLink>
      }
    >
      <div className="mb-8 relative max-w-md">
        <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <Link
              key={template.id}
              href={`/dashboard/workflows/new?template=${template.id}`}
              className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-secondary/50 transition-all"
            >
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg border border-border bg-background transition-colors group-hover:border-primary/30">
                <template.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" weight="bold" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-foreground truncate">{template.title}</h3>
                <p className="text-xs text-muted-foreground truncate leading-relaxed">
                  {template.description}
                </p>
              </div>
              <CaretRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <p>No templates found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
