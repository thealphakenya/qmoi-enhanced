'use client';

import type { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: ReactNode;
  [key: string]: unknown;
}

export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="qmoi_theme"
      themes={["light", "dark", "high-contrast"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
