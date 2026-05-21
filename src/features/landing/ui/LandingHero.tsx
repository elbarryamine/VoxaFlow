import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { LANDING_HERO } from "@/src/features/landing/constants/LANDING_COPY";
import { LandingMobileFlowCaption } from "@/src/features/landing/ui/LandingMobileFlowCaption";
import { LandingWorkflowCanvas } from "@/src/features/landing/ui/LandingWorkflowCanvas";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";

export const LandingHero = () => (
  <section
    id="hero"
    className="relative scroll-mt-20 border-b border-border/50"
  >
    <div className="mx-auto grid w-full max-w-360 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:items-stretch">
      <div className="relative px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">
        <p className="landing-reveal font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
          {LANDING_HERO.kicker}
        </p>

        <h1 className="landing-reveal landing-reveal-1 mt-8 font-newsreader text-[clamp(2.5rem,6.5vw,5rem)] font-bold leading-[0.92] tracking-tight text-on-surface">
          {LANDING_HERO.headlineLead}
          <br />
          <span className="text-secondary">
            {LANDING_HERO.headlineAccent}
          </span>{" "}
          {LANDING_HERO.headlineTail}
        </h1>

        <p className="landing-reveal landing-reveal-2 mt-8 max-w-md font-manrope text-[15px] font-medium leading-[1.7] text-on-surface-variant sm:text-[16px]">
          {LANDING_HERO.subheadline}
        </p>

        <div className="landing-reveal landing-reveal-3 mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <TopBarLink
            href="/auth/sign-in"
            className="gap-2 px-6 py-3 font-newsreader text-lg"
          >
            {LANDING_HERO.cta}
            <ArrowRight className="h-5 w-5" weight="bold" aria-hidden />
          </TopBarLink>
          <span className="font-manrope text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant/80">
            {LANDING_HERO.ctaHint}
          </span>
        </div>

        <div
          className="landing-reveal landing-reveal-4 mt-16 h-px w-full max-w-md bg-linear-to-r from-secondary via-primary/30 to-transparent"
          aria-hidden
        />
      </div>

      <LandingWorkflowCanvas />
    </div>

    <div className="landing-blueprint-mobile relative mx-5 mb-8 overflow-hidden rounded-2xl border border-border/50 bg-surface-container-lowest px-4 py-5 shadow-sm lg:hidden">
      <div
        className="landing-canvas-dots pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      />
      <p className="relative font-manrope text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
        Canvas preview
      </p>
      <LandingMobileFlowCaption />
    </div>
  </section>
);
