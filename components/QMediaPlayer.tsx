"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Cast,
  Monitor,
  Speaker,
  Settings,
  Music,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: "audio" | "video" | "image" | "document" | "stream";
  duration: number;
  artist?: string;
  album?: string;
  thumbnail?: string;
}
interface PlaylistItem extends MediaItem {
  position: number;
}
interface CastingDevice {
  id: string;
  name: string;
  type: "chromecast" | "airplay" | "dlna" | "qcity" | "bluetooth";
  volume: number;
  status: "ready" | "casting" | "paused";
}
interface QMediaPlayerProps {
  initialMedia?: MediaItem;
  playlist?: PlaylistItem[];
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  floating?: boolean;
  className?: string;
}
const defaultPlaylist: PlaylistItem[] = [
  {
    id: "track-1",
    title: "Aurora Pulse",
    url: "https://example.com/media/aurora-pulse.mp3",
    type: "audio",
    duration: 218,
    artist: "QMOI Synth",
    album: "Nebula Sessions",
    position: 0,
  },
  {
    id: "track-2",
    title: "Voyager Lights",
    url: "https://example.com/media/voyager-lights.mp3",
    type: "audio",
    duration: 192,
    artist: "QMOI Orchestra",
    album: "Spaceflow",
    position: 1,
  },
  {
    id: "track-3",
    title: "Horizon Drive",
    url: "https://example.com/media/horizon-drive.mp4",
    type: "video",
    duration: 256,
    artist: "QMOI Vision",
    album: "Future Frames",
    position: 2,
  },
];
const defaultCastingDevices: CastingDevice[] = [
  {
    id: "device-1",
    name: "Living Room Cast",
    type: "chromecast",
    volume: 0.8,
    status: "ready",
  },
  {
    id: "device-2",
    name: "Conference AirPlay",
    type: "airplay",
    volume: 0.6,
    status: "paused",
  },
  {
    id: "device-3",
    name: "QCity Display",
    type: "qcity",
    volume: 0.9,
    status: "ready",
  },
];
const QMediaPlayer: React.FC<QMediaPlayerProps> = ({
  initialMedia,
  playlist = defaultPlaylist,
  onClose,
  onMinimize,
  onMaximize,
  floating = false,
  className = "",
}) => {
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(
    initialMedia || playlist[0] || null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentMedia?.duration || 0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCastingDevices, setActiveCastingDevices] = useState<string[]>([]);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [selectedTab, setSelectedTab] = useState("playback");
  const [castDevices] = useState<CastingDevice[]>(defaultCastingDevices);
  const animationFrame = useRef<number | null>(null);
  useEffect(() => {
    if (!currentMedia) return;
    setDuration(currentMedia.duration);
  }, [currentMedia]);
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
      return;
    }
    const updateProgress = () => {
      setCurrentTime((prev) => {
        const nextTime = Math.min(prev + 1, duration);
        if (nextTime >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return nextTime;
      });
      animationFrame.current = window.requestAnimationFrame(() => {
        setTimeout(updateProgress, 1000);
      });
    };
    animationFrame.current = window.requestAnimationFrame(updateProgress);
    return () => {
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isPlaying, duration]);
  const currentPlaylist = useMemo(() => playlist, [playlist]);
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };
  const nextTrack = () => {
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    setCurrentIndex(nextIndex);
    setCurrentMedia(currentPlaylist[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };
  const prevTrack = () => {
    const prevIndex =
      currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentMedia(currentPlaylist[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (value === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  const handleSeek = (value: number) => {
    setCurrentTime(value);
  };
  const toggleCasting = (deviceId: string) => {
    setActiveCastingDevices((prev) =>
      prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId],
    );
  };
  const title = currentMedia?.title ?? "No media selected";
  const statusLabel = isPlaying ? "Playing" : "Paused";
  return (
    <Card className={`max-w-4xl mx-auto rounded-xl shadow-xl ${className}`}>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Music className="h-4 w-4" />
              <span>QMedia Player</span>
            </div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {currentMedia?.artist ?? "QMOI Media"} • {currentMedia?.album ?? "Live"
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onMinimize && (
              <Button variant="secondary" size="sm" onClick={onMinimize}>
                Minimize
              </Button>
            )}
            {onMaximize && (
              <Button variant="secondary" size="sm" onClick={onMaximize}>
                Maximize
              </Button>
            )}
            {onClose && (
              <Button variant="destructive" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <div className="rounded-2xl bg-muted p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Playback</h3>
                    <p className="text-sm text-muted-foreground">{statusLabel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={prevTrack}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="icon" onClick={togglePlay}>
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextTrack}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, "0")}</span>
                    <span>{Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}</span>
                  </div>
                  <Slider
                    value={[currentTime]}
                    onValueChange={([value]) => handleSeek(Number(value))}
                    min={0}
                    max={duration}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="rounded-2xl bg-muted p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    <span>Volume</span>
                  </div>
                  <Switch checked={!isMuted} onCheckedChange={toggleMute} />
                </div>
                <div className="mt-4">
                  <Slider
                    value={[volume]}
                    onValueChange={([value]) => handleVolumeChange(Number(value))}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-muted p-6">
                <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Cast className="h-4 w-4" />
                    <span>Casting</span>
                  </div>
                  <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
                </div>
                <div className="mt-4 space-y-3">
                  {castDevices.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-background p-3"
                    >
                      <div className="flex items-center gap-3">
                        {device.type === "chromecast" && <Monitor className="h-5 w-5" />}
                        {device.type === "airplay" && <Speaker className="h-5 w-5" />}
                        {device.type === "qcity" && <Cast className="h-5 w-5" />}
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground">{device.type}</p>
                        </div>
                      </div>
                      <Button size="sm" variant={activeCastingDevices.includes(device.id) ? "secondary" : "outline"} onClick={() => toggleCasting(device.id)}>
                        {activeCastingDevices.includes(device.id) ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-muted p-6">
                <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Playback Settings</span>
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Sync Playback</span>
                    <span>{syncEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Theme</span>
                    <span>{floating ? "Floating Window" : "Embedded"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="playback">Playback</TabsTrigger>
              <TabsTrigger value="playlist">Playlist</TabsTrigger>
              <TabsTrigger value="casting">Casting</TabsTrigger>
            </TabsList>
            <TabsContent value="playback">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use the controls above to manage the current media session, playback state, and volume.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-sm font-medium">Active media</p>
                    <p className="mt-2 text-sm">{currentMedia?.title ?? "No item selected"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-sm font-medium">Playback state</p>
                    <p className="mt-2 text-sm">{statusLabel}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="playlist">
              <div className="space-y-3">
                {currentPlaylist.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.artist ?? "Unknown artist"}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setCurrentIndex(item.position);
                        setCurrentMedia(item);
                        setCurrentTime(0);
                        setIsPlaying(true);
                      }}>
                        Play
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="casting">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Manage connected devices and sync casting sessions across supported devices.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {castDevices.map((device) => (
                    <div key={device.id} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground">{device.status}</p>
                        </div>
                        <Button size="sm" variant={activeCastingDevices.includes(device.id) ? "secondary" : "outline"} onClick={() => toggleCasting(device.id)}>
                          {activeCastingDevices.includes(device.id) ? "Stop" : "Start"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
export default QMediaPlayer;
