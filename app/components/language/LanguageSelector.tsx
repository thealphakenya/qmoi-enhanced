"use client";

import React, { useState, useEffect } from 'react';

const ALL_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
];

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const [lang, setLang] = useState<string>(() => {
    try { return localStorage.getItem('qmoi_lang') || 'en'; } catch { return 'en'; }
  });

  useEffect(() => {
    try { localStorage.setItem('qmoi_lang', lang); } catch {}
  }, [lang]);

  useEffect(() => {
    const hydrateFromServer = async () => {
      if (typeof window === 'undefined') return;
      try {
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) return;
        const data = await response.json();
        if (data?.success && data.profile?.language) {
          setLang(data.profile.language);
        }
      } catch (e) {
        // ignore if unauthenticated or network blocked
      }
    };

    hydrateFromServer();
  }, []);

  const apply = async (code: string) => {
    setLang(code);
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: code }),
      });
    } catch (e) {
      console.warn('Language preference persistence failed', e);
    }
    // Notify app-level event for immediate i18n hydration if present
    try { window.dispatchEvent(new CustomEvent('qmoi:lang-changed', { detail: { language: code } })); } catch (e) {}
  };

  return (
    <div className={compact ? 'flex gap-2 items-center' : 'p-3 rounded-xl bg-slate-900 border border-slate-700'}>
      {!compact && <div className="mb-2 text-slate-300 font-semibold">Language</div>}
      <div className={compact ? 'flex gap-2' : 'grid grid-cols-3 gap-2'}>
        {ALL_LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => apply(l.code)}
            className={`px-3 py-2 rounded ${lang===l.code ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
          >
            {l.name}
          </button>
        ))}
      </div>
    </div>
  );
}
