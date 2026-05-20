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
        <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-[15px] font-bold text-on-primary transition-all hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 font-manrope">
          <FloppyDisk className="h-5 w-5" weight="duotone" />
          Save Changes
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-border/50 bg-card p-6 xl:col-span-2 shadow-sm font-manrope">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-secondary-container/30 p-2 text-on-secondary-container">
              <Building className="h-5 w-5" weight="duotone" />
            </div>
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">
              Workspace Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-[15px] font-bold text-on-surface">Workspace Name</label>
              <input
                defaultValue="VoxaFlow Team"
                className="w-full rounded-xl border border-border/50 bg-surface-variant/20 px-4 py-3 text-[15px] font-medium text-on-surface outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-bold text-on-surface">Default Language</label>
              <select className="w-full rounded-xl border border-border/50 bg-surface-variant/20 px-4 py-3 text-[15px] font-medium text-on-surface outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary/20">
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
                <option>German</option>
                <option>Arabic</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-bold text-on-surface">Timezone</label>
              <select className="w-full rounded-xl border border-border/50 bg-surface-variant/20 px-4 py-3 text-[15px] font-medium text-on-surface outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary/20">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
                <option>Europe/Paris</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm font-manrope">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-secondary-container/30 p-2 text-on-secondary-container">
              <CreditCard className="h-5 w-5" weight="duotone" />
            </div>
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">
              Plan
            </h2>
          </div>
          <p className="text-xl font-newsreader font-bold text-on-surface">Pro Workspace</p>
          <p className="mt-1 text-[15px] font-medium text-on-surface-variant">$299/month · 3 seats included</p>
          <div className="mt-5 rounded-xl border border-border/50 bg-surface-variant/20 p-4 text-[14px] text-on-surface-variant font-medium">
            Next billing date: <span className="font-bold text-on-surface">May 1, 2026</span>
          </div>
          <button className="mt-5 w-full rounded-xl border border-border/50 px-4 py-3 text-[15px] font-bold text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface">
            Manage Billing
          </button>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm font-manrope">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-secondary-container/30 p-2 text-on-secondary-container">
              <Bell className="h-5 w-5" weight="duotone" />
            </div>
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">
              Notifications
            </h2>
          </div>
          <div className="space-y-4 text-[15px] font-medium text-on-surface">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="group-hover:text-primary transition-colors">Weekly usage digest</span>
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-secondary rounded-md" />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="group-hover:text-primary transition-colors">Workflow run alerts</span>
              <input type="checkbox" className="h-5 w-5 accent-secondary rounded-md" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm font-manrope">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-secondary-container/30 p-2 text-on-secondary-container">
              <ShieldCheck className="h-5 w-5" weight="duotone" />
            </div>
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">
              AI & Compliance
            </h2>
          </div>
          <div className="space-y-4 text-[15px] font-medium text-on-surface">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="group-hover:text-primary transition-colors">Store execution logs by default</span>
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-secondary rounded-md" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm font-manrope">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-secondary-container/30 p-2 text-on-secondary-container">
              <Globe className="h-5 w-5" weight="duotone" />
            </div>
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">
              Routing Defaults
            </h2>
          </div>
          <div className="space-y-5 text-[15px] font-medium text-on-surface">
            <div>
              <label className="mb-2 block font-bold">Default Region</label>
              <select className="w-full rounded-xl border border-border/50 bg-surface-variant/20 px-4 py-3 text-[15px] font-medium text-on-surface outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary/20">
                <option>US East (Virginia)</option>
                <option>US West (Oregon)</option>
                <option>Europe (Frankfurt)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block font-bold">Retry Window</label>
              <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-surface-variant/20 px-4 py-3 transition-colors focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary/20">
                <Clock className="h-5 w-5 text-on-surface-variant" weight="duotone" />
                <input
                  defaultValue="5 minutes"
                  className="w-full bg-transparent text-[15px] font-medium text-on-surface outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
