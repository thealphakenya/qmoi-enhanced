"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import ThemeSelector from "@/app/components/theme/ThemeSelector";

export default function QCityThemeProvider() {
  const { theme, resolvedTheme } = useTheme();
  const activeTheme = useMemo(
    () => (theme === "system" ? resolvedTheme || "dark" : theme || "dark"),
    [theme, resolvedTheme]
  );

  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold">QCity Theme Control</h3>
          <p className="text-slate-400 mt-2">Universal theme control used by QCity and all registered QMOI shells.</p>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200">
          <p className="font-semibold">Active Theme</p>
          <p className="mt-1 text-slate-300">{activeTheme}</p>
        </div>
      </div>

      <ThemeSelector />
    </div>
  );
}
