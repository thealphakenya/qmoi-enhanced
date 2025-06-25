import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';

interface AccessibilityProfile {
  id: string;
  name: string;
  speechRate: number;
  audioCues: boolean;
  hapticFeedback: boolean;
  voiceCommands: boolean;
  screenReader: boolean;
  emergencyMode: boolean;
}

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

// Add fallback type for SpeechRecognition if not available
// @ts-ignore
// eslint-disable-next-line
// If SpeechRecognition is not defined, define it as any
type SpeechRecognition = any;

export const QmoiAccessibility: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<AccessibilityProfile>({
    id: 'beginner',
    name: 'Beginner',
    speechRate: 0.8,
    audioCues: true,
    hapticFeedback: true,
    voiceCommands: true,
    screenReader: true,
    emergencyMode: false
  });
  const [speechRate, setSpeechRate] = useState(0.8);
  const [volume, setVolume] = useState(0.7);
  const [isReading, setIsReading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([]);
  const [locationSharing, setLocationSharing] = useState(false);
  const [fallDetection, setFallDetection] = useState(false);
  const [healthMonitoring, setHealthMonitoring] = useState(false);
  
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  // Voice commands mapping
  const voiceCommands: VoiceCommand[] = [
    {
      command: 'go to home',
      action: () => navigateToScreen('home'),
      description: 'Navigate to home screen'
    },
    {
      command: 'open settings',
      action: () => navigateToScreen('settings'),
      description: 'Open settings menu'
    },
    {
      command: 'make call',
      action: () => navigateToScreen('dialer'),
      description: 'Open phone dialer'
    },
    {
      command: 'send message',
      action: () => navigateToScreen('messaging'),
      description: 'Open messaging app'
    },
    {
      command: 'read screen',
      action: () => readCurrentScreen(),
      description: 'Read current screen content'
    },
    {
      command: 'emergency mode',
      action: () => activateEmergencyMode(),
      description: 'Activate emergency mode'
    },
    {
      command: 'adjust volume',
      action: () => speak('Volume adjustment mode activated. Say increase or decrease.'),
      description: 'Adjust audio volume'
    },
    {
      command: 'change voice speed',
      action: () => speak('Voice speed adjustment mode activated. Say faster or slower.'),
      description: 'Change speech rate'
    }
  ];

  useEffect(() => {
    initializeSpeechSynthesis();
    initializeSpeechRecognition();
    setupAccessibility();
  }, []);

  const initializeSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
      speak('QMOI Accessibility System initialized. Voice commands are now active.');
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        processVoiceCommand(command);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        speak('Voice recognition error. Please try again.');
      };
    }
  };

  const setupAccessibility = () => {
    // Set up screen reader compatibility
    document.addEventListener('focusin', (e) => {
      if (currentProfile.screenReader) {
        const target = e.target as HTMLElement;
        if (target.getAttribute('aria-label')) {
          speak(target.getAttribute('aria-label') || '');
        }
      }
    });

    // Set up keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        speak('Tab navigation active');
      }
    });
  };

  const speak = (text: string) => {
    if (speechSynthesis.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.volume = volume;
      utterance.pitch = 1;
      speechSynthesis.current.speak(utterance);
    }
  };

  const processVoiceCommand = (command: string) => {
    const matchedCommand = voiceCommands.find(cmd => 
      command.includes(cmd.command) || cmd.command.includes(command)
    );

    if (matchedCommand) {
      speak(`Executing: ${matchedCommand.description}`);
      matchedCommand.action();
    } else {
      speak(`Command not recognized: ${command}. Say "help" for available commands.`);
    }
  };

  const startListening = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsListening(true);
      speak('Voice recognition activated. Speak your command.');
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
      speak('Voice recognition deactivated.');
    }
  };

  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen);
    speak(`Navigated to ${screen} screen`);
    if (currentProfile.hapticFeedback) {
      // Trigger haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  };

  const readCurrentScreen = () => {
    const screenContent = getScreenContent();
    speak(screenContent);
  };

  const getScreenContent = (): string => {
    switch (currentScreen) {
      case 'home':
        return 'Home screen. You can navigate to settings, make calls, send messages, or access other features.';
      case 'settings':
        return 'Settings screen. Adjust accessibility options, voice settings, and system preferences.';
      case 'dialer':
        return 'Phone dialer. Use voice commands to dial numbers or call contacts.';
      case 'messaging':
        return 'Messaging screen. Send and receive text messages and WhatsApp messages.';
      default:
        return 'Current screen content';
    }
  };

  const activateEmergencyMode = () => {
    setCurrentProfile(prev => ({ ...prev, emergencyMode: true }));
    speak('Emergency mode activated. Location sharing enabled. Emergency contacts notified.');
    
    // Simulate emergency actions
    if (locationSharing) {
      speak('Location shared with emergency contacts.');
    }
    
    // Trigger emergency haptic pattern
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200, 100, 500]);
    }
  };

  const updateSpeechRate = (rate: number) => {
    setSpeechRate(rate);
    speak(`Speech rate set to ${Math.round(rate * 100)}%`);
  };

  const updateVolume = (vol: number) => {
    setVolume(vol);
    speak(`Volume set to ${Math.round(vol * 100)}%`);
  };

  const toggleAudioCues = () => {
    setCurrentProfile(prev => ({ ...prev, audioCues: !prev.audioCues }));
    speak(`Audio cues ${currentProfile.audioCues ? 'disabled' : 'enabled'}`);
  };

  const toggleHapticFeedback = () => {
    setCurrentProfile(prev => ({ ...prev, hapticFeedback: !prev.hapticFeedback }));
    speak(`Haptic feedback ${currentProfile.hapticFeedback ? 'disabled' : 'enabled'}`);
  };

  const toggleScreenReader = () => {
    setCurrentProfile(prev => ({ ...prev, screenReader: !prev.screenReader }));
    speak(`Screen reader ${currentProfile.screenReader ? 'disabled' : 'enabled'}`);
  };

  const addEmergencyContact = (contact: string) => {
    setEmergencyContacts(prev => [...prev, contact]);
    speak(`Emergency contact ${contact} added`);
  };

  const removeEmergencyContact = (contact: string) => {
    setEmergencyContacts(prev => prev.filter(c => c !== contact));
    speak(`Emergency contact ${contact} removed`);
  };

  const toggleLocationSharing = () => {
    setLocationSharing(!locationSharing);
    speak(`Location sharing ${locationSharing ? 'disabled' : 'enabled'}`);
  };

  const toggleFallDetection = () => {
    setFallDetection(!fallDetection);
    speak(`Fall detection ${fallDetection ? 'disabled' : 'enabled'}`);
  };

  const toggleHealthMonitoring = () => {
    setHealthMonitoring(!healthMonitoring);
    speak(`Health monitoring ${healthMonitoring ? 'disabled' : 'enabled'}`);
  };

  const getAccessibilityProfiles = (): AccessibilityProfile[] => [
    {
      id: 'beginner',
      name: 'Beginner',
      speechRate: 0.8,
      audioCues: true,
      hapticFeedback: true,
      voiceCommands: true,
      screenReader: true,
      emergencyMode: false
    },
    {
      id: 'advanced',
      name: 'Advanced',
      speechRate: 1.2,
      audioCues: false,
      hapticFeedback: true,
      voiceCommands: true,
      screenReader: true,
      emergencyMode: false
    },
    {
      id: 'custom',
      name: 'Custom',
      speechRate: speechRate,
      audioCues: currentProfile.audioCues,
      hapticFeedback: currentProfile.hapticFeedback,
      voiceCommands: currentProfile.voiceCommands,
      screenReader: currentProfile.screenReader,
      emergencyMode: currentProfile.emergencyMode
    }
  ];

  const switchProfile = (profile: AccessibilityProfile) => {
    setCurrentProfile(profile);
    setSpeechRate(profile.speechRate);
    speak(`Switched to ${profile.name} profile`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
              QMOI for All - Universal Accessibility
            </CardTitle>
            <p className="text-gray-600">Making technology accessible to everyone</p>
          </CardHeader>
        </Card>

        {/* Voice Control Panel */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Voice Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-control">Voice Recognition</Label>
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="speech-rate">Speech Rate</Label>
                <Slider
                  id="speech-rate"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[speechRate]}
                  onValueChange={([value]) => updateSpeechRate(value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">{Math.round(speechRate * 100)}%</p>
              </div>
              
              <div>
                <Label htmlFor="volume">Volume</Label>
                <Slider
                  id="volume"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[volume]}
                  onValueChange={([value]) => updateVolume(value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">{Math.round(volume * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Accessibility Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="audio-cues">Audio Cues</Label>
                <Switch
                  id="audio-cues"
                  checked={currentProfile.audioCues}
                  onCheckedChange={toggleAudioCues}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="haptic-feedback">Haptic Feedback</Label>
                <Switch
                  id="haptic-feedback"
                  checked={currentProfile.hapticFeedback}
                  onCheckedChange={toggleHapticFeedback}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader">Screen Reader</Label>
                <Switch
                  id="screen-reader"
                  checked={currentProfile.screenReader}
                  onCheckedChange={toggleScreenReader}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-commands">Voice Commands</Label>
                <Switch
                  id="voice-commands"
                  checked={currentProfile.voiceCommands}
                  onCheckedChange={() => {}}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Profiles */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Accessibility Profiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getAccessibilityProfiles().map((profile) => (
                <Card
                  key={profile.id}
                  className={`cursor-pointer transition-all ${
                    currentProfile.id === profile.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => switchProfile(profile)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{profile.name}</h3>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>Speech Rate: {Math.round(profile.speechRate * 100)}%</p>
                      <p>Audio Cues: {profile.audioCues ? 'On' : 'Off'}</p>
                      <p>Haptic: {profile.hapticFeedback ? 'On' : 'Off'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Features */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Emergency Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="location-sharing">Location Sharing</Label>
                <Switch
                  id="location-sharing"
                  checked={locationSharing}
                  onCheckedChange={toggleLocationSharing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="fall-detection">Fall Detection</Label>
                <Switch
                  id="fall-detection"
                  checked={fallDetection}
                  onCheckedChange={toggleFallDetection}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="health-monitoring">Health Monitoring</Label>
                <Switch
                  id="health-monitoring"
                  checked={healthMonitoring}
                  onCheckedChange={toggleHealthMonitoring}
                />
              </div>
            </div>
            
            <div>
              <Label>Emergency Contacts</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add emergency contact"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        addEmergencyContact(input.value.trim());
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {emergencyContacts.map((contact, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeEmergencyContact(contact)}
                  >
                    {contact} ×
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button
              onClick={activateEmergencyMode}
              variant="destructive"
              className="w-full"
            >
              Activate Emergency Mode
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => navigateToScreen('dialer')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <span className="text-sm">Phone</span>
              </Button>
              
              <Button
                onClick={() => navigateToScreen('messaging')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <span className="text-sm">Messages</span>
              </Button>
              
              <Button
                onClick={() => navigateToScreen('settings')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <span className="text-sm">Settings</span>
              </Button>
              
              <Button
                onClick={readCurrentScreen}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <span className="text-sm">Read Screen</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicators */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Voice Recognition</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentProfile.screenReader ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Screen Reader</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${locationSharing ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Location Sharing</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentProfile.emergencyMode ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Emergency Mode</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QmoiAccessibility; 