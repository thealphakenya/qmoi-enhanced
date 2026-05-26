"use client";
import React, { useEffect, useState } from "react";
interface BiometricOption {
  id: string;
  name: string;
  enabled: boolean;
}
const defaultOptions: BiometricOption[] = [
  { id: "face", name: "Face Recognition", enabled: true },
  { id: "fingerprint", name: "Fingerprint", enabled: false },
  { id: "voice", name: "Voice Match", enabled: false },
  { id: "iris", name: "Iris Scan", enabled: false },
];
export default function QMOIBiometricManager() {
  const [isMaster, setIsMaster] = useState(true);
  const [biometricOptions, setBiometricOptions] = useState<BiometricOption[]>(defaultOptions);
  const [activeTab, setActiveTab] = useState("overview");
  useEffect(() => {
    const stored = localStorage.getItem("qmoiBiometricMaster");
    if (stored === "false") setIsMaster(false);
  }, []);
  const toggleOption = (id: string) => {
    setBiometricOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, enabled: !option.enabled } : option,
      ),
    );
  };
  if (!isMaster) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-red-700">
        Master access required to view biometric management settings.
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">QMOI Biometric Manager</h2>
          <p className="text-sm text-slate-500">Configure biometric authentication methods for QMOI access.</p>
        </div>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${activeTab === "overview" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${activeTab === "settings" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            Settings
          </button>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        {activeTab === "overview" ? (
          <div className="space-y-4">
            <div className="text-sm text-slate-700">Active biometric options help secure QMOI while enabling fast authentication.</div>
            <ul className="space-y-3">
              {biometricOptions.map((option) => (
                <li key={option.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <div className="font-semibold text-slate-900">{option.name}</div>
                    <div className="text-sm text-slate-500">{option.enabled ? "Enabled" : "Disabled"}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleOption(option.id)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white ${option.enabled ? "bg-rose-600" : "bg-slate-900"}`}
                  >
                    {option.enabled ? "Disable" : "Enable"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-slate-700">
            <div>Switch biometric methods on or off and manage master access for secure device unlock.</div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="font-medium text-slate-900">Current active methods:</div>
              <div className="mt-2 text-sm text-slate-600">
                {biometricOptions.filter((option) => option.enabled).map((option) => option.name).join(", ") || "None"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
