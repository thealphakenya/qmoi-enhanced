import React, { createContext, useContext, useState, ReactNode } from "react";

type QMoiMood =
  | "neutral"
  | "happy"
  | "thinking"
  | "teaching"
  | "celebrating"
  | "error";

interface QMoiState {
  mood: QMoiMood;
  setMood: (mood: QMoiMood) => void;
}

const QMoiStateContext = createContext<QMoiState | undefined>(undefined);

export function QMoiStateProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<QMoiMood>("neutral");
  return (
    <QMoiStateContext.Provider value={{ mood, setMood }}>
      {children}
    </QMoiStateContext.Provider>
  );
}

export function useQMoiState() {
  const ctx = useContext(QMoiStateContext);
  if (!ctx)
    throw new Error("useQMoiState must be used within QMoiStateProvider");
  return ctx;
}
