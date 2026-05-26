"use client";
import React, { useMemo, useState } from "react";
interface VoiceOption {
  id: string;
  name: string;
  language: string;
  accent: string;
  popularity: number;
}
const voiceOptions: VoiceOption[] = [
  { id: "amara", name: "Amara", language: "English (US)", accent: "American", popularity: 92 },
  { id: "mila", name: "Mila", language: "English (UK)", accent: "British", popularity: 85 },
  { id: "sora", name: "Sora", language: "Swahili", accent: "East African", popularity: 78 },
];
export default function VoiceLibraryPanel() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>(["amara"]);
  const filteredVoices = useMemo(
    () => voiceOptions.filter((voice) => voice.name.toLowerCase().includes(search.toLowerCase()) || voice.language.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Voice Library</h2>
        <p className="text-sm text-slate-500">Select the best voice for your QMOI audio responses.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          placeholder="Search voices"
        />
        <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredVoices.map((voice) => (
          <div key={voice.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{voice.name}</h3>
                <p className="text-sm text-slate-600">{voice.language} · {voice.accent}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleFavorite(voice.id)}
                className="rounded-full border border-slate-300 px-3 py-1 text-sm"
              >
                {favorites.includes(voice.id) ? "★" : "☆"}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>Popularity</span>
              <span>{voice.popularity}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-600">
        {filteredVoices.length} voice{filteredVoices.length !== 1 ? "s" : ""} available.
      </div>
    </div>
  );
}
