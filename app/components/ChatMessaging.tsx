"use client";

import React, { useEffect, useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatMessagingProps {
  title?: string;
}

export default function ChatMessaging({ title = "Chat Messaging" }: ChatMessagingProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<any>(null);

  useEffect(() => {
    let active = true;

    async function loadModelStatus() {
      try {
        const res = await fetch("/api/qmoi-model", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        setModelStatus(data);
      } catch (error) {
        console.error("Failed to load QMOI model status:", error);
      }
    }

    loadModelStatus();
    return () => {
      active = false;
    };
  }, []);

  const handleSendMessage = async () => {
    const input = chatMessage.trim();
    if (!input) return;

    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", content: input }]);
    setChatMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/qmoi/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, userId: "chat-messaging-component", model: "qmoi-prod" }),
      });

      const result = await response.json();
      const answer = result?.response || result?.message || "No response from QMOI AI.";

      setMessages((current) => [
        ...current,
        { id: `assistant-${Date.now()}`, role: "assistant", content: answer },
      ]);
    } catch (error) {
      console.error("QMOI messaging failed:", error);
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Unable to reach the QMOI service. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-slate-400">Powered by the QMOI model backend for production chat, task orchestration, and incident response.</p>
        </div>
        {modelStatus?.success && (
          <div className="rounded-2xl bg-slate-950/90 px-4 py-2 text-slate-300">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">QMOI Model</div>
            <div className="text-sm font-semibold text-white">{modelStatus.model || "qmoi-prod"}</div>
            <div className="text-xs text-slate-400">{modelStatus.status || "ready"}</div>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-3xl bg-slate-950 p-4 text-slate-300">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1.5fr_0.5fr]">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask QMOI for assistance..."
              className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500"
            >
              Send
            </button>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Conversation history</div>
          <div className="max-h-80 overflow-y-auto rounded-2xl bg-slate-950 p-4">
            {messages.length === 0 ? (
              <div className="text-slate-500">Start a conversation with QMOI in this chat panel.</div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl p-4 ${message.role === "user" ? "bg-slate-800 text-white self-end" : "bg-slate-900 text-slate-100 self-start"}`}
                  >
                    <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {message.role === "user" ? "You" : message.role === "assistant" ? "QMOI" : "System"}
                    </div>
                    <div>{message.content}</div>
                  </div>
                ))}
              </div>
            )}
            {isLoading && <div className="mt-3 text-slate-400">QMOI is composing a response...</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
