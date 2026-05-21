"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { AUTH_FEATURES } from "@/src/features/auth/constants/AUTH_UI";
import { cn } from "@/src/shared/utils/cn";

const ROTATE_MS = 5000;
const FEATURE_COUNT = AUTH_FEATURES.length;

const getDirection = (from: number, to: number): 1 | -1 => {
  if (to === (from + 1) % FEATURE_COUNT) return 1;
  if (to === (from - 1 + FEATURE_COUNT) % FEATURE_COUNT) return -1;
  return to > from ? 1 : -1;
};

export const SignInFeatureShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const selectIndex = useCallback(
    (index: number) => {
      setActiveIndex((current) => {
        setDirection(getDirection(current, index));
        return index;
      });
    },
    [],
  );

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        setDirection(1);
        return (current + 1) % FEATURE_COUNT;
      });
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  const active = AUTH_FEATURES[activeIndex];
  const ActiveIcon = active.icon;
  const slideClass =
    direction === 1 ? "auth-slide-enter-next" : "auth-slide-enter-prev";

  return (
    <div
      className="relative"
      style={{ "--auth-duration": `${ROTATE_MS}ms` } as CSSProperties}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        className="pointer-events-none absolute -left-8 top-6 h-28 w-28 rounded-full bg-secondary/10 blur-2xl auth-ambient-drift"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-4 bottom-12 h-20 w-20 rounded-full bg-secondary-container/25 blur-xl auth-ambient-drift-delayed"
        aria-hidden
      />

      <div className="auth-showcase-border relative overflow-hidden rounded-3xl p-px shadow-lg">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[calc(1.5rem-1px)]">
          <div className="auth-shine-bar" aria-hidden />
        </div>

        <div
          className="pointer-events-none absolute -top-10 h-32 w-32 rounded-full bg-secondary/20 blur-3xl transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(${activeIndex * 72}px)` }}
          aria-hidden
        />

        <div className="relative rounded-[calc(1.5rem-1px)] bg-surface-container-lowest/95 px-5 py-6 sm:px-6 sm:py-7">
          <div
            key={`header-${activeIndex}`}
            className={cn(
              "flex items-start justify-between gap-4",
              !prefersReducedMotion && slideClass,
            )}
          >
            <span
              className="font-newsreader text-5xl font-bold leading-none text-primary/15 sm:text-6xl"
              aria-hidden
            >
              {active.step}
            </span>
            <span
              className={cn(
                "rounded-full border border-secondary/30 bg-secondary-container/40 px-3 py-1 font-manrope text-[11px] font-bold uppercase tracking-widest text-on-secondary-container",
                !prefersReducedMotion && "auth-tag-pop",
              )}
            >
              {active.tag}
            </span>
          </div>

          <div className="relative mt-5 min-h-29 overflow-hidden sm:min-h-30">
            <div
              key={`body-${activeIndex}`}
              className={cn(
                "flex items-start gap-4",
                !prefersReducedMotion && slideClass,
              )}
            >
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                <span
                  className={cn(
                    "absolute inset-0 rounded-2xl border-2 border-secondary/35",
                    !prefersReducedMotion && "auth-icon-orbit",
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "absolute inset-1 rounded-xl bg-secondary/10",
                    !prefersReducedMotion && "auth-icon-glow",
                  )}
                  aria-hidden
                />
                <div
                  className={cn(
                    "relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary",
                    !prefersReducedMotion && "auth-icon-pop",
                  )}
                >
                  <ActiveIcon className="h-6 w-6" weight="duotone" aria-hidden />
                </div>
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <h3 className="font-newsreader text-xl font-bold tracking-tight text-on-surface sm:text-2xl">
                  {active.title}
                </h3>
                <p
                  className={cn(
                    "mt-2 font-manrope text-[13px] font-medium leading-relaxed text-on-surface-variant sm:text-[14px]",
                    !prefersReducedMotion && "auth-desc-reveal",
                  )}
                >
                  {active.description}
                </p>
              </div>
            </div>
          </div>

          <div
            className="mt-6 flex gap-2"
            role="tablist"
            aria-label="Feature highlights"
          >
            {AUTH_FEATURES.map((feature, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={feature.step}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={feature.title}
                  onClick={() => selectIndex(index)}
                  className={cn(
                    "group flex flex-1 flex-col gap-2 rounded-xl px-1 py-1 text-left transition-transform duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isActive && "scale-[1.02]",
                  )}
                >
                  <span className="relative h-1 overflow-hidden rounded-full bg-surface-variant">
                    <span
                      key={isActive ? `progress-${activeIndex}-${isPaused}` : `idle-${index}`}
                      className={cn(
                        "absolute inset-y-0 left-0 w-full origin-left rounded-full bg-secondary",
                        isActive &&
                          !prefersReducedMotion &&
                          !isPaused &&
                          "auth-progress-fill",
                        isActive &&
                          (prefersReducedMotion || isPaused) &&
                          "scale-x-100 transition-transform duration-300",
                        !isActive &&
                          "scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-[0.35]",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "font-manrope text-[11px] font-bold uppercase tracking-wide transition-colors duration-300",
                      isActive
                        ? "text-on-surface"
                        : "text-on-surface-variant group-hover:text-on-surface",
                    )}
                  >
                    {feature.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2" aria-hidden>
        {AUTH_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = index === activeIndex;
          return (
            <li
              key={feature.step}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-manrope text-[11px] font-bold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive
                  ? "scale-105 border-secondary/50 bg-secondary-container/55 text-on-secondary-container shadow-sm"
                  : "scale-100 border-border/40 bg-surface-container-high/80 text-on-surface-variant opacity-55",
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-500",
                  isActive && !prefersReducedMotion && "auth-chip-icon-spin",
                )}
                weight="bold"
              />
              {feature.tag}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
