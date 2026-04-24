import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle, Headphones, ShieldCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { SignInForm } from "@/src/features/auth/ui/SignInForm";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";

export const metadata: Metadata = {
  title: "Sign in | VoiceFlow",
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_45%)]" />
      <section className="relative grid w-full max-w-5xl gap-6 rounded-3xl border border-border bg-card/90 p-3 shadow-2xl backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-4">
        <div className="rounded-2xl border border-border bg-linear-to-b from-secondary to-card p-6 md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
              <Headphones className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">VoxaFlow</p>
              <h1 className="text-2xl font-semibold tracking-tight">Modern voice agents, secured</h1>
            </div>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Build and manage AI agents</p>
                <p className="text-sm text-muted-foreground">
                  Configure voice, prompts, and behavior for every customer-facing agent.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Sparkle className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Design AI workflows visually</p>
                <p className="text-sm text-muted-foreground">
                  Build event-driven AI automations with a node-based workflow canvas.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Connect integrations and channels</p>
                <p className="text-sm text-muted-foreground">
                  Connect webhooks, Slack, email, and other integrations to your AI agents.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to your workspace</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use email/password or Google to access your VoxaFlow dashboard.
            </p>
          </div>

          <SignInForm />
        </div>
      </section>
    </main>
  );
}
