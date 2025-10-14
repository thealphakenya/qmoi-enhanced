import React, { useState, useEffect, useRef } from "react";
import { useMaster } from "./MasterContext";
import { FaBrain, FaLanguage, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

interface QmoiKeyboardProps {
  isVisible: boolean;
  onTextChange: (text: string) => void;
  onSend?: () => void;
  language?: "en" | "sw";
  theme?: "light" | "dark" | "auto";
}

interface KeyboardLayout {
  en: string[][];
  sw: string[][];
}

interface Prediction {
  word: string;
  confidence: number;
  language: "en" | "sw";
}

export const QmoiKeyboard: React.FC<QmoiKeyboardProps> = ({
  isVisible,
  onTextChange,
  onSend,
  language = "en",
  theme = "auto",
}) => {
  const { isMaster } = useMaster();

  const [currentText, setCurrentText] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isAILearning, setIsAILearning] = useState(true);
  const [swahiliMode, setSwahiliMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoCorrect, setAutoCorrect] = useState(true);

  const recognitionRef = useRef<any>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const keyboardLayouts: KeyboardLayout = {
    en: [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["z", "x", "c", "v", "b", "n", "m", "⌫"],
      ["123", "🌐", "🎤", "space", "↵"],
    ],
    sw: [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["z", "x", "c", "v", "b", "n", "m", "⌫"],
      ["123", "🌐", "🎤", "space", "↵"],
    ],
  };

  const swahiliWords = [
    "jambo",
    "asante",
    "karibu",
    "hakuna",
    "matata",
    "sana",
    "mzuri",
    "nzuri",
    "habari",
    "gani",
    "nzuri",
    "safi",
    "poa",
    "sawa",
    "hakuna",
    "shida",
    "tafadhali",
    "samahani",
    "pole",
    "nina",
    "wewe",
    "sisi",
    "nyinyi",
    "wao",
    "mimi",
    "yeye",
    "sisi",
    "nyinyi",
    "wao",
    "hii",
    "hizi",
    "huyu",
    "hawa",
  ];

  const englishWords = [
    "hello",
    "world",
    "good",
    "morning",
    "afternoon",
    "evening",
    "night",
    "thank",
    "you",
    "please",
    "sorry",
    "excuse",
    "me",
    "how",
    "are",
    "fine",
    "well",
    "bad",
    "great",
    "excellent",
    "wonderful",
    "amazing",
  ];

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === "sw" ? "sw-KE" : "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          handleVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  }, [language]);

  useEffect(() => {
    // AI learning mode - analyze typing patterns
    if (isAILearning && currentText.length > 0) {
      analyzeTypingPattern(currentText);
    }
  }, [currentText, isAILearning]);

  const analyzeTypingPattern = (text: string) => {
    // AI analyzes typing patterns and learns user preferences
    const words = text.toLowerCase().split(/\s+/);
    const wordFrequency: Record<string, number> = {};

    words.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    // Store learning data
    localStorage.setItem(
      "qmoi-keyboard-learning",
      JSON.stringify({
        wordFrequency,
        language,
        timestamp: Date.now(),
      }),
    );
  };

  const generatePredictions = (input: string): Prediction[] => {
    const predictions: Prediction[] = [];
    const words = language === "sw" ? swahiliWords : englishWords;

    if (input.length > 0) {
      const matchingWords = words.filter((word) =>
        word.toLowerCase().startsWith(input.toLowerCase()),
      );

      matchingWords.slice(0, 5).forEach((word) => {
        predictions.push({
          word,
          confidence: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
          language: language as "en" | "sw",
        });
      });
    }

    return predictions.sort((a, b) => b.confidence - a.confidence);
  };

  const handleKeyPress = (key: string) => {
    let newText = currentText;

    switch (key) {
      case "⌫":
        newText = currentText.slice(0, -1);
        break;
      case "space":
        newText = currentText + " ";
        break;
      case "↵":
        if (onSend) onSend();
        return;
      case "🌐":
        setSwahiliMode(!swahiliMode);
        return;
      case "🎤":
        toggleVoiceInput();
        return;
      case "123":
        // Toggle to numbers/symbols
        return;
      default:
        newText = currentText + key;
    }

    setCurrentText(newText);
    onTextChange(newText);

    // Generate predictions
    const newPredictions = generatePredictions(newText.split(" ").pop() || "");
    setPredictions(newPredictions);
  };

  const handleVoiceInput = (transcript: string) => {
    const newText = currentText + " " + transcript;
    setCurrentText(newText);
    onTextChange(newText);
    setIsListening(false);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const selectPrediction = (prediction: Prediction) => {
    const words = currentText.split(" ");
    words[words.length - 1] = prediction.word;
    const newText = words.join(" ") + " ";

    setCurrentText(newText);
    onTextChange(newText);
    setPredictions([]);
  };

  const getThemeClass = () => {
    if (theme === "auto") {
      return "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100";
    }
    return theme === "dark"
      ? "bg-gray-800 text-gray-100"
      : "bg-gray-100 text-gray-900";
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 ${getThemeClass()} border-t`}
    >
      {/* Predictions Bar */}
      {predictions.length > 0 && (
        <div className="flex gap-2 p-2 overflow-x-auto bg-white dark:bg-gray-700 border-b">
          {predictions.map((prediction, index) => (
            <button
              key={index}
              onClick={() => selectPrediction(prediction)}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm whitespace-nowrap"
            >
              {prediction.word}
            </button>
          ))}
        </div>
      )}

      {/* Text Input Area */}
      <div className="p-2">
        <textarea
          ref={textAreaRef}
          value={currentText}
          onChange={(e) => {
            setCurrentText(e.target.value);
            onTextChange(e.target.value);
          }}
          placeholder={language === "sw" ? "Andika hapa..." : "Type here..."}
          className="w-full p-2 border rounded resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={2}
        />
      </div>

      {/* Keyboard Layout */}
      <div className="p-2">
        {keyboardLayouts[language].map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 mb-1">
            {row.map((key, keyIndex) => (
              <button
                key={keyIndex}
                onClick={() => handleKeyPress(key)}
                className={`
                  flex-1 h-12 rounded-lg font-medium text-sm
                  ${key === "space" ? "flex-[3]" : ""}
                  ${key === "⌫" || key === "↵" ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100"}
                  ${key === "🌐" && swahiliMode ? "bg-green-500 text-white" : ""}
                  ${key === "🎤" && isListening ? "bg-red-500 text-white" : ""}
                  hover:bg-gray-300 dark:hover:bg-gray-500
                `}
              >
                {key === "🌐" ? (swahiliMode ? "🇹🇿" : "🌐") : key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* AI Status Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 text-xs">
        <div className="flex items-center gap-2">
          {React.createElement(FaBrain as React.ElementType, {
            className: `${isAILearning ? "text-green-500" : "text-gray-400"}`,
          })}
          <span>{isAILearning ? "AI Learning" : "AI Idle"}</span>
        </div>

        <div className="flex items-center gap-2">
          {React.createElement(FaLanguage as React.ElementType, {
            className: `${swahiliMode ? "text-blue-500" : "text-gray-400"}`,
          })}
          <span>{swahiliMode ? "Kiswahili" : "English"}</span>
        </div>

        <div className="flex items-center gap-2">
          {voiceEnabled
            ? React.createElement(FaVolumeUp as React.ElementType, {
                className: "text-green-500",
              })
            : React.createElement(FaVolumeMute as React.ElementType, {
                className: "text-gray-400",
              })}
          <span>{isListening ? "Listening..." : "Voice"}</span>
        </div>
      </div>

      {/* Master Controls */}
      {isMaster && (
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900 border-t">
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={isAILearning}
                onChange={(e) => setIsAILearning(e.target.checked)}
                className="w-3 h-3"
              />
              AI Learning
            </label>

            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={autoCorrect}
                onChange={(e) => setAutoCorrect(e.target.checked)}
                className="w-3 h-3"
              />
              Auto Correct
            </label>

            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="w-3 h-3"
              />
              Voice Input
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
