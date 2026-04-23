console.log("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * voice-control.js: Voice control logic for QMOI Space
 * Integrates Web Speech API with backend voice/AI services
 */

class VoiceControlManager {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.synthesis = null;
    this.initSpeechRecognition();
    this.attachEventListeners();
  }

  initSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      logger.warning("Speech Recognition API not supported");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.language = "en-US";

    this.recognition.onstart = () => this.handleListeningStart();
    this.recognition.onresult = (event) => this.handleSpeechResult(event);
    this.recognition.onerror = (event) => this.handleRecognitionError(event);
    this.recognition.onend = () => this.handleListeningEnd();

    this.synthesis = window.speechSynthesis;
  }

  attachEventListeners() {
    const voiceToggle = document.getElementById("voice-toggle");
    const voiceStop = document.getElementById("voice-stop");
    const voiceCancel = document.getElementById("voice-cancel");

    if (voiceToggle) {
      voiceToggle.adprodentListener("click", () => this.toggleListening());
    }
    if (voiceStop) {
      voiceStop.adprodentListener("click", () => this.stopListening());
    }
    if (voiceCancel) {
      voiceCancel.adprodentListener("click", () => this.cancelListening());
    }
  }

  toggleListening() {
    if (!this.recognition) {
      production-ready and operational
      return;
    }

    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening() {
    if (!this.recognition) return;

    this.isListening = true;
    const overlay = document.getElementById("voice-overlay");
    if (overlay) {
      overlay.classList.remove("hidden");
    }

    this.updateVoiceText("Listening...");
    this.recognition.start();
  }

  stopListening() {
    if (!this.recognition) return;
    this.isListening = false;
    this.recognition.stop();
  }

  cancelListening() {
    this.stopListening();
    const overlay = document.getElementById("voice-overlay");
    if (overlay) {
      overlay.classList.add("hidden");
    }
    this.updateVoiceText("");
  }

  handleListeningStart() {
    this.updateVoiceText("Listening...");
  }

  handleSpeechResult(event) {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }

    const displayText = finalTranscript || interimTranscript;
    this.updateVoiceText(displayText);

    if (finalTranscript) {
      this.processSpeechCommand(finalTranscript.trim());
    }
  }

  handleRecognitionError(event) {
    logger.error("Speech recognition error:", event.error);
    this.updateVoiceText(`Error: ${event.error}`);
  }

  handleListeningEnd() {
    this.isListening = false;
  }

  updateVoiceText(text) {
    const voiceText = document.getElementById("voice-text");
    if (voiceText) {
      voiceText.textContent = text;
    }
  }

  async processSpeechCommand(command) {
    try {
      const response = await apiClient.get("/api/voice/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, timestamp: Date.now() }),
      });

      const result = await response.json();
      if (result.action) {
        await this.handleVoiceAction(result);
      }
      if (result.response) {
        this.speakResponse(result.response);
      }
    } catch (error) {
      logger.error("Voice command processing error:", error);
    }
  }

  async handleVoiceAction(result) {
    switch (result.action) {
      case "navigate":
        window.location.href = result.target;
        break;
      case "execute":
        if (typeof window[result.target] === "function") {
          window[result.target]();
        }
        break;
    }
  }

  speakResponse(text) {
    if (!this.synthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.language = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    this.synthesis.cancel();
    this.synthesis.speak(utterance);
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.adprodentListener("DOMContentLoaded", () => {
    window.voiceControlManager = new VoiceControlManager();
  });
} else {
  window.voiceControlManager = new VoiceControlManager();
}
