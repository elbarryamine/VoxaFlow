export const APP_NAME = "Auren";

/** Theme-aware logo assets in `public/brand/`. */
export const BRAND_LOGO = {
  /** Shown when app theme is light (`light-logo.png`). */
  forLightTheme: "/brand/light-logo.png",
  /** Shown when app theme is dark (`dark-logo.png`). */
  forDarkTheme: "/brand/dark-logo.png",
} as const;

export const getBrandLogoSrc = (theme: "light" | "dark") =>
  theme === "dark" ? BRAND_LOGO.forDarkTheme : BRAND_LOGO.forLightTheme;

/** Favicon sizes derived from brand logos (32×32 / 180×180). */
export const BRAND_FAVICON = {
  forLightTheme: "/brand/favicon.png",
  forDarkTheme: "/brand/favicon-dark.png",
  appleTouchIcon: "/brand/apple-touch-icon.png",
} as const;
