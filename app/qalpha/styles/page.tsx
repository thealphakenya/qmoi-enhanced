"use client";

import React from 'react';
import StylePreviewCard from '@/app/components/styles/StylePreviewCard';

export default function Page() {
  const app = 'qalpha';
  const presets = [
    { name: 'Research Lab', slug: 'research-lab', tags: ['metrics','clean'], preview: '/style-previews/qalpha/research-lab.png' },
    { name: 'Notebook', slug: 'notebook', tags: ['reading','paper'], preview: '/style-previews/qalpha/notebook.png' },
    { name: 'Focus', slug: 'focus', tags: ['minimal','charts'], preview: '/style-previews/qalpha/focus.png' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-semibold mb-6">QAlpha Styles & Personalization</h1>
      <p className="mb-6 text-slate-400">Presets optimized for research, reading, and focused analytics.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {presets.map(p => (
          <StylePreviewCard key={p.slug} app={app} name={p.name} slug={p.slug} tags={p.tags} preview={p.preview} />
        ))}
      </div>
    </main>
  );
}
