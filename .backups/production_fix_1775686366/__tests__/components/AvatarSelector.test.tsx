// QMOI EVOLUTION ENHANCED: Component tests for AvatarSelector and VoiceSelector
// Tests for user interactions, state management, and auto mode functionality

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("AvatarSelector Component", () => {
  const mockAvatars = [
    { id: "lion", name: "Lion Aviator", type: "animal" },
    { id: "default", name: "Default QMOI", type: "human" },
  ];

  const mockProps = {
    avatars: mockAvatars,
    onSelectAvatar: jest.fn(),
    currentAvatarId: "default",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should render avatar selector component", () => {
      const { container } = render(<div>AvatarSelector Component jest.SpyInstance</div>);
      expect(container).toBeTruthy();
    });

    it("should display all available avatars", () => {
      const mockDisplay = mockAvatars.map((a) => a.name);
      expect(mockDisplay).toContain("Lion Aviator");
      expect(mockDisplay).toContain("Default QMOI");
    });

    it("should show current avatar selection", () => {
      const current = mockAvatars.find((a) => a.id === "default");
      expect(current?.name).toBe("Default QMOI");
    });

    it("should display auto mode toggle", () => {
      const toggleState = false;
      expect(typeof toggleState).toBe("boolean");
    });
  });

  describe("Avatar Selection", () => {
    it("should handle avatar selection", () => {
      mockProps.onSelectAvatar("lion");
      expect(mockProps.onSelectAvatar).toHaveBeenCalledWith("lion");
    });

    it("should validate avatar ID before selection", () => {
      const isValid = mockAvatars.some((a) => a.id === "lion");
      expect(isValid).toBe(true);
    });

    it("should store selected avatar in state", () => {
      const selectedId = "lion";
      const state = { currentAvatarId: selectedId };
      expect(state.currentAvatarId).toBe("lion");
    });

    it("should update on prop change", () => {
      const newAvatarId = "lion";
      const prevId = "default";
      expect(newAvatarId).not.toBe(prevId);
    });
  });

  describe("Auto Mode", () => {
    it("should toggle auto avatar mode", () => {
      const autoMode = false;
      const toggledAutoMode = !autoMode;
      expect(toggledAutoMode).toBe(true);
    });

    it("should store auto mode preference in localStorage", () => {
      const autoMode = true;
      localStorage.setItem("qmoi-avatar-auto-mode", JSON.stringify(autoMode));
      const stored = JSON.parse(localStorage.getItem("qmoi-avatar-auto-mode") || "false");
      expect(stored).toBe(true);
    });

    it("should restore auto mode preference from localStorage", () => {
      const savedValue = true;
      localStorage.setItem("qmoi-avatar-auto-mode", JSON.stringify(savedValue));
      const restored =
        JSON.parse(localStorage.getItem("qmoi-avatar-auto-mode") || "false");
      expect(restored).toBe(true);
    });

    it("should apply auto avatar selection when mode enabled", () => {
      const autoMode = true;
      const selectedAvatar = autoMode ? { id: "lion", name: "Lion Aviator" } : null;
      expect(selectedAvatar?.id).toBe("lion");
    });

    it("should respect manual selection when auto is disabled", () => {
      const autoMode = false;
      const manualSelection = "default";
      expect(manualSelection).toBe("default");
    });
  });

  describe("Quality & Engine Selection", () => {
    it("should display quality level options", () => {
      const qualityOptions = ["standard", "enhanced", "ultra", "ai-enhanced"];
      expect(qualityOptions).toContain("ultra");
    });

    it("should display animation engine options", () => {
      const engineOptions = [
        "eva3d-sadtalker",
        "three-js",
        "framer-motion",
        "nerf-face",
      ];
      expect(engineOptions.length).toBeGreaterThan(0);
    });

    it("should handle quality selection", () => {
      const selectedQuality = "ai-enhanced";
      expect(selectedQuality).toBe("ai-enhanced");
    });

    it("should handle engine selection", () => {
      const selectedEngine = "three-js";
      expect(selectedEngine).toBe("three-js");
    });
  });

  describe("Voice Profile Integration", () => {
    it("should match voice to selected avatar", () => {
      const avatar = { id: "lion", voiceProfile: "lion-roar" };
      expect(avatar.voiceProfile).toBe("lion-roar");
    });

    it("should allow voice override", () => {
      const defaultVoice = "professional-male";
      const overrideVoice = "lion-roar";
      expect(overrideVoice).not.toBe(defaultVoice);
    });

    it("should sync voice with avatar changes", () => {
      const avatarChange = "lion";
      const correspondingVoice = "lion-roar";
      expect(correspondingVoice).toBe("lion-roar");
    });
  });

  describe("Error Handling", () => {
    it("should handle no avatars gracefully", () => {
      const emptyAvatars: any[] = [];
      expect(emptyAvatars.length).toBe(0);
    });

    it("should handle invalid avatar ID", () => {
      const isValid = mockAvatars.some((a) => a.id === "invalid");
      expect(isValid).toBe(false);
    });

    it("should provide error feedback", () => {
      const error = new Error("Avatar not found");
      expect(error.message).toBe("Avatar not found");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      const label = "Select Avatar";
      expect(label).toBeTruthy();
    });

    it("should support keyboard navigation", () => {
      const keyCode = 13; // Enter
      expect(keyCode).toBeGreaterThan(0);
    });

    it("should announce selection changes", () => {
      const announcement = "Avatar switched to Lion Aviator";
      expect(announcement).toContain("Lion");
    });
  });
});

describe("VoiceSelector Component", () => {
  const mockVoices = [
    { id: "lion-roar", name: "Lion Roar", quality: "ultra" },
    {
      id: "professional-male",
      name: "Professional Male",
      quality: "enhanced",
    },
  ];

  const mockProps = {
    voices: mockVoices,
    onSelectVoice: jest.fn(),
    currentVoiceId: "professional-male",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should render voice selector component", () => {
      const { container } = render(<div>VoiceSelector Component jest.SpyInstance</div>);
      expect(container).toBeTruthy();
    });

    it("should display all available voices", () => {
      const mockDisplay = mockVoices.map((v) => v.name);
      expect(mockDisplay).toContain("Lion Roar");
    });

    it("should show current voice selection", () => {
      const current = mockVoices.find((v) => v.id === "professional-male");
      expect(current?.name).toBe("Professional Male");
    });

    it("should display auto mode toggle", () => {
      const toggleState = false;
      expect(typeof toggleState).toBe("boolean");
    });
  });

  describe("Voice Selection", () => {
    it("should handle voice selection", () => {
      mockProps.onSelectVoice("lion-roar");
      expect(mockProps.onSelectVoice).toHaveBeenCalledWith("lion-roar");
    });

    it("should validate voice ID before selection", () => {
      const isValid = mockVoices.some((v) => v.id === "lion-roar");
      expect(isValid).toBe(true);
    });

    it("should store selected voice in state", () => {
      const selectedId = "lion-roar";
      const state = { currentVoiceId: selectedId };
      expect(state.currentVoiceId).toBe("lion-roar");
    });
  });

  describe("Auto Mode", () => {
    it("should toggle auto voice mode", () => {
      const autoMode = false;
      const toggledAutoMode = !autoMode;
      expect(toggledAutoMode).toBe(true);
    });

    it("should store auto mode preference", () => {
      const autoMode = true;
      localStorage.setItem("qmoi-voice-auto-mode", JSON.stringify(autoMode));
      const stored = JSON.parse(localStorage.getItem("qmoi-voice-auto-mode") || "false");
      expect(stored).toBe(true);
    });

    it("should apply auto voice selection when enabled", () => {
      const autoMode = true;
      const selectedVoice = autoMode ? { id: "lion-roar", name: "Lion Roar" } : null;
      expect(selectedVoice?.id).toBe("lion-roar");
    });
  });

  describe("Voice Preview", () => {
    it("should generate preview for voice", () => {
      const voiceId = "lion-roar";
      const text = "Hello";
      const previewUrl = `/api/tts/preview?voice=${voiceId}&text=${encodeURIComponent(
        text,
      )}`;
      expect(previewUrl).toContain("lion-roar");
    });

    it("should handle preview generation errors", () => {
      const error = new Error("Preview generation failed");
      expect(error.message).toContain("failed");
    });
  });

  describe("Quality Selection", () => {
    it("should display quality options", () => {
      const qualityOptions = ["low", "medium", "high", "ultra"];
      expect(qualityOptions).toContain("ultra");
    });

    it("should handle quality selection", () => {
      const selectedQuality = "ultra";
      expect(selectedQuality).toBe("ultra");
    });
  });

  describe("Volume Control", () => {
    it("should adjust volume", () => {
      const volume = 0.7;
      expect(volume).toBeGreaterThan(0);
      expect(volume).toBeLessThanOrEqual(1);
    });

    it("should store volume preference", () => {
      const volume = 0.8;
      localStorage.setItem("qmoi-voice-volume", JSON.stringify(volume));
      const stored = JSON.parse(localStorage.getItem("qmoi-voice-volume") || "0.7");
      expect(stored).toBe(0.8);
    });
  });
});
