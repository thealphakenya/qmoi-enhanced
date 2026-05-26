"use client";
import React, { useMemo, useState } from "react";
interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  content: string;
  timestamp: string;
}
const initialMessages: ChatMessage[] = [
  { id: "1", sender: "system", content: "Welcome to QI — the intelligent assistance hub.", timestamp: new Date().toISOString() },
];
export default function QI() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const latestMessage = useMemo(() => messages[messages.length - 1], [messages]);
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage, {
      id: String(Date.now() + 1),
      sender: "ai",
      content: `AI response: ${inputValue.trim()}`,
      timestamp: new Date().toISOString(),
    }] );
    setInputValue("");
  };
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">QI Assistant</h2>
        <p className="text-sm text-slate-500">A lightweight intelligence panel for quick prompts and context-aware responses.</p>
      </div>
      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`rounded-3xl p-4 ${message.sender === "ai" ? "bg-slate-50 text-slate-900" : message.sender === "user" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>
            <div className="text-sm font-medium">{message.sender.toUpperCase()}</div>
            <p className="mt-2 text-sm leading-6">{message.content}</p>
            <div className="mt-2 text-xs text-slate-500">{new Date(message.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          placeholder="Type a message to QI..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button
          type="button"
          onClick={sendMessage}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Send
        </button>
      </div>
      {latestMessage && latestMessage.sender === "ai" && (
        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Last AI response generated at {new Date(latestMessage.timestamp).toLocaleTimeString()}.
        </div>
      )}
    </div>
  );
}
