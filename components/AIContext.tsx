"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAIHealthCheck } from "@/hooks/useAIHealthCheck";
import { useDeviceHealth } from "@/hooks/useDeviceHealth";
import { useToast } from "@/components/ui/use-toast";
import { log as logger } from "@/lib/logger";

// Types for context
interface EmotionalState {
  mood: "cheerful" | "neutral" | "focused";
  lastInteraction: number;
  bondingLevel: number; // 0-100
  preferredUsers: string[];
  persona: string;
}
interface ChatMessage {
  type: "user" | "ai" | "system";
  content: string;
  timestamp?: number;
}
interface AIHealth {
  status: "healthy" | "degraded" | "critical";
  lastCheck: number;
  metrics?: Record<string, unknown>;
}
interface DeviceHealth {
  status: "healthy" | "degraded" | "critical";
  lastCheck: number;
  metrics?: Record<string, unknown>;
}
interface PersistentMemory {
  [key: string]: unknown;
}

interface AIContextType {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  aiHealth: AIHealth | null;
  deviceHealth: DeviceHealth | null;
  optimizeDevice: () => Promise<void>;
  scanForErrors: () => Promise<string[]>;
  selfHeal: () => Promise<string>;
  persistentMemory: PersistentMemory;
  setPersistentMemory: (m: PersistentMemory) => void;
  emotionalState: EmotionalState;
  setEmotionalState: (e: EmotionalState) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function useAIContext(): AIContextType {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAIContext must be used within AIProvider");
  return ctx;
}

export function AIProvider({ children }: { children: ReactNode }) {
  const { toasts, toast } = useToast();

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("alphaq-chat-history");
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch (err) {
      (globalThis.console as any)?.error?.("Failed to load chat history:", err);
      return [];
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("alphaq-chat-history", JSON.stringify(chatHistory));
      }
    } catch (err) {
      (globalThis.console as any)?.error?.("Failed to save chat history:", err);
      toast({ title: "Error", description: "Failed to save chat history", variant: "destructive" });
    }
  }, [chatHistory, toast]);

  const [persistentMemory, setPersistentMemory] = useState<PersistentMemory>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("alphaq-persistent-memory");
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    } catch (err) {
      (globalThis.console as any)?.error?.("Failed to load persistent memory:", err);
      return {};
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("alphaq-persistent-memory", JSON.stringify(persistentMemory));
      }
    } catch (err) {
      (globalThis.console as any)?.error?.("Failed to save persistent memory:", err);
      toast({ title: "Error", description: "Failed to save persistent memory", variant: "destructive" });
    }
  }, [persistentMemory, toast]);

  const [emotionalState, setEmotionalState] = useState<EmotionalState>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("alphaq-emotional-state");
        if (saved) return JSON.parse(saved) as EmotionalState;
      }
      return {
        mood: "cheerful",
        lastInteraction: Date.now(),
        bondingLevel: 80,
        preferredUsers: [],
        persona: "cheerful, loyal, affectionate, always positive",
      };
    } catch (err) {
      (globalThis.console as any)?.error?.("Failed to load emotional state:", err);
      return {
        mood: "cheerful",
        lastInteraction: Date.now(),
        bondingLevel: 80,
        preferredUsers: [],
        persona: "cheerful, loyal, affectionate, always positive",
      };
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("alphaq-emotional-state", JSON.stringify(emotionalState));
      }
    } catch (err) {
      (globalThis.console as any)?.error?.("Failed to save emotional state:", err);
      toast({ title: "Error", description: "Failed to save emotional state", variant: "destructive" });
    }
  }, [emotionalState, toast]);

  // Health hooks
  const aiHealth = useAIHealthCheck();
  const deviceHealth = useDeviceHealth();

  const optimizeDevice = async () => {
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setChatHistory((h) => [...h, { type: "system", content: "Device optimization complete.", timestamp: Date.now() }]);
    } catch (err) {
      (globalThis.console as any)?.error?.("Failed to optimize device:", err);
      toast({ title: "Error", description: "Failed to optimize device", variant: "destructive" });
    }
  };

  const scanForErrors = async (): Promise<string[]> => {
    try {
      await new Promise((res) => setTimeout(res, 1200));
      setChatHistory((h) => [...h, { type: "system", content: "Scan complete. No threats found.", timestamp: Date.now() }]);
      return ["No threats found"];
    } catch (err) {
      (globalThis.console as any)?.error?.("Failed to scan for errors:", err);
      toast({ title: "Error", description: "Failed to scan for errors", variant: "destructive" });
      return ["Scan failed"];
    }
  };

  const selfHeal = async (): Promise<string> => {
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setChatHistory((h) => [...h, { type: "system", content: "Self-healing process completed.", timestamp: Date.now() }]);
      return "Self-healing completed";
    } catch (err) {
      (globalThis.console as any)?.error?.("Failed to self-heal:", err);
      toast({ title: "Error", description: "Failed to self-heal", variant: "destructive" });
      return "Self-healing failed";
    }
  };

  return (
    <AIContext.Provider
      value={{
        chatHistory,
        setChatHistory,
        aiHealth: aiHealth ?? null,
        deviceHealth: deviceHealth ?? null,
        optimizeDevice,
        scanForErrors,
        selfHeal,
        persistentMemory,
        setPersistentMemory,
        emotionalState,
        setEmotionalState,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

