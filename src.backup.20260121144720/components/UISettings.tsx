"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/UISettings.tsx -->
"use client";

import React, { useEffect, useState } from "react";

type UISettingsState = {
  fontSize: number; // px
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  lineHeight: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: UISettingsState = {
  fontSize: 16,
  fontFamily:
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontColor: "#111827",
  backgroundColor: "#ffffff",
  lineHeight: 1.5,
  highContrast: false,
  reduceMotion: false,
};

const STORAGE_KEY = "qmoi_ui_settings_v1";

function applySettings(s: UISettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--qmoi-font-size", `${s.fontSize}px`);
  root.style.setProperty("--qmoi-font-family", s.fontFamily);
  root.style.setProperty("--qmoi-font-color", s.fontColor);
  root.style.setProperty("--qmoi-bg-color", s.backgroundColor);
  root.style.setProperty("--qmoi-line-height", String(s.lineHeight));
  root.style.setProperty("--qmoi-high-contrast", s.highContrast ? "1" : "0");
  root.style.setProperty("--qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  // mirror as data attributes for easier CSS selectors
  try {
    root.setAttribute("data-qmoi-high-contrast", s.highContrast ? "1" : "0");
    root.setAttribute("data-qmoi-reduce-motion", s.reduceMotion ? "1" : "0");
  } catch (_e) {
    void _e; /* ignore DOM attribute failures */
  }
}

export const UISettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<UISettingsState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UISettingsState;
        setSettings((prev) => ({ ...prev, ...parsed }));
        applySettings({ ...DEFAULTS, ...parsed });
      } else {
        applySettings(DEFAULTS);
      }
    } catch (_e) {
      void _e; /* fallback to defaults */
      applySettings(DEFAULTS);
    }
  }, []);

  // quick-toggle _event listeners (high contrast / reduce motion)
  useEffect(() => {
    function onToggleHigh() {
      setSettings((prev) => {
        const _next = { ...prev, highContrast: !prev.highContrast };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    function onToggleReduce() {
      setSettings((prev) => {
        const _next = { ...prev, reduceMotion: !prev.reduceMotion };
        applySettings(_next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
        } catch (_e) {
          void _e;
        }
        return _next;
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:toggle-high-contrast",
        onToggleHigh as EventListener,
      );
      window.addEventListener(
        "qmoi:toggle-reduce-motion",
        onToggleReduce as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:toggle-high-contrast",
          onToggleHigh as EventListener,
        );
        window.removeEventListener(
          "qmoi:toggle-reduce-motion",
          onToggleReduce as EventListener,
        );
      }
    };
  }, []);

  // Listen for a global _event to open the settings from other UI parts
  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener(
        "qmoi:open-settings",
        handleOpenEvent as EventListener,
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "qmoi:open-settings",
          handleOpenEvent as EventListener,
        );
      }
    };
  }, []);

  const save = (partial: Partial<UISettingsState>) => {
    const _next = { ...settings, ...partial };
    setSettings(_next);
    applySettings(_next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_next));
    } catch (_e) {
      void _e; /* ignore storage errors */
    }
  };

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      void _e;
    }
  };

  return (
    <>
      <button
        aria-label="Open display settings"
        onClick={() => setOpen(true)}
        className="fixed z-50 right-4 bottom-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <aside className="w-full max-w-md bg-white dark:bg-[#0b1220] h-full p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display & Accessibility
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font size ({settings.fontSize}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={settings.fontSize}
                  onChange={(_e) => save({ fontSize: Number(_e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(_e) => save({ fontFamily: _e.target.value })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={DEFAULTS.fontFamily}>System / Inter</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Monospace</option>
                  <option value="Arial, Helvetica, sans-serif">
                    Sans (Arial)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Font color
                </label>
                <input
                  type="color"
                  value={settings.fontColor}
                  onChange={(_e) => save({ fontColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Background color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(_e) => save({ backgroundColor: _e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Line height ({settings.lineHeight})
                </label>
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.05}
                  value={settings.lineHeight}
                  onChange={(_e) =>
                    save({ lineHeight: Number(_e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    High contrast
                  </div>
                  <div className="text-xs text-gray-500">
                    Increase contrast for better readability
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(_e) => save({ highContrast: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Reduce motion
                  </div>
                  <div className="text-xs text-gray-500">
                    Disable animations and transitions
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(_e) => save({ reduceMotion: _e.target.checked })}
                    className="mr-2"
                  />
                </label>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500">Preview</div>
                <div
                  className="mt-2 p-4 rounded"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    background: settings.backgroundColor,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default UISettings;
