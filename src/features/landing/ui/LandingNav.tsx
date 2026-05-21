"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { LANDING_NAV } from "@/src/features/landing/constants/LANDING_COPY";
import { LandingSectionLink } from "@/src/features/landing/ui/LandingSectionLink";
import { APP_NAME } from "@/src/shared/constants/BRAND";
import { ThemeToggle } from "@/src/shared/theme/ThemeToggle";
import { AurenLogo } from "@/src/shared/ui/AurenLogo";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";

export const LandingNav = () => (
  <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-md">
    <div className="mx-auto flex h-[4.25rem] max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
      <LandingSectionLink
        sectionId="hero"
        className="group flex min-w-0 items-end gap-2.5"
        aria-label={`${APP_NAME} home`}
      >
        <AurenLogo size="sm" priority />
        <span className="truncate font-newsreader text-lg font-bold leading-none tracking-tight text-on-surface sm:text-xl">
          {APP_NAME}
        </span>
      </LandingSectionLink>

      <nav
        className="hidden items-center gap-8 font-manrope text-[14px] font-semibold text-on-surface-variant md:flex lg:gap-10"
        aria-label="Page sections"
      >
        {LANDING_NAV.map((item) =>
          "sectionId" in item ? (
            <LandingSectionLink
              key={item.label}
              sectionId={item.sectionId}
              className="landing-nav-link transition-colors hover:text-on-surface"
            >
              {item.label}
            </LandingSectionLink>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="landing-nav-link transition-colors hover:text-on-surface"
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle className="border border-border/50 bg-card shadow-sm" />
        <TopBarLink
          href="/auth/sign-in"
          variant="secondary"
          className="hidden px-4 py-2 text-[12px] uppercase tracking-[0.12em] sm:inline-flex"
        >
          Sign in
        </TopBarLink>
        <TopBarLink
          href="/auth/sign-in"
          className="gap-1.5 px-4 py-2 text-[12px] uppercase tracking-[0.12em] sm:px-5"
        >
          Enter
          <ArrowUpRight className="h-4 w-4" weight="bold" aria-hidden />
        </TopBarLink>
      </div>
    </div>
  </header>
);
