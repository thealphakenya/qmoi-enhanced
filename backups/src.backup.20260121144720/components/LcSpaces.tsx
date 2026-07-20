"use client";
import React, { useState } from "react";

export function LcSpaces() {
  const [spaces, setSpaces] = useState<string[]>(["Main", "Dev"]);
  const [input, setInput] = useState("");

  function add() {
    if (!input.trim()) return;
    setSpaces((s) => [input.trim(), ...s]);
    setInput("");
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontWeight: 700 }}>LC Spaces</div>
      <div style={{ marginTop: 8 }}>
        <input
          value={input}
          onChange={(_e) => setInput(_e.target.value)}
          placeholder="Add new LC space..."
        />
        <button onClick={add} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>
      <ul style={{ marginTop: 8 }}>
        {spaces.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.042899Z: replaced placeholders or noted TODOs. Please review.
