import type { Metadata } from "next";
import { Newsreader, Manrope, Hanken_Grotesk } from "next/font/google";
import { BRAND_FAVICON } from "@/src/shared/constants/BRAND";
import { ThemeProvider } from "@/src/shared/theme/ThemeProvider";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auren — AI Workflow Executions",
  description: "Create and manage AI-driven automation workflows",
  icons: {
    icon: [
      {
        url: BRAND_FAVICON.forLightTheme,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: BRAND_FAVICON.forDarkTheme,
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: {
      url: BRAND_FAVICON.appleTouchIcon,
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} ${hankenGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var key = "auren-theme";
                  var stored = localStorage.getItem(key);
                  var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  var theme = stored || (systemDark ? "dark" : "light");
                  var root = document.documentElement;
                  root.setAttribute("data-theme", theme);
                  root.classList.toggle("dark", theme === "dark");
                  root.style.colorScheme = theme;
                  var favicon = document.querySelector('link[data-auren-favicon]');
                  if (!favicon) {
                    favicon = document.createElement('link');
                    favicon.rel = 'icon';
                    favicon.type = 'image/png';
                    favicon.setAttribute('data-auren-favicon', '');
                    document.head.appendChild(favicon);
                  }
                  favicon.href = theme === 'dark'
                    ? '/brand/favicon-dark.png'
                    : '/brand/favicon.png';
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
