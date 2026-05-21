"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { LANDING_CTA } from "@/src/features/landing/constants/LANDING_COPY";
import { LandingRevealGroup, LandingRevealItem } from "@/src/features/landing/ui/LandingReveal";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";

export const LandingCta = () => (
  <section id="get-started" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
    <LandingRevealGroup className="mx-auto max-w-360">
      <div className="flex flex-col gap-8 rounded-4xl border border-border/50 bg-surface-container-low p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-12">
        <LandingRevealItem>
          <h2 className="max-w-2xl font-newsreader text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-on-surface">
            {LANDING_CTA.line}
          </h2>
        </LandingRevealItem>
        <LandingRevealItem delay={120}>
          <TopBarLink href="/auth/sign-in" className="shrink-0 gap-2 px-8 py-3.5 transition-transform duration-300 hover:scale-[1.02]">
            {LANDING_CTA.action}
            <ArrowRight className="h-5 w-5" weight="bold" aria-hidden />
          </TopBarLink>
        </LandingRevealItem>
      </div>
    </LandingRevealGroup>
  </section>
);
