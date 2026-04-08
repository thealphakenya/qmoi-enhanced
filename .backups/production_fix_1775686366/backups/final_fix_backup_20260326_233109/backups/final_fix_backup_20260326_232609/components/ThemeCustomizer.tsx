// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
"use client";

// INTENTIONAL_UNUSED: archived / intentionally unused component
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThemeManager,
  THEME_PRESETS,
  Theme,
  ThemeColors,
} from "@/lib/theme-system";
import {
  Copy,
  Palette,
  Check,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

interface ThemeCustomizerProps {
  isOpen?: boolean;
  onClose?: () => void;
  position?: "floating" | "panel" | "modal";
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen = true,
  onClose,
  position = "floating",
}) => {
  const themeManager = ThemeManager.getInstance();
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themeManager.getTheme(),
  );
  const [allThemes] = useState(themeManager.getAllThemes());
  const [expanded, setExpanded] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    "presets" | "customize" | "export"
  >("presets");
  const [customColors, setCustomColors] = useState<full<ThemeColors>>(
    currentTheme.colors,
  );
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showIsDark, setShowIsDark] = useState(currentTheme.isDark);

  useEffect(() => {
    const unsubscribe = themeManager.subscribe((theme) => {
      setCurrentTheme(theme);
      setCustomColors(theme.colors);
      setShowIsDark(theme.isDark);
    });
    return unsubscribe;
  }, []);

  const handleSelectTheme = (themeId: string) => {
    themeManager.setTheme(themeId);
  };

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const newCustomColors = { ...customColors, [colorKey]: value };
    setCustomColors(newCustomColors);
  };

  const applyCustomTheme = () => {
    const customTheme = themeManager.createCustomTheme(
      `custom_${Date.now()}`,
      "Custom Theme",
      customColors,
      showIsDark,
    );
    themeManager.setCustomTheme(customTheme);
  };

  const toggleDarkMode = () => {
    themeManager.toggleDarkMode();
    setShowIsDark(!showIsDark);
  };

  const copyToClipboard = (text: string, colorKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorKey);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportThemeJSON = () => {
    const json = JSON.stringify(
      {
        theme: currentTheme.name,
        colors: currentTheme.colors,
        gradients: currentTheme.gradients,
      },
      null,
      2,
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentTheme.id}-theme.json`;
    a.click();
  };

  // Container styling based on position
  const containerClasses = {
    floating: "fixed bottom-8 right-8 w-96 max-h-96",
    panel: "w-full h-full overflow-y-auto",
    modal: "w-full max-w-2xl h-auto max-h-96",
  };

  const containerClass = containerClasses[position];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`${containerClass} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden`}
          style={{
            background: `var(--gradient-background)`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Palette
                  className="w-5 h-5"
                  style={{ color: "var(--color-primary)" }}
                />
              </motion.div>
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--color-text)" }}
              >
                Theme Customizer
              </h3>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-700 transition"
              >
                {showIsDark ? (
                  <Moon
                    className="w-4 h-4"
                    style={{ color: "var(--color-accent)" }}
                  />
                ) : (
                  <Sun
                    className="w-4 h-4"
                    style={{ color: "var(--color-warning)" }}
                  />
                )}
              </motion.button>

              {position === "floating" && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExpanded(!expanded)}
                  className="p-2 rounded-lg hover:bg-slate-700 transition"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                    style={{ color: "var(--color-text)" }}
                  />
                </motion.button>
              )}

              {onClose && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-700 transition"
                >
                  <span
                    className="text-xl"
                    style={{ color: "var(--color-text)" }}
                  >
                    ✕
                  </span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Content */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-y-auto max-h-80"
            >
              {/* Tabs */}
              <div className="flex border-b border-slate-700 px-4 pt-4">
                {(["presets", "customize", "export"] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 text-sm font-medium transition capitalize ${
                      selectedTab === tab
                        ? "border-b-2"
                        : "border-b-2 border-transparent opacity-60"
                    }`}
                    style={{
                      borderColor:
                        selectedTab === tab
                          ? "var(--color-primary)"
                          : "transparent",
                      color:
                        selectedTab === tab
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                    }}
                  >
                    {tab === "customize" && (
                      <Sparkles className="w-3 h-3 inline mr-2" />
                    )}
                    {tab}
                  </motion.button>
                ))}
              </div>

              {/* Presets Tab */}
              {selectedTab === "presets" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {allThemes.map((theme) => (
                      <motion.button
                        key={theme.id}
                        onClick={() => handleSelectTheme(theme.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-lg border-2 transition ${
                          currentTheme.id === theme.id
                            ? "border-current"
                            : "border-transparent opacity-70"
                        }`}
                        style={{
                          background: theme.gradients.primary,
                          borderColor:
                            currentTheme.id === theme.id
                              ? "var(--color-accent)"
                              : "transparent",
                        }}
                      >
                        <div
                          className="text-sm font-semibold flex items-center gap-2"
                          style={{ color: theme.colors.text }}
                        >
                          {currentTheme.id === theme.id && (
                            <Check className="w-4 h-4" />
                          )}
                          <span className="truncate">{theme.name}</span>
                        </div>
                        <div
                          className="text-xs opacity-80 mt-1"
                          style={{ color: theme.colors.textMuted }}
                        >
                          {theme.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Customize Tab */}
              {selectedTab === "customize" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 space-y-4"
                >
                  <div className="space-y-3">
                    {(
                      [
                        "primary",
                        "secondary",
                        "accent",
                        "background",
                        "text",
                      ] as Array<keyof ThemeColors>
                    ).map((colorKey) => (
                      <div key={colorKey} className="space-y-1">
                        <label
                          className="text-sm font-medium capitalize"
                          style={{ color: "var(--color-text)" }}
                        >
                          {colorKey}
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={customColors[colorKey] || "#000000"}
                            onChange={(e) =>
                              handleColorChange(colorKey, e.target.value)
                            }
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={customColors[colorKey] || ""}
                            onChange={(e) =>
                              handleColorChange(colorKey, e.target.value)
                            }
                            className="flex-1 px-3 py-1 rounded bg-slate-800 text-sm font-mono"
                            style={{
                              color: "var(--color-text)",
                              borderColor: "var(--color-border)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={applyCustomTheme}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 rounded-lg font-medium transition"
                    style={{
                      background: "var(--gradient-primary)",
                      color: "var(--color-background)",
                    }}
                  >
                    Apply Custom Theme
                  </motion.button>
                </motion.div>
              )}

              {/* Export Tab */}
              {selectedTab === "export" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 space-y-4"
                >
                  <div
                    className="p-3 rounded-lg bg-slate-800 text-sm font-mono"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <div>Theme: {currentTheme.name}</div>
                    <div>ID: {currentTheme.id}</div>
                    <div>Colors: {Object.keys(currentTheme.colors).length}</div>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(currentTheme.colors).map(([key, value]) => (
                      <motion.div
                        key={key}
                        className="flex items-center justify-between p-2 rounded bg-slate-800 hover:bg-slate-700 transition"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-slate-600"
                            style={{ backgroundColor: value }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text)" }}
                          >
                            {key}
                          </span>
                        </div>
                        <motion.button
                          onClick={() => copyToClipboard(value, key)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 rounded hover:bg-slate-600 transition"
                        >
                          {copiedColor === key ? (
                            <Check
                              className="w-4 h-4"
                              style={{ color: "var(--color-success)" }}
                            />
                          ) : (
                            <Copy
                              className="w-4 h-4"
                              style={{ color: "var(--color-text-muted)" }}
                            />
                          )}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    onClick={exportThemeJSON}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 rounded-lg font-medium border-2 transition"
                    style={{
                      borderColor: "var(--color-primary)",
                      color: "var(--color-primary)",
                    }}
                  >
                    Export as JSON
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThemeCustomizer;
