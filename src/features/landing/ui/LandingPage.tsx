import { LandingCta } from "@/src/features/landing/ui/LandingCta";
import { LandingHero } from "@/src/features/landing/ui/LandingHero";
import { LandingIndex } from "@/src/features/landing/ui/LandingIndex";
import { LandingTape } from "@/src/features/landing/ui/LandingTape";
import { LandingWhy } from "@/src/features/landing/ui/LandingWhy";
import { MarketingShell } from "@/src/features/landing/ui/MarketingShell";

export const LandingPage = () => (
  <MarketingShell>
    <main className="relative z-10">
      <LandingHero />
      <LandingTape />
      <LandingWhy />
      <LandingIndex />
      <LandingCta />
    </main>
  </MarketingShell>
);
