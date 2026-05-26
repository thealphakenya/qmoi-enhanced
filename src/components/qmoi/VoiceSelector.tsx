"use client";
import React, { useEffect, useState } from "react";
interface VoiceProfile {
  id: string;
  name: string;
  language: string;
  accent: string;
  pitch: number;
  rate: number;
  volume: number;
}
const voiceProfiles: VoiceProfile[] = [
  { id: "amara", name: "Amara", language: "English", accent: "American", pitch: 1.1, rate: 1, volume: 0.9 },
  { id: "mila", name: "Mila", language: "English", accent: "British", pitch: 1, rate: 0.95, volume: 0.85 },
];
interface VoiceSelectorProps {
  currentVoiceId?: string;
  onVoiceChange?: (voiceId: string, profile: VoiceProfile) => void;
}
export default function VoiceSelector({ currentVoiceId, onVoiceChange }: VoiceSelectorProps) {
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile | null>(null);
  useEffect(() => {
    const initial = voiceProfiles.find((voice) => voice.id === currentVoiceId) || voiceProfiles[0];
    setSelectedVoice(initial);
  }, [currentVoiceId]);
  const selectVoice = (voice: VoiceProfile) => {
    setSelectedVoice(voice);
    onVoiceChange?.(voice.id, voice);
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Voice Selector</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {voiceProfiles.map((voice) => (
          <button
            key={voice.id}
            type="button"
            onClick={() => selectVoice(voice)}
            className={`rounded-3xl border px-4 py-4 text-left transition ${selectedVoice?.id === voice.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
          >
            <div className="font-semibold">{voice.name}</div>
            <div className="text-sm text-slate-500">{voice.language} · {voice.accent}</div>
            <div className="mt-2 text-xs text-slate-500">Pitch {voice.pitch}, Rate {voice.rate}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
