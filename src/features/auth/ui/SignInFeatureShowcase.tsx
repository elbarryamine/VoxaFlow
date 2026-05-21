"use client";

import { useCallback, useEffect, useState } from "react";
import { AUTH_FEATURES } from "@/src/features/auth/constants/AUTH_UI";
import { cn } from "@/src/shared/utils/cn";

const ROTATE_MS = 5000;
const FEATURE_COUNT = AUTH_FEATURES.length;
const DEGREES_PER_FEATURE = 360 / FEATURE_COUNT;
const DIAL_RADIUS_PERCENT = 42;

const getFeaturePosition = (index: number) => {
  const angleDeg = index * DEGREES_PER_FEATURE - 90;
  const radians = (angleDeg * Math.PI) / 180;
  return {
    left: `${50 + DIAL_RADIUS_PERCENT * Math.cos(radians)}%`,
    top: `${50 + DIAL_RADIUS_PERCENT * Math.sin(radians)}%`,
  };
};

export const SignInFeatureShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const selectIndex = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % FEATURE_COUNT);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  const active = AUTH_FEATURES[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <div
      className="relative mx-auto w-full max-w-[360px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="relative aspect-square w-full">
        <div
          className="pointer-events-none absolute inset-[8%] rounded-full bg-surface-container-lowest/90"
          aria-hidden
        />

        {AUTH_FEATURES.map((feature, index) => {
          const isActive = index === activeIndex;
          const TabIcon = feature.icon;
          const position = getFeaturePosition(index);

          return (
            <button
              key={feature.step}
              type="button"
              aria-label={`${feature.title}, step ${index + 1} of ${FEATURE_COUNT}`}
              aria-pressed={isActive}
              title={feature.title}
              onClick={() => selectIndex(index)}
              className={cn(
                "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl p-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                isActive
                  ? "scale-110"
                  : "scale-100 opacity-75 hover:scale-105 hover:opacity-100",
              )}
              style={position}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-500 sm:h-11 sm:w-11",
                  isActive
                    ? "border-secondary/50 bg-primary text-on-primary shadow-md"
                    : "border-border/40 bg-surface-container-high text-on-surface-variant",
                )}
              >
                <TabIcon
                  className="h-5 w-5"
                  weight={isActive ? "duotone" : "bold"}
                  aria-hidden
                />
              </span>
              <span
                className={cn(
                  "font-manrope text-[9px] font-bold uppercase tracking-wider",
                  isActive ? "text-secondary" : "text-on-surface-variant/70",
                )}
              >
                {feature.step}
              </span>
            </button>
          );
        })}

        <div className="absolute inset-[24%] flex items-center justify-center px-2">
          <div
            key={`center-${activeIndex}`}
            className={cn(
              "flex max-h-full w-full flex-col items-center justify-center text-center",
              !prefersReducedMotion && "auth-feature-enter",
            )}
          >
            <span className="font-manrope text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Step {activeIndex + 1} of {FEATURE_COUNT}
            </span>
            <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ActiveIcon className="h-5 w-5" weight="duotone" aria-hidden />
            </div>
            <h3 className="mt-2 font-newsreader text-base font-bold leading-snug tracking-tight text-on-surface sm:text-lg">
              {active.title}
            </h3>
            <p className="mt-1.5 line-clamp-3 font-manrope text-[11px] font-medium leading-relaxed text-on-surface-variant sm:text-[12px]">
              {active.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
