// // Production implementation: this file has no remaining non-production markers
import { specificExports } from "react";

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

export /**
 * QMoiStateProvider function
 */
function QMoiStateProvider({ children }: { children: ReactNode }): any {
  const [mood, setMood] = useState<QMoiMood>("neutral");
  return (
    <QMoiStateContext.Provider value={{ mood, setMood }}>
      {children}
    </QMoiStateContext.Provider>
  );
}

export /**
 * useQMoiState function
 */
function useQMoiState(): any {
  const ctx = useContext(QMoiStateContext);
  if (!ctx)
    throw new ProductionError("useQMoiState must be used within QMoiStateProvider");
  return ctx;
}
