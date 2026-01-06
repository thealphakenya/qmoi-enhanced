// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMaster } from "./MasterContext";

interface ChatbotProps {
  chatHistory: unknown[];
  setChatHistory: (history: unknown[] | ((prev: unknown[]) => any[])) => void;
  // Model selection is deprecated and optional — the system enforces 'qmoi' as canonical
  selectedModel?: string;
  setSelectedModel?: (model: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({
  chatHistory,
  setChatHistory,
  selectedModel,
  setSelectedModel,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const { isMaster } = useMaster();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [speakResponses, setSpeakResponses] = useState<boolean>(() => {
    try {
      if (typeof window !== "undefined")
        return localStorage.getItem("speakResponses") === "true";
      return false;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined")
        localStorage.setItem("speakResponses", String(speakResponses));
    } catch (e) {}
  }, [speakResponses]);

  const [profileName, setProfileName] = useState<string | null>(null);

  const fetchProfile = async (sessionId?: string) => {
    try {
      const resp = await fetch("/api/qmoi/memory");
      if (!resp.ok) return;
      const data = await resp.json();
      const sid =
        sessionId ||
        (typeof window !== "undefined"
          ? localStorage.getItem("qmoi_session_id")
          : null) ||
        "anon";
      const name = data?.profiles?.[sid]?.name || null;
      setProfileName(name);
    } catch (e) {}
  };

  useEffect(() => {
    try {
      const sid =
        typeof window !== "undefined"
          ? localStorage.getItem("qmoi_session_id")
          : null;
      fetchProfile(sid || undefined);
    } catch (e) {}
  }, []);

  const speakText = (text: string) => {
    try {
      if (typeof window === "undefined" || !speakResponses) return;
      const synth = window.speechSynthesis;
      if (!synth) return;
      const utter = new SpeechSynthesisUtterance(text);
      synth.cancel();
      setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      synth.speak(utter);
    } catch (e) {
      console.warn("TTS error", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Build messages context from chatHistory + current user message
      const messages = [
        // include system persona if master
        ...(isMaster ? [{ role: "system", content: "master" }] : []),
        ...chatHistory.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content || m.text,
        })),
        { role: "user", content: inputMessage },
      ];

      // Call the proxy Next API which enforces model 'qmoi'
      // ensure session id persisted
      let sessionId = null;
      try {
        sessionId = localStorage.getItem("qmoi_session_id");
      } catch (e) {}
      if (!sessionId) {
        sessionId =
          String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);
        try {
          localStorage.setItem("qmoi_session_id", sessionId);
        } catch (e) {}
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (sessionId) headers["X-QMOI-SESSION"] = sessionId;
      if (isMaster) headers["X-QMOI-ROLE"] = "master";

      const res = await fetch("/api/qmoi/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ messages, sessionId }),
      });

      if (!res.ok) throw new Error("qmoi request failed");
      const data = await res.json();

      // Extract assistant reply content from OpenAI-like response
      let replyText = "";
      try {
        replyText = data?.choices?.[0]?.message?.content ?? (data.reply || "");
      } catch (e) {
        replyText = data?.reply || "";
      }

      const aiResponse = {
        id: Date.now() + 1,
        content: replyText,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      // If assistant offered numbered choices, mark session as awaiting choice
      try {
        const lower = (replyText || "").toLowerCase();
        if (
          lower.includes("would you like") ||
          /\(1\)|\(2\)|\(3\)/.test(replyText)
        ) {
          // notify server to mark session awaiting_choice
          fetch("/api/qmoi/memory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessions: {
                [sessionId]: { awaiting_choice: true, last_prompt: replyText },
              },
            }),
          }).catch(() => {});
        }
      } catch (e) {}

      setChatHistory((prev) => [...prev, aiResponse]);

      // speak if enabled
      speakText(replyText);

      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-green-600 rounded-lg p-4 mb-4 qmoi-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-400">
          QMOI Chatbot {profileName ? `— ${profileName}` : ""}
        </h3>
        <div className="flex items-center gap-3">
          <div className="bg-[#222] border border-green-600 text-green-400 px-2 py-1 rounded text-sm">
            Model: <strong>qmoi</strong>
          </div>
          <button
            title={speakResponses ? "Disable speech" : "Enable speech"}
            onClick={() => setSpeakResponses((s) => !s)}
            className={`px-2 py-1 rounded text-sm ${
              speakResponses
                ? "bg-green-600 text-white"
                : "bg-[#222] text-green-400 border border-green-600"
            }`}
          >
            🔊 {speakResponses ? "On" : "Off"}
          </button>
          {isSpeaking && (
            <div className="text-xs text-yellow-300">Speaking...</div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.sender === "user"
                ? "bg-blue-600 text-white ml-8"
                : "bg-green-700 text-white mr-8"
            }`}
          >
            <div className="text-sm">{message.content}</div>
            <div className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="bg-gradient-to-r from-green-700 to-blue-700 text-white p-4 rounded-lg mr-8 border border-green-500 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <div className="text-sm font-semibold">
                QMOI AI is processing...
              </div>
            </div>
            <div className="text-xs opacity-90 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Analyzing context and intent</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span>Generating intelligent response</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <span>Applying consciousness and learning</span>
              </div>
            </div>
            <div className="mt-2 text-xs opacity-75">
              Enhanced QMOI processing with superior intelligence...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-[#222] border border-green-600 text-white px-3 py-2 rounded"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
