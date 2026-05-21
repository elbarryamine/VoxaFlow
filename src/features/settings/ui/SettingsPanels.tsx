import { Clock } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/src/shared/theme/ThemeToggle";
import { TopBarButton } from "@/src/shared/ui/TopBarButton";
import type { SettingsSectionId } from "@/src/features/settings/constants/SETTINGS_SECTIONS";
import { SettingsPanel } from "@/src/features/settings/ui/SettingsPanel";
import {
  SettingsField,
  SettingsToggleRow,
  SettingsDivider,
  SettingsStatRow,
  settingsInputClass,
} from "@/src/features/settings/ui/SettingsField";

export const SettingsPanelContent = ({
  sectionId,
}: {
  sectionId: SettingsSectionId;
}) => {
  switch (sectionId) {
    case "workspace":
      return (
        <SettingsPanel>
          <SettingsField label="Workspace name" htmlFor="workspace-name">
            <input
              id="workspace-name"
              defaultValue="Auren Team"
              className={settingsInputClass}
            />
          </SettingsField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SettingsField label="Language" htmlFor="language">
              <select id="language" className={settingsInputClass}>
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
                <option>German</option>
                <option>Arabic</option>
              </select>
            </SettingsField>
            <SettingsField label="Timezone" htmlFor="timezone">
              <select id="timezone" className={settingsInputClass}>
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
                <option>Europe/Paris</option>
              </select>
            </SettingsField>
          </div>
          <SettingsField label="Default region" htmlFor="region">
            <select id="region" className={settingsInputClass}>
              <option>US East (Virginia)</option>
              <option>US West (Oregon)</option>
              <option>Europe (Frankfurt)</option>
            </select>
          </SettingsField>
          <SettingsField label="Retry window" htmlFor="retry-window">
            <div className="relative">
              <Clock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                weight="duotone"
              />
              <input
                id="retry-window"
                defaultValue="5 minutes"
                className={`${settingsInputClass} pl-9`}
              />
            </div>
          </SettingsField>
        </SettingsPanel>
      );

    case "appearance":
      return (
        <SettingsPanel>
          <div className="flex items-center justify-between gap-4 rounded-lg bg-surface-variant/25">
            <div>
              <p className="text-[14px] font-bold text-on-surface">
                Color mode
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-on-surface-variant">
                Switch between light and dark
              </p>
            </div>
            <ThemeToggle />
          </div>
        </SettingsPanel>
      );

    case "billing":
      return (
        <SettingsPanel>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-newsreader text-xl font-bold text-on-surface">
                Pro workspace
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-on-surface-variant">
                $299/month · 3 seats
              </p>
            </div>
            <TopBarButton
              type="button"
              variant="secondary"
              className="shrink-0"
            >
              Manage billing
            </TopBarButton>
          </div>
          <SettingsStatRow label="Next billing date" value="May 1, 2026" />
        </SettingsPanel>
      );

    case "notifications":
      return (
        <SettingsPanel>
          <SettingsToggleRow
            title="Weekly usage digest"
            description="Summary of workflow activity each week"
            defaultChecked
          />
          <SettingsDivider />
          <SettingsToggleRow
            title="Workflow run alerts"
            description="Notify when critical runs fail"
          />
        </SettingsPanel>
      );

    case "data":
      return (
        <SettingsPanel>
          <SettingsToggleRow
            title="Store execution logs"
            description="Keep inputs and outputs for each run"
            defaultChecked
          />
          <SettingsDivider />
          <SettingsField label="Log retention" htmlFor="retention">
            <select id="retention" className={settingsInputClass}>
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
            </select>
          </SettingsField>
        </SettingsPanel>
      );

    default:
      return null;
  }
};
