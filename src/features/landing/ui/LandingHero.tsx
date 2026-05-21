import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { LANDING_HERO } from "@/src/features/landing/constants/LANDING_COPY";
import { LandingBlueprint } from "@/src/features/landing/ui/LandingBlueprint";

export const LandingHero = () => (
  <section className="relative border-b-2 border-primary/10">
    <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[1fr_minmax(300px,36%)]">
      <div className="relative px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-24 lg:pt-24">
        <p className="landing-reveal font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
          {LANDING_HERO.kicker}
        </p>

        <h1 className="landing-reveal landing-reveal-1 mt-8 font-newsreader text-[clamp(2.75rem,7.5vw,5.5rem)] font-bold leading-[0.92] tracking-tight text-on-surface">
          {LANDING_HERO.headlineLead}
          <br />
          <span className="text-secondary">{LANDING_HERO.headlineAccent}</span>{" "}
          {LANDING_HERO.headlineTail}
        </h1>

        <p className="landing-reveal landing-reveal-2 mt-8 max-w-lg font-manrope text-[15px] font-medium leading-[1.7] text-on-surface-variant sm:text-[16px]">
          {LANDING_HERO.subheadline}
        </p>

        <div className="landing-reveal landing-reveal-3 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/auth/sign-in"
            className="group inline-flex w-fit items-center gap-3 border-b-2 border-secondary pb-1 font-newsreader text-2xl font-bold text-on-surface transition-colors hover:border-primary hover:text-secondary"
          >
            {LANDING_HERO.cta}
            <ArrowRight
              className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1"
              weight="bold"
              aria-hidden
            />
          </Link>
          <span className="font-manrope text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant/80">
            {LANDING_HERO.ctaHint}
          </span>
        </div>

        <div
          className="landing-reveal landing-reveal-4 mt-16 h-px w-full max-w-md bg-linear-to-r from-secondary via-primary/30 to-transparent"
          aria-hidden
        />
      </div>

      <LandingBlueprint />
    </div>

    <div className="landing-blueprint-mobile border-t-2 border-primary/10 bg-surface-container-low px-5 py-8 lg:hidden">
      <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
        Run path preview
      </p>
      <p className="mt-3 font-newsreader text-lg font-bold text-on-surface">
        trigger → branch → <span className="text-secondary">openai</span> → sent
      </p>
    </div>
  </section>
);
