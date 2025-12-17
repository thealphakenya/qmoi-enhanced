"use client";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: "light" | "dark" | "system";
  enableSystem?: boolean;
};

export function ThemeProvider({
  children,
  attribute = "data-theme",
  defaultTheme = "system",
  enableSystem = true,
}: Props) {
  useEffect(() => {
    try {
      let theme = defaultTheme;
      if (
        defaultTheme === "system" &&
        enableSystem &&
        typeof window !== "undefined" &&
        window.matchMedia
      ) {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      document.documentElement.setAttribute(attribute, theme as string);
    } catch (e) {
      // fail silently in tests
    }
  }, [attribute, defaultTheme, enableSystem]);

  return <>{children}</>;
}

export default ThemeProvider;
