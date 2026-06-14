"use client";

import React from 'react';
import StylePreviewCard from '@/app/components/styles/StylePreviewCard';
import { listPresets } from '@/app/components/styles';
import LanguageSelector from '@/app/components/language/LanguageSelector';

export default function Page() {
  const app = 'qmoi-space';
  const presets = listPresets(app);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-semibold mb-6">QMOI Space Styles & Personalization</h1>
      <p className="mb-6 text-slate-400">Customize workspace appearance and accessibility settings for collaborative projects.</p>
      
      <section className="mb-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <LanguageSelector />
      </section>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {presets.map(p => (
          <StylePreviewCard key={p.slug} app={app} name={p.name} slug={p.slug} theme={p.theme} tags={p.tags} preview={p.preview} />
        ))}
      </div>
    </main>
  );
}
