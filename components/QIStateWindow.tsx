import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
// For animated particles, you can use Three.js or a placeholder for now

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

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced visualization: show video if provided, else animated placeholder
  const renderVisualization = () => (
    videoUrl ? (
      <video
        src={videoUrl}
        className="w-full h-32 object-cover rounded border"
        autoPlay
        loop
        muted
        playsInline
        style={{ maxHeight: 160 }}
      />
    ) : (
      <div className="w-full h-32 flex items-center justify-center bg-gradient-to-r from-purple-700 to-blue-700 rounded animate-pulse">
        <span className="text-4xl text-white font-bold">{state}</span>
      </div>
    )
  );

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 340, height: isMinimized ? 60 : 320 }}
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
          <button onClick={() => { setIsMinimized(!isMinimized); onMinimize && onMinimize(); }} className="text-xs px-2 py-1 bg-purple-200 rounded hover:bg-purple-300">{isMinimized ? "Maximize" : "Minimize"}</button>
        </div>
      </div>
      {!isMinimized && (
        <div className="p-3 space-y-2">
          {renderVisualization()}
          <div className="text-xs text-gray-700 dark:text-gray-200">
            <div><b>AI State:</b> {state}</div>
            <div><b>Time:</b> {now.toLocaleTimeString()} ({now.toLocaleDateString()})</div>
            {aiHealth && (
              <div><b>AI Health:</b> {aiHealth.status} <span className="ml-2 text-gray-400">(Last check: {new Date(aiHealth.lastCheck).toLocaleTimeString()})</span> {aiHealth.error && <span className="text-red-500">Error: {aiHealth.error}</span>}</div>
            )}
            {colabJob && (
              <div><b>Colab Job:</b> {colabJob.jobStatus} {colabJob.error && <span className="text-red-500">Error: {colabJob.error}</span>}</div>
            )}
            {session && (
              <>
                <div><b>User:</b> {session.user}</div>
                <div><b>Session Memory:</b> {session.memory} interactions</div>
                <div><b>Recent:</b> {session.recent?.slice(-3).join(", ")}</div>
              </>
            )}
            {global && (
              <>
                <div><b>Active Sessions:</b> {global.sessions}</div>
                <div><b>Total Memory:</b> {global.memory}</div>
                <div><b>System Health:</b> {global.health}</div>
              </>
            )}
          </div>
        </div>
      )}
    </Rnd>
  );
}
