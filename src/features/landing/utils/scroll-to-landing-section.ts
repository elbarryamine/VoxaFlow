export const LANDING_SECTION_SCROLL_KEY = "auren:landing-section";

export type LandingSectionId =
  | "hero"
  | "about"
  | "why"
  | "features"
  | "get-started";

export const scrollToLandingSection = (sectionId: LandingSectionId | string) => {
  const target = document.getElementById(sectionId);
  if (!target) return false;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  return true;
};

export const queueLandingSectionScroll = (sectionId: LandingSectionId | string) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LANDING_SECTION_SCROLL_KEY, sectionId);
};

export const consumeQueuedLandingSectionScroll = () => {
  if (typeof window === "undefined") return null;

  const sectionId = sessionStorage.getItem(LANDING_SECTION_SCROLL_KEY);
  if (!sectionId) return null;

  sessionStorage.removeItem(LANDING_SECTION_SCROLL_KEY);
  return sectionId;
};

/** Legacy `/#section` URLs — scroll then strip the hash from the address bar. */
export const scrollFromLocationHash = () => {
  if (typeof window === "undefined") return;

  const sectionId = window.location.hash.replace(/^#/, "");
  if (!sectionId) return;

  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );

  window.requestAnimationFrame(() => {
    scrollToLandingSection(sectionId);
  });
};
