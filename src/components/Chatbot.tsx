"use client";
import React, { useState, useRef, useEffect } from "react";
import { playSSML, supportsSpeechSynthesis } from "../services/tts";
import "./Chatbot.css";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm the QMOI AI Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Call model endpoint and _request speak (SSML) when supported
    try {
      const wantSpeak = supportsSpeechSynthesis();
      const { postModel } = await import("../services/qmoiApi");
      const data = await postModel({
        user: "local",
        message: input,
        speak: wantSpeak,
      });
      const dataAny = data as unknown;
      let replyText = "";
      if (dataAny && dataAny.reply) replyText = dataAny.reply;
      else if (
        dataAny &&
        dataAny.choices &&
        Array.isArray(dataAny.choices) &&
        dataAny.choices[0]
      ) {
        replyText =
          dataAny.choices[0].message?.content || dataAny.choices[0]?.text || "";
      } else {
        replyText = "Sorry, I could not get a reply.";
      }
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Best-effort: report updated conversation length to QMOI memory API
      try {
        fetch("/api/qmoi/memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessions: {
              local: {
                conversations: (messages.length || 0) + 2,
                last_prompt: input,
              },
            },
          }),
        }).catch(() => {});
      } catch (_e) {
        // ignore best-effort failure
      }

      // Play SSML if provided
      if (dataAny && dataAny.ssml) {
        // best-effort playback
        playSSML(dataAny.ssml);
      }
    } catch (_err) {
      void _err;
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Error: could not reach QMOI backend",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>QMOI AI Chat</h2>
        <span className="status-badge">Ready</span>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.sender}`}>
            <div className="message-content">{msg.text}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-bot loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(_e) => setInput(_e.target.value)}
          onKeyPress={(_e) => _e.key === "Enter" && handleSendMessage()}
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-26T18:54:41.346996Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:34.382695Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.574272Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.602757Z
