"use client";

import { AUTH_FEATURES } from "@/src/features/auth/constants/AUTH_UI";
import { LandingRevealGroup, LandingRevealItem } from "@/src/features/landing/ui/LandingReveal";

export const LandingIndex = () => (
  <section id="features" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
    <div className="mx-auto max-w-360">
      <LandingRevealGroup>
        <div className="flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <LandingRevealItem>
            <div>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
                Features
              </p>
              <h2 className="mt-3 font-newsreader text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">
                Seven things the studio does well
              </h2>
            </div>
          </LandingRevealItem>
          <LandingRevealItem delay={90} className="lg:max-w-sm">
            <p className="font-manrope text-[14px] font-medium leading-relaxed text-on-surface-variant lg:text-right">
              No feature dump in tiny cards — just the catalogue, like a field guide.
            </p>
          </LandingRevealItem>
        </div>

        <ol className="mt-8 space-y-3">
          {AUTH_FEATURES.map(({ icon: Icon, step, title, description, tag }, index) => (
            <li key={step}>
              <LandingRevealItem delay={index * 55}>
                <div className="group grid gap-6 rounded-2xl border border-transparent px-4 py-8 transition-all duration-500 hover:-translate-y-0.5 hover:border-border/50 hover:bg-card hover:shadow-sm sm:grid-cols-[5rem_1fr_auto] sm:items-start sm:gap-10 sm:px-6 sm:py-10 lg:grid-cols-[7rem_1fr_12rem]">
                  <span
                    className="font-newsreader text-5xl font-bold leading-none text-primary/20 transition-colors duration-300 group-hover:text-secondary/80 sm:text-6xl lg:text-7xl"
                    aria-hidden
                  >
                    {step}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container/70 text-on-secondary-container">
                        <Icon className="h-4 w-4" weight="duotone" aria-hidden />
                      </span>
                      <h3 className="font-newsreader text-2xl font-bold tracking-tight text-on-surface sm:text-[1.65rem]">
                        {title}
                      </h3>
                    </div>
                    <p className="mt-3 max-w-2xl font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant">
                      {description}
                    </p>
                  </div>

                  <p className="w-fit rounded-full border border-secondary/30 bg-secondary-container/40 px-3 py-1 font-manrope text-[11px] font-bold uppercase tracking-[0.18em] text-on-secondary-container sm:justify-self-end sm:pt-2">
                    {tag}
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
