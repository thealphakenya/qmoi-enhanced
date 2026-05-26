"use client";
import React, { useState } from "react";
interface QMOIChatProps {
  onMessageReceived?: (message: string) => void;
}
export default function QMOIChat({ onMessageReceived }: QMOIChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string }[]>([]);
  const sendMessage = () => {
    if (!input.trim()) return;
    const message = input.trim();
    setMessages((prev) => [...prev, { id: String(Date.now()), sender: "user", text: message }]);
    setMessages((prev) => [...prev, { id: String(Date.now() + 1), sender: "ai", text: `Echo: ${message}` }]);
    onMessageReceived?.(message);
    setInput("");
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">QMOI Chat</h2>
      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`rounded-3xl p-4 ${message.sender === "ai" ? "bg-slate-50 text-slate-900" : "bg-slate-900 text-white"}`}>
            <div className="text-xs uppercase tracking-wide text-slate-500">{message.sender}</div>
            <div className="mt-2 text-sm">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          placeholder="Type a message..."
        />
        <button type="button" onClick={sendMessage} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          Send
        </button>
      </div>
    </div>
  );
}
