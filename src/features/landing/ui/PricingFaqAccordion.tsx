"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import type { PRICING_FAQ } from "@/src/features/landing/constants/PRICING_COPY";
import { LandingRevealItem } from "@/src/features/landing/ui/LandingReveal";
import { cn } from "@/src/shared/utils/cn";

type PricingFaqItem = (typeof PRICING_FAQ)[number];

interface PricingFaqAccordionProps {
  items: readonly PricingFaqItem[];
}

export const PricingFaqAccordion = ({ items }: PricingFaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <dl className="mt-10 divide-y divide-border/50 rounded-2xl border border-border/50 bg-card">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `pricing-faq-panel-${index}`;
        const triggerId = `pricing-faq-trigger-${index}`;

        return (
          <LandingRevealItem key={item.question} delay={80 + index * 55} className="min-w-0">
            <div>
              <dt className="m-0">
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-surface-variant/20 sm:px-8 sm:py-6"
                >
                  <span className="font-newsreader text-lg font-bold tracking-tight text-on-surface sm:text-xl">
                    {item.question}
                  </span>
                  <CaretDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-secondary transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                    weight="bold"
                    aria-hidden
                  />
                </button>
              </dt>
              <dd
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant sm:px-8 sm:pb-6">
                    {item.answer}
                  </p>
                </div>
              </dd>
            </div>
          </LandingRevealItem>
        );
      })}
    </dl>
  );
};
