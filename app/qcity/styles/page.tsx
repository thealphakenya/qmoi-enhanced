"use client";

import React from 'react';
import StylePreviewCard from '@/app/components/styles/StylePreviewCard';

export default function Page() {
  const app = 'qcity';
  const presets = [
    { name: 'Sentinel Dark', slug: 'sentinel-dark', tags: ['dark','high-contrast','master-default'], preview: '/style-previews/qcity/sentinel-dark.png' },
    { name: 'Maproom Light', slug: 'maproom-light', tags: ['light'], preview: '/style-previews/qcity/maproom-light.png' },
    { name: 'Master Console', slug: 'master-console', tags: ['high-contrast','master-default'], preview: '/style-previews/qcity/master-console.png' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-semibold mb-6">QCity Styles & Personalization</h1>
      <p className="mb-6 text-slate-400">Preview and apply presets for QCity. These presets persist to local storage and will be saved to your profile when available.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {presets.map(p => (
          <StylePreviewCard key={p.slug} app={app} name={p.name} slug={p.slug} tags={p.tags} preview={p.preview} />
        ))}
      </div>
    </main>
  );
}
