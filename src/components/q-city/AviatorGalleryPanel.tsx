"use client";
import React from "react";
const galleryItems = [
  { id: "1", title: "Avatar One", description: "Sleek interface avatar" },
  { id: "2", title: "Voice Pack", description: "High fidelity voice model" },
];
export default function AviatorGalleryPanel() {
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Aviator Gallery</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {galleryItems.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold text-slate-900">{item.title}</div>
            <p className="text-sm text-slate-500 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">Browse avatars, voices, and visual assets in the gallery.</div>
    </div>
  );
}
