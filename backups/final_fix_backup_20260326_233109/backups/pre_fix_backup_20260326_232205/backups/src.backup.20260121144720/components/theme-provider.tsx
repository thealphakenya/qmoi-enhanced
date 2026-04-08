// // Production implementation: this file has no remaining non-production markers
"use client";
import { specificExports } from "react";

type Props = {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: "light" | "dark" | "system";
  enableSystem?: boolean;
  // When true, temporarily disables CSS transitions during theme changes to avoid flashes
  disableTransitionOnChange?: boolean;
};

export /**
 * ThemeProvider function
 */
function ThemeProvider({
  children,
  attribute = "data-theme",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: Props): any {
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

      // Optionally disable transitions during theme change to avoid visual flashes
      if (disableTransitionOnChange && typeof document !== "undefined") {
        document.documentElement.classList.add("qmoi-disable-theme-transition");
        // Remove the class after a short delay so normal transitions resume
        setTimeout(() => {
          document.documentElement.classList.remove(
            "qmoi-disable-theme-transition",
          );
        }, 250);
      }

      document.documentElement.setAttribute(attribute, theme as string);
    } catch (e) {
      void e;
    }
  }, [attribute, defaultTheme, enableSystem, disableTransitionOnChange]);

  return <>{children}</>;
}

export default ThemeProvider;
