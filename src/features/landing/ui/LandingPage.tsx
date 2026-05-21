import { APP_NAME } from "@/src/shared/constants/BRAND";
import { LandingCta } from "@/src/features/landing/ui/LandingCta";
import { LandingHero } from "@/src/features/landing/ui/LandingHero";
import { LandingIndex } from "@/src/features/landing/ui/LandingIndex";
import { LandingNav } from "@/src/features/landing/ui/LandingNav";
import { LandingTape } from "@/src/features/landing/ui/LandingTape";

export const LandingPage = () => (
  <div className="landing-canvas relative min-h-screen bg-background font-manrope text-on-surface">
    <div className="landing-frame pointer-events-none fixed inset-3 z-40 border border-primary/10 sm:inset-5" aria-hidden />
    <div className="landing-corner landing-corner-tl pointer-events-none fixed left-3 top-3 z-40 sm:left-5 sm:top-5" aria-hidden />
    <div className="landing-corner landing-corner-tr pointer-events-none fixed right-3 top-3 z-40 sm:right-5 sm:top-5" aria-hidden />
    <div className="landing-corner landing-corner-bl pointer-events-none fixed bottom-3 left-3 z-40 sm:bottom-5 sm:left-5" aria-hidden />
    <div className="landing-corner landing-corner-br pointer-events-none fixed bottom-3 right-3 z-40 sm:bottom-5 sm:right-5" aria-hidden />

    <LandingNav />
    <main className="relative z-10">
      <LandingHero />
      <LandingTape />
      <LandingIndex />
      <LandingCta />
    </main>
    <footer className="relative z-10 flex flex-col gap-2 border-t-2 border-primary px-5 py-8 font-manrope text-[12px] font-bold uppercase tracking-[0.14em] text-on-surface-variant sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
      <span>
        © {new Date().getFullYear()} {APP_NAME}
      </span>
      <span className="text-on-surface-variant/70">Automations with a point of view</span>
    </footer>
  </div>
);
