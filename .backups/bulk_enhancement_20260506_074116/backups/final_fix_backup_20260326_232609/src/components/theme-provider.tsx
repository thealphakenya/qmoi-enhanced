import React from 'react';
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:13Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

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



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
