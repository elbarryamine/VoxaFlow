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
      <div className="mx-auto max-w-3xl space-y-20 pb-20 pt-6">
        {/* Workspace Profile */}
        <section className="space-y-8 font-manrope">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container/30 text-on-secondary-container">
              <Building className="h-7 w-7" weight="duotone" />
            </div>
            <h2 className="font-newsreader text-4xl font-bold text-on-surface">
              Workspace Profile
            </h2>
            <p className="mt-2 text-[16px] font-medium text-on-surface-variant">
              Manage your team's identity and global preferences.
            </p>
          </div>

          <div className="space-y-8 rounded-[2rem] border border-border/50 bg-card p-8 shadow-sm">
            <div>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">Workspace Name</label>
              <input
                defaultValue="VoxaFlow Team"
                className="w-full bg-transparent border-b-2 border-border/50 py-3 text-[18px] font-medium text-on-surface outline-none transition-colors focus:border-secondary"
              />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">Default Language</label>
                <select className="w-full bg-transparent border-b-2 border-border/50 py-3 text-[18px] font-medium text-on-surface outline-none transition-colors focus:border-secondary">
                  <option>English</option>
                  <option>French</option>
                  <option>Spanish</option>
                  <option>German</option>
                  <option>Arabic</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">Timezone</label>
                <select className="w-full bg-transparent border-b-2 border-border/50 py-3 text-[18px] font-medium text-on-surface outline-none transition-colors focus:border-secondary">
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Europe/Paris</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Plan & Billing */}
        <section className="space-y-8 font-manrope">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container/30 text-on-secondary-container">
              <CreditCard className="h-7 w-7" weight="duotone" />
            </div>
            <h2 className="font-newsreader text-4xl font-bold text-on-surface">
              Plan & Billing
            </h2>
            <p className="mt-2 text-[16px] font-medium text-on-surface-variant">
              View your current usage and manage your subscription.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border/50 bg-card p-8 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="font-newsreader text-2xl font-bold text-on-surface">Pro Workspace</p>
                <p className="mt-1 text-[16px] font-medium text-on-surface-variant">$299/month · 3 seats included</p>
              </div>
              <button className="rounded-xl border border-border/50 px-6 py-3 text-[15px] font-bold text-on-surface transition-colors hover:bg-surface-variant">
                Manage Billing
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-between rounded-2xl border border-border/50 bg-surface-variant/20 p-5 text-[15px] font-medium">
              <span className="text-on-surface-variant">Next billing date</span>
              <span className="font-bold text-on-surface">May 1, 2026</span>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-8 font-manrope">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container/30 text-on-secondary-container">
              <Bell className="h-7 w-7" weight="duotone" />
            </div>
            <h2 className="font-newsreader text-4xl font-bold text-on-surface">
              Notifications
            </h2>
            <p className="mt-2 text-[16px] font-medium text-on-surface-variant">
              Choose what we update you on and when.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border/50 bg-card p-8 shadow-sm">
            <div className="space-y-6">
              <label className="group flex cursor-pointer items-center justify-between">
                <div>
                  <p className="text-[18px] font-bold text-on-surface transition-colors group-hover:text-primary">Weekly usage digest</p>
                  <p className="text-[14px] font-medium text-on-surface-variant">Receive a weekly summary of your automated workflows.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-6 w-6 rounded-md accent-secondary" />
              </label>
              
              <div className="h-px w-full bg-border/50" />
              
              <label className="group flex cursor-pointer items-center justify-between">
                <div>
                  <p className="text-[18px] font-bold text-on-surface transition-colors group-hover:text-primary">Workflow run alerts</p>
                  <p className="text-[14px] font-medium text-on-surface-variant">Get notified immediately when critical workflows fail.</p>
                </div>
                <input type="checkbox" className="h-6 w-6 rounded-md accent-secondary" />
              </label>
            </div>
          </div>
        </section>

        {/* AI & Compliance */}
        <section className="space-y-8 font-manrope">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container/30 text-on-secondary-container">
              <ShieldCheck className="h-7 w-7" weight="duotone" />
            </div>
            <h2 className="font-newsreader text-4xl font-bold text-on-surface">
              AI & Compliance
            </h2>
            <p className="mt-2 text-[16px] font-medium text-on-surface-variant">
              Manage data retention and AI model access levels.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border/50 bg-card p-8 shadow-sm">
             <label className="group flex cursor-pointer items-center justify-between">
                <div>
                  <p className="text-[18px] font-bold text-on-surface transition-colors group-hover:text-primary">Store execution logs by default</p>
                  <p className="text-[14px] font-medium text-on-surface-variant">Keep a detailed historical record of execution inputs and outputs.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-6 w-6 rounded-md accent-secondary" />
              </label>
          </div>
        </section>

        {/* Routing Defaults */}
        <section className="space-y-8 font-manrope">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container/30 text-on-secondary-container">
              <Globe className="h-7 w-7" weight="duotone" />
            </div>
            <h2 className="font-newsreader text-4xl font-bold text-on-surface">
              Routing Defaults
            </h2>
            <p className="mt-2 text-[16px] font-medium text-on-surface-variant">
              Configure baseline settings for your global deployment nodes.
            </p>
          </div>

          <div className="space-y-8 rounded-[2rem] border border-border/50 bg-card p-8 shadow-sm">
            <div>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">Default Region</label>
              <select className="w-full bg-transparent border-b-2 border-border/50 py-3 text-[18px] font-medium text-on-surface outline-none transition-colors focus:border-secondary">
                <option>US East (Virginia)</option>
                <option>US West (Oregon)</option>
                <option>Europe (Frankfurt)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">Retry Window</label>
              <div className="flex items-center gap-3 border-b-2 border-border/50 py-3 transition-colors focus-within:border-secondary">
                <Clock className="h-6 w-6 text-on-surface-variant" weight="duotone" />
                <input
                  defaultValue="5 minutes"
                  className="w-full bg-transparent text-[18px] font-medium text-on-surface outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
