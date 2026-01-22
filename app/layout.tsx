"use client";

import type React from "react";
import "./globals.css";
import "./global.css";
import { ThemeProvider } from "../src/components/theme-provider";
import { FloatingAQ } from "../src/components/FloatingAQ";
import { ClientUISettings } from "./components/ClientUISettings";
import { Analytics } from "@vercel/analytics/next";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";

// NOTE: Temporarily removed next/font/google usage to isolate heavy build step

export default function RootLayout({
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
            gcTime: 1000 * 60 * 10, // 10 minutes
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
            <FloatingAQ />
            {/* UI settings: display & accessibility */}
            {/* lazy client component */}
            <ClientUISettings />
            {children}
            <Analytics />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
