import { Suspense } from "react";

import { SettingsScreen } from "@/src/features/settings/ui/SettingsScreen";
import { PageLayout } from "@/src/shared/ui/PageLayout";

function SettingsLoading() {
  return (
    <PageLayout
      title="Settings"
      description="Workspace preferences, notifications, and account options"
      withContentPadding={false}
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <p className="font-manrope text-[13px] font-medium text-on-surface-variant">
          Loading settings…
        </p>
      </div>
    </PageLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsScreen />
    </Suspense>
  );
}
