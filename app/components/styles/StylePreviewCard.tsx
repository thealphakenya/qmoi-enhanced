"use client";

import React from "react";

interface Props {
  app: string;
  name: string;
  slug: string;
  tags?: string[];
  preview?: string; // path to preview image
  defaultTheme?: string;
}

export const StylePreviewCard: React.FC<Props> = ({ app, name, slug, tags = [], preview, defaultTheme }) => {
  const apply = async () => {
    try {
      // persist locally
      localStorage.setItem('qmoi_theme', slug);
      localStorage.setItem(`qmoi_theme_overrides.${app}`, JSON.stringify({ preset: slug }));

      // attempt to persist to server profile (best-effort)
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stylePreferences: { theme: slug, app } }),
      });
    } catch (e) {
      // ignore errors; local change still applied
      console.warn('Could not persist style to server', e);
    }
    // trigger simple page reload to apply theme (shell should pick up qmoi_theme)
    try { window.location.reload(); } catch (e) {}
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100 w-72">
      <div className="h-40 w-full mb-3 bg-gray-800 rounded overflow-hidden flex items-center justify-center">
        {preview ? (
          <img src={preview} alt={`${name} preview`} className="object-cover h-full w-full" />
        ) : (
          <div className="text-sm opacity-60">Preview not available</div>
        )}
      </div>
      <div className="mb-2">
        <div className="font-semibold">{name}</div>
        <div className="text-xs opacity-60">{tags.join(' • ')}</div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button onClick={apply} className="px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:opacity-90">Apply & Save</button>
        <div className="text-xs opacity-60">{defaultTheme || slug}</div>
      </div>
    </div>
  );
};

export default StylePreviewCard;
