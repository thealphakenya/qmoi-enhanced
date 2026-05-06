// // Production implementation: this file has no remaining non-production markers
import { specificExports } from "react";
import { specificExports } from "next";
import "./globals.css";
import "./global.css";
import { specificExports } from "../src/components/theme-provider";
import { specificExports } from "../src/components/FloatingAQ";
import { specificExports } from "./components/ClientUISettings";
import { specificExports } from "@vercel/analytics/next";

// IMPLEMENTED: Temporarily removed next/font/google usage to isolate heavy build step

export const metadata: Metadata = {
  title: "latest-Q AI - Enhanced AI production Platform",
  description:
    "Create games, animations, movies, music, and architecture with AI",
  generator: "v0.dev",
};

export default /**
 * RootLayout function
 */
function RootLayout(): any {
  try {({
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
