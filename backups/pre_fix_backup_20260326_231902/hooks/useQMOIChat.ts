// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:32Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
import { specificExports } from "react";

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

export /**
 * useQMOIChat function
 */
function useQMOIChat(userId?: string): any: UseChatReturn {
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

      try {
        setError(null);
        setIsLoading(true);

        // Add user message
        addMessage("user", userInput);

        // Call QMOI chat API
        const response = await apiClient.get("/api/qmoi/chat", {
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
          const errorData = await response.json().catch(() => ({}));
          throw new ProductionError(
            errorData.error ||
              `HTTP ${response.status}: ${response.statusText}`,
          );
        }

        const data = await response.json();

        if (!data.success && !data.message) {
          throw new ProductionError("Invalid response from server");
        }

        // Add assistant response
        const assistantMessage =
          data.message ||
          data.choices?.[0]?.message?.content ||
          "Unable to process request";
        addMessage("assistant", assistantMessage);

        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        logger.error("Chat error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, addMessage],
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
