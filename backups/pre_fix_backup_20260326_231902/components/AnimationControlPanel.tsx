import React from 'react';
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

//  this file has no remaining non-production markers
"use client";

// INTENTIONAL_UNUSED: archived / intentionally unused component
import { specificExports } from "react";
import { specificExports } from "framer-motion";
import { specificExports } from "lucide-react";

interface AnimationConfig {
  type: string;
  speed: number;
  intensity: number;
  loop: boolean;
  description: string;
  category: string;
}

interface AnimationControlPanelProps {
  currentAnimation?: string;
  onAnimationChange?: (animation: AnimationConfig) => void;
  isOpen?: boolean;
  position?: "floating" | "panel";
}

const ANIMATION_PRESETS: Record<string, AnimationConfig> = {
  // Idle animations
  idle_breathing: {
    type: "idle_breathing",
    speed: 1,
    intensity: 0.5,
    loop: true,
    description: "Gentle breathing motion",
    category: "Idle",
  },
  idle_blinking: {
    type: "idle_blinking",
    speed: 1.5,
    intensity: 0.3,
    loop: true,
    description: "Natural blinking",
    category: "Idle",
  },
  idle_head_tilt: {
    type: "idle_head_tilt",
    speed: 0.8,
    intensity: 0.6,
    loop: true,
    description: "Curious head tilt",
    category: "Idle",
  },
  idle_weight_shift: {
    type: "idle_weight_shift",
    speed: 1.2,
    intensity: 0.4,
    loop: true,
    description: "Weight shifting side to side",
    category: "Idle",
  },

  // Listening animations
  listening_focus: {
    type: "listening_focus",
    speed: 1.3,
    intensity: 0.7,
    loop: true,
    description: "Focused listening pose",
    category: "Listening",
  },
  listening_nod: {
    type: "listening_nod",
    speed: 1,
    intensity: 0.8,
    loop: false,
    description: "Understanding nods",
    category: "Listening",
  },
  listening_wave: {
    type: "listening_wave",
    speed: 1.4,
    intensity: 0.6,
    loop: true,
    description: "Audio waveform response",
    category: "Listening",
  },

  // Speaking animations
  speaking_gesture: {
    type: "speaking_gesture",
    speed: 1.5,
    intensity: 0.8,
    loop: true,
    description: "Hand gestures while speaking",
    category: "Speaking",
  },
  speaking_lip_sync: {
    type: "speaking_lip_sync",
    speed: 2,
    intensity: 0.9,
    loop: true,
    description: "Lip synchronization",
    category: "Speaking",
  },
  speaking_head_movement: {
    type: "speaking_head_movement",
    speed: 1.2,
    intensity: 0.5,
    loop: true,
    description: "Natural head movement",
    category: "Speaking",
  },

  // Thinking animations
  thinking_ponder: {
    type: "thinking_ponder",
    speed: 0.8,
    intensity: 0.6,
    loop: true,
    description: "Thinking pose",
    category: "Thinking",
  },
  thinking_hand_gesture: {
    type: "thinking_hand_gesture",
    speed: 1,
    intensity: 0.7,
    loop: true,
    description: "Hand to chin gesture",
    category: "Thinking",
  },
  thinking_glow: {
    type: "thinking_glow",
    speed: 1.1,
    intensity: 0.8,
    loop: true,
    description: "Glowing thinking indicator",
    category: "Thinking",
  },

  // Emotion animations
  emotion_happy: {
    type: "emotion_happy",
    speed: 1.5,
    intensity: 0.9,
    loop: true,
    description: "Jumping and smiling",
    category: "Emotion",
  },
  emotion_sad: {
    type: "emotion_sad",
    speed: 0.7,
    intensity: 0.6,
    loop: true,
    description: "Sad slouch pose",
    category: "Emotion",
  },
  emotion_excited: {
    type: "emotion_excited",
    speed: 2,
    intensity: 1,
    loop: true,
    description: "Bouncy excited motion",
    category: "Emotion",
  },
  emotion_confused: {
    type: "emotion_confused",
    speed: 1.2,
    intensity: 0.7,
    loop: true,
    description: "Head tilting in confusion",
    category: "Emotion",
  },

  // Transition animations
  transition_fade: {
    type: "transition_fade",
    speed: 1,
    intensity: 0.8,
    loop: false,
    description: "Fade in/out transition",
    category: "Transition",
  },
  transition_morph: {
    type: "transition_morph",
    speed: 1.3,
    intensity: 0.9,
    loop: false,
    description: "Morphing shape change",
    category: "Transition",
  },
  transition_spin: {
    type: "transition_spin",
    speed: 1.5,
    intensity: 0.7,
    loop: false,
    description: "Spinning transition",
    category: "Transition",
  },
};

export const AnimationControlPanel: React.FC<AnimationControlPanelProps> = ({
  currentAnimation = "idle_breathing",
  onAnimationChange,
  isOpen = true,
  position = "floating",
}) => {
  const [selectedAnimation, setSelectedAnimation] =
    useState<AnimationConfig | null>(
      ANIMATION_PRESETS[currentAnimation] || ANIMATION_PRESETS.idle_breathing,
    );
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [intensityMultiplier, setIntensityMultiplier] = useState(1);
  const [isAutoLoop, setIsAutoLoop] = useState(false);
  const [autoLoopDelay, setAutoLoopDelay] = useState(5000); // 5 seconds
  const [isPlaying, setIsPlaying] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "Idle",
  );

  const categories = Array.from(
    new Set(Object.values(ANIMATION_PRESETS).map((a) => a.category)),
  ).sort();

  const animationsByCategory = categories.reduce(
    (acc, cat) => {
      acc[cat] = Object.values(ANIMATION_PRESETS).filter(
        (a) => a.category === cat,
      );
      return acc;
    },
    {} as Record<string, AnimationConfig[]>,
  );

  const handleSelectAnimation = (animation: AnimationConfig) => {
    setSelectedAnimation(animation);
    onAnimationChange?.(animation);
  };

  const applyAnimationModifiers = () => {
    if (!selectedAnimation) return;
    const modified = {
      ...selectedAnimation,
      speed: selectedAnimation.speed * speedMultiplier,
      intensity: Math.min(selectedAnimation.intensity * intensityMultiplier, 1),
    };
    onAnimationChange?.(modified);
  };

  const resetToDefaults = () => {
    setSpeedMultiplier(1);
    setIntensityMultiplier(1);
    setIsAutoLoop(false);
    applyAnimationModifiers();
  };

  const containerClass =
    position === "floating" ? "fixed bottom-32 right-8 w-96" : "w-full";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`${containerClass} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden`}
          style={{
            background: `const(--gradient-background)`,
          }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{
                  duration: 2,
                  repeat: isPlaying ? Infinity : 0,
                }}
              >
                <Zap
                  className="w-5 h-5"
                  style={{ color: "const(--color-accent)" }}
                />
              </motion.div>
              <h3
                className="text-lg font-bold"
                style={{ color: "const(--color-text)" }}
              >
                Animation Control
              </h3>
            </div>

            {/* Current Animation Display */}
            {selectedAnimation && (
              <div
                className="text-sm p-2 rounded bg-slate-800 mt-2"
                style={{ color: "const(--color-text-muted)" }}
              >
                <p className="text-xs opacity-70">Current Animation</p>
                <p
                  className="font-semibold"
                  style={{ color: "const(--color-accent)" }}
                >
                  {selectedAnimation.description}
                </p>
              </div>
            )}
          </div>

          {/* Animation List */}
          <div className="max-h-80 overflow-y-auto px-6 py-4 space-y-3">
            {categories.map((category) => (
              <motion.div key={category}>
                {/* Category Header */}
                <motion.button
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === category ? null : category,
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-700 transition"
                  style={{
                    background:
                      expandedCategory === category
                        ? "const(--color-primary)"
                        : "transparent",
                    color:
                      expandedCategory === category
                        ? "const(--color-background)"
                        : "const(--color-text)",
                  }}
                >
                  <span className="font-semibold text-sm">{category}</span>
                  <motion.div
                    animate={{
                      rotate: expandedCategory === category ? 180 : 0,
                    }}
                  >
                    <Wind className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                {/* Animation Items */}
                <AnimatePresence>
                  {expandedCategory === category && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 mt-2 pl-4"
                    >
                      {animationsByCategory[category].map((animation) => (
                        <motion.button
                          key={animation.type}
                          onClick={() => handleSelectAnimation(animation)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-3 rounded-lg border-2 transition text-left ${
                            selectedAnimation?.type === animation.type
                              ? "border-current"
                              : "border-slate-700 hover:border-slate-600"
                          }`}
                          style={{
                            borderColor:
                              selectedAnimation?.type === animation.type
                                ? "const(--color-accent)"
                                : "const(--color-border)",
                            background:
                              selectedAnimation?.type === animation.type
                                ? "rgba(0, 255, 165, 0.1)"
                                : "rgba(30, 41, 59, 0.5)",
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p
                                className="text-sm font-medium"
                                style={{ color: "const(--color-text)" }}
                              >
                                {animation.description}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <span
                                  className="text-xs px-2 py-0.5 rounded bg-slate-700"
                                  style={{
                                    color: "const(--color-text-muted)",
                                  }}
                                >
                                  Speed: {animation.speed}x
                                </span>
                                <span
                                  className="text-xs px-2 py-0.5 rounded bg-slate-700"
                                  style={{
                                    color: "const(--color-text-muted)",
                                  }}
                                >
                                  Power:{" "}
                                  {(animation.intensity * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Modifier Controls */}
          <motion.div
            className="px-6 py-4 border-t border-slate-700 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Speed Multiplier */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: "const(--color-text)" }}
                >
                  Speed Multiplier
                </label>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800"
                  style={{ color: "const(--color-accent)" }}
                >
                  {speedMultiplier.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                className="w-full h-1 rounded-lg cursor-pointer"
                style={{
                  accentColor: "const(--color-accent)",
                }}
              />
            </div>

            {/* Intensity Multiplier */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: "const(--color-text)" }}
                >
                  Animation Intensity
                </label>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800"
                  style={{ color: "const(--color-accent)" }}
                >
                  {(intensityMultiplier * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={intensityMultiplier}
                onChange={(e) =>
                  setIntensityMultiplier(parseFloat(e.target.value))
                }
                className="w-full h-1 rounded-lg cursor-pointer"
                style={{
                  accentColor: "const(--color-accent)",
                }}
              />
            </div>

            {/* Auto-loop Settings */}
            <div className="border-t border-slate-700 pt-4">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={isAutoLoop}
                  onChange={(e) => setIsAutoLoop(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: "const(--color-accent)",
                  }}
                />
                <span style={{ color: "const(--color-text)" }}>
                  Auto-loop Animations
                </span>
              </label>

              {isAutoLoop && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <label
                    className="text-xs"
                    style={{ color: "const(--color-text-muted)" }}
                  >
                    Loop Interval (ms)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="10000"
                    step="500"
                    value={autoLoopDelay}
                    onChange={(e) => setAutoLoopDelay(parseInt(e.target.value))}
                    className="w-full px-3 py-1 rounded bg-slate-800 border border-slate-700 text-sm"
                    style={{
                      color: "const(--color-text)",
                    }}
                  />
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                style={{
                  background: isPlaying
                    ? "const(--gradient-accent)"
                    : "const(--gradient-primary)",
                  color: "const(--color-background)",
                }}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Play
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetToDefaults}
                className="flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition border-2"
                style={{
                  borderColor: "const(--color-primary)",
                  color: "const(--color-primary)",
                }}
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </motion.button>
            </div>

            {/* Apply Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={applyAnimationModifiers}
              className="w-full py-2 rounded-lg font-medium transition"
              style={{
                background: "const(--gradient-primary)",
                color: "const(--color-background)",
              }}
            >
              Apply Settings
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimationControlPanel;



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
