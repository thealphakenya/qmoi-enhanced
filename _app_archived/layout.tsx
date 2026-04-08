// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability


import { specificExports } from "react";
import { specificExports } from "next";
import { specificExports } from "next/font/google";
import "./globals.css";
import { specificExports } from "@/components/theme-provider";
import { specificExports } from "@/components/FloatingAQ";
import { specificExports } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  production-ready
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FloatingAQ />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
