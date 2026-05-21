"use client";

import { AUTH_FEATURES } from "@/src/features/auth/constants/AUTH_UI";
import { LANDING_FEATURES } from "@/src/features/landing/constants/LANDING_COPY";
import { LandingRevealGroup, LandingRevealItem } from "@/src/features/landing/ui/LandingReveal";

export const LandingIndex = () => (
  <section id="features" className="scroll-mt-20 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
    <div className="mx-auto max-w-360">
      <LandingRevealGroup>
        <LandingRevealItem className="border-b border-border/50 pb-5">
          <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
            {LANDING_FEATURES.kicker}
          </p>
          <h2 className="mt-2 font-newsreader text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            {LANDING_FEATURES.title}
          </h2>
          <p className="mt-3 max-w-2xl font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant">
            {LANDING_FEATURES.subheadline}
          </p>
        </LandingRevealItem>

        <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {AUTH_FEATURES.map(({ icon: Icon, step, title, description, tag }, index) => (
            <li
              key={step}
              className="min-h-0 sm:last:col-span-2 sm:last:flex sm:last:justify-center sm:last:[&>div]:w-full sm:last:[&>div]:max-w-[calc((100%-0.75rem)/2)]"
            >
              <LandingRevealItem delay={index * 45} className="h-full">
                <div className="group flex h-full flex-col rounded-xl border border-transparent px-4 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-border/50 hover:bg-card hover:shadow-sm sm:px-4 sm:py-4">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="font-newsreader text-4xl font-bold leading-none text-primary/20 transition-colors duration-300 group-hover:text-secondary/80"
                      aria-hidden
                    >
                      {step}
                    </span>
                    <p className="shrink-0 rounded-full border border-secondary/30 bg-secondary-container/40 px-2.5 py-0.5 font-manrope text-[10px] font-bold uppercase tracking-[0.16em] text-on-secondary-container">
                      {tag}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-container/70 text-on-secondary-container">
                      <Icon className="h-3.5 w-3.5" weight="duotone" aria-hidden />
                    </span>
                    <h3 className="font-newsreader text-lg font-bold leading-snug tracking-tight text-on-surface">
                      {title}
                    </h3>
                  </div>

                  <p className="mt-2 flex-1 font-manrope text-[14px] font-medium leading-snug text-on-surface-variant">
                    {description}
                  </p>
                </div>
              </LandingRevealItem>
            </li>
          ))}
        </ol>
      </LandingRevealGroup>
    </div>
  </section>
);
