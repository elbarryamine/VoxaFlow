import {
  Building,
  Bell,
  ShieldCheck,
  CreditCard,
  Globe,
  Clock,
  FloppyDisk,
} from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui/PageLayout";

export default function SettingsPage() {
  return (
    <PageLayout
      title="Settings"
      description="Configure workspace preferences, notifications, and account options"
      actions={
        <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80">
          <FloppyDisk className="h-4 w-4" />
          Save Changes
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-6 xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Workspace Name</label>
              <input
                defaultValue="VoiceFlow Team"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Default Language</label>
              <select className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20">
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
                <option>German</option>
                <option>Arabic</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Timezone</label>
              <select className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
                <option>Europe/Paris</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Plan
            </h2>
          </div>
          <p className="text-sm font-semibold">Pro Workspace</p>
          <p className="mt-1 text-xs text-muted-foreground">$299/month · 3 seats included</p>
          <div className="mt-4 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
            Next billing date: <span className="font-medium text-foreground">May 1, 2026</span>
          </div>
          <button className="mt-4 w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground">
            Manage Billing
          </button>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Notifications
            </h2>
          </div>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between">
              <span>Weekly usage digest</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span>Workflow run alerts</span>
              <input type="checkbox" className="h-4 w-4 accent-primary" />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              AI & Compliance
            </h2>
          </div>
          <div className="space-y-4 text-sm">
            <label className="flex items-center justify-between">
              <span>Store conversation transcripts by default</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Routing Defaults
            </h2>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <label className="mb-1.5 block font-medium">Default Region</label>
              <select className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20">
                <option>US East (Virginia)</option>
                <option>US West (Oregon)</option>
                <option>Europe (Frankfurt)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-medium">Retry Window</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <input
                  defaultValue="5 minutes"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
