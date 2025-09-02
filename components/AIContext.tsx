import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAIHealthCheck } from "../hooks/useAIHealthCheck";
import { useDeviceHealth } from "../hooks/useDeviceHealth";
import { useToast } from "@/components/ui/use-toast";

// Types for context
interface EmotionalState {
  mood: 'cheerful' | 'neutral' | 'focused';
  lastInteraction: number;
  bondingLevel: number; // 0-100
  preferredUsers: string[];
  persona: string;
}

interface ChatMessage {
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp?: number;
}

interface AIHealth {
  status: 'healthy' | 'degraded' | 'critical';
  lastCheck: number;
  metrics: {
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

interface DeviceHealth {
  status: 'healthy' | 'degraded' | 'critical';
  lastCheck: number;
  metrics: {
    temperature: number;
    batteryLevel: number;
    networkStatus: string;
  };
}

interface PersistentMemory {
  [key: string]: any;
}

interface AIContextType {
  chatHistory: ChatMessage[];
  setChatHistory: (h: ChatMessage[]) => void;
  aiHealth: AIHealth;
  deviceHealth: DeviceHealth;
  optimizeDevice: () => Promise<void>;
  scanForErrors: () => Promise<string[]>;
  selfHeal: () => Promise<string>;
  persistentMemory: PersistentMemory;
  setPersistentMemory: (m: PersistentMemory) => void;
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
  const { toast } = useToast();

  // Shared chat history with error handling
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('alphaq-chat-history');
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('alphaq-chat-history', JSON.stringify(chatHistory));
      }
    } catch (error) {
      console.error('Failed to save chat history:', error);
      toast({
        title: 'Error',
        description: 'Failed to save chat history',
        variant: 'destructive'
      });
    }
  }, [chatHistory, toast]);

  // Persistent memory with error handling
  const [persistentMemory, setPersistentMemory] = useState<PersistentMemory>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('alphaq-persistent-memory');
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    } catch (error) {
      console.error('Failed to load persistent memory:', error);
      return {};
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('alphaq-persistent-memory', JSON.stringify(persistentMemory));
      }
    } catch (error) {
      console.error('Failed to save persistent memory:', error);
      toast({
        title: 'Error',
        description: 'Failed to save persistent memory',
        variant: 'destructive'
      });
    }
  }, [persistentMemory, toast]);

  // Emotional state with error handling
  const [emotionalState, setEmotionalState] = useState<EmotionalState>(() => {
    try {
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
    } catch (error) {
      console.error('Failed to load emotional state:', error);
      return {
        mood: 'cheerful',
        lastInteraction: Date.now(),
        bondingLevel: 80,
        preferredUsers: ['Victor Kwemoi Simotwo', 'Leah Chebet Simotwo'],
        persona: 'cheerful, loyal, affectionate, always positive',
      };
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('alphaq-emotional-state', JSON.stringify(emotionalState));
      }
    } catch (error) {
      console.error('Failed to save emotional state:', error);
      toast({
        title: 'Error',
        description: 'Failed to save emotional state',
        variant: 'destructive'
      });
    }
  }, [emotionalState, toast]);

  // Device/AI health hooks
  const aiHealth = useAIHealthCheck();
  const deviceHealth = useDeviceHealth();

  // Device optimization with proper error handling
  const optimizeDevice = async () => {
    try {
      // Simulate optimization (replace with real logic)
      await new Promise(res => setTimeout(res, 1000));
      setChatHistory(h => [...h, { type: 'system', content: 'Device optimization complete.' }]);
    } catch (error) {
      console.error('Failed to optimize device:', error);
      toast({
        title: 'Error',
        description: 'Failed to optimize device',
        variant: 'destructive'
      });
    }
  };

  // Error/virus scan with proper error handling
  const scanForErrors = async () => {
    try {
      // Simulate scan (replace with real logic)
      await new Promise(res => setTimeout(res, 1200));
      setChatHistory(h => [...h, { type: 'system', content: 'Scan complete. No threats found.' }]);
      return ['No threats found'];
    } catch (error) {
      console.error('Failed to scan for errors:', error);
      toast({
        title: 'Error',
        description: 'Failed to scan for errors',
        variant: 'destructive'
      });
      return ['Scan failed'];
    }
  };

  // Self-healing with proper error handling
  const selfHeal = async () => {
    try {
      // Simulate self-healing (replace with real logic)
      await new Promise(res => setTimeout(res, 1500));
      setChatHistory(h => [...h, { type: 'system', content: 'Self-healing process completed.' }]);
      return 'Self-healing completed';
    } catch (error) {
      console.error('Failed to self-heal:', error);
      toast({
        title: 'Error',
        description: 'Failed to self-heal',
        variant: 'destructive'
      });
      return 'Self-healing failed';
    }
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
