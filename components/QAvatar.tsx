"use client";
import React, { useState } from "react";
interface QAvatarProps {
  defaultAvatar?: "human" | "robot" | "animal" | "abstract";
  onSelect?: (selection: string) => void;
}
const avatarOptions = [
  { id: "human", label: "Human", emoji: "🧑" },
  { id: "robot", label: "Robot", emoji: "🤖" },
  { id: "animal", label: "Animal", emoji: "🐾" },
  { id: "abstract", label: "Abstract", emoji: "🎨" },
];
export default function QAvatar({ defaultAvatar = "human", onSelect }: QAvatarProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);
  const handleSelect = (id: string) => {
    setSelectedAvatar(id);
    onSelect?.(id);
  };
  const activeAvatar = avatarOptions.find((option) => option.id === selectedAvatar);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Avatar Settings</h2>
          <p className="text-sm text-slate-500">
            Choose an avatar style for your QMOI assistant profile.
          </p>
        </div>
        <div className="text-right text-sm text-slate-500">Active: {activeAvatar?.label}</div>
      </div>
      <div className="mb-5 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-center">
        <div className="text-6xl">{activeAvatar?.emoji}</div>
        <div className="mt-3 text-sm text-slate-600">{activeAvatar?.label} avatar selected</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {avatarOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option.id)}
            className={`rounded-3xl border px-4 py-4 text-left transition ${
              selectedAvatar === option.id
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{option.emoji}</span>
              <div>
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm text-slate-500">Select this avatar style</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
