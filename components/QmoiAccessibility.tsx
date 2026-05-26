"use client";
import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
interface AccessibilityProfile {
  id: string;
  name: string;
  speechRate: number;
  audioCues: boolean;
  hapticFeedback: boolean;
  voiceCommands: boolean;
  screenReader: boolean;
  emergencyMode: boolean;
}
const defaultProfiles: AccessibilityProfile[] = [
  {
    id: "beginner",
    name: "Beginner",
    speechRate: 0.8,
    audioCues: true,
    hapticFeedback: true,
    voiceCommands: true,
    screenReader: true,
    emergencyMode: false,
  },
  {
    id: "expert",
    name: "Expert",
    speechRate: 1.0,
    audioCues: false,
    hapticFeedback: true,
    voiceCommands: true,
    screenReader: false,
    emergencyMode: false,
  },
];
export default function QmoiAccessibility(): JSX.Element {
  const [selectedProfileId, setSelectedProfileId] = useState("beginner");
  const [speechRate, setSpeechRate] = useState(0.8);
  const [volume, setVolume] = useState(0.7);
  const [isReading, setIsReading] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const screenReaderRef = useRef<SpeechSynthesisUtterance | null>(null);
  const selectedProfile = useMemo(
    () => defaultProfiles.find((profile) => profile.id === selectedProfileId) || defaultProfiles[0],
    [selectedProfileId],
  );
  const handleProfileSelect = (profileId: string) => {
    const profile = defaultProfiles.find((item) => item.id === profileId);
    if (profile) {
      setSelectedProfileId(profile.id);
      setSpeechRate(profile.speechRate);
      setVolume(profile.audioCues ? 0.8 : 0.5);
      setEmergencyMode(profile.emergencyMode);
    }
  };
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (screenReaderRef.current) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.volume = volume;
      window.speechSynthesis.speak(utterance);
      screenReaderRef.current = utterance;
    }
  };
  const toggleScreenReader = () => {
    setIsReading((current) => {
      const next = !current;
      if (next) {
        speak("Screen reader mode activated.");
      } else {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Accessibility Settings</h1>
        <p className="text-sm text-slate-500">
          Configure speech, screen reader, and assistive features for QMOI.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {defaultProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleProfileSelect(profile.id)}
                    className={`rounded-2xl border px-4 py-2 text-sm transition ${
                      selectedProfileId === profile.id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {profile.name}
                  </button>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="speechRate">Speech rate</Label>
                  <Slider
                    id="speechRate"
                    value={speechRate}
                    onValueChange={(value) => setSpeechRate(value)}
                    min={0.5}
                    max={1.5}
                    step={0.1}
                  />
                  <div className="text-xs text-slate-500">{speechRate.toFixed(1)}x</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume</Label>
                  <Slider
                    id="volume"
                    value={volume}
                    onValueChange={(value) => setVolume(value)}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                  <div className="text-xs text-slate-500">{Math.round(volume * 100)}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assistive Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">Screen Reader</p>
                  <p className="text-sm text-slate-500">Narrates selected UI elements aloud.</p>
                </div>
                <Switch checked={isReading} onCheckedChange={toggleScreenReader} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">Emergency Mode</p>
                  <p className="text-sm text-slate-500">Enable quick access controls and alerts.</p>
                </div>
                <Switch checked={emergencyMode} onCheckedChange={setEmergencyMode} />
              </div>
            </CardContent>
          </Card>
        </section>
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">{selectedProfile.name}</p>
                <p>Speech rate: {selectedProfile.speechRate.toFixed(1)}x</p>
                <p>Audio cues: {selectedProfile.audioCues ? "Enabled" : "Disabled"}</p>
                <p>Haptic feedback: {selectedProfile.hapticFeedback ? "Enabled" : "Disabled"}</p>
                <p>Screen reader: {selectedProfile.screenReader ? "Enabled" : "Disabled"}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900">Voice Command Examples</h3>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm text-slate-600">
                  <div className="inline-flex items-center gap-2">
                    <Badge variant="outline">Navigate</Badge>
                    Say “go to home” to switch screens.
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Badge variant="outline">Open</Badge>
                    Say “open settings” to access preferences.
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Badge variant="outline">Read</Badge>
                    Say “read current screen” for an overview.
                  </div>
                </div>
              </div>
              <Button onClick={() => speak("Accessibility settings applied")}>Apply Settings</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
