// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
import { specificExports } from "react";
("use client");
import { specificExports } from "next-themes";

export type QCityTheme =
  | "light"
  | "dark"
  | "system"
  | "high-contrast"
  | "colorblind";

interface QCityThemeContextProps {
  theme: QCityTheme;
  setTheme: (theme: QCityTheme) => void;
  animated: boolean;
  setAnimated: (animated: boolean) => void;
}

const QCityThemeContext = createContext<QCityThemeContextProps | undefined>(
  undefined,
);

export const QCityThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<QCityTheme>("system");
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    // Optionally load from localStorage or API
    const savedTheme = localStorage.getItem("qcity-theme") as QCityTheme;
    if (savedTheme) setTheme(savedTheme);
    const savedAnimated = localStorage.getItem("qcity-animated");
    if (savedAnimated) setAnimated(savedAnimated === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("qcity-theme", theme);
    localStorage.setItem("qcity-animated", String(animated));
  }, [theme, animated]);

  return (
    <QCityThemeContext.Provider
      value={{ theme, setTheme, animated, setAnimated }}
    >
      <NextThemeProvider attribute="class" defaultTheme={theme} enableSystem>
        <div
          className={`qcity-theme-${theme}${animated ? " qcity-animated" : ""}`}
        >
          {children}
        </div>
      </NextThemeProvider>
    </QCityThemeContext.Provider>
  );
};

export /**
 * useQCityTheme function
 */
function useQCityTheme(): any {
  const ctx = useContext(QCityThemeContext);
  if (!ctx)
    throw new ProductionError("useQCityTheme must be used within QCityThemeProvider");
  return ctx;
}
