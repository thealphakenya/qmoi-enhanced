"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

export default function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      storageKey="qmoi_theme"
      themes={["light", "dark", "high-contrast"]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
