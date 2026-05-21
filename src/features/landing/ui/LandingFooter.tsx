import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { LANDING_FOOTER } from "@/src/features/landing/constants/LANDING_COPY";
import { APP_NAME } from "@/src/shared/constants/BRAND";
import { AurenLogo } from "@/src/shared/ui/AurenLogo";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";

export const LandingFooter = () => (
  <footer className="relative z-10 border-t border-border/50 bg-surface-container-lowest">
    <div className="relative overflow-hidden">
      <div
        className="landing-blueprint-grid pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      />

      <div className="relative mx-auto max-w-360 px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex flex-col gap-10 border-b border-border/50 pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-end gap-2.5"
              aria-label={`${APP_NAME} home`}
            >
              <AurenLogo size="sm" />
              <span className="font-newsreader text-xl font-bold tracking-tight text-on-surface">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-4 font-newsreader text-2xl font-bold leading-snug tracking-tight text-on-surface sm:text-[1.75rem]">
              {LANDING_FOOTER.tagline}
            </p>
            <p className="mt-3 font-manrope text-[14px] font-medium leading-relaxed text-on-surface-variant">
              {LANDING_FOOTER.blurb}
            </p>
            <TopBarLink
              href="/auth/sign-in"
              className="mt-6 gap-1.5 px-5 py-2.5 text-[12px] uppercase tracking-[0.12em]"
            >
              {LANDING_FOOTER.cta}
              <ArrowUpRight className="h-4 w-4" weight="bold" aria-hidden />
            </TopBarLink>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-8 sm:gap-12">
            {LANDING_FOOTER.columns.map((column) => (
              <div key={column.title}>
                <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-manrope text-[14px] font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
            © {new Date().getFullYear()} {APP_NAME}
          </p>

          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            aria-label="Legal"
          >
            {LANDING_FOOTER.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-manrope text-[11px] font-bold uppercase tracking-[0.14em] text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="font-manrope text-[11px] font-medium text-on-surface-variant/70 sm:max-w-xs sm:text-right">
            {LANDING_FOOTER.finePrint}
          </p>
        </div>
      </div>
    </div>
  </footer>
);
