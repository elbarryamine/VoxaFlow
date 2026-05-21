"use client";

import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";

import {
  PRICING_FAQ,
  PRICING_HERO,
  PRICING_NOTES,
  PRICING_PLANS,
} from "@/src/features/landing/constants/PRICING_COPY";
import { LandingCtaPanel } from "@/src/features/landing/ui/LandingCtaPanel";
import { LandingRevealGroup, LandingRevealItem } from "@/src/features/landing/ui/LandingReveal";
import { MarketingShell } from "@/src/features/landing/ui/MarketingShell";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";

export const PricingPage = () => (
  <MarketingShell>
    <main className="relative z-10">
      <section className="border-b border-border/50 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <LandingRevealGroup className="mx-auto max-w-360">
          <div className="max-w-2xl">
            <LandingRevealItem>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
                {PRICING_HERO.kicker}
              </p>
              <h1 className="mt-4 font-newsreader text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-tight text-on-surface">
                {PRICING_HERO.headline}
                <br />
                <span className="text-secondary">{PRICING_HERO.headlineAccent}</span>
              </h1>
            </LandingRevealItem>
            <LandingRevealItem delay={90} className="mt-6 max-w-xl">
              <p className="font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant sm:text-[16px]">
                {PRICING_HERO.subheadline}
              </p>
            </LandingRevealItem>
          </div>
        </LandingRevealGroup>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-360">
          <LandingRevealGroup>
            <ul className="grid gap-5 lg:grid-cols-3 lg:gap-6">
              {PRICING_PLANS.map((plan, index) => (
                <li key={plan.id} className={plan.highlighted ? "lg:-mt-2 lg:mb-2" : undefined}>
                  <LandingRevealItem delay={index * 80}>
                    <article
                      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-transform duration-500 hover:-translate-y-0.5 sm:p-8 ${
                        plan.highlighted
                          ? "border-secondary/35 bg-secondary-container/15 shadow-md"
                          : "border-border/50 bg-card"
                      }`}
                    >
                      {plan.highlighted && "badge" in plan && (
                        <span className="absolute right-5 top-5 rounded-full bg-secondary px-3 py-1 font-manrope text-[10px] font-bold uppercase tracking-[0.16em] text-on-secondary">
                          {plan.badge}
                        </span>
                      )}

                      <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                        {plan.fig} — {plan.name}
                      </p>

                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="font-newsreader text-5xl font-bold tracking-tight text-on-surface">
                          {plan.price}
                        </span>
                        <span className="font-manrope text-[13px] font-semibold text-on-surface-variant">
                          {plan.period}
                        </span>
                      </div>

                      <p className="mt-4 font-manrope text-[14px] font-medium leading-relaxed text-on-surface-variant">
                        {plan.description}
                      </p>

                      <ul className="mt-8 flex-1 space-y-3 border-t border-border/50 pt-8">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex gap-3 font-manrope text-[14px] font-medium leading-snug text-on-surface"
                          >
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                              weight="bold"
                              aria-hidden
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <TopBarLink
                        href={plan.ctaHref}
                        variant={plan.highlighted ? "primary" : "secondary"}
                        className="mt-8 w-full justify-center py-3 text-[12px] uppercase tracking-[0.12em]"
                      >
                        {plan.cta}
                      </TopBarLink>
                    </article>
                  </LandingRevealItem>
                </li>
              ))}
            </ul>

            <LandingRevealItem delay={200} className="mt-10">
              <ul className="space-y-2 rounded-2xl border border-border/50 bg-surface-container-low/80 px-5 py-5 sm:px-6">
                {PRICING_NOTES.map((note) => (
                  <li
                    key={note}
                    className="font-manrope text-[13px] font-medium leading-relaxed text-on-surface-variant"
                  >
                    <span className="mr-2 text-secondary" aria-hidden>
                      —
                    </span>
                    {note}
                  </li>
                ))}
              </ul>
            </LandingRevealItem>
          </LandingRevealGroup>
        </div>
      </section>

      <section className="border-y border-border/50 bg-surface-container-lowest/50 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-360">
          <LandingRevealGroup>
            <LandingRevealItem>
              <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
                FAQ
              </p>
              <h2 className="mt-3 font-newsreader text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
                Common questions
              </h2>
            </LandingRevealItem>

            <dl className="mt-10 divide-y divide-border/50 rounded-2xl border border-border/50 bg-card">
              {PRICING_FAQ.map((item, index) => (
                <LandingRevealItem key={item.question} delay={80 + index * 55}>
                  <div className="px-5 py-6 sm:px-8 sm:py-7">
                    <dt className="font-newsreader text-xl font-bold tracking-tight text-on-surface">
                      {item.question}
                    </dt>
                    <dd className="mt-3 font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant">
                      {item.answer}
                    </dd>
                  </div>
                </LandingRevealItem>
              ))}
            </dl>
          </LandingRevealGroup>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-360">
          <LandingCtaPanel />
        </div>
      </section>
    </main>
  </MarketingShell>
);
