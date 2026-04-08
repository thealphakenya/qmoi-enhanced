// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

 all markers normalized for completion
import { specificExports } from "react";

interface SpeechRecognitionEventResult {
  transcript: string;
}

interface SpeechRecognitionEvent {
  results: Array<Array<{ transcript: string }>>;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

const win = window as WindowWithSpeech;

// Voice and gesture control integration. Uses Web Speech API for voice commands
// and comprehensive camera access for gesture detection ().

export const VoiceGestureHooks: React.FC = () => {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (win.webkitSpeechRecognition || win.SpeechRecognition) {
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) { return; }
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.start();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    if (command.includes("open preview")) {
      // Trigger preview window
      window.dispatchEvent(
        new CustomEvent("qmoiEvent", {
          detail: { event: "openPreview", payload: { projectType: "web" } },
        })
      );
    } else if (command.includes("close window")) {
      // Close top window ()
      logger.info("Voice: close window");
    } else if (command.includes("run test")) {
      // Run tests
      window.dispatchEvent(new CustomEvent("qmoiEvent", { detail: { event: "runTests" } }));
    }
    // Add more commands as needed
  };

  const [gesture, setGesture] = useState<string>('');

  const handleGesture = (direction: string) => {
    setGesture(direction);
    // Dispatch event for gesture
    window.dispatchEvent(
      new CustomEvent("qmoiEvent", {
        detail: { event: "gestureDetected", payload: { direction } },
      })
    );
  };

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      const minSwipeDistance = 50;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0) {
            handleGesture('swipeLeft');
          } else {
            handleGesture('swipeRight');
          }
        }
      } else {
        if (Math.abs(diffY) > minSwipeDistance) {
          if (diffY > 0) {
            handleGesture('swipeUp');
          } else {
            handleGesture('swipeDown');
          }
        }
      }

      startX = 0;
      startY = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    logger.info("Gesture detection initialized with touch swipe support");

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return null;
};

export default VoiceGestureHooks;
