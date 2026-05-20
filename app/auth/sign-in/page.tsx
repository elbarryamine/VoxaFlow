import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle, Lightning, ShieldCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { SignInForm } from "@/src/features/auth/ui/SignInForm";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";

export const metadata: Metadata = {
  title: "Sign in | VoxaFlow",
  description: "Sign in to your VoxaFlow workspace",
};

export default async function SignInPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 font-manrope">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_45%)]" />
      <section className="relative grid w-full max-w-5xl gap-6 rounded-[2rem] border border-border/50 bg-surface-container-lowest/80 p-3 shadow-2xl backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] md:p-4">
        <div className="rounded-3xl border border-border/50 bg-gradient-to-b from-surface-variant/40 to-surface-container-lowest p-6 shadow-sm md:p-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Lightning className="h-6 w-6 text-on-primary" weight="duotone" />
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">VoxaFlow</p>
              <h1 className="font-newsreader text-2xl font-bold tracking-tight text-on-surface">Modern workflow automations, secured</h1>
            </div>
          </div>

          <ul className="space-y-4">
            <li className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-outline-variant hover:shadow-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container/60 transition-transform duration-300 group-hover:scale-110">
                <ShieldCheck className="h-5.5 w-5.5 text-on-secondary-container" weight="duotone" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-on-surface">Build and manage AI workflows</p>
                <p className="mt-1 text-[13px] font-medium text-on-surface-variant">
                  Configure logic, prompts, and behavior for every automated process.
                </p>
              </div>
            </li>
            <li className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-outline-variant hover:shadow-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container/60 transition-transform duration-300 group-hover:scale-110">
                <Sparkle className="h-5.5 w-5.5 text-on-secondary-container" weight="duotone" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-on-surface">Design AI workflows visually</p>
                <p className="mt-1 text-[13px] font-medium text-on-surface-variant">
                  Build event-driven AI automations with a node-based workflow canvas.
                </p>
              </div>
            </li>
            <li className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-outline-variant hover:shadow-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container/60 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle className="h-5.5 w-5.5 text-on-secondary-container" weight="duotone" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-on-surface">Connect integrations and channels</p>
                <p className="mt-1 text-[13px] font-medium text-on-surface-variant">
                  Connect webhooks, Slack, email, and other integrations to your automations.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <p className="text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">Welcome back</p>
            <h2 className="font-newsreader text-3xl font-bold tracking-tight text-on-surface">Sign in to your workspace</h2>
            <p className="mt-2 text-[14px] font-medium text-on-surface-variant">
              Use email/password or Google to access your VoxaFlow dashboard.
            </p>
          </div>

          <SignInForm />
        </div>
      </section>
    </main>
  );
}
