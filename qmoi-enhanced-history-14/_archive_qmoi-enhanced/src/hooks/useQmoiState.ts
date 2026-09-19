import { useState, useEffect, useCallback } from "react";

interface QmoiState {
  emotion:
    | "happy"
    | "excited"
    | "focused"
    | "calm"
    | "curious"
    | "creative"
    | "analytical"
    | "neutral";
  activity:
    | "processing"
    | "learning"
    | "creating"
    | "analyzing"
    | "optimizing"
    | "planning";
  pulse: {
    bpm: number;
    rhythm: "steady" | "accelerating" | "decelerating" | "irregular";
    health: "excellent" | "good" | "normal" | "warning" | "critical";
  };
  projects: {
    active: number;
    completed: number;
    planned: number;
  };
  system: {
    health: "excellent" | "good" | "normal" | "warning" | "critical";
    memory: number;
    cpu: number;
    tasks: number;
  };
}

interface UseQmoiStateReturn {
  state: QmoiState;
  updateEmotion: (emotion: QmoiState["emotion"]) => void;
  updateActivity: (activity: QmoiState["activity"]) => void;
  updatePulse: (pulse: Partial<QmoiState["pulse"]>) => void;
  updateProjects: (projects: Partial<QmoiState["projects"]>) => void;
  updateSystem: (system: Partial<QmoiState["system"]>) => void;
  isMaster: boolean;
  setIsMaster: (master: boolean) => void;
}

export const useQmoiState = (): UseQmoiStateReturn => {
  const [state, setState] = useState<QmoiState>({
    emotion: "focused",
    activity: "processing",
    pulse: {
      bpm: 72,
      rhythm: "steady",
      health: "excellent",
    },
    projects: {
      active: 3,
      completed: 15,
      planned: 8,
    },
    system: {
      health: "excellent",
      memory: 65,
      cpu: 45,
      tasks: 12,
    },
  });

  const [isMaster, setIsMaster] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        pulse: {
          ...prev.pulse,
          bpm: Math.floor(Math.random() * 20) + 65,
          rhythm: ["steady", "accelerating", "decelerating"][
            Math.floor(Math.random() * 3)
          ] as any,
        },
        system: {
          ...prev.system,
          memory: Math.floor(Math.random() * 30) + 50,
          cpu: Math.floor(Math.random() * 40) + 30,
          tasks: Math.floor(Math.random() * 10) + 8,
        },
      }));
    }, 3000);

    return () => clearInterval(updateInterval);
  }, []);

  const updateEmotion = useCallback((emotion: QmoiState["emotion"]) => {
    setState((prev) => ({ ...prev, emotion }));
  }, []);

  const updateActivity = useCallback((activity: QmoiState["activity"]) => {
    setState((prev) => ({ ...prev, activity }));
  }, []);

  const updatePulse = useCallback((pulse: Partial<QmoiState["pulse"]>) => {
    setState((prev) => ({
      ...prev,
      pulse: { ...prev.pulse, ...pulse },
    }));
  }, []);

  const updateProjects = useCallback(
    (projects: Partial<QmoiState["projects"]>) => {
      setState((prev) => ({
        ...prev,
        projects: { ...prev.projects, ...projects },
      }));
    },
    [],
  );

  const updateSystem = useCallback((system: Partial<QmoiState["system"]>) => {
    setState((prev) => ({
      ...prev,
      system: { ...prev.system, ...system },
    }));
  }, []);

  return {
    state,
    updateEmotion,
    updateActivity,
    updatePulse,
    updateProjects,
    updateSystem,
    isMaster,
    setIsMaster,
  };
};
