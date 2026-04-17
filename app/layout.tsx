import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/src/shared/theme/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoiceFlow — AI Voice Agents",
  description: "Create and manage AI voice agents and automation workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var key = "voiceflow-theme";
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
