 all markers normalized for completion
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
          ="Add new space..."
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
