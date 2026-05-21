"use client";

import { Check } from "@phosphor-icons/react/dist/ssr";
import { LANDING_WHY } from "@/src/features/landing/constants/LANDING_COPY";
import { LandingRevealGroup, LandingRevealItem } from "@/src/features/landing/ui/LandingReveal";

const PILLAR_MARKERS = ["I", "II", "III"] as const;

export const LandingWhy = () => (
  <section id="why" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
    <div className="mx-auto max-w-360">
      <LandingRevealGroup>
        <div className="flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <LandingRevealItem>
            <div>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
                {LANDING_WHY.kicker}
              </p>
              <h2 className="mt-3 font-newsreader text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">
                {LANDING_WHY.headline}
                <br />
                <span className="text-secondary">{LANDING_WHY.headlineAccent}</span>
              </h2>
            </div>
          </LandingRevealItem>
          <LandingRevealItem delay={100} className="lg:max-w-md lg:justify-self-end">
            <p className="font-manrope text-[14px] font-medium leading-relaxed text-on-surface-variant lg:text-right">
              {LANDING_WHY.subheadline}
            </p>
          </LandingRevealItem>
        </div>

        <LandingRevealItem delay={70} className="mt-10">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
            <div
              className="landing-blueprint-grid pointer-events-none absolute inset-0 opacity-45"
              aria-hidden
            />
            <div
              className="landing-canvas-dots pointer-events-none absolute inset-0 opacity-35"
              aria-hidden
            />

            <div className="relative grid lg:grid-cols-2">
              <div className="border-b border-border/50 p-6 sm:p-8 lg:border-r lg:border-b-0">
                <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                    Fig. 01 — {LANDING_WHY.contrast.others.label}
                  </p>
                </div>
                <ul className="mt-5 space-y-4">
                  {LANDING_WHY.contrast.others.points.map((point, index) => (
                    <li
                      key={point}
                      className="landing-why-point flex gap-4 font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant"
                      style={{ transitionDelay: `${160 + index * 65}ms` }}
                    >
                      <span
                        className="mt-0.5 shrink-0 font-newsreader text-lg leading-none text-on-surface-variant/35"
                        aria-hidden
                      >
                        ×
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-secondary-container/20 p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 border-b border-secondary/20 pb-4">
                  <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-on-secondary-container">
                    Fig. 02 — {LANDING_WHY.contrast.auren.label}
                  </p>
                  <span className="rounded-full bg-success/15 px-2.5 py-1 font-manrope text-[10px] font-bold text-success">
                    live
                  </span>
                </div>
                <ul className="mt-5 space-y-4">
                  {LANDING_WHY.contrast.auren.points.map((point, index) => (
                    <li
                      key={point}
                      className="landing-why-point flex gap-4 font-manrope text-[15px] font-medium leading-relaxed text-on-surface"
                      style={{ transitionDelay: `${240 + index * 65}ms` }}
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                        weight="bold"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </LandingRevealItem>

        <ol className="mt-12 space-y-2">
          {LANDING_WHY.pillars.map(({ title, description, tag }, index) => (
            <li key={title}>
              <LandingRevealItem delay={100 + index * 75}>
                <div className="group grid gap-5 rounded-2xl border border-transparent px-4 py-7 transition-all duration-500 hover:-translate-y-0.5 hover:border-border/50 hover:bg-card hover:shadow-sm sm:grid-cols-[4.5rem_1fr_auto] sm:items-start sm:gap-8 sm:px-6 sm:py-9 lg:grid-cols-[5.5rem_1fr_9rem]">
                  <span
                    className="font-newsreader text-4xl font-bold leading-none text-primary/20 transition-colors duration-300 group-hover:text-secondary/70 sm:text-5xl"
                    aria-hidden
                  >
                    {PILLAR_MARKERS[index]}
                  </span>

                  <div className="min-w-0">
                    <h3 className="font-newsreader text-2xl font-bold tracking-tight text-on-surface sm:text-[1.65rem]">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-2xl font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant">
                      {description}
                    </p>
                  </div>

                  <p className="w-fit font-manrope text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant sm:justify-self-end sm:border-l sm:border-border/50 sm:pl-6 sm:pt-1">
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
