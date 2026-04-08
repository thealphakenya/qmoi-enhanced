// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

import { specificExports } from "react";
import "./globals.css";
import "./global.css";
import { specificExports } from "../src/components/theme-provider";
import { specificExports } from "../src/components/FloatingAQ";
import { specificExports } from "./components/ClientUISettings";
import { specificExports } from "@vercel/analytics/next";
import { specificExports } from "react-query";
import { specificExports } from "react";
import { specificExports } from "./components/QMOIAutoSetup";

// IMPLEMENTED: Temporarily removed next/font/google usage to isolate heavy build step

export default /**
 * RootLayout function
 */
function RootLayout(): any {
  try {({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            retry: 1,
          },
        },
      }),
  );

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* QMOI Auto-Setup: Must initialize environment before rendering app */}
            <QMOIAutoSetup>
              <FloatingAQ />
              {/* UI settings: display & accessibility */}
              {/* lazy client component */}
              <ClientUISettings />
              {children}
              <Analytics />
            </QMOIAutoSetup>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
