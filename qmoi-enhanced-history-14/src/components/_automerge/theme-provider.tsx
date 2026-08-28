"use client";
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <>
        <style>{`\n          :root {\n            --qmoi-primary: #16a34a;\n            --qmoi-accent: #10b981;\n            --qmoi-bg-1: #071013;\n            --qmoi-bg-2: #0f1724;\n            --qmoi-card-bg: rgba(10,12,15,0.65);\n            --qmoi-text: #dfffe4;\n            --qmoi-muted: #9bd6b3;\n            --qmoi-radius: 12px;\n            --qmoi-shadow: 0 8px 30px rgba(2,6,23,0.7);\n          }\n          html, body, #__next {\n            height: 100%;\n            margin: 0;\n            padding: 0;\n            background: linear-gradient(135deg, var(--qmoi-bg-1) 0%, var(--qmoi-bg-2) 100%);\n            color: var(--qmoi-text);\n            font-family: Inter, ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial;\n            -webkit-font-smoothing: antialiased;\n            -moz-osx-font-smoothing: grayscale;\n          }\n          .qmoi-card {\n            background: var(--qmoi-card-bg);\n            border: 1px solid rgba(22,163,74,0.08);\n            border-radius: var(--qmoi-radius);\n            padding: 1rem;\n            box-shadow: var(--qmoi-shadow);\n          }\n          .qmoi-btn {\n            background: linear-gradient(180deg, var(--qmoi-primary), var(--qmoi-accent));\n            color: white;\n            border-radius: 8px;\n            padding: 0.5rem 0.9rem;\n            border: none;\n            cursor: pointer;\n          }\n          .qmoi-btn:disabled { opacity: 0.5; cursor: not-allowed }\n          .qmoi-muted { color: var(--qmoi-muted) }\n          /* Scrollbar */\n          ::-webkit-scrollbar { width: 10px; height: 10px }\n          ::-webkit-scrollbar-track { background: transparent }\n          ::-webkit-scrollbar-thumb { background: rgba(22,163,74,0.15); border-radius: 999px }\n        `}</style>
        {children}
      </>
    </NextThemesProvider>
  );
}
