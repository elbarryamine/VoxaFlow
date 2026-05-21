"use client";

import { ThemeToggle } from "@/src/shared/theme/ThemeToggle";
import { SignInForm } from "@/src/features/auth/ui/SignInForm";
import { SignInHero } from "@/src/features/auth/ui/SignInHero";

export const SignInScreen = () => (
  <main className="relative min-h-screen bg-background font-manrope">
    <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
      <ThemeToggle className="border border-border/50 bg-card shadow-sm" />
    </div>

    <div className="flex min-h-screen flex-col lg:flex-row">
      <SignInHero />

      <section className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:py-12">
        <div className="w-full max-w-[420px]">
          <header className="mb-8">
            <p className="font-manrope text-[11px] font-bold uppercase tracking-widest text-secondary">
              Welcome back
            </p>
            <h2 className="mt-2 font-newsreader text-3xl font-bold tracking-tight text-on-surface">
              Sign in to your workspace
            </h2>
            <p className="mt-2 font-manrope text-[14px] font-medium text-on-surface-variant">
              Continue with Google or use your email and password.
            </p>
          </header>

          <SignInForm />
        </div>
      </section>
    </div>
  </main>
);
