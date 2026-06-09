"use client";

import type { ReactNode } from "react";
import { City, Cpu, Globe2, Sparkles, Users } from "lucide-react";

const iconMap = {
  qcity: City,
  "qmoi-ai": Cpu,
  "qmoi-space": Globe2,
  qvillage: Users,
  qalpha: Sparkles,
} as const;

type AppIconKey = keyof typeof iconMap;

interface AppShellHeaderProps {
  title: string;
  tagline: string;
  iconKey: AppIconKey;
  accentColor?: string;
  children?: ReactNode;
}

export default function AppShellHeader({
  title,
  tagline,
  iconKey,
  accentColor = "#0ea5e9",
  children,
}: AppShellHeaderProps) {
  const Icon = iconMap[iconKey];

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-xl" style={{ borderColor: accentColor }}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-inner"
            style={{ border: `1px solid ${accentColor}` }}
          >
            <Icon className="h-10 w-10" color={accentColor} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Application Shell</p>
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">{tagline}</p>
          </div>
        </div>
        <div className="rounded-3xl bg-slate-950/80 px-5 py-4 text-right" style={{ borderColor: accentColor }}>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Centralized App Branding</p>
          <p className="mt-3 text-base font-semibold text-white">Central icon and theme ownership</p>
          <p className="text-sm text-slate-400">Uses centralized assets and app metadata for consistent shell rendering.</p>
        </div>
      </div>
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}
