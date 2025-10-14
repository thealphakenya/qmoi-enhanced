import React, { useState } from "react";

export function QmoiFloatingChat() {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });

  function onMouseDown(e: React.MouseEvent) {
    setDragging(true);
    setRel({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.stopPropagation();
    e.preventDefault();
  }
  function onMouseUp() {
    setDragging(false);
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragging) return;
    setPosition({ x: e.clientX - rel.x, y: e.clientY - rel.y });
    e.stopPropagation();
    e.preventDefault();
  }

  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        background: "#18181b",
        color: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 24px #0008",
        width: 340,
        minHeight: 120,
        padding: 0,
        cursor: dragging ? "grabbing" : "grab",
        transition: dragging ? "none" : "box-shadow 0.2s",
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0ea5e9",
          borderRadius: "12px 12px 0 0",
          padding: 8,
        }}
      >
        <span style={{ fontWeight: 700 }}>QMOI Chat</span>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
      <div style={{ padding: 12 }}>
        {/* QMOI chat UI goes here */}
        <div style={{ marginBottom: 8 }}>How can I help you today?</div>
        <input
          style={{
            width: "100%",
            padding: 6,
            borderRadius: 6,
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
