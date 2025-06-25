import React, { useState, useEffect } from "react";

interface QMoiStateProps {
  session?: any;
  global?: any;
  minimized?: boolean;
  aiHealth?: { status: string; lastCheck: string; error?: string };
  isMaster?: boolean;
}

export function QMoiState({
  session,
  global,
  minimized = false,
  aiHealth,
  isMaster = false
}: QMoiStateProps) {
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [now, setNow] = useState(new Date());
  const [currentEmotion, setCurrentEmotion] = useState('focused');
  const [currentActivity, setCurrentActivity] = useState('processing');
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time Qmoi state updates
  useEffect(() => {
    const emotions = ['focused', 'creative', 'analytical', 'excited', 'calm', 'curious'];
    const activities = ['processing', 'learning', 'creating', 'analyzing', 'optimizing', 'planning'];
    
    const emotionTimer = setInterval(() => {
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 8000);

    const activityTimer = setInterval(() => {
      setCurrentActivity(activities[Math.floor(Math.random() * activities.length)]);
    }, 5000);

    return () => {
      clearInterval(emotionTimer);
      clearInterval(activityTimer);
    };
  }, []);

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'focused': return '🎯';
      case 'creative': return '🎨';
      case 'analytical': return '📊';
      case 'excited': return '🚀';
      case 'calm': return '🧘';
      case 'curious': return '🤔';
      default: return '🤖';
    }
  };

  const getActivityEmoji = (activity: string) => {
    switch (activity) {
      case 'processing': return '⚙️';
      case 'learning': return '📚';
      case 'creating': return '✨';
      case 'analyzing': return '🔍';
      case 'optimizing': return '⚡';
      case 'planning': return '📋';
      default: return '🔄';
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'OK': return 'text-green-500';
      case 'Warning': return 'text-yellow-500';
      case 'Error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed top-5 right-5 w-20 h-10 bg-gray-900 text-white rounded-lg p-2 shadow-2xl border border-gray-700 cursor-pointer z-50">
        <div className="text-center">
          <div className="text-lg">🤖</div>
          <div className="text-xs">{getEmotionEmoji(currentEmotion)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-5 right-5 w-80 h-96 bg-gray-900 text-white rounded-lg p-4 shadow-2xl border border-gray-700 z-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-cyan-400">
          🤖 Qmoi State
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ➖
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ⚪
          </button>
        </div>
      </div>

      {/* Current Time */}
      <div className="mb-3 p-2 bg-gray-800 rounded">
        <div className="text-sm text-gray-400">Current Time</div>
        <div className="text-lg font-mono">
          {now.toLocaleTimeString('en-US', { 
            hour12: false,
            timeZone: 'Africa/Nairobi'
          })}
        </div>
        <div className="text-xs text-gray-500">Nairobi Time</div>
      </div>

      {/* Qmoi Status */}
      <div className="mb-3 p-2 bg-gray-800 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Status</span>
          <span className={`text-sm font-bold ${getHealthColor(aiHealth?.status || 'OK')}`}>
            {aiHealth?.status || 'OK'} {aiHealth?.status === 'OK' ? '🟢' : '🔴'}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Last Check: {aiHealth?.lastCheck ? new Date(aiHealth.lastCheck).toLocaleTimeString() : 'N/A'}
        </div>
      </div>

      {/* Current Emotion & Activity */}
      <div className="mb-3 p-2 bg-gray-800 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Emotion</span>
          <span className="text-lg">
            {getEmotionEmoji(currentEmotion)} {currentEmotion}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Activity</span>
          <span className="text-lg">
            {getActivityEmoji(currentActivity)} {currentActivity}
          </span>
        </div>
      </div>

      {/* Session Memory */}
      {session && (
        <div className="mb-3 p-2 bg-gray-800 rounded">
          <div className="text-sm text-gray-400 mb-1">Session Memory</div>
          <div className="text-xs text-gray-300">
            Tasks: {session.tasks || 0} | 
            Projects: {session.projects || 0} | 
            Errors: {session.errors || 0}
          </div>
        </div>
      )}

      {/* Global Stats */}
      {global && (
        <div className="mb-3 p-2 bg-gray-800 rounded">
          <div className="text-sm text-gray-400 mb-1">Global Stats</div>
          <div className="text-xs text-gray-300">
            Total Tasks: {global.totalTasks || 0} | 
            Success Rate: {global.successRate || 0}%
          </div>
        </div>
      )}

      {/* Master-only additional info */}
      {isMaster && (
        <div className="pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            <div>Master Access: Active 👑</div>
            <div>System Health: Excellent</div>
            <div>Auto Projects: Running</div>
          </div>
        </div>
      )}

      {/* Add button for master to open Activity Log */}
      {isMaster && (
        <button className="mt-2 px-3 py-1 bg-cyan-700 text-white rounded" onClick={() => setShowActivityLog(true)}>
          QMOI Activity Log
        </button>
      )}

      {/* QMOI Activity Log Panel (master-only) */}
      {isMaster && showActivityLog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg w-2/3 h-2/3 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">QMOI Activity Log</h2>
            {/* TODO: Fetch and display logs, filter by type/time/severity */}
            <button className="absolute top-4 right-8 text-white" onClick={() => setShowActivityLog(false)}>
              Close
            </button>
            <div className="text-gray-300">(Log entries will appear here...)</div>
          </div>
        </div>
      )}
    </div>
  );
} 