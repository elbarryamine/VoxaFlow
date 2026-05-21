import type { Metadata } from "next";
import { Newsreader, Manrope, Hanken_Grotesk } from "next/font/google";
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
