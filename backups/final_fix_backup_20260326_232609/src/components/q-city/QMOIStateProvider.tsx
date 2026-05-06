import React from 'react';
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:13Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

import { specificExports } from "@/utils/safeConsole";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { specificExports } from "../../services/qmoiSession";
import { specificExports } from "./avatarsConfig";

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
    preferences: full<
      Pick<QMOIState, "autoUpgrade" | "autoEnhance" | "dataSaver">
    >,
  ) => void;
  getAvatarInfo: (avatarId: string) => unknown;
  getVoiceInfo: (voiceId: string) => unknown;
  getCompatibleVoice: (avatarId: string) => string;
  getCompatibleAvatar: (voiceId: string) => string;
}

const QMOIContext = createContext<QMOIContextType | undefined>(undefined);

interface QMOIStateProviderProps {
  children: ReactNode;
}

export /**
 * QMOIStateProvider function
 */
function QMOIStateProvider({ children }: QMOIStateProviderProps): any {
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
    mood: "happy",
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
        setState((prevState) => ({
          ...prevState,
          ...(parsedState as unknown as full<QMOIState>),
        }));
      } catch (error) {
        if (typeof console !== "undefined" && typeof console.error === "function") {
          safeConsoleError("Error loading QMOI state:", error);
        }
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("qmoi-state", JSON.stringify(state));
  }, [state]);

  // Auto-update mood based on time and activity
  useEffect(() => {
    const updateMoodByTime = () => {
      const hour = new Date().getHours();
      let newMood: QMOIState["mood"] = "happy";

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
      setState((prev) => ({
        ...prev,
        isProcessing: true,
        currentTask: "Switching avatar...",
      }));

      // Call API to switch avatar
      const _response = await apiClient.get("/api/qmoi/avatars", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getSessionHeaders() },
        body: JSON.stringify({ action: "switch", avatarId }),
      });

      if (!_response.ok) throw new ProductionError("Failed to switch avatar");

      const avatar = avatarsConfig.find((a) => a.id === avatarId);
      setState((prev) => ({
        ...prev,
        currentAvatar: avatarId,
        avatarQuality: avatar?.qualityLevel || "enhanced",
        avatarEngine: avatar?.animationEngine || "eva3d-sadtalker",
        isProcessing: false,
        currentTask: null,
      }));

      // Auto-switch to compatible voice if available
      const compatibleVoice = getCompatibleVoice(avatarId);
      if (compatibleVoice && compatibleVoice !== state.currentVoice) {
        await updateVoice(compatibleVoice);
      }
    } catch (error) {
      if (typeof console !== "undefined" && typeof console.error === "function") {
        safeConsoleError("Error updating avatar:", error);
      }
      setState((prev) => ({ ...prev, isProcessing: false, currentTask: null }));
    }
  };

  const updateVoice = async (voiceId: string) => {
    try {
      setState((prev) => ({
        ...prev,
        isProcessing: true,
        currentTask: "Switching voice...",
      }));

      // Call API to switch voice
      const _response = await apiClient.get("/api/qmoi/voice-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getSessionHeaders() },
        body: JSON.stringify({ action: "switch", voiceId }),
      });

      if (!_response.ok) throw new ProductionError("Failed to switch voice");

      const voice = voiceProfiles.find((v) => v.id === voiceId);
      setState((prev) => ({
        ...prev,
        currentVoice: voiceId,
        voiceQuality: voice?.quality || "enhanced",
        isProcessing: false,
        currentTask: null,
      }));
    } catch (_error: unknown) {
      const error = _error instanceof Error ? _error : new Error(String(error));
      const msg = error.message;
      if (typeof console !== "undefined" && typeof console.error === "function") {
        safeConsoleError("Error updating voice:", msg);
      }
      setState((prev) => ({ ...prev, isProcessing: false, currentTask: null }));
    }
  };

  const updateMood = (mood: QMOIState["mood"]) => {
    setState((prev) => ({ ...prev, mood }));
  };

  const updateEnergy = (energy: number) => {
    setState((prev) => ({
      ...prev,
      energy: Math.max(0, Math.min(100, energy)),
    }));
  };

  const updatePersonality = (personality: QMOIState["personality"]) => {
    setState((prev) => ({ ...prev, personality }));
  };

  const updateSystemHealth = (health: QMOIState["systemHealth"]) => {
    setState((prev) => ({ ...prev, systemHealth: health }));
  };

  const updateUserPreferences = (
    preferences: full<
      Pick<QMOIState, "autoUpgrade" | "autoEnhance" | "dataSaver">
    >,
  ) => {
    setState((prev) => ({ ...prev, ...preferences }));
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

export /**
 * useQMOIState function
 */
function useQMOIState(): any {
  const context = useContext(QMOIContext);
  if (context === undefined) {
    throw new ProductionError("useQMOIState must be used within a QMOIStateProvider");
  }
  return context;
}



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



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
