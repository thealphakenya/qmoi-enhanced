"use client";

import React from 'react';
import StylePreviewCard from '@/app/components/styles/StylePreviewCard';

export default function Page() {
  const app = 'qmoi-space';
  const presets = [
    { name: 'Studio', slug: 'studio', tags: ['balanced','collaboration'], preview: '/style-previews/qmoi-space/studio.png' },
    { name: 'Workshop', slug: 'workshop', tags: ['card-forward','interactive'], preview: '/style-previews/qmoi-space/workshop.png' },
    { name: 'Accessible', slug: 'accessible', tags: ['high-contrast','accessibility'], preview: '/style-previews/qmoi-space/accessible.png' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-semibold mb-6">QMOI Space Styles & Personalization</h1>
      <p className="mb-6 text-slate-400">Customize workspace appearance and accessibility settings for collaborative projects.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {presets.map(p => (
          <StylePreviewCard key={p.slug} app={app} name={p.name} slug={p.slug} tags={p.tags} preview={p.preview} />
        ))}
      </div>
    </main>
  );
}
