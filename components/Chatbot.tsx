"use client";

import React, { useEffect, useRef, useState } from "react";

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

  const getSessionId = () => {
    if (typeof window === "undefined") return `server-${Date.now()}`;
    try {
      let sid = localStorage.getItem("qmoi_session_id");
      if (!sid) {
        const match = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
        sid = match ? decodeURIComponent(match[1]) : null;
      }
      if (!sid) {
        sid = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem("qmoi_session_id", sid);
        document.cookie = `qmoi_session_id=${encodeURIComponent(sid)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      }
      return sid;
    } catch {
      return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    }
  };

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
          messages: chatHistory.map((item) => ({
            role: item.sender === "user" ? "user" : "assistant",
            content: item.content,
          })),
          input: inputMessage.trim() || "",
          sessionId,
          userId: sessionId,
          context: {
            model: selectedModel,
          },
        }),
      });

      const data = await response.json();
      const replyText =
        data?.response ||
        (Array.isArray(data?.choices) && data.choices[0]?.message?.content) ||
        data?.message ||
        "Sorry, QMOI could not generate a response.";

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: replyText,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, aiMessage]);
      speakText(replyText);
    } catch (error) {
      logger.error("QMOI chat error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "There was a problem sending your message. Please try again.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAttachmentFile(null);
      setAttachmentUrl(null);
      setAttachmentType(null);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-green-600 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-green-400">QMOI Chatbot</h3>
          <p className="text-sm text-slate-300">Powered by QMOI production chat backend.</p>
        </div>
        {setSelectedModel && (
          <select
            value={selectedModel}
            onChange={(event) => setSelectedModel(event.target.value)}
            className="bg-[#222] border border-green-600 text-green-400 px-2 py-1 rounded text-sm"
          >
            <option value="Auto">Auto</option>
            <option value="QMOI">QMOI</option>
            <option value="GPT-4">GPT-4</option>
            <option value="Claude">Claude</option>
          </select>
        )}
      </div>

      <div className="h-64 overflow-y-auto mb-4 space-y-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl p-3 text-sm ${
              message.sender === "user"
                ? "bg-sky-700 text-white self-end ml-auto"
                : "bg-emerald-700 text-white mr-auto"
            }`}
          >
            <div>{message.content}</div>
            {message.attachment && (
              <div className="mt-2 text-xs text-slate-100">
                Attachment: {message.attachment.name}
              </div>
            )}
            <div className="mt-2 text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="rounded-2xl bg-gradient-to-r from-green-700 to-blue-700 p-3 text-sm text-white">
            <div className="font-semibold">QMOI AI is processing...</div>
            <div className="mt-1 text-xs opacity-80">Analyzing context, generating an intelligent response.</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleAttachmentChange}
            disabled={isLoading}
            className="text-xs text-slate-200"
          />
          {attachmentUrl && (
            <span className="text-xs text-slate-300">Attached: {attachmentFile?.name || "file"}</span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(event) => setInputMessage(event.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-w-0 rounded-lg border border-green-600 bg-[#111] px-3 py-2 text-white outline-none focus:border-cyan-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!inputMessage.trim() && !attachmentUrl)}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;

export { Chatbot };



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
