import { useCallback, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  audioUrl?: string;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  addMessage: (role: "user" | "assistant", content: string) => void;
}

export function useQMOIChat(userId?: string): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback(
    (role: "user" | "assistant", content: string) => {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        role,
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, message]);
    },
    [],
  );

  const sendMessage = useCallback(
    async (userInput: string) => {
      if (!userInput.trim()) return;

      setError(null);
      setIsLoading(true);

      addMessage("user", userInput);

      try {
        const response = await fetch("/api/qmoi/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: userInput,
            userId: userId || "anonymous-user",
            sessionId: `session-${userId || "anonymous"}`,
            context: {
              timestamp: new Date().toISOString(),
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const message = errorData?.error || `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(message);
        }

        const data = await response.json();
        const assistantMessage =
          data.message || data.choices?.[0]?.message?.content || "Unable to process request";

        addMessage("assistant", assistantMessage);
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Chat error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, userId],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    addMessage,
  };
}
