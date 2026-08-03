"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.524586Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.569974Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FloatingAQ.tsx -->
"use client";

import React, { useState, useEffect } from "react";
import UISettings from "./UISettings";

export function FloatingAQ() {
  // Keep existing floating ask UI but also mount UISettings so settings are available
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // keyboard shortcut: Ctrl+Shift+, opens settings
  useEffect(() => {
    function onKey(_e: KeyboardEvent) {
      if (_e.ctrlKey && _e.shiftKey && _e.key === ",") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:open-settings"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "h" || _e.key === "H")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"));
        }
      }
      if (_e.ctrlKey && _e.shiftKey && (_e.key === "m" || _e.key === "M")) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
      {/* Header settings buttons (top-right) */}
      <div
        style={{
          position: "fixed",
          right: 20,
          top: 20,
          zIndex: 9999,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          aria-label="Toggle high contrast"
          title="Toggle high contrast"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-high-contrast"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🌓
        </button>
        <button
          aria-label="Toggle reduce motion"
          title="Toggle reduce motion"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:toggle-reduce-motion"))
          }
          className="bg-gray-800 text-white p-2 rounded"
        >
          🛑
        </button>
        <button
          aria-label="Open display settings"
          onClick={() =>
            typeof window !== "undefined" &&
            window.dispatchEvent(new CustomEvent("qmoi:open-settings"))
          }
          style={{}}
          className="bg-transparent text-white p-2 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* keyboard shortcut: Ctrl+Shift+, opens settings (listener mounted above) */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}
      >
        {open ? "Close" : "Ask"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 70,
            width: 320,
            padding: 12,
            background: "#111",
            color: "#dff",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>Ask Q (floating)</div>
          <input
            value={value}
            onChange={(_e) => setValue(_e.target.value)}
            placeholder="Ask a question..."
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit}>Send</button>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  padding: 6,
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount the persistent UI settings component so it's available across the app */}
      <UISettings />
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.041852Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.931586Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.077343Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.511403Z
