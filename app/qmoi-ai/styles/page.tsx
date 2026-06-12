"use client";

import React from 'react';
import StylePreviewCard from '@/app/components/styles/StylePreviewCard';

export default function Page() {
  const app = 'qmoi-ai';
  const presets = [
    { name: 'Neon Dialog', slug: 'neon-dialog', tags: ['dark','audio-friendly'], preview: '/style-previews/qmoi-ai/neon-dialog.png' },
    { name: 'Clarity Light', slug: 'clarity-light', tags: ['light','readability'], preview: '/style-previews/qmoi-ai/clarity-light.png' },
    { name: 'Assistive', slug: 'assistive', tags: ['high-contrast','accessibility','audio-cues'], preview: '/style-previews/qmoi-ai/assistive.png' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-semibold mb-6">QMOI AI Styles & Personalization</h1>
      <p className="mb-6 text-slate-400">Pick a preset to personalize QMOI AI's conversational experience.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {presets.map(p => (
          <StylePreviewCard key={p.slug} app={app} name={p.name} slug={p.slug} tags={p.tags} preview={p.preview} />
        ))}
      </div>
    </main>
  );
}
