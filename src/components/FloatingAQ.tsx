"use client";
"use client";
import React, { useState } from "react";

export function FloatingAQ() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  function submit() {
    if (!value) return;
    setMessages((m) => [value, ...m].slice(0, 20));
    setValue("");
    setOpen(false);
  }

  return (
    <div>
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
            onChange={(e) => setValue(e.target.value)}
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
    </div>
  );
}
