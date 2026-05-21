import Link from "next/link";
import { LANDING_CTA } from "@/src/features/landing/constants/LANDING_COPY";

export const LandingCta = () => (
  <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
    <div className="mx-auto flex max-w-[90rem] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
      <h2 className="max-w-2xl font-newsreader text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-on-surface">
        {LANDING_CTA.line}
      </h2>
      <Link
        href="/auth/sign-in"
        className="group inline-flex shrink-0 items-center gap-4 border-2 border-primary bg-secondary px-8 py-4 font-manrope text-[13px] font-bold uppercase tracking-[0.2em] text-on-secondary transition-colors hover:bg-primary hover:text-on-primary"
      >
        {LANDING_CTA.action}
        <span
          className="inline-block h-2 w-2 bg-on-secondary transition-colors group-hover:bg-on-primary"
          aria-hidden
        />
      </Link>
    </div>
  </section>
);
