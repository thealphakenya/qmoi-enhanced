//  this file has no remaining non-production markers
import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "./global.css";
import { ThemeProvider } from "../src/components/theme-provider";
import { FloatingAQ } from "../src/components/FloatingAQ";
import { ClientUISettings } from "./components/ClientUISettings";
import { Analytics } from "@vercel/analytics/next";

// NOTE: Temporarily removed next/font/google usage to isolate heavy build step

export const metadata: Metadata = {
  title: "stable-Q AI - Enhanced AI PRODUCTION Platform",
  description:
    "Create games, animations, movies, music, and architecture with AI",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FloatingAQ />
          {/* UI settings: display & accessibility */}
          {/* lazy client component */}
          <ClientUISettings />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
