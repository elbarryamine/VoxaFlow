"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { LANDING_CTA } from "@/src/features/landing/constants/LANDING_COPY";
import {
  LandingRevealGroup,
  LandingRevealItem,
} from "@/src/features/landing/ui/LandingReveal";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";

export const LandingCtaPanel = () => (
  <LandingRevealGroup>
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
      <div
        className="landing-blueprint-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <div
        className="landing-canvas-dots pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      />

      <div className="relative flex flex-col gap-10 p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:p-12">
        <LandingRevealItem className="max-w-2xl">
          <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            {LANDING_CTA.figLabel}
          </p>
          <p className="mt-3 font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
            {LANDING_CTA.kicker}
          </p>
          <h2 className="mt-4 font-newsreader text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.02] tracking-tight text-on-surface">
            {LANDING_CTA.headline}
            <br />
            <span className="text-secondary">{LANDING_CTA.headlineAccent}</span>
          </h2>
          <p className="mt-5 max-w-xl font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant sm:text-[16px]">
            {LANDING_CTA.subheadline}
          </p>
        </LandingRevealItem>

        <LandingRevealItem
          delay={120}
          className="flex shrink-0 flex-col items-stretch gap-3 sm:items-start lg:items-end"
        >
          <TopBarLink
            href="/auth/sign-in"
            className="justify-center gap-2 px-8 py-3.5 transition-transform duration-300 hover:scale-[1.02] lg:min-w-56"
          >
            {LANDING_CTA.action}
            <ArrowRight className="h-5 w-5" weight="bold" aria-hidden />
          </TopBarLink>
          <p className="text-center font-manrope text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant/80 lg:text-right">
            {LANDING_CTA.hint}
          </p>
        </LandingRevealItem>
      </div>
    </div>
  </LandingRevealGroup>
);
