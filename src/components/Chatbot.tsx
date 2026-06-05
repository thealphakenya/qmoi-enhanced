"use client";
import React, { useEffect, useRef, useState } from "react";
import { getSessionId } from "@/services/qmoiSession";

export interface ChatMessage {
  id: string | number;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
  attachment?: {
    url: string;
    type: string;
    name: string;
  };
}

interface ChatbotProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  selectedModel?: string;
  setSelectedModel?: (model: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({
  chatHistory,
  setChatHistory,
  selectedModel = "Auto",
  setSelectedModel,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakResponses, setSpeakResponses] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("speakResponses") === "true";
    } catch {
      return false;
    }
  });
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentType, setAttachmentType] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("speakResponses", String(speakResponses));
      }
    } catch {
      // ignore storage failures
    }
  }, [speakResponses]);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !speakResponses) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => void 0;
    utterance.onerror = () => void 0;
    synth.cancel();
    synth.speak(utterance);
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setAttachmentFile(null);
      setAttachmentUrl(null);
      setAttachmentType(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setAttachmentFile(file);
    setAttachmentUrl(url);
    setAttachmentType(file.type || "application/octet-stream");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputMessage.trim() && !attachmentUrl) return;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim() || "[Attachment]",
      sender: "user",
      timestamp: new Date().toISOString(),
      attachment:
        attachmentUrl && attachmentType
          ? {
              url: attachmentUrl,
              type: attachmentType,
              name: attachmentFile?.name || "attachment",
            }
          : undefined,
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const sessionId = getSessionId();
      const response = await fetch("/api/qmoi/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-QMOI-SESSION": sessionId,
        },
        body: JSON.stringify({
          message: userMessage.content,
          attachment: userMessage.attachment,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chatbot request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: data?.message || "No response received.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, aiMessage]);
      speakText(aiMessage.content);
    } catch (error) {
      console.error?.("Chatbot submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3 className="text-lg font-semibold text-green-400">QMOI Chatbot</h3>
      </div>
      <div className="chatbot-body">
        <div className="chatbot-messages">
          {chatHistory.map((message) => (
            <div key={message.id} className={`chat-message ${message.sender}`}>
              <p>{message.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="chatbot-form">
          <textarea
            value={inputMessage}
            onChange={(event) => setInputMessage(event.target.value)}
            placeholder="Type your message..."
            className="chatbot-input"
          />
          <button type="submit" disabled={isLoading} className="chatbot-send-button">
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
export { Chatbot };
