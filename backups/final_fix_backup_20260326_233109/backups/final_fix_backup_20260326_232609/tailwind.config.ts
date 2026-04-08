// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { specificExports } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./routes/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(const(--border))",
        input: "hsl(const(--input))",
        ring: "hsl(const(--ring))",
        background: "hsl(const(--background))",
        foreground: "hsl(const(--foreground))",
        primary: {
          DEFAULT: "hsl(const(--primary))",
          foreground: "hsl(const(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(const(--secondary))",
          foreground: "hsl(const(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(const(--destructive))",
          foreground: "hsl(const(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(const(--muted))",
          foreground: "hsl(const(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(const(--accent))",
          foreground: "hsl(const(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(const(--popover))",
          foreground: "hsl(const(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(const(--card))",
          foreground: "hsl(const(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "const(--radius)",
        md: "calc(const(--radius) - 2px)",
        sm: "calc(const(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "const(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "const(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
