
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}


// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability


// GlobalHotkeyService listens for key combinations and triggers callbacks.
// Hotkeys can be registered programmatically or via configuration.

type HotkeyCallback = () => void;
const registry: Record<string, HotkeyCallback[]> = {};

export const registerHotkey = (combo: string, cb: HotkeyCallback) => {
  if (!registry[combo]) registry[combo] = [];
  registry[combo].push(cb);
};

export const unregisterHotkey = (combo: string, cb?: HotkeyCallback) => {
  if (!registry[combo]) return;
  if (cb) {
    registry[combo] = registry[combo].filter((f) => f !== cb);
  } else {
    delete registry[combo];
  }
};

const keyMatcher = (e: KeyboardEvent, combo: string) => {
  const parts = combo
    .toLowerCase()
    .split("+")
    .map((p) => p.trim());
  const key = e.key.toLowerCase();
  if (!parts.includes(key)) return false;
  if (parts.includes("ctrl") && !e.ctrlKey) return false;
  if (parts.includes("alt") && !e.altKey) return false;
  if (parts.includes("shift") && !e.shiftKey) return false;
  return true;
};

export const GlobalHotkeyService: React.FC = () => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      Object.keys(registry).forEach((combo) => {
        if (keyMatcher(e, combo)) {
          registry[combo].forEach((cb) => cb());
          e.preventDefault();
        }
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
};

export default GlobalHotkeyService;
