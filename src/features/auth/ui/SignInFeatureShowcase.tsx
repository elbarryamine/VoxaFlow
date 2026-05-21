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
          style={{ transform: `translateX(${activeIndex * 52}px)` }}
          aria-hidden
        />

        <div className="relative rounded-[calc(1.5rem-1px)] bg-surface-container-lowest/95 px-5 py-6 sm:px-6 sm:py-7">
          <div
            key={`header-${activeIndex}`}
            className={cn(
              "flex items-center justify-between gap-4",
              !prefersReducedMotion && slideClass,
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/8 font-manrope text-sm font-bold tabular-nums text-primary"
                aria-hidden
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="font-manrope text-xs font-semibold text-on-surface-variant">
                <span className="text-on-surface">Step {activeIndex + 1}</span>
                <span className="text-on-surface-variant/60"> of {FEATURE_COUNT}</span>
              </span>
            </div>
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
            className="mt-6 grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4 lg:grid-cols-7"
            role="tablist"
            aria-label="Feature highlights"
          >
            {AUTH_FEATURES.map((feature, index) => {
              const isActive = index === activeIndex;
              const TabIcon = feature.icon;
              return (
                <button
                  key={feature.step}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${feature.title}, step ${index + 1} of ${FEATURE_COUNT}`}
                  title={feature.title}
                  onClick={() => selectIndex(index)}
                  className={cn(
                    "group flex flex-col items-center gap-2 rounded-xl px-1 py-1.5 transition-transform duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isActive && "scale-[1.04]",
                  )}
                >
                  <span className="relative h-1 w-full overflow-hidden rounded-full bg-surface-variant">
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
                      "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300",
                      isActive
                        ? "border-secondary/45 bg-secondary-container/50 text-on-secondary-container shadow-sm"
                        : "border-transparent bg-surface-container-high/80 text-on-surface-variant group-hover:border-border/50 group-hover:text-on-surface",
                    )}
                  >
                    <TabIcon className="h-4 w-4" weight={isActive ? "duotone" : "bold"} aria-hidden />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
