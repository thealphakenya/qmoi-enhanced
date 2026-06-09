"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

const themeOptions = [
  {
    value: "system",
    label: "System",
    description: "Follow the operating system preference.",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Dark mode with rich slate panels and neon accents.",
  },
  {
    value: "light",
    label: "Light",
    description: "Light mode with bright surfaces and clear readability.",
  },
  {
    value: "high-contrast",
    label: "High Contrast",
    description: "Maximum contrast for accessibility and visibility.",
  },
];

interface ThemeSelectorProps {
  compact?: boolean;
}

export default function ThemeSelector({ compact = false }: ThemeSelectorProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = useMemo(() => {
    if (!mounted) return "system";
    if (theme === "system") {
      return resolvedTheme || "dark";
    }
    return theme || "dark";
  }, [theme, resolvedTheme, mounted]);

  if (!mounted) {
    return <div className="text-sm text-slate-400">Loading theme options…</div>;
  }

  return (
    <div className={compact ? "space-y-2" : "rounded-3xl border border-slate-700 bg-slate-950 p-4 shadow-xl shadow-slate-950/20"}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Theme</p>
          <p className="text-sm text-slate-400">
            Current theme: <span className="font-semibold text-white">{activeTheme}</span>
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
          {theme === "system" ? "System" : theme}
        </span>
      </div>

      <div className={compact ? "grid gap-2" : "mt-4 grid gap-3 sm:grid-cols-2"}>
        {themeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
              theme === option.value
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
            }`}
          >
            <div className="font-semibold">{option.label}</div>
            {!compact ? <p className="mt-1 text-xs text-slate-400">{option.description}</p> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
