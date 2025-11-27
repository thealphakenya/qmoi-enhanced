"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { avatarsConfig, voiceProfiles } from "./avatarsConfig";

interface QMOIState {
  // Avatar State
  currentAvatar: string;
  avatarQuality: string;
  avatarEngine: string;

  // Voice State
  currentVoice: string;
  voiceQuality: string;
  voiceVolume: number;

  // Mood & Personality
  mood:
    | "friendly"
    | "happy"
    | "focused"
    | "curious"
    | "excited"
    | "calm"
    | "professional"
    | "playful"
    | "wise";
  energy: number; // 0-100
  personality:
    | "friendly"
    | "professional"
    | "creative"
    | "analytical"
    | "helpful"
    | "enthusiastic";

  // System State
  isOnline: boolean;
  isProcessing: boolean;
  currentTask: string | null;
  systemHealth: "excellent" | "good" | "fair" | "poor";

  // User Preferences
  autoUpgrade: boolean;
  autoEnhance: boolean;
  dataSaver: boolean;

  // Performance Metrics
  responseTime: number;
  accuracy: number;
  userSatisfaction: number;
}

interface QMOIContextType {
  state: QMOIState;
  updateAvatar: (avatarId: string) => Promise<void>;
  updateVoice: (voiceId: string) => Promise<void>;
  updateMood: (mood: QMOIState["mood"]) => void;
  updateEnergy: (energy: number) => void;
  updatePersonality: (personality: QMOIState["personality"]) => void;
  updateSystemHealth: (health: QMOIState["systemHealth"]) => void;
  updateUserPreferences: (
    preferences: Partial<
      Pick<QMOIState, "autoUpgrade" | "autoEnhance" | "dataSaver">
    >,
  ) => void;
  getAvatarInfo: (avatarId: string) => any;
  getVoiceInfo: (voiceId: string) => any;
  getCompatibleVoice: (avatarId: string) => string;
  getCompatibleAvatar: (voiceId: string) => string;
}

const QMOIContext = createContext<QMOIContextType | undefined>(undefined);

interface QMOIStateProviderProps {
  children: ReactNode;
}

export function QMOIStateProvider({ children }: QMOIStateProviderProps) {
  const [state, setState] = useState<QMOIState>({
    // Avatar State
    currentAvatar: "default",
    avatarQuality: "enhanced",
    avatarEngine: "eva3d-sadtalker",

    // Voice State
    currentVoice: "professional-male",
    voiceQuality: "enhanced",
    voiceVolume: 80,

    // Mood & Personality
    mood: "friendly",
    energy: 85,
    personality: "helpful",

    // System State
    isOnline: true,
    isProcessing: false,
    currentTask: null,
    systemHealth: "excellent",

    // User Preferences
    autoUpgrade: true,
    autoEnhance: true,
    dataSaver: false,

    // Performance Metrics
    responseTime: 150,
    accuracy: 98.5,
    userSatisfaction: 95,
  });

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("qmoi-state");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState((prevState: QMOIState) => ({ ...prevState, ...parsedState }));
      } catch (error) {
        console.error("Error loading QMOI state:", error);
      }
    }
  }, []);

  // Persist state to localStorage with debounce; guard for SSR
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("qmoi-state", JSON.stringify(state));
        }
      } catch (err) {
        console.warn("Failed to persist QMOI state:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [state]);

  // Keep a ref to the latest state to avoid stale closures in async callbacks
  const stateRef = useRef<QMOIState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Auto-update mood based on time and activity
  useEffect(() => {
    const updateMoodByTime = () => {
      const hour = new Date().getHours();
      let newMood: QMOIState["mood"] = "friendly";

      if (hour < 6) newMood = "calm";
      else if (hour < 12) newMood = "excited";
      else if (hour < 18) newMood = "focused";
      else if (hour < 22) newMood = "professional";
      else newMood = "calm";

      setState((prev) => ({ ...prev, mood: newMood }));
    };

    updateMoodByTime();
    const interval = setInterval(updateMoodByTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const updateAvatar = async (avatarId: string) => {
    try {
      setState((prev: QMOIState) => ({
        ...prev,
        isProcessing: true,
        currentTask: "Switching avatar...",
      }));
      // Call API to switch avatar (use safeFetch with timeout)
      const response = await safeFetch(
        "/api/qmoi/avatars",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "switch", avatarId }),
        },
        10000,
      );

      if (!response.ok) throw new Error("Failed to switch avatar");

      const avatar = avatarsConfig.find((a) => a.id === avatarId);
      setState((prev: QMOIState) => ({
        ...prev,
        currentAvatar: avatarId,
        avatarQuality: avatar?.qualityLevel || "enhanced",
        avatarEngine: avatar?.animationEngine || "eva3d-sadtalker",
        isProcessing: false,
        currentTask: null,
      }));

      // Auto-switch to compatible voice if available
      const compatibleVoice = getCompatibleVoice(avatarId);
      if (compatibleVoice && compatibleVoice !== stateRef.current.currentVoice) {
        await updateVoice(compatibleVoice);
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      setState((prev: QMOIState) => ({ ...prev, isProcessing: false, currentTask: null }));
    }
  };

  const updateVoice = async (voiceId: string) => {
    try {
      setState((prev: QMOIState) => ({
        ...prev,
        isProcessing: true,
        currentTask: "Switching voice...",
      }));
      // Call API to switch voice (safeFetch with timeout)
      const response = await safeFetch(
        "/api/qmoi/voice-profiles",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "switch", voiceId }),
        },
        10000,
      );

      if (!response.ok) throw new Error("Failed to switch voice");

      const voice = voiceProfiles.find((v) => v.id === voiceId);
      setState((prev: QMOIState) => ({
        ...prev,
        currentVoice: voiceId,
        voiceQuality: voice?.quality || "enhanced",
        isProcessing: false,
        currentTask: null,
      }));
    } catch (error) {
      console.error("Error updating voice:", error);
      setState((prev: QMOIState) => ({ ...prev, isProcessing: false, currentTask: null }));
    }
  };

  // Helper: safeFetch with abort and timeout
  async function safeFetch(
    input: RequestInfo,
    init?: RequestInit,
    timeout = 10000,
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(input, { ...(init || {}), signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  const updateMood = (mood: QMOIState["mood"]) => {
    setState((prev: QMOIState) => ({ ...prev, mood }));
  };

  const updateEnergy = (energy: number) => {
    setState((prev: QMOIState) => ({
      ...prev,
      energy: Math.max(0, Math.min(100, energy)),
    }));
  };

  const updatePersonality = (personality: QMOIState["personality"]) => {
    setState((prev: QMOIState) => ({ ...prev, personality }));
  };

  const updateSystemHealth = (health: QMOIState["systemHealth"]) => {
    setState((prev: QMOIState) => ({ ...prev, systemHealth: health }));
  };

  const updateUserPreferences = (
    preferences: Partial<
      Pick<QMOIState, "autoUpgrade" | "autoEnhance" | "dataSaver">
    >,
  ) => {
    setState((prev: QMOIState) => ({ ...prev, ...preferences }));
  };

  const getAvatarInfo = (avatarId: string) => {
    return avatarsConfig.find((a) => a.id === avatarId);
  };

  const getVoiceInfo = (voiceId: string) => {
    return voiceProfiles.find((v) => v.id === voiceId);
  };

  const getCompatibleVoice = (avatarId: string) => {
    const avatar = avatarsConfig.find((a) => a.id === avatarId);
    if (avatar?.voiceProfile) {
      return avatar.voiceProfile;
    }

    // Find compatible voice based on avatar type
    const compatibleVoice = voiceProfiles.find((v) => v.type === avatar?.type);
    return compatibleVoice?.id || "professional-male";
  };

  const getCompatibleAvatar = (voiceId: string) => {
    const voice = voiceProfiles.find((v) => v.id === voiceId);
    const compatibleAvatar = avatarsConfig.find(
      (a) => a.voiceProfile === voiceId,
    );
    return compatibleAvatar?.id || "default";
  };

  const contextValue: QMOIContextType = {
    state,
    updateAvatar,
    updateVoice,
    updateMood,
    updateEnergy,
    updatePersonality,
    updateSystemHealth,
    updateUserPreferences,
    getAvatarInfo,
    getVoiceInfo,
    getCompatibleVoice,
    getCompatibleAvatar,
  };

  return (
    <QMOIContext.Provider value={contextValue}>{children}</QMOIContext.Provider>
  );
}

export function useQMOIState() {
  const context = useContext(QMOIContext);
  if (context === undefined) {
    throw new Error("useQMOIState must be used within a QMOIStateProvider");
  }
  return context;
}
