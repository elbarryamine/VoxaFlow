"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { APP_NAME } from "@/src/shared/constants/BRAND";
import { ThemeToggle } from "@/src/shared/theme/ThemeToggle";
import { AurenLogo } from "@/src/shared/ui/AurenLogo";

export const LandingNav = () => (
  <header className="sticky top-0 z-50 border-b-2 border-primary bg-background/90 backdrop-blur-sm">
    <div className="mx-auto flex h-[4.25rem] max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
      <Link
        href="/"
        className="group flex min-w-0 items-end gap-2.5"
        aria-label={`${APP_NAME} home`}
      >
        <AurenLogo size="sm" priority />
        <span className="truncate font-newsreader text-lg font-bold leading-none tracking-tight text-on-surface sm:text-xl">
          {APP_NAME}
        </span>
      </Link>

      <nav
        className="hidden items-center gap-10 font-manrope text-[13px] font-bold uppercase tracking-[0.18em] text-on-surface-variant md:flex"
        aria-label="Primary"
      >
        <a href="#index" className="landing-nav-link transition-colors hover:text-on-surface">
          Index
        </a>
        <a href="#manifesto" className="landing-nav-link transition-colors hover:text-on-surface">
          Manifesto
        </a>
      </nav>

      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle className="rounded-none border-2 border-primary/15 bg-transparent" />
        <Link
          href="/auth/sign-in"
          className="landing-nav-cta group inline-flex items-center gap-1.5 border-2 border-primary bg-primary px-4 py-2 font-manrope text-[12px] font-bold uppercase tracking-[0.14em] text-on-primary transition-colors hover:bg-transparent hover:text-on-surface sm:px-5"
        >
          Enter
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            weight="bold"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  </header>
);
