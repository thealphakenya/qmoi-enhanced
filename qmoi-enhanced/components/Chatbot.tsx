"use client";

import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import Image from "next/image";

interface ChatbotProps {
  chatHistory: any[];
  setChatHistory: Dispatch<SetStateAction<any[]>>;
  selectedModel: string;
  setSelectedModel: Dispatch<SetStateAction<string>>;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  chatHistory,
  setChatHistory,
  selectedModel,
  setSelectedModel,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fontSize, setFontSize] = useState<number>(16);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editMessageValue, setEditMessageValue] = useState("");
  const [reactionPickerId, setReactionPickerId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !uploadedFile) return;

    if (editingMessageId !== null) {
      // Save edit
      setChatHistory(
        chatHistory.map((msg) =>
          msg.id === editingMessageId
            ? { ...msg, content: editMessageValue }
            : msg,
        ),
      );
      setEditingMessageId(null);
      setEditMessageValue("");
      setInputMessage("");
      return;
    }

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
      reactions: [],
    };

    let newHistory = [...chatHistory, userMessage];
    // If file uploaded, add to chat
    if (uploadedFile) {
      newHistory.push({
        id: Date.now() + 2,
        content: uploadedFile.type.startsWith("image") ? (
          <img
            src={uploadedFile.url}
            alt={uploadedFile.name}
            className="max-h-32 rounded border mt-2"
          />
        ) : uploadedFile.type.startsWith("audio") ? (
          <audio controls src={uploadedFile.url} className="mt-2" />
        ) : (
          <a
            href={uploadedFile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline mt-2 block"
          >
            {uploadedFile.name}
          </a>
        ),
        sender: "user",
        timestamp: new Date().toISOString(),
        file: uploadedFile,
        reactions: [],
      });
      setUploadedFile(null);
    }
    setChatHistory(newHistory);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          content: `QMOI AI (${selectedModel}): I understand your message: "${inputMessage}"${uploadedFile ? ` and received your file: ${uploadedFile.name}` : ""}. How can I assist you further?`,
          sender: "ai",
          timestamp: new Date().toISOString(),
          reactions: [],
        };
        setChatHistory((prev: any[]) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  // Reaction logic
  const handleAddReaction = (msgId: number, reaction: string) => {
    setChatHistory(
      chatHistory.map((msg) =>
        msg.id === msgId
          ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
          : msg,
      ),
    );
    setReactionPickerId(null);
  };

  // Edit logic
  const handleEditMessage = (msgId: number, content: string) => {
    setEditingMessageId(msgId);
    setEditMessageValue(content);
    setInputMessage(content);
  };

  // Delete logic
  const handleDeleteMessage = (msgId: number) => {
    setChatHistory(chatHistory.filter((msg) => msg.id !== msgId));
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setUploadedFile({
          url: data.url,
          name: file.name,
          type: file.type,
        });
      }
    } catch (err) {
      alert("File upload failed");
    }
    setUploading(false);
  };

  return (
    <div
      className={
        `${theme === "dark" ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} ` +
        `border border-green-600 rounded-lg p-4 mb-4 ` +
        `${highContrast ? "contrast-200" : ""}`
      }
      style={{ fontSize: fontSize }}
      aria-label={
        screenReader ? "QMOI Chatbot. Accessible chat interface." : undefined
      }
    >
      {/* Settings Bar */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-green-400">QMOI Chatbot</h3>
        <div className="flex gap-2 items-center">
          <label className="text-xs">
            Theme:
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "dark" | "light")}
              className="ml-1 bg-[#222] border border-green-600 text-green-400 px-1 py-0.5 rounded text-xs"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <label className="text-xs">
            Font:
            <input
              type="range"
              min={12}
              max={24}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="ml-1 align-middle"
              aria-label="Font size"
            />
          </label>
          <label className="text-xs flex items-center gap-1">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              aria-label="High contrast mode"
            />{" "}
            High Contrast
          </label>
          <label className="text-xs flex items-center gap-1">
            <input
              type="checkbox"
              checked={screenReader}
              onChange={(e) => setScreenReader(e.target.checked)}
              aria-label="Screen reader label"
            />{" "}
            Screen Reader
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-[#222] border border-green-600 text-green-400 px-2 py-1 rounded text-sm"
          >
            <option value="Auto">Auto</option>
            <option value="GPT-4">GPT-4</option>
            <option value="Claude">Claude</option>
            <option value="QMOI">QMOI</option>
          </select>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`relative p-3 rounded-lg ${
              message.sender === "user"
                ? "bg-blue-600 text-white ml-8"
                : "bg-green-700 text-white mr-8"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="text-sm flex-1">
                {editingMessageId === message.id ? (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={editMessageValue}
                      onChange={(e) => setEditMessageValue(e.target.value)}
                      className="flex-1 bg-[#222] border border-green-600 text-white px-2 py-1 rounded"
                    />
                    <button
                      type="submit"
                      className="bg-green-600 px-2 py-1 rounded text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMessageId(null);
                        setEditMessageValue("");
                        setInputMessage("");
                      }}
                      className="bg-gray-600 px-2 py-1 rounded text-white"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  message.content
                )}
              </div>
              {/* Reactions */}
              <div className="flex items-center gap-1">
                {message.reactions &&
                  message.reactions.map((r: string, i: number) => (
                    <span key={i} className="text-lg">
                      {r}
                    </span>
                  ))}
                <button
                  className="text-xs bg-gray-700 px-1 rounded hover:bg-green-700"
                  onClick={() => setReactionPickerId(message.id)}
                  title="React"
                >
                  😊
                </button>
                {reactionPickerId === message.id && (
                  <div className="absolute z-10 bg-white text-black rounded shadow p-1 flex gap-1 top-8 right-0">
                    {["👍", "❤️", "😂", "😮", "😢", "👏"].map((r) => (
                      <button
                        key={r}
                        onClick={() => handleAddReaction(message.id, r)}
                        className="hover:bg-gray-200 rounded px-1"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Edit/Delete for user messages */}
              {message.sender === "user" && editingMessageId !== message.id && (
                <>
                  <button
                    className="text-xs bg-yellow-600 px-1 rounded ml-1 hover:bg-yellow-700"
                    onClick={() =>
                      handleEditMessage(
                        message.id,
                        typeof message.content === "string"
                          ? message.content
                          : "",
                      )
                    }
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="text-xs bg-red-600 px-1 rounded ml-1 hover:bg-red-700"
                    onClick={() => handleDeleteMessage(message.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
            <div className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-green-700 text-white p-3 rounded-lg mr-8">
            <div className="text-sm">QMOI AI is thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          type="text"
          value={editingMessageId !== null ? editMessageValue : inputMessage}
          onChange={(e) => {
            if (editingMessageId !== null) setEditMessageValue(e.target.value);
            else setInputMessage(e.target.value);
          }}
          placeholder={
            editingMessageId !== null
              ? "Edit your message..."
              : "Type your message..."
          }
          className="flex-1 bg-[#222] border border-green-600 text-white px-3 py-2 rounded"
          disabled={isLoading}
        />
        <input
          type="file"
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          disabled={uploading || isLoading}
          className="text-sm text-green-400"
        />
        <button
          type="submit"
          disabled={
            isLoading ||
            uploading ||
            (editingMessageId !== null
              ? !editMessageValue.trim()
              : !inputMessage.trim() && !uploadedFile)
          }
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
        >
          {editingMessageId !== null
            ? "Save"
            : uploading
              ? "Uploading..."
              : "Send"}
        </button>
        {editingMessageId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingMessageId(null);
              setEditMessageValue("");
              setInputMessage("");
            }}
            className="bg-gray-600 text-white px-3 py-2 rounded ml-2"
          >
            Cancel
          </button>
        )}
      </form>
      {uploadedFile && (
        <div className="mt-2">
          <span className="text-xs text-green-300">
            Ready to send: {uploadedFile.name}
          </span>
          {uploadedFile.type.startsWith("image") && (
            <img
              src={uploadedFile.url}
              alt={uploadedFile.name}
              className="max-h-32 rounded border mt-2"
            />
          )}
          {uploadedFile.type.startsWith("audio") && (
            <audio controls src={uploadedFile.url} className="mt-2" />
          )}
          {!(
            uploadedFile.type.startsWith("image") ||
            uploadedFile.type.startsWith("audio")
          ) && (
            <a
              href={uploadedFile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline mt-2 block"
            >
              {uploadedFile.name}
            </a>
          )}
        </div>
      )}
    </div>
  );
};
