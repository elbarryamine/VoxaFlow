"use client";

import { useCallback, useEffect, useState } from "react";
import { FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import { PageLayout } from "@/src/shared/ui/PageLayout";
import { TopBarButton } from "@/src/shared/ui/TopBarButton";
import {
  SETTINGS_SECTIONS,
  DEFAULT_SETTINGS_SECTION,
  type SettingsSectionId,
} from "@/src/features/settings/constants/SETTINGS_SECTIONS";
import { SettingsNav } from "@/src/features/settings/ui/SettingsNav";
import { SettingsPanelContent } from "@/src/features/settings/ui/SettingsPanels";

function parseHashSection(hash: string): SettingsSectionId | null {
  const id = hash.replace(/^#/, "") as SettingsSectionId;
  return SETTINGS_SECTIONS.some((s) => s.id === id) ? id : null;
}

export const SettingsScreen = () => {
  const [activeId, setActiveId] = useState<SettingsSectionId>(DEFAULT_SETTINGS_SECTION);

  useEffect(() => {
    const syncFromHash = () => {
      const fromHash = parseHashSection(window.location.hash);
      if (fromHash) setActiveId(fromHash);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const handleSelect = useCallback((id: SettingsSectionId) => {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const active = SETTINGS_SECTIONS.find((s) => s.id === activeId) ?? SETTINGS_SECTIONS[0];

  return (
    <PageLayout
      title="Settings"
      description="Workspace preferences, notifications, and account options"
  
      withContentPadding={false}
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="shrink-0 border-b border-border/50 bg-surface-container-low md:w-56 md:border-b-0 md:border-r">
          <SettingsNav
            items={SETTINGS_SECTIONS}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </aside>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
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
