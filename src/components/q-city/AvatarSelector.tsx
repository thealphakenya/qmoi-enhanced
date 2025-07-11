"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Settings,
  Star,
  Zap,
  Eye,
  Play,
  Download,
  RefreshCw,
  Palette,
  Volume2,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  avatarsConfig,
  animationEngines,
  qualityLevels,
  voiceProfiles,
} from "./avatarsConfig";

interface AvatarSelectorProps {
  currentVoiceId?: string;
  onAvatarChange?: (avatarId: string) => void;
  className?: string;
}

export function AvatarSelector({
  currentVoiceId,
  onAvatarChange,
  className,
}: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [selectedEngine, setSelectedEngine] = useState<string>("all");
  const [autoUpgrade, setAutoUpgrade] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  // Get current voice's default avatar
  const currentVoice = voiceProfiles.find(
    (voice) => voice.id === currentVoiceId,
  );
  const defaultAvatar =
    avatarsConfig.find((avatar) => avatar.voiceProfile === currentVoiceId) ||
    avatarsConfig[0];

  useEffect(() => {
    // Load saved avatar preference or use voice default
    const savedAvatar = localStorage.getItem("qmoi-avatar-preference");
    setSelectedAvatar(savedAvatar || defaultAvatar.id);
  }, [defaultAvatar.id]);

  const handleAvatarChange = async (avatarId: string) => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem("qmoi-avatar-preference", avatarId);
      setSelectedAvatar(avatarId);

      // Call API to switch avatar
      const response = await fetch("/api/qmoi/avatars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "switch", avatarId }),
      });

      if (!response.ok) throw new Error("Failed to switch avatar");

      // Notify parent component
      onAvatarChange?.(avatarId);

      toast({
        title: "Avatar Updated",
        description: `QMOI is now using the ${avatarsConfig.find((a) => a.id === avatarId)?.name} avatar.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (avatarId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/qmoi/avatars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upgrade", avatarId }),
      });

      if (!response.ok) throw new Error("Failed to upgrade avatar");

      toast({
        title: "Avatar Upgraded",
        description: "Avatar has been successfully upgraded with new features.",
      });
    } catch (error) {
      toast({
        title: "Upgrade Error",
        description: "Failed to upgrade avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnhance = async (avatarId: string) => {
    setIsLoading(true);
    try {
      const avatar = avatarsConfig.find((a) => a.id === avatarId);
      const response = await fetch("/api/qmoi/avatars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance",
          avatarId,
          quality: avatar?.qualityLevel,
          engine: avatar?.animationEngine,
        }),
      });

      if (!response.ok) throw new Error("Failed to enhance avatar");

      toast({
        title: "Avatar Enhanced",
        description:
          "Avatar has been enhanced with improved quality and features.",
      });
    } catch (error) {
      toast({
        title: "Enhancement Error",
        description: "Failed to enhance avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "ai-enhanced":
        return "bg-purple-500";
      case "ultra":
        return "bg-blue-500";
      case "enhanced":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEngineColor = (engine: string) => {
    switch (engine) {
      case "eva3d-sadtalker":
        return "bg-purple-500";
      case "gaussian-splatting":
        return "bg-blue-500";
      case "three-js":
        return "bg-green-500";
      case "luma-ai":
        return "bg-orange-500";
      case "pika-labs":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredAvatars = avatarsConfig.filter((avatar) => {
    if (selectedCategory !== "all" && avatar.category !== selectedCategory)
      return false;
    if (selectedQuality !== "all" && avatar.qualityLevel !== selectedQuality)
      return false;
    if (selectedEngine !== "all" && avatar.animationEngine !== selectedEngine)
      return false;
    return true;
  });

  const categories = [
    "all",
    ...Array.from(new Set(avatarsConfig.map((a) => a.category))),
  ];
  const qualities = ["all", ...Object.keys(qualityLevels)];
  const engines = ["all", ...Object.keys(animationEngines)];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Avatar Settings
        </CardTitle>
        <CardDescription>
          Choose QMOI's avatar and customize appearance settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="avatars" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="avatars">Avatars</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="avatars" className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedQuality}
                onValueChange={setSelectedQuality}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quality" />
                </SelectTrigger>
                <SelectContent>
                  {qualities.map((quality) => (
                    <SelectItem key={quality} value={quality}>
                      {quality === "all"
                        ? "All Qualities"
                        : qualityLevels[quality as keyof typeof qualityLevels]
                            ?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                <SelectTrigger>
                  <SelectValue placeholder="Engine" />
                </SelectTrigger>
                <SelectContent>
                  {engines.map((engine) => (
                    <SelectItem key={engine} value={engine}>
                      {engine === "all"
                        ? "All Engines"
                        : animationEngines[
                            engine as keyof typeof animationEngines
                          ]?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Avatar Grid */}
            <div className="grid gap-4">
              {filteredAvatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                    selectedAvatar === avatar.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => handleAvatarChange(avatar.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{avatar.name}</span>
                        {avatar.isPremium && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                        {avatar.autoUpgrade && (
                          <RefreshCw className="h-4 w-4 text-blue-500" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {avatar.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getQualityColor(avatar.qualityLevel)}`}
                        >
                          {avatar.qualityLevel}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getEngineColor(avatar.animationEngine)}`}
                        >
                          {animationEngines[avatar.animationEngine]?.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {avatar.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedAvatar === avatar.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgrade(avatar.id);
                      }}
                      disabled={isLoading}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnhance(avatar.id);
                      }}
                      disabled={isLoading}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-upgrade"
                checked={autoUpgrade}
                onCheckedChange={setAutoUpgrade}
              />
              <label htmlFor="auto-upgrade" className="text-sm">
                Auto-upgrade avatars with new features
              </label>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <User className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">
                  {avatarsConfig.find((a) => a.id === selectedAvatar)?.name}
                </p>
                <p className="text-sm opacity-80">
                  Preview mode - Avatar will appear here
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? "Stop Preview" : "Start Preview"}
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Demo Animation
              </Button>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">
                Current Avatar:{" "}
                <span className="font-medium">
                  {avatarsConfig.find((a) => a.id === selectedAvatar)?.name}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Engine:{" "}
                <span className="font-medium">
                  {
                    animationEngines[
                      avatarsConfig.find((a) => a.id === selectedAvatar)
                        ?.animationEngine || "framer-motion"
                    ]?.name
                  }
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Quality:{" "}
                <span className="font-medium">
                  {
                    avatarsConfig.find((a) => a.id === selectedAvatar)
                      ?.qualityLevel
                  }
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Animation Quality</label>
                <Select
                  value={selectedQuality}
                  onValueChange={setSelectedQuality}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(qualityLevels).map(([key, level]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{level.name}</span>
                          {key === "ai-enhanced" && (
                            <Zap className="h-4 w-4 text-purple-500" />
                          )}
                          {key === "ultra" && (
                            <Star className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {
                    qualityLevels[selectedQuality as keyof typeof qualityLevels]
                      ?.description
                  }
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Advanced Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-enhance avatar quality</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Real-time animation optimization
                    </span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Physics-based animations</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Emotion detection and response
                    </span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {currentVoice && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Volume2 className="h-4 w-4 text-green-500" />
              <span className="font-medium">Voice-Avatar Pairing</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentVoice.name} voice is optimized for compatible avatars
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
