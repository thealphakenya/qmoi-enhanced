import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAIHealthCheck } from "../hooks/useAIHealthCheck";
import { useDeviceHealth } from "../hooks/useDeviceHealth";

// Types for context
interface EmotionalState {
  mood: 'cheerful' | 'neutral' | 'focused';
  lastInteraction: number;
  bondingLevel: number; // 0-100
  preferredUsers: string[];
  persona: string;
}
interface AIContextType {
  chatHistory: any[];
  setChatHistory: (h: any[]) => void;
  aiHealth: any;
  deviceHealth: any;
  optimizeDevice: () => Promise<void>;
  scanForErrors: () => Promise<string[]>;
  selfHeal: () => Promise<string>;
  persistentMemory: any;
  setPersistentMemory: (m: any) => void;
  emotionalState: EmotionalState;
  setEmotionalState: (e: EmotionalState) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function useAIContext() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAIContext must be used within AIProvider");
  return ctx;
}

export function AIProvider({ children }: { children: ReactNode }) {
  // Shared chat history
  const [chatHistory, setChatHistory] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alphaq-chat-history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alphaq-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Persistent memory (for all chat UIs)
  const [persistentMemory, setPersistentMemory] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alphaq-persistent-memory');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alphaq-persistent-memory', JSON.stringify(persistentMemory));
    }
  }, [persistentMemory]);

  // Emotional state and bonding protocol
  const [emotionalState, setEmotionalState] = useState<EmotionalState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alphaq-emotional-state');
      if (saved) return JSON.parse(saved);
    }
    return {
      mood: 'cheerful',
      lastInteraction: Date.now(),
      bondingLevel: 80,
      preferredUsers: ['Victor Kwemoi Simotwo', 'Leah Chebet Simotwo'],
      persona: 'cheerful, loyal, affectionate, always positive',
    };
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alphaq-emotional-state', JSON.stringify(emotionalState));
    }
  }, [emotionalState]);

  // Device/AI health hooks
  const aiHealth = useAIHealthCheck();
  const deviceHealth = useDeviceHealth();

  // Device optimization
  const optimizeDevice = async () => {
    // Simulate optimization (replace with real logic)
    await new Promise(res => setTimeout(res, 1000));
    setChatHistory(h => [...h, { type: 'system', content: 'Device optimization complete.' }]);
  };
  // Error/virus scan
  const scanForErrors = async () => {
    // Simulate scan (replace with real logic)
    await new Promise(res => setTimeout(res, 1200));
    setChatHistory(h => [...h, { type: 'system', content: 'Scan complete. No threats found.' }]);
    return ['No threats found'];
  };
  // Self-healing
  const selfHeal = async () => {
    // Simulate self-healing (replace with real logic)
    await new Promise(res => setTimeout(res, 1500));
    setChatHistory(h => [...h, { type: 'system', content: 'Self-healing process completed.' }]);
    return 'Self-healing completed';
  };

  return (
    <AIContext.Provider value={{
      chatHistory, setChatHistory,
      aiHealth, deviceHealth,
      optimizeDevice, scanForErrors, selfHeal,
      persistentMemory, setPersistentMemory,
      emotionalState, setEmotionalState
    }}>
      {children}
    </AIContext.Provider>
  );
}
