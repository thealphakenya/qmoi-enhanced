// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

// INTENTIONAL_UNUSED: archived / intentionally unused component
import React, { useState, useRef, useEffect } from "react";
import { Image, Palette, Zap, Settings, X, Download } from "lucide-react";

interface VisualElement {
  id: string;
  type: "avatar" | "background" | "theme" | "animation";
  name: string;
  value: string;
  preview?: string;
  enabled: boolean;
}

interface VisualEnhancementProps {
  userId: string;
  onVisualsChanged?: (visuals: VisualElement[]) => Promise<void>;
  defaultAvatar?: string;
  defaultTheme?: string;
}

export const VisualEnhancement: React.FC<VisualEnhancementProps> = ({
  userId,
  onVisualsChanged,
  defaultAvatar = "default_avatar",
  defaultTheme = "light",
}) => {
  const [visuals, setVisuals] = useState<VisualElement[]>([
    {
      id: "avatar-1",
      type: "avatar",
      name: "Avatar Style",
      value: defaultAvatar,
      enabled: true,
    },
    {
      id: "bg-1",
      type: "background",
      name: "Background",
      value: "gradient-blue",
      enabled: true,
    },
    {
      id: "theme-1",
      type: "theme",
      name: "Color Theme",
      value: defaultTheme,
      enabled: true,
    },
    {
      id: "anim-1",
      type: "animation",
      name: "Animation Style",
      value: "smooth",
      enabled: true,
    },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [customColor, setCustomColor] = useState("#6366f1");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Avatar options
  const avatarOptions = [
    {
      id: "default_avatar",
      name: "Default Avatar",
      preview: "👤",
      color: "#6366f1",
    },
    {
      id: "professional_avatar",
      name: "Professional",
      preview: "💼",
      color: "#3b82f6",
    },
    {
      id: "modern_avatar",
      name: "Modern",
      preview: "✨",
      color: "#8b5cf6",
    },
    { id: "casual_avatar", name: "Casual", preview: "😊", color: "#ec4899" },
    { id: "tech_avatar", name: "Tech", preview: "🤖", color: "#f59e0b" },
    {
      id: "creative_avatar",
      name: "Creative",
      preview: "🎨",
      color: "#10b981",
    },
  ];

  // Background options
  const backgroundOptions = [
    {
      id: "gradient-blue",
      name: "Blue Gradient",
      gradient: "to-r from-blue-400 to-blue-600",
    },
    {
      id: "gradient-purple",
      name: "Purple Gradient",
      gradient: "to-r from-purple-400 to-pink-600",
    },
    {
      id: "gradient-green",
      name: "Green Gradient",
      gradient: "to-r from-green-400 to-blue-500",
    },
    {
      id: "gradient-orange",
      name: "Orange Gradient",
      gradient: "to-r from-orange-400 to-red-600",
    },
    { id: "dark-bg", name: "Dark", gradient: "from-slate-800 to-slate-900" },
    { id: "light-bg", name: "Light", gradient: "from-white to-gray-100" },
  ];

  // Theme options
  const themeOptions = [
    {
      id: "light",
      name: "Light",
      colors: { bg: "#ffffff", text: "#000000", accent: "#6366f1" },
    },
    {
      id: "dark",
      name: "Dark",
      colors: { bg: "#1f2937", text: "#ffffff", accent: "#818cf8" },
    },
    {
      id: "ocean",
      name: "Ocean",
      colors: { bg: "#e0f2fe", text: "#0c4a6e", accent: "#0284c7" },
    },
    {
      id: "forest",
      name: "Forest",
      colors: { bg: "#f0fdf4", text: "#15803d", accent: "#16a34a" },
    },
    {
      id: "sunset",
      name: "Sunset",
      colors: { bg: "#fef2f2", text: "#7c2d12", accent: "#ea580c" },
    },
  ];

  // Animation options
  const animationOptions = [
    {
      id: "smooth",
      name: "Smooth",
      animation: "transition-all duration-300 ease-in-out",
    },
    { id: "bounce", name: "Bounce", animation: "animate-bounce" },
    { id: "pulse", name: "Pulse", animation: "animate-pulse" },
    { id: "spin", name: "Spin", animation: "animate-spin" },
    { id: "static", name: "Static", animation: "" },
  ];

  // Update visual element
  const updateVisual = (id: string, value: string) => {
    setVisuals((prev) => prev.map((v) => (v.id === id ? { ...v, value } : v)));
  };

  // Toggle visual element
  const toggleVisual = (id: string) => {
    setVisuals((prev) =>
      prev.map((v) => (v.id === id ? { ...v, enabled: !v.enabled } : v)),
    );
  };

  // Apply custom color
  const applyCustomColor = () => {
    setVisuals((prev) =>
      prev.map((v) => (v.type === "theme" ? { ...v, value: customColor } : v)),
    );
  };

  // Download preview as image
  const downloadPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `qmoi-visual-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get current background gradient
  const getCurrentBgGradient = () => {
    const bgVisual = visuals.find((v) => v.type === "background");
    return (
      backgroundOptions.find((o) => o.id === bgVisual?.value)?.gradient ||
      "to-r from-blue-400 to-blue-600"
    );
  };

  // Get current theme colors
  const getCurrentTheme = () => {
    const themeVisual = visuals.find((v) => v.type === "theme");
    return (
      themeOptions.find((o) => o.id === themeVisual?.value)?.colors || {
        bg: "#ffffff",
        text: "#000000",
        accent: "#6366f1",
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Palette size={28} className="text-indigo-600" />
          Visual Enhancement
        </h2>
        <div className="flex gap-2">
          <button
            onClick={downloadPreview}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Download preview"
          >
            <Download size={24} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Settings"
          >
            <Settings size={24} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div
            className={`bg-gradient-${getCurrentBgGradient()} rounded-lg p-8 min-h-96 flex flex-col items-center justify-center text-center shadow-lg overflow-hidden`}
            style={{
              backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            }}
          >
            {/* Avatar Display */}
            <div className="mb-8">
              <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center text-6xl hover:scale-110 transition-transform">
                {avatarOptions.find(
                  (a) =>
                    a.id === visuals.find((v) => v.type === "avatar")?.value,
                )?.preview || "👤"}
              </div>
            </div>

            {/* Theme Preview Text */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                QMOI Visual Studio
              </h3>
              <p className="text-white text-lg drop-shadow-md">
                Customize your experience
              </p>
            </div>

            {/* Animation Demo */}
            {visuals.find((v) => v.type === "animation")?.enabled && (
              <div className="mt-8">
                <Zap
                  size={32}
                  className={`text-yellow-300 ${
                    visuals.find((v) => v.type === "animation")?.value ===
                    "bounce"
                      ? "animate-bounce"
                      : visuals.find((v) => v.type === "animation")?.value ===
                          "pulse"
                        ? "animate-pulse"
                        : ""
                  }`}
                />
              </div>
            )}
          </div>

          {/* Canvas for download */}
          <canvas ref={canvasRef} width={800} height={600} className="hidden" />
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Avatar Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Image size={20} className="text-indigo-600" />
              Avatar
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {avatarOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateVisual("avatar-1", option.id)}
                  className={`p-2 rounded-lg text-2xl transition ${
                    visuals.find((v) => v.type === "avatar")?.value ===
                    option.id
                      ? "bg-white shadow-md scale-105"
                      : "hover:bg-white"
                  }`}
                  title={option.name}
                >
                  {option.preview}
                </button>
              ))}
            </div>
          </div>

          {/* Background Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Background</h3>
            <div className="space-y-2">
              {backgroundOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateVisual("bg-1", option.id)}
                  className={`w-full px-3 py-2 rounded-lg text-sm transition ${
                    visuals.find((v) => v.type === "background")?.value ===
                    option.id
                      ? "ring-2 ring-indigo-600 font-semibold"
                      : "hover:bg-white"
                  }`}
                >
                  <div
                    className={`bg-gradient-${option.gradient} h-6 rounded inline-block w-full`}
                  />
                  <span className="text-xs text-gray-700">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Theme</h3>
            <div className="space-y-2">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateVisual("theme-1", option.id)}
                  className={`w-full px-3 py-2 rounded-lg text-sm transition ${
                    visuals.find((v) => v.type === "theme")?.value === option.id
                      ? "ring-2 ring-indigo-600 font-semibold"
                      : "hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: option.colors.accent }}
                    />
                    <span>{option.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Animation Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
              <span>Animation</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visuals.find((v) => v.type === "animation")?.enabled}
                  onChange={() => toggleVisual("anim-1")}
                  className="rounded"
                />
                <span className="text-xs">Enable</span>
              </label>
            </h3>
            <div className="space-y-2">
              {animationOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateVisual("anim-1", option.id)}
                  enabled={
                    !visuals.find((v) => v.type === "animation")?.enabled
                  }
                  className={`w-full px-3 py-2 rounded-lg text-sm transition ${
                    visuals.find((v) => v.type === "animation")?.value ===
                    option.id
                      ? "ring-2 ring-indigo-600 font-semibold"
                      : "hover:bg-white"
                  } enabled:opacity-50`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Custom Color</h3>
            <div className="flex gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <button
                onClick={applyCustomColor}
                className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualEnhancement;
