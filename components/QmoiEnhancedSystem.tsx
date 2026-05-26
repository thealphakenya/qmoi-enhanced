"use client";
import React, { useState } from "react";
interface AccessibilityProfile {
  id: string;
  name: string;
  enabled: boolean;
  speechRate: number;
}
const defaultProfiles: AccessibilityProfile[] = [
  { id: "default", name: "Standard", enabled: true, speechRate: 1 },
  { id: "high-contrast", name: "High Contrast", enabled: false, speechRate: 1 },
  { id: "voice-first", name: "Voice First", enabled: false, speechRate: 1.2 },
];
export default function QmoiEnhancedSystem() {
  const [profiles, setProfiles] = useState<AccessibilityProfile[]>(defaultProfiles);
  const [selectedProfileId, setSelectedProfileId] = useState("default");
  const [marketingActive, setMarketingActive] = useState(false);
  const selectedProfile = profiles.find((profile) => profile.id === selectedProfileId);
  const toggleProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((profile) => ({
        ...profile,
        enabled: profile.id === id,
      })),
    );
    setSelectedProfileId(id);
  };
  const toggleMarketing = () => setMarketingActive((prev) => !prev);
  return (
    <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">QMOI Enhanced System</h2>
        <p className="text-sm text-slate-500">Manage accessibility profiles, distribution, and marketing for QMOI.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Accessibility Profiles</h3>
          <div className="mt-4 space-y-3">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => toggleProfile(profile.id)}
                className={`w-full rounded-3xl border px-4 py-3 text-left transition ${
                  profile.enabled ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{profile.name}</div>
                    <div className="text-sm text-slate-500">Speech rate: {profile.speechRate.toFixed(1)}x</div>
                  </div>
                  {profile.enabled && <span className="text-xs font-semibold text-emerald-600">Active</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Distribution & Marketing</h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              Selected profile: <span className="font-medium text-slate-900">{selectedProfile?.name}</span>
            </div>
            <button
              type="button"
              onClick={toggleMarketing}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white ${marketingActive ? "bg-emerald-600" : "bg-slate-900"}`}
            >
              {marketingActive ? "Marketing Active" : "Start Marketing"}
            </button>
            <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">
              QMOI system status is stable and ready for distribution across connected channels.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
