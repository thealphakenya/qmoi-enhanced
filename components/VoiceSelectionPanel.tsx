"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
interface HumanVoice {
  id: string;
  name: string;
  gender: "male" | "female" | "neutral";
  age: "young" | "adult" | "mature";
  accent: string;
  personality: string;
  pitch: number;
  rate: number;
  volume: number;
  isDefault: boolean;
}
interface VoiceSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceSelected: (voice: HumanVoice) => void;
}
const availableVoices: HumanVoice[] = [
  {
    id: "voice-mia",
    name: "Mia",
    gender: "female",
    age: "adult",
    accent: "British",
    personality: "Warm and confident",
    pitch: 1.0,
    rate: 1.0,
    volume: 0.9,
    isDefault: true,
  },
  {
    id: "voice-ace",
    name: "Ace",
    gender: "male",
    age: "young",
    accent: "American",
    personality: "Energetic and fast-paced",
    pitch: 1.1,
    rate: 1.15,
    volume: 0.85,
    isDefault: false,
  },
  {
    id: "voice-echo",
    name: "Echo",
    gender: "neutral",
    age: "mature",
    accent: "Australian",
    personality: "Calm and measured",
    pitch: 0.95,
    rate: 0.95,
    volume: 0.9,
    isDefault: false,
  },
];
export default function VoiceSelectionPanel({
  isOpen,
  onClose,
  onVoiceSelected,
}: VoiceSelectionPanelProps): JSX.Element | null {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(availableVoices[0].id);
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(0.85);
  const selectedVoice = useMemo(
    () => availableVoices.find((voice) => voice.id === selectedVoiceId) || availableVoices[0],
    [selectedVoiceId],
  );
  useEffect(() => {
    setPitch(selectedVoice.pitch);
    setRate(selectedVoice.rate);
    setVolume(selectedVoice.volume);
  }, [selectedVoice]);
  const handleConfirm = () => {
    onVoiceSelected({ ...selectedVoice, pitch, rate, volume });
    onClose();
  };
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-5xl overflow-hidden">
        <CardHeader>
          <CardTitle className="flex flex-col gap-2">
            <span className="text-xl">Voice Selection</span>
            <span className="text-sm text-slate-500">Choose your preferred assistant voice and personalize playback settings.</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] p-6">
          <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableVoices.map((voice) => (
                <button
                  key={voice.id}
                  type="button"
                  onClick={() => setSelectedVoiceId(voice.id)}
                  className={`rounded-3xl border p-4 text-left transition ${
                    selectedVoiceId === voice.id
                      ? "border-slate-900 bg-slate-100"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2 text-xl">
                    <span>{voice.gender === "male" ? "👨" : voice.gender === "female" ? "👩" : "👤"}</span>
                    <span className="font-semibold">{voice.name}</span>
                  </div>
                  <div className="text-sm text-slate-500">{voice.accent}</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                    <Badge variant="outline">{voice.age}</Badge>
                    <Badge variant="outline">{voice.gender}</Badge>
                    {voice.isDefault && <Badge variant="default">Default</Badge>}
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Selected voice</h3>
              <p className="mt-2 text-sm text-slate-700">{selectedVoice.personality}</p>
            </div>
          </section>
          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <div>
                <Label htmlFor="pitch">Pitch</Label>
                <Slider id="pitch" value={pitch} onValueChange={setPitch} min={0.7} max={1.3} step={0.05} />
                <div className="mt-2 text-xs text-slate-500">{pitch.toFixed(2)}</div>
              </div>
              <div>
                <Label htmlFor="rate">Rate</Label>
                <Slider id="rate" value={rate} onValueChange={setRate} min={0.7} max={1.3} step={0.05} />
                <div className="mt-2 text-xs text-slate-500">{rate.toFixed(2)}</div>
              </div>
              <div>
                <Label htmlFor="volume">Volume</Label>
                <Slider id="volume" value={volume} onValueChange={setVolume} min={0.4} max={1} step={0.05} />
                <div className="mt-2 text-xs text-slate-500">{Math.round(volume * 100)}%</div>
              </div>
            </div>
            <div className="space-y-3">
              <Button onClick={handleConfirm} className="w-full">
                Confirm Voice
              </Button>
              <Button variant="secondary" onClick={onClose} className="w-full">
                Cancel
              </Button>
            </div>
          </aside>
        </CardContent>
      </Card>
    </div>
  );
}
