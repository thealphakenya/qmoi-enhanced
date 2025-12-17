import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { VoiceRecognitionService } from "../src/services/VoiceRecognitionService";

interface HumanVoice {
  id: string;
  name: string;
  gender: "male" | "female" | "neutral";
  age: "young" | "adult" | "mature";
  accent: string;
  personality: string;
  pitch: number;
  rate: number;
  volume: number;
  voiceURI: string;
  isDefault: boolean;
}

interface VoiceSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceSelected: (voice: HumanVoice) => void;
}

export const VoiceSelectionPanel: React.FC<VoiceSelectionPanelProps> = ({
  isOpen,
  onClose,
  onVoiceSelected,
}) => {
  const [voices, setVoices] = useState<HumanVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<HumanVoice | null>(null);
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
  });
  const [preferredNames, setPreferredNames] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [voiceService] = useState(() => VoiceRecognitionService.getInstance());

  useEffect(() => {
    if (isOpen) {
      loadVoices();
      loadUserSettings();
    }
  }, [isOpen]);

  const loadVoices = () => {
    const availableVoices = voiceService.getAvailableVoices();
    setVoices(availableVoices);

    const currentVoice = voiceService.getCurrentVoice();
    if (currentVoice) {
      setSelectedVoice(currentVoice);
      setVoiceSettings({
        pitch: currentVoice.pitch,
        rate: currentVoice.rate,
        volume: currentVoice.volume,
      });
    }
  };

  const loadUserSettings = () => {
    const names = voiceService.getPreferredNames();
    setPreferredNames(names);

    // Check if this is first time setup
    const hasUsedVoice = localStorage.getItem("voiceFirstTimeSetup");
    setIsFirstTime(!hasUsedVoice);
  };

  const handleVoiceSelect = (voice: HumanVoice) => {
    setSelectedVoice(voice);
    setVoiceSettings({
      pitch: voice.pitch,
      rate: voice.rate,
      volume: voice.volume,
    });

    // Test the voice
    voiceService.speak(`Hello! I'm ${voice.name}. How can I help you today?`);
  };

  const handleConfirmSelection = () => {
    if (selectedVoice) {
      voiceService.selectVoice(selectedVoice.id);
      voiceService.updateVoiceSettings(voiceSettings);

      // Add preferred names
      preferredNames.forEach((name) => {
        voiceService.addPreferredName(name);
      });

      onVoiceSelected(selectedVoice);
      onClose();
    }
  };

  const handleAddName = () => {
    if (newName.trim() && !preferredNames.includes(newName.trim())) {
      setPreferredNames([...preferredNames, newName.trim()]);
      setNewName("");
    }
  };

  const handleRemoveName = (name: string) => {
    setPreferredNames(preferredNames.filter((n) => n !== name));
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return "👨";
      case "female":
        return "👩";
      case "neutral":
        return "👤";
      default:
        return "👤";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎤{" "}
            {isFirstTime ? "Choose Your AI Voice Assistant" : "Voice Settings"}
          </CardTitle>
          {isFirstTime && (
            <p className="text-muted-foreground">
              Welcome! Please select your preferred AI voice assistant. You can
              change this anytime in settings.
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Voice Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Voices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voices.map((voice) => (
                <Card
                  key={voice.id}
                  className={`cursor-pointer transition-all ${
                    selectedVoice?.id === voice.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleVoiceSelect(voice)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">
                        {getGenderIcon(voice.gender)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{voice.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {voice.accent}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{voice.age}</Badge>
                      <Badge variant="outline">{voice.gender}</Badge>
                      {voice.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {voice.personality}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Pitch: {voice.pitch}</span>
                        <span>Rate: {voice.rate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Voice Settings */}
          {selectedVoice && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label>Pitch</Label>
                  <Slider
                    value={[voiceSettings.pitch]}
                    onValueChange={([value]) =>
                      setVoiceSettings({ ...voiceSettings, pitch: value })
                    }
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Lower</span>
                    <span>Higher</span>
                  </div>
                </div>

                <div>
                  <Label>Speed</Label>
                  <Slider
                    value={[voiceSettings.rate]}
                    onValueChange={([value]) =>
                      setVoiceSettings({ ...voiceSettings, rate: value })
                    }
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>

                <div>
                  <Label>Volume</Label>
                  <Slider
                    value={[voiceSettings.volume]}
                    onValueChange={([value]) =>
                      setVoiceSettings({ ...voiceSettings, volume: value })
                    }
                    min={0.0}
                    max={1.0}
                    step={0.1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Quiet</span>
                    <span>Loud</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferred Names */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Preferred Names</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Add names you'd like the AI to call you by. The AI will randomly
              use these names when addressing you.
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter a name..."
                className="flex-1 px-3 py-2 border rounded-md"
                onKeyPress={(e) => e.key === "Enter" && handleAddName()}
              />
              <Button onClick={handleAddName} size="sm">
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {preferredNames.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="cursor-pointer"
                >
                  {name}
                  <button
                    onClick={() => handleRemoveName(name)}
                    className="ml-2 text-xs hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSelection} disabled={!selectedVoice}>
              {isFirstTime ? "Start Using Voice Assistant" : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
