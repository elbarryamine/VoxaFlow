"use client";

import { useState } from "react";
import { AUTH_FEATURES } from "@/src/features/auth/constants/AUTH_UI";
import { SignInFeatureShowcase } from "@/src/features/auth/ui/SignInFeatureShowcase";
import { LANDING_FEATURES } from "@/src/features/landing/constants/LANDING_COPY";
import { LandingRevealGroup, LandingRevealItem } from "@/src/features/landing/ui/LandingReveal";
import { LandingStepMarker } from "@/src/features/landing/ui/LandingStepMarker";
import { cn } from "@/src/shared/utils/cn";

export const LandingIndex = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
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

          <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
            <ol className="landing-step-grid flex flex-col gap-1 sm:gap-1.5">
              {AUTH_FEATURES.map(({ step, title }, index) => {
                const isActive = index === activeIndex;

                return (
                  <li key={step}>
                    <LandingRevealItem delay={index * 45}>
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        onMouseEnter={() => setActiveIndex(index)}
                        aria-pressed={isActive}
                        className={cn(
                          "group flex w-full min-w-0 items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-all duration-500 sm:gap-3 sm:px-3.5 sm:py-2.5",
                          isActive
                            ? "landing-step-card--active border-secondary/40 bg-card shadow-sm"
                            : "border-transparent hover:border-border/50 hover:bg-card/60",
                        )}
                      >
                        <LandingStepMarker className="shrink-0 text-xl text-on-surface-variant/40 group-hover:text-on-surface-variant sm:text-2xl">
                          {step}
                        </LandingStepMarker>

                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate font-manrope text-[13px] font-semibold leading-tight sm:text-[14px]",
                            isActive ? "text-on-surface" : "text-on-surface-variant group-hover:text-on-surface",
                          )}
                        >
                          {title}
                        </span>
                      </button>
                    </LandingRevealItem>
                  </li>
                );
              })}
            </ol>

            <LandingRevealItem delay={120} className="flex justify-center lg:justify-end">
              <SignInFeatureShowcase
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
                className="lg:max-w-[400px]"
              />
            </LandingRevealItem>
          </div>
        </LandingRevealGroup>
      </div>
    </section>
  );
};
