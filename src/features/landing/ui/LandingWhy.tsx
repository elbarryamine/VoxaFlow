"use client";

import { Check } from "@phosphor-icons/react/dist/ssr";
import { LANDING_WHY } from "@/src/features/landing/constants/LANDING_COPY";
import { LandingRevealGroup, LandingRevealItem } from "@/src/features/landing/ui/LandingReveal";
import { LandingStepGrid, useLandingStepCycleIndex } from "@/src/features/landing/ui/LandingStepGrid";
import { LandingStepMarker } from "@/src/features/landing/ui/LandingStepMarker";
import { cn } from "@/src/shared/utils/cn";

const PILLAR_MARKERS = ["I", "II", "III"] as const;

export const LandingWhy = () => (
  <section id="why" className="scroll-mt-20 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
    <div className="mx-auto max-w-360">
      <LandingRevealGroup>
        <LandingRevealItem className="border-b border-border/50 pb-5">
          <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
            {LANDING_WHY.kicker}
          </p>
          <h2 className="mt-2 font-newsreader text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            {LANDING_WHY.headline}
            <br />
            <span className="text-secondary">{LANDING_WHY.headlineAccent}</span>
          </h2>
          <p className="mt-3 max-w-2xl font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant">
            {LANDING_WHY.subheadline}
          </p>
        </LandingRevealItem>

        <LandingRevealItem delay={70} className="mt-6">
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
            <div
              className="landing-blueprint-grid pointer-events-none absolute inset-0 opacity-45"
              aria-hidden
            />
            <div
              className="landing-canvas-dots pointer-events-none absolute inset-0 opacity-35"
              aria-hidden
            />

            <div className="relative grid sm:grid-cols-2">
              <div className="border-b border-border/50 p-4 sm:border-r sm:border-b-0 sm:p-5">
                <div className="border-b border-border/40 pb-3">
                  <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                    Fig. 01 — {LANDING_WHY.contrast.others.label}
                  </p>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {LANDING_WHY.contrast.others.points.map((point, index) => (
                    <li key={point}>
                      <LandingRevealItem
                        delay={80 + index * 55}
                        className="flex gap-3 font-manrope text-[14px] font-medium leading-snug text-on-surface-variant"
                      >
                        <span
                          className="shrink-0 font-newsreader text-base leading-none text-on-surface-variant/35"
                          aria-hidden
                        >
                          ×
                        </span>
                        {point}
                      </LandingRevealItem>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-secondary-container/20 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 border-b border-secondary/20 pb-3">
                  <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-on-secondary-container">
                    Fig. 02 — {LANDING_WHY.contrast.auren.label}
                  </p>
                  <span className="rounded-full bg-success/15 px-2 py-0.5 font-manrope text-[10px] font-bold text-success">
                    live
                  </span>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {LANDING_WHY.contrast.auren.points.map((point, index) => (
                    <li key={point}>
                      <LandingRevealItem
                        delay={120 + index * 55}
                        className="flex gap-3 font-manrope text-[14px] font-medium leading-snug text-on-surface"
                      >
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary"
                          weight="bold"
                          aria-hidden
                        />
                        {point}
                      </LandingRevealItem>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </LandingRevealItem>

        <LandingStepGrid
          itemCount={LANDING_WHY.pillars.length}
          className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {LANDING_WHY.pillars.map(({ title, description, tag }, index) => (
            <LandingWhyPillarCard
              key={title}
              index={index}
              marker={PILLAR_MARKERS[index]}
              title={title}
              description={description}
              tag={tag}
            />
          ))}
        </LandingStepGrid>
      </LandingRevealGroup>
    </div>
  </section>
);

interface LandingWhyPillarCardProps {
  index: number;
  marker: (typeof PILLAR_MARKERS)[number];
  title: string;
  description: string;
  tag: string;
}

const LandingWhyPillarCard = ({
  index,
  marker,
  title,
  description,
  tag,
}: LandingWhyPillarCardProps) => {
  const isCycleActive = useLandingStepCycleIndex(index);

  return (
    <li
      className="min-h-0 sm:last:col-span-2 sm:last:flex sm:last:justify-center sm:last:[&>div]:w-full sm:last:[&>div]:max-w-[calc((100%-0.75rem)/2)]"
    >
      <LandingRevealItem delay={100 + index * 55} className="h-full">
        <div
          className={cn(
            "group flex h-full flex-col rounded-xl border border-transparent px-4 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-border/50 hover:bg-card hover:shadow-sm",
            isCycleActive && "landing-step-card--active",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <LandingStepMarker>{marker}</LandingStepMarker>
            <p className="shrink-0 font-manrope text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
              {tag}
            </p>
          </div>

          <h3 className="mt-3 font-newsreader text-lg font-bold leading-snug tracking-tight text-on-surface">
            {title}
          </h3>
          <p className="mt-2 flex-1 font-manrope text-[14px] font-medium leading-snug text-on-surface-variant">
            {description}
          </p>
        </div>
      </LandingRevealItem>
    </li>
  );
};
