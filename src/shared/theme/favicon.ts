import { BRAND_FAVICON } from "@/src/shared/constants/BRAND";

type Theme = "light" | "dark";

export const getFaviconHref = (theme: Theme) =>
  theme === "dark"
    ? BRAND_FAVICON.forDarkTheme
    : BRAND_FAVICON.forLightTheme;

export const applyFavicon = (theme: Theme) => {
  if (typeof document === "undefined") return;

  let link = document.querySelector<HTMLLinkElement>("link[data-auren-favicon]");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.setAttribute("data-auren-favicon", "");
    document.head.appendChild(link);
  }

  link.href = getFaviconHref(theme);
};
