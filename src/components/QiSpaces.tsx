"use client";
import React, { useState } from "react";

export function QiSpaces() {
  const [spaces, setSpaces] = useState<string[]>(["default"]);
  const [name, setName] = useState("");

  function add() {
    if (!name.trim()) return;
    setSpaces((s) => [name.trim(), ...s]);
    setName("");
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontWeight: 700 }}>Qi Spaces</div>
      <div style={{ marginTop: 8 }}>
        <input
          value={name}
          onChange={(_e) => setName(_e.target.value)}
          placeholder="Add new space..."
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

// AUTOFIXED by Ollama at 2026-07-26T18:54:41.349570Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:34.385376Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.578585Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.605770Z
