'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Volume2, Play, Pause, Settings, Star, Zap, Mic, Headphones } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { avatarsConfig, voiceProfiles, qualityLevels } from './avatarsConfig';

interface VoiceProfile {
  id: string;
  name: string;
  type: string;
  quality: string;
}

interface VoiceSelectorProps {
  currentAvatarId?: string;
  onVoiceChange?: (voiceId: string) => void;
  className?: string;
}

export function VoiceSelector({ currentAvatarId, onVoiceChange, className }: VoiceSelectorProps) {
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [quality, setQuality] = useState('enhanced');
  const [autoAdapt, setAutoAdapt] = useState(true);
  const [previewText, setPreviewText] = useState('Hello! I am QMOI, your AI assistant.');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get current avatar's default voice
  const currentAvatar = avatarsConfig.find(avatar => avatar.id === currentAvatarId);
  const defaultVoice = currentAvatar?.voiceProfile || 'professional-male';

  useEffect(() => {
    // Load saved voice preference or use avatar default
    const savedVoice = localStorage.getItem('qmoi-voice-preference');
    setSelectedVoice(savedVoice || defaultVoice);
  }, [defaultVoice]);

  const handleVoiceChange = async (voiceId: string) => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('qmoi-voice-preference', voiceId);
      setSelectedVoice(voiceId);

      // Call API to switch voice
      const response = await fetch('/api/qmoi/voice-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch', voiceId })
      });

      if (!response.ok) throw new Error('Failed to switch voice');

      // Notify parent component
      onVoiceChange?.(voiceId);

      toast({
        title: 'Voice Updated',
        description: `QMOI is now using the ${voiceProfiles.find(v => v.id === voiceId)?.name} voice.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to switch voice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    try {
      const response = await fetch('/api/qmoi/voice-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId: selectedVoice,
          text: previewText,
          quality,
          volume: volume[0]
        })
      });

      if (!response.ok) throw new Error('Failed to play preview');

      // Simulate audio playback
      setTimeout(() => setIsPlaying(false), 3000);
    } catch (error) {
      toast({
        title: 'Preview Error',
        description: 'Could not play voice preview.',
        variant: 'destructive',
      });
      setIsPlaying(false);
    }
  };

  const getVoiceQuality = (voiceId: string) => {
    const profile = voiceProfiles.find(v => v.id === voiceId);
    return profile?.quality || 'standard';
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'ai-enhanced': return 'bg-purple-500';
      case 'ultra': return 'bg-blue-500';
      case 'enhanced': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredVoices = voiceProfiles.filter(voice => {
    if (autoAdapt && currentAvatar) {
      // Auto-adapt: show voices that match avatar type
      return voice.type === currentAvatar.type || voice.type === 'human';
    }
    return true;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Settings
        </CardTitle>
        <CardDescription>
          Choose QMOI's voice and customize audio settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="voices" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voices">Voices</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="voices" className="space-y-4">
            <div className="grid gap-3">
              {filteredVoices.map((voice) => (
                <div
                  key={voice.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                    selectedVoice === voice.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => handleVoiceChange(voice.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{voice.name}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getQualityColor(voice.quality)}`}
                        >
                          {voice.quality}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground capitalize">
                        {voice.type} voice
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {voice.quality === 'ai-enhanced' && <Zap className="h-4 w-4 text-purple-500" />}
                    {voice.quality === 'ultra' && <Star className="h-4 w-4 text-blue-500" />}
                    {selectedVoice === voice.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-adapt"
                checked={autoAdapt}
                onCheckedChange={setAutoAdapt}
              />
              <label htmlFor="auto-adapt" className="text-sm">
                Auto-adapt voice to avatar type
              </label>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Preview Text</label>
              <textarea
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Enter text to preview the voice..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handlePreview}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Stop' : 'Preview'}
              </Button>
              
              <div className="flex items-center gap-2 flex-1">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm w-8">{volume[0]}%</span>
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">
                Current Voice: <span className="font-medium">{voiceProfiles.find(v => v.id === selectedVoice)?.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Quality: <span className="font-medium">{getVoiceQuality(selectedVoice)}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Voice Quality</label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(qualityLevels).map(([key, level]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{level.name}</span>
                          {key === 'ai-enhanced' && <Zap className="h-4 w-4 text-purple-500" />}
                          {key === 'ultra' && <Star className="h-4 w-4 text-blue-500" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {qualityLevels[quality as keyof typeof qualityLevels]?.description}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Advanced Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-enhance voice quality</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Adapt to conversation context</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Background noise reduction</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emotion detection</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {currentAvatar && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Headphones className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Avatar Voice Pairing</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentAvatar.name} is optimized for {currentAvatar.voiceProfile} voice
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 