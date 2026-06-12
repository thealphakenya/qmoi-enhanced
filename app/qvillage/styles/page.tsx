"use client";

import React from 'react';
import StylePreviewCard from '@/app/components/styles/StylePreviewCard';

export default function Page() {
  const app = 'qvillage';
  const presets = [
    { name: 'Marketplace', slug: 'marketplace', tags: ['commerce','warm'], preview: '/style-previews/qvillage/marketplace.png' },
    { name: 'Catalog', slug: 'catalog', tags: ['grid-first','readable'], preview: '/style-previews/qvillage/catalog.png' },
    { name: 'Community High-Contrast', slug: 'community-high-contrast', tags: ['high-contrast','accessibility'], preview: '/style-previews/qvillage/community-high-contrast.png' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-semibold mb-6">QVillage Styles & Personalization</h1>
      <p className="mb-6 text-slate-400">Choose a look for community pages and dataset browsing.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {presets.map(p => (
          <StylePreviewCard key={p.slug} app={app} name={p.name} slug={p.slug} tags={p.tags} preview={p.preview} />
        ))}
      </div>
    </main>
  );
}
