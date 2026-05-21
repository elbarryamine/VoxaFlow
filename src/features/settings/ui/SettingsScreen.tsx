"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PageLayout } from "@/src/shared/ui/PageLayout";
import {
  SETTINGS_SECTIONS,
  isSettingsSectionId,
  parseSettingsTab,
  settingsSectionHref,
  type SettingsSectionId,
} from "@/src/features/settings/constants/SETTINGS_SECTIONS";
import { SettingsNav } from "@/src/features/settings/ui/SettingsNav";
import { SettingsPanelContent } from "@/src/features/settings/ui/SettingsPanels";

export const SettingsScreen = () => {
  const searchParams = useSearchParams();
  const activeId = parseSettingsTab(searchParams.get("tab"));

  useEffect(() => {
    const hashId = window.location.hash.replace(/^#/, "");
    if (!isSettingsSectionId(hashId) || searchParams.get("tab") === hashId) return;
    window.history.replaceState(null, "", settingsSectionHref(hashId));
  }, [searchParams]);

  const active = SETTINGS_SECTIONS.find((s) => s.id === activeId) ?? SETTINGS_SECTIONS[0];

  return (
    <PageLayout
      title="Settings"
      description="Workspace preferences, notifications, and account options"
      withContentPadding={false}
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="shrink-0 md:w-56 md:border-r md:border-border/50 md:bg-surface-container-low">
          <SettingsNav items={SETTINGS_SECTIONS} activeId={activeId} />
        </aside>

        <div
          className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id={`settings-panel-${activeId}`}
          aria-labelledby={`settings-tab-${activeId}`}
        >
          <header className="mb-4 font-manrope">
            <h2 className="font-newsreader text-xl font-bold text-on-surface sm:text-2xl">
              {active.label}
            </h2>
            <p className="mt-1 text-[13px] font-medium text-on-surface-variant">
              {active.description}
            </p>
          </header>
          <SettingsPanelContent sectionId={activeId} />
        </div>
      </div>
    </PageLayout>
  );
};
