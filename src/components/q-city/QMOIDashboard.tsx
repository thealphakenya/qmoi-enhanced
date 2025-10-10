"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Volume2,
  Activity,
  Zap,
  Star,
  TrendingUp,
  Cpu,
  Memory,
  HardDrive,
  Wifi,
  Battery,
  Heart,
  Brain,
  Sparkles,
} from "lucide-react";
import { VoiceSelector } from "./VoiceSelector";
import { AvatarSelector } from "./AvatarSelector";
import { useQMOIState } from "./QMOIStateProvider";

export function QMOIDashboard() {
  const { state, updateAvatar, updateVoice, updateMood, updateEnergy } =
    useQMOIState();
  const [activeTab, setActiveTab] = useState("overview");

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "text-yellow-500";
      case "excited":
        return "text-orange-500";
      case "focused":
        return "text-blue-500";
      case "curious":
        return "text-purple-500";
      case "calm":
        return "text-green-500";
      case "professional":
        return "text-gray-500";
      case "playful":
        return "text-pink-500";
      case "wise":
        return "text-indigo-500";
      default:
        return "text-gray-500";
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "text-green-500";
      case "good":
        return "text-blue-500";
      case "fair":
        return "text-yellow-500";
      case "poor":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return "text-green-500";
    if (energy >= 60) return "text-blue-500";
    if (energy >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QMOI Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and control QMOI's state and settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={state.isOnline ? "default" : "secondary"}>
            {state.isOnline ? "Online" : "Offline"}
          </Badge>
          <Badge
            variant="outline"
            className={getHealthColor(state.systemHealth)}
          >
            <Heart className="h-3 w-3 mr-1" />
            {state.systemHealth}
          </Badge>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Avatar */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Avatar
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {state.currentAvatar === "default"
                    ? "Default QMOI"
                    : state.currentAvatar
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Quality: {state.avatarQuality}
                </p>
              </CardContent>
            </Card>

            {/* Current Voice */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Voice
                </CardTitle>
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {state.currentVoice
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Quality: {state.voiceQuality}
                </p>
              </CardContent>
            </Card>

            {/* Current Mood */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Mood
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${getMoodColor(state.mood)}`}
                >
                  {state.mood.charAt(0).toUpperCase() + state.mood.slice(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Energy: {state.energy}%
                </p>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {state.isProcessing ? "Processing" : "Ready"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Response: {state.responseTime}ms
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-muted-foreground">
                      {state.responseTime}ms
                    </span>
                  </div>
                  <Progress
                    value={Math.max(0, 100 - state.responseTime / 2)}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Accuracy</span>
                    <span className="text-sm text-muted-foreground">
                      {state.accuracy}%
                    </span>
                  </div>
                  <Progress value={state.accuracy} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      User Satisfaction
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {state.userSatisfaction}%
                    </span>
                  </div>
                  <Progress value={state.userSatisfaction} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("avatar")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("voice")}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Change Voice
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateMood("happy")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Happy Mood
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateEnergy(Math.min(100, state.energy + 10))}
                >
                  <Battery className="h-4 w-4 mr-2" />
                  Boost Energy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avatar" className="space-y-4">
          <AvatarSelector
            currentVoiceId={state.currentVoice}
            onAvatarChange={updateAvatar}
          />
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <VoiceSelector
            currentAvatarId={state.currentAvatar}
            onVoiceChange={updateVoice}
          />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Health</span>
                  <Badge
                    variant="outline"
                    className={getHealthColor(state.systemHealth)}
                  >
                    {state.systemHealth}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Storage Usage</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* User Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  User Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-upgrade</span>
                  <Badge variant={state.autoUpgrade ? "default" : "secondary"}>
                    {state.autoUpgrade ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-enhance</span>
                  <Badge variant={state.autoEnhance ? "default" : "secondary"}>
                    {state.autoEnhance ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Saver</span>
                  <Badge variant={state.dataSaver ? "default" : "secondary"}>
                    {state.dataSaver ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice Volume</span>
                  <span className="text-sm">{state.voiceVolume}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Task */}
          {state.currentTask && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Current Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm">{state.currentTask}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
