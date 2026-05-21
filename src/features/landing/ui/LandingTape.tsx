"use client";

import { LANDING_MANIFESTO, LANDING_TAPE } from "@/src/features/landing/constants/LANDING_COPY";
import { LandingRevealGroup, LandingRevealItem } from "@/src/features/landing/ui/LandingReveal";

export const LandingTape = () => {
  const tapeItems = [...LANDING_TAPE, ...LANDING_TAPE];

  return (
    <section id="about" className="scroll-mt-20 px-5 py-6 sm:px-8 lg:px-12">
      <div className="overflow-hidden rounded-4xl border border-border/50 bg-primary text-on-primary shadow-sm">
        <div className="landing-marquee border-b border-on-primary/15 py-4" aria-hidden>
          <div className="landing-marquee-track flex w-max gap-0">
            {tapeItems.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="flex shrink-0 items-center gap-6 px-6 font-manrope text-[13px] font-bold uppercase tracking-[0.35em]"
              >
                {word}
                <span className="text-on-primary/40">◆</span>
              </span>
            ))}
          </div>
        </div>

        <LandingRevealGroup className="mx-auto max-w-360 px-5 py-14 sm:px-8 lg:grid lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-10 lg:py-16">
          <LandingRevealItem>
            <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-on-primary/60">
              About
            </p>
          </LandingRevealItem>
          <div className="mt-6 space-y-8 lg:mt-0">
            {LANDING_MANIFESTO.map((line, index) => (
              <LandingRevealItem key={line} delay={80 + index * 100}>
                <p className="font-newsreader text-2xl font-bold leading-snug sm:text-3xl lg:text-[2rem]">
                  {line}
                </p>
              </LandingRevealItem>
            ))}
          </div>
        </LandingRevealGroup>
      </div>
    </section>
  );
};
