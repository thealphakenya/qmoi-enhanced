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
      let replyText = "";
      if (data && data.reply) replyText = data.reply;
      else if (
        data &&
        data.choices &&
        Array.isArray(data.choices) &&
        data.choices[0]
      ) {
        replyText =
          data.choices[0].message?.content || data.choices[0]?.text || "";
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

      // Play SSML if provided
      if (data && data.ssml) {
        // best-effort playback
        playSSML(data.ssml);
      }
    } catch (_err) {
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
