"use client";
import React from "react";
interface AvatarDisplayProps {
  name?: string;
  quality?: string;
  isActive?: boolean;
}
export default function AvatarDisplay({ name = "QMOI Avatar", quality = "Standard", isActive = false }: AvatarDisplayProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-center">
        <div className="text-4xl">{isActive ? "🤖" : "👤"}</div>
        <h2 className="text-2xl font-semibold text-slate-900">{name}</h2>
        <p className="text-sm text-slate-500">Quality: {quality}</p>
      </div>
      <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">Avatar display and status information for the current QMOI persona.</div>
    </div>
  );
}
