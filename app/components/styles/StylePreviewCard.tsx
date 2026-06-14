"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { applyPreset } from "@/app/components/styles";

interface Props {
  app: string;
  name: string;
  slug: string;
  theme?: string;
  tags?: string[];
  preview?: string; // path to preview image
}

export const StylePreviewCard: React.FC<Props> = ({ app, name, slug, theme, tags = [], preview }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { setTheme } = useTheme();

  const handleApply = async () => {
    setIsSaving(true);

    try {
      const result = await applyPreset(slug, app, { persist: true });
      if (result.theme) {
        setTheme(result.theme);
      }
      if (!result.local) {
        console.warn("Style preset apply did not persist locally", result);
      }
    } catch (error) {
      console.warn("Could not apply style preset", error);
    } finally {
      setIsSaving(false);
    }
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
        <button
          disabled={isSaving}
          onClick={handleApply}
          className="rounded px-3 py-2 bg-blue-600 text-white font-semibold hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Applying…" : "Apply & Save"}
        </button>
        <div className="text-xs opacity-60">{theme || slug}</div>
      </div>
    </div>
  );
};

export default StylePreviewCard;
