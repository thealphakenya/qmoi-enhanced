import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message { role: "user" | "assistant"; text: string }

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qmoi/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.reply || data.message || "(no reply)";
      setMessages((m) => [...m, { role: "assistant", text: reply }] );
    } catch (err: any) {
      setError(err.message || "Failed to converse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-slate-900">
      <h3 className="font-semibold mb-2">Assistant Chat</h3>
      <div className="mb-2">
        <div className="max-h-48 overflow-auto mb-2 border rounded p-2 bg-black text-sm">
          {messages.length === 0 && <div className="text-gray-500">Start a conversation</div>}
          {messages.map((m, i) => (
            <div key={i} className={`mb-1 ${m.role === 'assistant' ? 'text-cyan-300' : 'text-white'}`}>
              <b>{m.role === 'assistant' ? 'Assistant' : 'You'}:</b> {m.text}
            </div>
          ))}
        </div>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the assistant" />
          <Button onClick={sendMessage} disabled={loading || !input}>{loading ? '...' : 'Send'}</Button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;