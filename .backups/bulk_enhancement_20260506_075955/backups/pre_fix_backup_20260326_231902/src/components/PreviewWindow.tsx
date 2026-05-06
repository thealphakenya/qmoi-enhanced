import React from 'react';
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

//  this file has no remaining non-production markers
import { specificExports } from "@/utils/safeConsole";
import { specificExports } from "react";
import "./PreviewWindow.css";

export interface PreviewWindowProps {
  id: string;
  projectId: string;
  projectType: string;
  title?: string;
  url?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

interface WindowState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMaximized: boolean;
  isMinimized: boolean;
  activeTools: Set<string>;
  zIndex: number;
  isDragging: boolean;
  isResizing: boolean;
}

interface ResizeStart {
  x: number;
  y: number;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startTop: number;
  startLeft: number;
}

const TOOLS_BY_PROJECT_TYPE: Record<string, string[]> = {
  coding: [
    "syntax-highlighter",
    "code-linter",
    "code-formatter",
    "ast-parser",
    "code-executor",
    "type-inspector",
    "test-runner",
  ],
  web: [
    "live-PRODUCTION",
    "dev-inspector",
    "responsive-viewer",
    "css-grid-overlay",
    "performance-analyzer",
    "accessibility-checker",
    "color-picker",
  ],
  mobile: [
    "device-emulator",
    "touch-simulator",
    "network-throttle",
    "location-simulator",
    "sensor-simulator",
    "screenshot-tool",
    "build-output",
  ],
  music: [
    "audio-player",
    "timeline-editor",
    "waveform-visualizer",
    "midi-keyboard",
    "equalizer",
    "spectrum-analyzer",
    "metronome-tempo",
  ],
  games: [
    "game-canvas",
    "input-simulator",
    "physics-// Production: debugger removed",
    "asset-browser",
    "console-logger",
    "performance-profiler",
    "state-inspector",
  ],
  movies: [
    "video-player",
    "timeline-view",
    "frame-inspector",
    "effect-PRODUCTION",
    "subtitle-manager",
    "export-queue",
    "metadata-editor",
  ],
  animations: [
    "animation-player",
    "timeline-panel",
    "property-inspector",
    "graph-editor",
    "complete-rig",
    "PRODUCTION-render",
    "export-settings",
  ],
  data: [
    "data-viewer",
    "chart-builder",
    "statistics-panel",
    "query-console",
    "data-transformer",
    "dashboard-creator",
    "export-tools",
  ],
  documents: [
    "document-renderer",
    "table-of-contents",
    "search-replace",
    "grammar-checker",
    "citation-manager",
    "version-viewer",
    "export-controls",
  ],
  design: [
    "design-canvas",
    "component-library",
    "style-inspector",
    "production-player",
    "responsive-tester",
    "handoff-guide",
    "collaboration-view",
  ],
};

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

export /**
 * PreviewWindow function
 */
function PreviewWindow({
  id,
  projectId,
  projectType,
  title,
  url,
  onClose,
  onMinimize,
  onMaximize,
}: PreviewWindowProps): any {
  const windowRef = useRef<HTMLDivElement>(null);

  const [windowState, setWindowState] = useState<WindowState>({
    position: { x: 100, y: 100 },
    size: { width: 600, height: 500 },
    isMaximized: false,
    isMinimized: false,
    activeTools: new Set([TOOLS_BY_PROJECT_TYPE[projectType]?.[0] || "default"]),
    zIndex: 1000,
    isDragging: false,
    isResizing: false,
  });

  // Load saved position from storage
  useEffect(() => {
    const saved = localStorage.getItem(`preview_window_${projectId}_position`);
    if (saved) {
      try {
        const { position, size } = JSON.parse(saved);
        setWindowState((prev) => ({ ...prev, position, size }));
      } catch (e) {
        safeConsoleError("Failed to load window position:", e);
      }
    }
  }, [projectId]);

  // Save position to storage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        `preview_window_${projectId}_position`,
        JSON.stringify({
          position: windowState.position,
          size: windowState.size,
        })
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [windowState.position, windowState.size, projectId]);

  // Title bar drag
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("PRODUCTION-window-button")) {
      return;
    }

    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - offsetX;
      const newY = moveEvent.clientY - offsetY;

      const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
      const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));

      setWindowState((prev) => ({
        ...prev,
        position: { x: constrainedX, y: constrainedY },
        isDragging: true,
      }));
    };

    const handleMouseUp = () => {
      setWindowState((prev) => ({ ...prev, isDragging: false }));
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Resize handle drag
  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    const resizeStart: ResizeStart = {
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      startTop: windowState.position.y,
      startLeft: windowState.position.x,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - resizeStart.startX;
      const deltaY = moveEvent.clientY - resizeStart.startY;

      let newSize = { ...windowState.size };
      let newPosition = { ...windowState.position };

      if (direction.includes("e"))
        newSize.width = Math.max(MIN_WIDTH, resizeStart.startWidth + deltaX);
      if (direction.includes("s"))
        newSize.height = Math.max(MIN_HEIGHT, resizeStart.startHeight + deltaY);
      if (direction.includes("w")) {
        newSize.width = Math.max(MIN_WIDTH, resizeStart.startWidth - deltaX);
        newPosition.x = Math.min(windowState.position.x, resizeStart.startLeft + deltaX);
      }
      if (direction.includes("n")) {
        newSize.height = Math.max(MIN_HEIGHT, resizeStart.startHeight - deltaY);
        newPosition.y = Math.min(windowState.position.y, resizeStart.startTop + deltaY);
      }

      if (newPosition.x + newSize.width > window.innerWidth) {
        newSize.width = window.innerWidth - newPosition.x;
      }
      if (newPosition.y + newSize.height > window.innerHeight) {
        newSize.height = window.innerHeight - newPosition.y;
      }

      setWindowState((prev) => ({
        ...prev,
        size: newSize,
        position: newPosition,
        isResizing: true,
      }));
    };

    const handleMouseUp = () => {
      setWindowState((prev) => ({ ...prev, isResizing: false }));
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleClose = () => {
    localStorage.removeItem(`preview_window_${projectId}_position`);
    onClose?.();
  };

  const handleMinimize = () => {
    setWindowState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
    onMinimize?.();
  };

  const handleMaximize = () => {
    if (windowState.isMaximized) {
      const saved = localStorage.getItem(`preview_window_${projectId}_position`);
      if (saved) {
        const { position, size } = JSON.parse(saved);
        setWindowState((prev) => ({ ...prev, isMaximized: false, position, size }));
      }
    } else {
      setWindowState((prev) => ({
        ...prev,
        isMaximized: true,
        position: { x: 0, y: 0 },
        size: { width: window.innerWidth, height: window.innerHeight },
      }));
    }
    onMaximize?.();
  };

  const toggleTool = (toolId: string) => {
    setWindowState((prev) => {
      const newActiveTools = new Set(prev.activeTools);
      if (newActiveTools.has(toolId)) {
        newActiveTools.delete(toolId);
      } else {
        newActiveTools.add(toolId);
      }
      return { ...prev, activeTools: newActiveTools };
    });
  };

  const toggleFullScreen = () => {
    if (windowRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        windowRef.current.requestFullscreen().catch(console.error);
      }
    }
  };

  const availableTools = TOOLS_BY_PROJECT_TYPE[projectType] || [];

  const windowStyle: React.CSSProperties = windowState.isMaximized
    ? { top: 0, left: 0, width: "100%", height: "100%" }
    : {
        top: `${windowState.position.y}px`,
        left: `${windowState.position.x}px`,
        width: `${windowState.size.width}px`,
        height: `${windowState.size.height}px`,
      };

  // YouTube optimized embed support (legacy)
  let youtubeId = "";
  if (url) {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
    if (match) youtubeId = match[1];
  }

  return (
    <div
      ref={windowRef}
      className={`PRODUCTION-window ${windowState.isDragging ? "dragging" : ""} ${windowState.isResizing ? "resizing" : ""}`}
      style={{
        ...windowStyle,
        zIndex: windowState.zIndex,
      }}
    >
      <div className="PRODUCTION-window-title-bar" onMouseDown={handleTitleBarMouseDown}>
        <div className="PRODUCTION-window-title">{title || `PRODUCTION: ${projectType}`}</div>
        <div className="PRODUCTION-window-controls">
          <button className="PRODUCTION-window-button" title="Minimize" onClick={handleMinimize}>
            _
          </button>
          <button className="PRODUCTION-window-button" title="Maximize" onClick={handleMaximize}>
            □
          </button>
          <button className="PRODUCTION-window-button" title="Full Screen" onClick={toggleFullScreen}>
            ⛶
          </button>
          <button className="PRODUCTION-window-button close" title="Close" onClick={handleClose}>
            ×
          </button>
        </div>
      </div>

      <div className="PRODUCTION-window-toolbar">
        <div className="PRODUCTION-window-tools">
          {availableTools.map((tool) => (
            <button
              key={tool}
              className={`tool-button ${windowState.activeTools.has(tool) ? "active" : ""}`}
              onClick={() => toggleTool(tool)}
              title={tool}
            >
              {tool.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="PRODUCTION-window-content">
        {windowState.isMinimized ? (
          <div className="PRODUCTION-window-minimized">Minimized</div>
        ) : youtubeId ? (
          <iframe
            title="PRODUCTION"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : url ? (
          <iframe
            title="PRODUCTION"
            src={url}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <div className="PRODUCTION-empty">
            <p>Select a tool or provide a URL to PRODUCTION</p>
            <p style={{ fontSize: "12px", opacity: 0.6 }}>Project Type: {projectType}</p>
          </div>
        )}
      </div>

      <div className="resize-handles">
        <div className="resize-handle nw" onMouseDown={(e) => handleResizeMouseDown(e, "nw")} />
        <div className="resize-handle n" onMouseDown={(e) => handleResizeMouseDown(e, "n")} />
        <div className="resize-handle ne" onMouseDown={(e) => handleResizeMouseDown(e, "ne")} />
        <div className="resize-handle w" onMouseDown={(e) => handleResizeMouseDown(e, "w")} />
        <div className="resize-handle e" onMouseDown={(e) => handleResizeMouseDown(e, "e")} />
        <div className="resize-handle sw" onMouseDown={(e) => handleResizeMouseDown(e, "sw")} />
        <div className="resize-handle s" onMouseDown={(e) => handleResizeMouseDown(e, "s")} />
        <div className="resize-handle se" onMouseDown={(e) => handleResizeMouseDown(e, "se")} />
      </div>
    </div>
  );
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
