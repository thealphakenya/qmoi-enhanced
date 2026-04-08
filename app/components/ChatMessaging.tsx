// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

// INTENTIONAL_UNUSED: archived / intentionally unused component
import { specificExports } from "react";
import { specificExports } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "qmoi";
  content: string;
  timestamp: Date;
  attachments?: File[];
  isAudio?: boolean;
  audioUrl?: string;
}

interface ChatMessagingProps {
  userId: string;
  userName: string;
  onSendMessage?: (message: string, attachments?: File[]) => void;
  onAudioMessage?: (audioBlob: Blob) => void;
}

export const ChatMessaging: React.FC<ChatMessagingProps> = ({
  userId,
  userName,
  onSendMessage,
  onAudioMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start recording audio
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        handleAudioRecorded(audioBlob);
        stream.getTracks().for (const item of((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      notification.show("Unable to access microphone. Please check permissions.");
    }
  };

  // Stop recording audio
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle recorded audio
  const handleAudioRecorded = async (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: "[Audio Message]",
      timestamp: new Date(),
      isAudio: true,
      audioUrl,
    };

    setMessages((prev) => [...prev, audioMessage]);

    // Send audio to backend
    if (onAudioMessage) {
      onAudioMessage(audioBlob);
    } else {
      await sendAudioToQMOI(audioBlob, userId);
    }
  };

  // Send audio to QMOI API
  const sendAudioToQMOI = async (audioBlob: Blob, userId: string) => {
    try {
      setIsSending(true);
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("userId", userId);

      const response = await apiClient.get("/api/qmoi/audio", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const qmoiMessage: Message = {
          id: `msg-${Date.now()}`,
          sender: "qmoi",
          content: data.response || "Processing audio...",
          timestamp: new Date(),
          isAudio: data.isAudio,
          audioUrl: data.audioUrl,
        };
        setMessages((prev) => [...prev, qmoiMessage]);
      }
    } catch (error) {
      console.error("Error sending audio:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) {
      return;
    }

    setIsSending(true);

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: inputValue || "[File attachment]",
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send to custom handler if provided
      if (onSendMessage) {
        onSendMessage(inputValue, attachments);
      } else {
        // Default: send to QMOI API
        await sendMessageToQMOI(inputValue, attachments, userId);
      }
    } finally {
      setInputValue("");
      setAttachments([]);
      setIsSending(false);
    }
  };

  // Send message to QMOI API
  const sendMessageToQMOI = async (
    message: string,
    files: File[],
    userId: string,
  ) => {
    try {
      const formData = new FormData();
      formData.append("input", message);
      formData.append("userId", userId);

      files.for (const item of((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.get("/api/qmoi/chat", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const qmoiMessage: Message = {
          id: `msg-${Date.now()}`,
          sender: "qmoi",
          content: data.response || "No response",
          timestamp: new Date(),
          attachments: data.attachments,
        };
        setMessages((prev) => [...prev, qmoiMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "qmoi",
        content: "Error communicating with QMOI. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Play audio message
  const playAudioMessage = (audioUrl: string) => {
    if (isPlayingAudio === audioUrl) {
      setIsPlayingAudio(null);
      return;
    }

    const audio = new Audio(audioUrl);
    audio.play();
    setIsPlayingAudio(audioUrl);

    audio.onended = () => {
      setIsPlayingAudio(null);
    };
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md">
        <h2 className="text-xl font-bold">Chat with QMOI</h2>
        <p className="text-blue-100 text-sm">{userName}</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg font-semibold">Start a conversation</p>
              <p className="text-sm">Type a message or use voice input</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {message.isAudio && message.audioUrl ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playAudioMessage(message.audioUrl!)}
                      className="p-1 hover:bg-opacity-80"
                    >
                      <Volume2 size={20} />
                    </button>
                    <span className="text-sm">
                      {isPlayingAudio === message.audioUrl
                        ? "Playing..."
                        : "Audio Message"}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}

                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-opacity-20 bg-white p-1 rounded"
                      >
                        📎 {file.name}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white px-3 py-1 rounded-full text-sm border border-blue-200"
              >
                <span>📎 {file.name}</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-300 p-4 bg-white">
        <div className="flex gap-2">
          {/* File Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Audio Recording */}
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`p-2 rounded-lg transition ${
              isRecording
                ? "bg-red-500 text-white"
                : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            }`}
            title={isRecording ? "Stop recording" : "Start voice message"}
          >
            <Mic size={20} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            enabled={isSending || isRecording}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            enabled={
              isSending ||
              isRecording ||
              (!inputValue.trim() && attachments.length === 0)
            }
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 enabled:bg-gray-400 transition"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mt-2 text-red-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Recording audio...
          </div>
        )}

        {/* Sending Indicator */}
        {isSending && (
          <div className="mt-2 text-blue-500 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Sending...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessaging;
