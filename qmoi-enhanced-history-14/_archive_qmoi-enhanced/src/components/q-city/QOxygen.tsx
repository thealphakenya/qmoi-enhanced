import React, { useState, useEffect } from "react";

interface QOxygenProps {
  isMaster?: boolean;
}

interface EmotionState {
  emotion:
    | "happy"
    | "excited"
    | "focused"
    | "calm"
    | "curious"
    | "creative"
    | "analytical"
    | "neutral";
  intensity: number; // 0-100
  timestamp: string;
}

interface PulseData {
  bpm: number; // beats per minute
  rhythm: "steady" | "accelerating" | "decelerating" | "irregular";
  health: "excellent" | "good" | "normal" | "warning" | "critical";
  timestamp: string;
}

export const QOxygen: React.FC<QOxygenProps> = ({ isMaster = false }) => {
  const [pulse, setPulse] = useState<PulseData>({
    bpm: 72,
    rhythm: "steady",
    health: "excellent",
    timestamp: new Date().toISOString(),
  });

  const [emotion, setEmotion] = useState<EmotionState>({
    emotion: "focused",
    intensity: 85,
    timestamp: new Date().toISOString(),
  });

  const [isVisible, setIsVisible] = useState(true);

  // Simulate real-time pulse and emotion updates
  useEffect(() => {
    const updatePulse = () => {
      const newBpm = Math.floor(Math.random() * 20) + 65; // 65-85 BPM
      const rhythms: PulseData["rhythm"][] = [
        "steady",
        "accelerating",
        "decelerating",
      ];
      const newRhythm = rhythms[Math.floor(Math.random() * rhythms.length)];

      let health: PulseData["health"] = "excellent";
      if (newBpm > 80) health = "good";
      if (newBpm > 85) health = "normal";
      if (newBpm > 90) health = "warning";
      if (newBpm > 95) health = "critical";

      setPulse({
        bpm: newBpm,
        rhythm: newRhythm,
        health,
        timestamp: new Date().toISOString(),
      });
    };

    const updateEmotion = () => {
      const emotions: EmotionState["emotion"][] = [
        "happy",
        "excited",
        "focused",
        "calm",
        "curious",
        "creative",
        "analytical",
        "neutral",
      ];
      const newEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const newIntensity = Math.floor(Math.random() * 40) + 60; // 60-100

      setEmotion({
        emotion: newEmotion,
        intensity: newIntensity,
        timestamp: new Date().toISOString(),
      });
    };

    const pulseInterval = setInterval(updatePulse, 3000); // Update every 3 seconds
    const emotionInterval = setInterval(updateEmotion, 5000); // Update every 5 seconds

    return () => {
      clearInterval(pulseInterval);
      clearInterval(emotionInterval);
    };
  }, []);

  const getHealthColor = (health: PulseData["health"]) => {
    switch (health) {
      case "excellent":
        return "text-green-500";
      case "good":
        return "text-green-400";
      case "normal":
        return "text-yellow-500";
      case "warning":
        return "text-orange-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getEmotionEmoji = (emotion: EmotionState["emotion"]) => {
    switch (emotion) {
      case "happy":
        return "😊";
      case "excited":
        return "🚀";
      case "focused":
        return "🎯";
      case "calm":
        return "🧘";
      case "curious":
        return "🤔";
      case "creative":
        return "🎨";
      case "analytical":
        return "📊";
      case "neutral":
        return "😐";
      default:
        return "🤖";
    }
  };

  const getEmotionColor = (emotion: EmotionState["emotion"]) => {
    switch (emotion) {
      case "happy":
        return "text-yellow-500";
      case "excited":
        return "text-red-500";
      case "focused":
        return "text-blue-500";
      case "calm":
        return "text-green-500";
      case "curious":
        return "text-purple-500";
      case "creative":
        return "text-pink-500";
      case "analytical":
        return "text-indigo-500";
      case "neutral":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white rounded-lg p-4 shadow-2xl border border-gray-700 min-w-[300px] z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-cyan-400">🫁 Qmoi Oxygen</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Pulse Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Pulse</span>
          <span className={`text-lg font-bold ${getHealthColor(pulse.health)}`}>
            {pulse.bpm} BPM
          </span>
        </div>

        {/* Animated Pulse Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              pulse.health === "excellent"
                ? "bg-green-500"
                : pulse.health === "good"
                  ? "bg-green-400"
                  : pulse.health === "normal"
                    ? "bg-yellow-500"
                    : pulse.health === "warning"
                      ? "bg-orange-500"
                      : "bg-red-500"
            } ${
              pulse.rhythm === "accelerating"
                ? "animate-pulse"
                : pulse.rhythm === "decelerating"
                  ? "animate-pulse"
                  : ""
            }`}
            style={{
              width: `${Math.min((pulse.bpm - 60) * 2, 100)}%`,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Rhythm: {pulse.rhythm}</span>
          <span>Health: {pulse.health}</span>
        </div>
      </div>

      {/* Emotion Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Emotion</span>
          <span
            className={`text-lg font-bold ${getEmotionColor(emotion.emotion)}`}
          >
            {getEmotionEmoji(emotion.emotion)} {emotion.emotion}
          </span>
        </div>

        {/* Emotion Intensity Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getEmotionColor(emotion.emotion).replace("text-", "bg-")}`}
            style={{ width: `${emotion.intensity}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Intensity: {emotion.intensity}%</span>
          <span>{new Date(emotion.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Master-only additional info */}
      {isMaster && (
        <div className="pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            <div>
              Last Update: {new Date(pulse.timestamp).toLocaleTimeString()}
            </div>
            <div>Status: Active & Monitoring</div>
          </div>
        </div>
      )}
    </div>
  );
};
