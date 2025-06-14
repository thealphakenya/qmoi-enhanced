import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
// For animated particles, you can use Three.js or a placeholder for now

// Add: QI Preview Window trigger from anywhere in the app
// Example: import { useQIPreview } from './QI';
// const { openPreview, QIPreview } = useQIPreview();
// openPreview({ state: 'Preview', aiHealth: { status: 'OK', lastCheck: new Date().toISOString() } });

export function QIStateWindow({
  state,
  session,
  global,
  onMinimize,
  onMaximize,
  minimized,
  videoUrl,
  aiHealth,
  colabJob,
}: {
  state: string;
  session?: any;
  global?: any;
  onMinimize?: () => void;
  onMaximize?: () => void;
  minimized?: boolean;
  videoUrl?: string;
  aiHealth?: { status: string; lastCheck: string; error?: string };
  colabJob?: { jobStatus: string; result: any; error?: string };
}) {
  const [isMinimized, setIsMinimized] = useState(minimized || false);
  const [now, setNow] = useState(new Date());
  const [vizType, setVizType] = useState<'auto'|'video'|'image'|'sketch'>('auto');
  const [viz, setViz] = useState<any>(null);
  const [loadingViz, setLoadingViz] = useState(false);
  const lastFetch = useRef<number>(0);

  useEffect(() => {
    const fetchViz = async () => {
      setLoadingViz(true);
      const res = await fetch(`/api/qmoi-model?aiStateVisualization=1&type=${vizType}`);
      const data = await res.json();
      setViz(data);
      setLoadingViz(false);
      lastFetch.current = Date.now();
    };
    fetchViz();
    const interval = setInterval(() => {
      if (Date.now() - lastFetch.current > 4000) fetchViz();
    }, 5000);
    return () => clearInterval(interval);
  }, [vizType]);

  // Enhanced visualization: show video/image/sketch if provided, else animated placeholder
  const renderVisualization = () => {
    if (loadingViz) return <div className="w-full h-32 flex items-center justify-center bg-gradient-to-r from-purple-700 to-blue-700 rounded animate-pulse"><span className="text-white">Loading...</span></div>;
    if (viz && viz.type === 'video') return (
      <video src={viz.url} className="w-full h-32 object-cover rounded border" autoPlay loop muted playsInline style={{ maxHeight: 160 }} />
    );
    if (viz && viz.type === 'image') return (
      <img src={viz.url} className="w-full h-32 object-cover rounded border" alt="AI State" style={{ maxHeight: 160 }} />
    );
    if (viz && viz.type === 'sketch') return (
      <img src={viz.url} className="w-full h-32 object-contain rounded border" alt="AI State Sketch" style={{ maxHeight: 160 }} />
    );
    return (
      <div className="w-full h-32 flex items-center justify-center bg-gradient-to-r from-purple-700 to-blue-700 rounded animate-pulse">
        <span className="text-4xl text-white font-bold">{state}</span>
      </div>
    );
  };

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 340, height: isMinimized ? 60 : 340 }}
      minWidth={240}
      minHeight={60}
      bounds="window"
      className="z-50 fixed shadow-lg rounded-lg bg-white dark:bg-gray-900 border border-purple-500"
      enableResizing={!isMinimized}
      disableDragging={isMinimized}
    >
      <div className="flex items-center justify-between p-2 border-b border-purple-300 bg-purple-50 dark:bg-purple-900 rounded-t-lg">
        <span className="font-bold text-purple-700">QI State</span>
        <div className="flex gap-2">
          <select className="text-xs p-1 rounded border" value={vizType} onChange={e=>setVizType(e.target.value as any)}>
            <option value="auto">Auto</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="sketch">Sketch</option>
          </select>
          <button onClick={() => { setIsMinimized(!isMinimized); onMinimize && onMinimize(); }} className="text-xs px-2 py-1 bg-purple-200 rounded hover:bg-purple-300">{isMinimized ? "Maximize" : "Minimize"}</button>
        </div>
      </div>
      {!isMinimized && (
        <div className="p-3 space-y-2">
          {renderVisualization()}
          <div className="text-xs text-gray-700 dark:text-gray-200">
            <div><b>AI State:</b> {state}</div>
            <div><b>Time:</b> {now.toLocaleTimeString()} ({now.toLocaleDateString()})</div>
            {viz && viz.description && <div><b>Visualization:</b> {viz.description}</div>}
            {aiHealth && (
              <div><b>Health:</b> {aiHealth.status} (Last check: {aiHealth.lastCheck}) {aiHealth.error && <span className="text-red-600">Error: {aiHealth.error}</span>}</div>
            )}
            {colabJob && (
              <div><b>Colab Job:</b> {colabJob.jobStatus} {colabJob.error && <span className="text-red-600">Error: {colabJob.error}</span>}</div>
            )}
          </div>
        </div>
      )}
    </Rnd>
  );
}
