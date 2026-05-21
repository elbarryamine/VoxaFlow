import Link from "next/link";
import { APP_NAME } from "@/src/shared/constants/BRAND";
import { SignInFeatureShowcase } from "@/src/features/auth/ui/SignInFeatureShowcase";
import { AurenLogo } from "@/src/shared/ui/AurenLogo";

export const SignInHero = () => (
  <section className="relative flex min-h-[420px] flex-col justify-start overflow-hidden border-b border-border/50 bg-surface-container-low px-6 py-10 lg:min-h-screen lg:w-[48%] lg:max-w-[560px] lg:shrink-0 lg:border-r lg:border-b-0 lg:px-10 lg:py-12">
    <div
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,color-mix(in_srgb,var(--secondary)_14%,transparent),transparent_55%)]"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-secondary-container/20 blur-3xl"
      aria-hidden
    />

    <div className="relative flex flex-col auth-hero-fade-in">
      <Link
        href="/"
        className="flex w-fit items-end gap-3 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={`${APP_NAME} home`}
      >
        <AurenLogo size="lg" priority />
        <span className="pb-0.5 font-newsreader text-2xl font-bold leading-none tracking-tight text-on-surface">
          {APP_NAME}
        </span>
      </Link>
      <h1 className="mt-8 max-w-md font-newsreader text-3xl font-bold leading-tight tracking-tight text-on-surface sm:text-4xl">
        Automate workflows with clarity and control
      </h1>
      <p className="mt-4 max-w-sm font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant">
        Plan, run, and monitor AI-powered automations from a single workspace.
      </p>

      <div className="mt-10 flex flex-1 items-center justify-center lg:mt-12">
        <SignInFeatureShowcase />
      </div>
    </div>
  </section>
);
