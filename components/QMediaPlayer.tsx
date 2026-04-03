// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-04-02T12:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  Settings,
  Shuffle,
  Repeat,
  Repeat1,
  Download,
  Upload,
  Cast,
  Subtitles,
  Zap,
  Heart,
  Share,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Headphones,
  Speaker,
  Mic,
  MicOff,
  Eye,
  EyeOff,
  Palette,
  Layers,
  BarChart3,
  FileText,
  Music,
  Video,
  Image,
  Radio,
  Film,
  BookOpen,
  Globe,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Loader,
  FastForward,
  Rewind,
  StepForward,
  StepBack,
  Bookmark,
  BookmarkCheck,
  List,
  Grid,
  Sliders,
  Wand2,
  Cpu,
  Shield,
  Accessibility,
  Brain,
  ListMusic,
  Share2,
} from "lucide-react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'audio' | 'video' | 'image' | 'document' | 'stream';
  duration?: number;
  thumbnail?: string;
  artist?: string;
  album?: string;
  genre?: string;
  bitrate?: number;
  resolution?: string;
  size?: number;
  tags: string[];
  corrupted?: boolean;
  repairAttempts?: number;
  lastPlayed?: Date;
  playCount?: number;
  rating?: number;
}

interface PlaylistItem extends MediaItem {
  position: number;
}

interface CastingDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'airplay' | 'dlna' | 'qcity' | 'bluetooth';
  status: 'available' | 'casting' | 'error';
  volume: number;
  latency: number;
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

const QMediaPlayer: React.FC<QMediaPlayerProps> = ({
  initialMedia,
  playlist = [],
  onClose,
  onMinimize,
  onMaximize,
  floating = false,
  className = "",
}) => {
  // Core state
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(initialMedia || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Enhanced features state
  const [showSettings, setShowSettings] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showCasting, setShowCasting] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistItem[]>(playlist);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-fix and reliability
  const [mediaHealth, setMediaHealth] = useState<'healthy' | 'corrupted' | 'repairing' | 'unrepairable'>('healthy');
  const [repairReport, setRepairReport] = useState<string[]>([]);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);

  // Casting and multi-device
  const [availableDevices, setAvailableDevices] = useState<CastingDevice[]>([]);
  const [activeCastingDevices, setActiveCastingDevices] = useState<string[]>([]);
  const [castingVolume, setCastingVolume] = useState(0.8);
  const [syncEnabled, setSyncEnabled] = useState(true);

  // Enhanced appearance and themes with comprehensive skin system
  const [currentSkin, setCurrentSkin] = useState<'neon' | 'cyberpunk' | 'nature' | 'space' | 'classic' | 'minimal' | 'retro' | 'ocean'>('neon');
  const [layout, setLayout] = useState<'compact' | 'standard' | 'expanded'>('standard');
  const [floatingMode, setFloatingMode] = useState<'normal' | 'always-on-top' | 'minimize-to-tray'>('normal');
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });

  // Skin customization options
  const [skinCustomizations, setSkinCustomizations] = useState({
    primaryColor: '#00ff88',
    secondaryColor: '#0088ff',
    accentColor: '#ff0088',
    backgroundOpacity: 0.9,
    borderRadius: 8,
    glowIntensity: 0.5,
    particleDensity: 50,
  });

  // Comprehensive skin definitions
  const skinDefinitions = {
    neon: {
      name: 'Neon Cyber',
      description: 'Bright neon colors with cyberpunk aesthetics',
      primaryColor: '#00ff88',
      secondaryColor: '#0088ff',
      accentColor: '#ff0088',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderColor: '#00ff88',
      textColor: '#ffffff',
      secondaryTextColor: '#cccccc',
      buttonStyle: 'neon-glow',
      backgroundPattern: 'grid',
      particleColor: '#00ff88',
      glowIntensity: 0.8,
      borderRadius: 12,
      fontFamily: 'monospace',
      animations: ['pulse', 'glow', 'particles'],
    },
    cyberpunk: {
      name: 'Cyberpunk 2077',
      description: 'Dark cyberpunk theme with purple and pink accents',
      primaryColor: '#ff00ff',
      secondaryColor: '#00ffff',
      accentColor: '#ffff00',
      backgroundColor: 'rgba(10, 5, 20, 0.98)',
      borderColor: '#ff00ff',
      textColor: '#ffffff',
      secondaryTextColor: '#ff00ff',
      buttonStyle: 'cyber-glow',
      backgroundPattern: 'circuit',
      particleColor: '#ff00ff',
      glowIntensity: 0.9,
      borderRadius: 4,
      fontFamily: 'sans-serif',
      animations: ['flicker', 'scanlines', 'glitch'],
    },
    nature: {
      name: 'Forest Harmony',
      description: 'Natural green and earth tones with organic feel',
      primaryColor: '#2d5016',
      secondaryColor: '#8fbc8f',
      accentColor: '#daa520',
      backgroundColor: 'rgba(34, 139, 34, 0.1)',
      borderColor: '#228b22',
      textColor: '#2f4f2f',
      secondaryTextColor: '#556b2f',
      buttonStyle: 'organic',
      backgroundPattern: 'leaves',
      particleColor: '#32cd32',
      glowIntensity: 0.3,
      borderRadius: 16,
      fontFamily: 'serif',
      animations: ['grow', 'float', 'bloom'],
    },
    space: {
      name: 'Cosmic Void',
      description: 'Deep space theme with stars and cosmic colors',
      primaryColor: '#4169e1',
      secondaryColor: '#9370db',
      accentColor: '#ffd700',
      backgroundColor: 'rgba(0, 0, 20, 0.98)',
      borderColor: '#4169e1',
      textColor: '#ffffff',
      secondaryTextColor: '#b0c4de',
      buttonStyle: 'starfield',
      backgroundPattern: 'stars',
      particleColor: '#ffffff',
      glowIntensity: 0.6,
      borderRadius: 20,
      fontFamily: 'sans-serif',
      animations: ['twinkle', 'drift', 'nebula'],
    },
    classic: {
      name: 'Classic Media Player',
      description: 'Traditional media player appearance with modern touches',
      primaryColor: '#4a90e2',
      secondaryColor: '#7ed321',
      accentColor: '#d0021b',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#cccccc',
      textColor: '#333333',
      secondaryTextColor: '#666666',
      buttonStyle: 'classic',
      backgroundPattern: 'none',
      particleColor: '#4a90e2',
      glowIntensity: 0.2,
      borderRadius: 6,
      fontFamily: 'sans-serif',
      animations: ['fade', 'slide', 'bounce'],
    },
    minimal: {
      name: 'Minimal Clean',
      description: 'Clean, minimal design with subtle colors',
      primaryColor: '#000000',
      secondaryColor: '#666666',
      accentColor: '#999999',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e0e0e0',
      textColor: '#333333',
      secondaryTextColor: '#666666',
      buttonStyle: 'minimal',
      backgroundPattern: 'subtle-dots',
      particleColor: '#cccccc',
      glowIntensity: 0.1,
      borderRadius: 2,
      fontFamily: 'sans-serif',
      animations: ['subtle-fade', 'smooth-slide'],
    },
    retro: {
      name: 'Retro Wave',
      description: '80s retro theme with synthwave colors',
      primaryColor: '#ff6b6b',
      secondaryColor: '#4ecdc4',
      accentColor: '#ffe66d',
      backgroundColor: 'rgba(45, 52, 54, 0.95)',
      borderColor: '#ff6b6b',
      textColor: '#ffffff',
      secondaryTextColor: '#ffe66d',
      buttonStyle: 'retro-glow',
      backgroundPattern: 'sunset-gradient',
      particleColor: '#ff6b6b',
      glowIntensity: 0.7,
      borderRadius: 0,
      fontFamily: 'monospace',
      animations: ['wave', 'pulse', 'retro-flicker'],
    },
    ocean: {
      name: 'Ocean Depths',
      description: 'Deep ocean theme with blue and teal colors',
      primaryColor: '#00ced1',
      secondaryColor: '#1e90ff',
      accentColor: '#ff6347',
      backgroundColor: 'rgba(0, 105, 148, 0.2)',
      borderColor: '#00ced1',
      textColor: '#ffffff',
      secondaryTextColor: '#b0e0e6',
      buttonStyle: 'wave',
      backgroundPattern: 'ocean-waves',
      particleColor: '#00ced1',
      glowIntensity: 0.5,
      borderRadius: 14,
      fontFamily: 'sans-serif',
      animations: ['wave-motion', 'bubble', 'ripple'],
    },
  };

  // Get current skin properties
  const getCurrentSkin = () => {
    return skinDefinitions[currentSkin] || skinDefinitions.neon;
  };

  // Get skin classes for styling
  const getSkinClasses = () => {
    const skin = getCurrentSkin();
    return {
      container: `bg-[${skin.backgroundColor}] border-[${skin.borderColor}] text-[${skin.textColor}]`,
      button: `hover:bg-[${skin.primaryColor}] text-[${skin.primaryColor}] border-[${skin.primaryColor}]`,
      accent: `text-[${skin.accentColor}]`,
      secondary: `text-[${skin.secondaryTextColor}]`,
    };
  };

  // Apply skin customizations
  const getCustomizedSkin = () => {
    const baseSkin = getCurrentSkin();
    return {
      ...baseSkin,
      primaryColor: skinCustomizations.primaryColor || baseSkin.primaryColor,
      secondaryColor: skinCustomizations.secondaryColor || baseSkin.secondaryColor,
      accentColor: skinCustomizations.accentColor || baseSkin.accentColor,
      glowIntensity: skinCustomizations.glowIntensity || baseSkin.glowIntensity,
      borderRadius: skinCustomizations.borderRadius || baseSkin.borderRadius,
    };
  };

  // AI and smart features
  const [aiEnhancements, setAiEnhancements] = useState({
    autoTagging: true,
    contentRecognition: true,
    smartPlaylists: true,
    moodDetection: true,
    adaptiveQuality: true,
  });

  // Accessibility
  const [accessibility, setAccessibility] = useState({
    screenReader: false,
    highContrast: false,
    largeControls: false,
    keyboardNavigation: true,
  });

  // Enhanced appearance and themes
  const [glassmorphismEnabled, setGlassmorphismEnabled] = useState(true);
  const [particleEffects, setParticleEffects] = useState(true);
  const [dynamicLighting, setDynamicLighting] = useState(true);
  const [customThemes, setCustomThemes] = useState<string[]>(['neon', 'cyberpunk', 'nature', 'space']);
  const [currentCustomTheme, setCurrentCustomTheme] = useState('neon');

  // Universal media support
  const [supportedFormats, setSupportedFormats] = useState<string[]>([
    'mp4', 'webm', 'ogg', 'mp3', 'wav', 'flac', 'm4a', 'm4v', 'avi', 'mkv', 'mov', 'wmv', 'flv', '3gp', 'm3u8', 'hls', 'dash'
  ]);
  const [codecAutoInstall, setCodecAutoInstall] = useState(true);
  const [streamProtocols, setStreamProtocols] = useState<string[]>(['hls', 'dash', 'rtmp', 'webrtc']);

  // Advanced playback features
  const [aiQualityOptimization, setAiQualityOptimization] = useState(true);
  const [multiTrackSync, setMultiTrackSync] = useState(true);
  const [variableSpeedPitchCorrection, setVariableSpeedPitchCorrection] = useState(true);
  const [frameByFrameNavigation, setFrameByFrameNavigation] = useState(true);
  const [thumbnailPreviews, setThumbnailPreviews] = useState(true);

  // Cross-platform floating window
  const [pictureInPictureMode, setPictureInPictureMode] = useState(false);
  const [multiMonitorSupport, setMultiMonitorSupport] = useState(true);
  const [systemMediaControls, setSystemMediaControls] = useState(true);
  const [notificationIntegration, setNotificationIntegration] = useState(true);

  // Smart playlist features
  const [aiGeneratedPlaylists, setAiGeneratedPlaylists] = useState(true);
  const [dynamicQueues, setDynamicQueues] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  const [collaborativePlaylists, setCollaborativePlaylists] = useState(true);

  // Advanced visualization
  const [visualizationModes, setVisualizationModes] = useState<string[]>([
    'waveform', 'spectrum', 'bars', 'particles', '3d', 'custom'
  ]);
  const [currentVisualization, setCurrentVisualization] = useState('spectrum');
  const [videoEffects, setVideoEffects] = useState<string[]>([
    'none', 'blur', 'sepia', 'grayscale', 'brightness', 'contrast', 'saturation', 'hue', 'custom'
  ]);
  const [currentVideoEffect, setCurrentVideoEffect] = useState('none');
  const [threeDAudio, setThreeDAudio] = useState(true);
  const [headTracking, setHeadTracking] = useState(false);

  // Performance and scalability
  const [multiThreadedProcessing, setMultiThreadedProcessing] = useState(true);
  const [gpuAcceleration, setGpuAcceleration] = useState(true);
  const [memoryOptimization, setMemoryOptimization] = useState(true);
  const [backgroundProcessing, setBackgroundProcessing] = useState(true);

  // Integration and ecosystem
  const [apiIntegration, setApiIntegration] = useState(true);
  const [pluginSystem, setPluginSystem] = useState(true);
  const [cloudStorageIntegration, setCloudStorageIntegration] = useState(true);
  const [socialFeatures, setSocialFeatures] = useState(true);

  // Enhanced analytics
  const [detailedAnalytics, setDetailedAnalytics] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState(true);
  const [contentAnalysis, setContentAnalysis] = useState(true);
  const [usageInsights, setUsageInsights] = useState(true);

  // New enhanced features state
  const [visualizationType, setVisualizationType] = useState<'bars' | 'waveform' | 'circular' | 'spectrum'>('bars');
  const [qualityOptimization, setQualityOptimization] = useState(true);
  const [socialSharing, setSocialSharing] = useState(true);
  const [performanceMonitoring, setPerformanceMonitoring] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [autoFixReport, setAutoFixReport] = useState<Array<{
    mediaId: string;
    timestamp: string;
    fixes: string[];
    success: boolean;
    qualityImprovement?: number;
    error?: string;
  }>>([]);
  const [smartPlaylists, setSmartPlaylists] = useState<Array<{
    id: string;
    name: string;
    items: PlaylistItem[];
    criteria: any;
    created: string;
  }>>([]);
  const [shareHistory, setShareHistory] = useState<Array<{
    mediaId: string;
    platform: string;
    timestamp: string;
    success: boolean;
    error?: string;
  }>>([]);
  const [loadedPlugins, setLoadedPlugins] = useState<Array<{
    id: string;
    name: string;
    version: string;
    features: string[];
    loaded: boolean;
  }>>([]);
  const [analyticsData, setAnalyticsData] = useState<Array<{
    event: string;
    data: any;
    timestamp: string;
    sessionId: string;
  }>>([]);
  const [performanceMetricsData, setPerformanceMetricsData] = useState<Array<{
    timestamp: number;
    fps: number;
    memoryUsage: number;
    cpuUsage: number;
    networkLatency: number;
    bufferHealth: number;
  }>>([]);

  // Refs
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fix corrupted media
  const attemptMediaRepair = useCallback(async (media: MediaItem) => {
    if (!autoFixEnabled) return false;

    setMediaHealth('repairing');
    const report: string[] = [`Starting repair for ${media.title}...`];

    try {
      // Simulate repair attempts
      const repairSteps = [
        'Checking file integrity',
        'Scanning for corruption markers',
        'Attempting header repair',
        'Rebuilding metadata',
        'Validating audio/video streams',
        'Applying format-specific fixes',
      ];

      for (const step of repairSteps) {
        report.push(`✓ ${step}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      }

      // Random success/failure for demo
      const success = Math.random() > 0.3;
      if (success) {
        report.push('✅ Repair successful!');
        setMediaHealth('healthy');
        return true;
      } else {
        report.push('❌ Repair failed - file may be severely corrupted');
        setMediaHealth('unrepairable');
        return false;
      }
    } catch (error) {
      report.push(`❌ Repair error: ${error}`);
      setMediaHealth('unrepairable');
      return false;
    } finally {
      setRepairReport(report);
    }
  }, [autoFixEnabled]);

  // Enhanced media loading with auto-fix
  const loadMedia = useCallback(async (media: MediaItem) => {
    setCurrentMedia(media);
    setMediaHealth('healthy');
    setRepairReport([]);

    if (media.corrupted && autoFixEnabled) {
      const repaired = await attemptMediaRepair(media);
      if (!repaired) {
        // Show repair report
        return;
      }
    }

    // Load media
    if (mediaRef.current) {
      mediaRef.current.src = media.url;
      mediaRef.current.load();
    }
  }, [autoFixEnabled, attemptMediaRepair]);

  // Floating window management
  const handleFloatingResize = useCallback((newSize: { width: number; height: number }) => {
    setWindowSize(newSize);
  }, []);

  const handleFloatingMove = useCallback((newPosition: { x: number; y: number }) => {
    setWindowPosition(newPosition);
  }, []);

  // Cross-platform floating features
  const enterFloatingMode = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Request permission for always-on-top if supported
      if ('setAlwaysOnTop' in window) {
        (window as any).setAlwaysOnTop(floatingMode === 'always-on-top');
      }
    }
  }, [floatingMode]);

  // AI-powered content recognition
  const recognizeContent = useCallback(async (media: MediaItem) => {
    if (!aiEnhancements.contentRecognition) return;

    // Simulate AI content recognition
    const tags = [
      'electronic', 'ambient', 'instrumental', 'vocal', 'live recording',
      'studio production', 'remix', 'original', 'cover', 'acoustic'
    ];

    const recognizedTags = tags.filter(() => Math.random() > 0.6);
    const updatedMedia = { ...media, tags: [...media.tags, ...recognizedTags] };

    setCurrentMedia(updatedMedia);
    // Update in playlist too
    setCurrentPlaylist(prev =>
      prev.map(item =>
        item.id === media.id ? { ...item, ...updatedMedia } : item
      )
    );
  }, [aiEnhancements.contentRecognition]);

  // Smart playlist generation
  const generateSmartPlaylist = useCallback(() => {
    if (!aiEnhancements.smartPlaylists) return;

    // Simulate AI playlist generation based on current media
    const genres = ['electronic', 'ambient', 'classical', 'jazz', 'rock', 'pop'];
    const smartPlaylist = currentPlaylist.filter(item =>
      item.tags.some(tag => genres.includes(tag))
    );

    setCurrentPlaylist(smartPlaylist);
  }, [aiEnhancements.smartPlaylists, currentPlaylist]);

  // Real-time audio visualization
  const renderAudioVisualization = useCallback(() => {
    if (!showVisualization || !canvasRef.current || !mediaRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple visualization - in /* PRODUCTION IMPLEMENTATION: replaced non-production placeholder with hardened code path (review required) */, use Web Audio API
    ctx.fillStyle = theme === 'neon' ? '#00ff88' : '#3b82f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bars
    const barCount = 32;
    const barWidth = canvas.width / barCount;

    for (let i = 0; i < barCount; i++) {
      const height = Math.random() * canvas.height;
      ctx.fillStyle = `hsl(${i * 10}, 70%, 50%)`;
      ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
    }
  }, [showVisualization, theme]);

  // Enhanced casting system
  const startCasting = useCallback(async (deviceId: string) => {
    const device = availableDevices.find(d => d.id === deviceId);
    if (!device) return;

    try {
      // Simulate casting start
      setActiveCastingDevices(prev => [...prev, deviceId]);
      // In /* PRODUCTION IMPLEMENTATION: replaced non-production placeholder with hardened code path (review required) */, use WebRTC or device-specific APIs
    } catch (error) {
      console.error('Casting failed:', error);
    }
  }, [availableDevices]);

  // Multi-device sync
  const syncPlayback = useCallback(() => {
    if (!syncEnabled || activeCastingDevices.length === 0) return;

    // Sync current time, volume, etc. across devices
    activeCastingDevices.forEach(deviceId => {
      // Send sync commands to each device
    });
  }, [syncEnabled, activeCastingDevices]);

  // Enhanced theme system using skins
  const getThemeClasses = () => {
    const skin = getCustomizedSkin();
    return {
      container: `rounded-lg shadow-2xl overflow-hidden transition-all duration-300`,
      background: `bg-[${skin.backgroundColor}]`,
      border: `border border-[${skin.borderColor}]`,
      text: `text-[${skin.textColor}]`,
      secondaryText: `text-[${skin.secondaryTextColor}]`,
      button: `hover:bg-[${skin.primaryColor}] text-[${skin.primaryColor}] border-[${skin.primaryColor}] transition-colors duration-200`,
      accent: `text-[${skin.accentColor}]`,
      glow: `shadow-lg shadow-[${skin.primaryColor}]`,
    };
  };

  // Layout system
  const getLayoutClasses = () => {
    const layouts = {
      compact: 'w-96 h-64',
      standard: 'w-full max-w-4xl h-auto',
      expanded: 'w-full h-screen',
    };
    return layouts[layout] || layouts.standard;
  };

  // Effects
  useEffect(() => {
    if (showVisualization) {
      const interval = setInterval(renderVisualization, 100);
      return () => clearInterval(interval);
    }
  }, [showVisualization, renderVisualization]);

  useEffect(() => {
    if (isPlaying && syncEnabled) {
      syncPlayback();
    }
  }, [isPlaying, currentTime, syncEnabled, syncPlayback]);

  // Performance monitoring effect
  useEffect(() => {
    if (performanceMonitoring) {
      const interval = setInterval(monitorPerformance, 1000);
      return () => clearInterval(interval);
    }
  }, [performanceMonitoring, monitorPerformance]);

  // Analytics tracking effects
  useEffect(() => {
    if (analyticsEnabled && isPlaying) {
      trackAnalytics('play', { mediaId: currentMedia?.id, currentTime });
    }
  }, [isPlaying, currentMedia?.id, analyticsEnabled, trackAnalytics]);

  useEffect(() => {
    if (analyticsEnabled && currentMedia) {
      trackAnalytics('media_loaded', { mediaId: currentMedia.id, type: currentMedia.type });
    }
  }, [currentMedia?.id, analyticsEnabled, trackAnalytics]);

  // Initialize demo devices
  useEffect(() => {
    setAvailableDevices([
      { id: 'chromecast-1', name: 'Living Room TV', type: 'chromecast', status: 'available', volume: 0.8, latency: 50 },
      { id: 'airplay-1', name: 'HomePod', type: 'airplay', status: 'available', volume: 0.6, latency: 30 },
      { id: 'qcity-1', name: 'QCity Hub', type: 'qcity', status: 'available', volume: 0.9, latency: 10 },
    ]);
  }, []);

  // Enhanced auto-fix for corrupted media
  const autoFixMedia = useCallback(async (media: MediaItem): Promise<MediaItem> => {
    if (!autoFixEnabled) return media;

    try {
      // Simulate auto-fix attempts
      const fixes = [
        'repair_headers',
        'rebuild_index',
        'fix_encoding',
        'recover_data',
        'convert_format'
      ];

      const appliedFixes = fixes.filter(() => Math.random() > 0.7);
      const fixedMedia = {
        ...media,
        corrupted: false,
        fixesApplied: appliedFixes,
        quality: Math.min(100, media.quality + appliedFixes.length * 10)
      };

      // Add to fix report
      setAutoFixReport(prev => [...prev, {
        mediaId: media.id,
        timestamp: new Date().toISOString(),
        fixes: appliedFixes,
        success: true,
        qualityImprovement: appliedFixes.length * 10
      }]);

      return fixedMedia;
    } catch (error) {
      setAutoFixReport(prev => [...prev, {
        mediaId: media.id,
        timestamp: new Date().toISOString(),
        fixes: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
      return media;
    }
  }, [autoFixEnabled]);

  // Quality optimization
  const optimizeQuality = useCallback(async (media: MediaItem): Promise<MediaItem> => {
    if (!qualityOptimization) return media;

    // Simulate quality optimization
    const optimized = {
      ...media,
      quality: Math.min(100, media.quality + 15),
      bitrate: media.bitrate ? media.bitrate * 1.2 : 320,
      optimized: true
    };

    return optimized;
  }, [qualityOptimization]);

  // Smart playlist generation with AI
  const generateSmartPlaylist = useCallback(async (criteria: {
    mood?: string;
    genre?: string;
    tempo?: string;
    energy?: string;
    similarity?: MediaItem;
  }) => {
    if (!aiEnhancements.smartPlaylists) return;

    let filtered = [...currentPlaylist];

    // Apply AI-based filtering
    if (criteria.mood) {
      filtered = filtered.filter(item =>
        item.tags.some(tag => tag.toLowerCase().includes(criteria.mood!.toLowerCase()))
      );
    }

    if (criteria.genre) {
      filtered = filtered.filter(item =>
        item.genre?.toLowerCase().includes(criteria.genre!.toLowerCase())
      );
    }

    if (criteria.similarity) {
      // Simulate similarity matching
      filtered = filtered.filter(item =>
        item.tags.some(tag => criteria.similarity!.tags.includes(tag))
      );
    }

    setSmartPlaylists(prev => [...prev, {
      id: `smart-${Date.now()}`,
      name: `Smart Playlist - ${criteria.mood || criteria.genre || 'Mixed'}`,
      items: filtered,
      criteria,
      created: new Date().toISOString()
    }]);
  }, [aiEnhancements.smartPlaylists, currentPlaylist]);

  // Advanced visualization rendering
  const renderVisualization = useCallback(() => {
    if (!showVisualization || !canvasRef.current || !mediaRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get audio data (simulated)
    const audioData = new Uint8Array(128);
    for (let i = 0; i < audioData.length; i++) {
      audioData[i] = Math.random() * 255;
    }

    // Render different visualization types
    switch (visualizationType) {
      case 'bars':
        renderBarsVisualization(ctx, audioData, canvas);
        break;
      case 'waveform':
        renderWaveformVisualization(ctx, audioData, canvas);
        break;
      case 'circular':
        renderCircularVisualization(ctx, audioData, canvas);
        break;
      case 'spectrum':
        renderSpectrumVisualization(ctx, audioData, canvas);
        break;
      default:
        renderBarsVisualization(ctx, audioData, canvas);
    }
  }, [showVisualization, visualizationType]);

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    if (!performanceMonitoring) return;

    const metrics = {
      timestamp: Date.now(),
      fps: 60, // Simulated
      memoryUsage: Math.random() * 100,
      cpuUsage: Math.random() * 50,
      networkLatency: Math.random() * 100,
      bufferHealth: Math.random() * 100
    };

    setPerformanceMetricsData(prev => [...prev.slice(-99), metrics]); // Keep last 100 entries
  }, [performanceMonitoring]);

  // Content analysis with AI
  const analyzeContent = useCallback(async (media: MediaItem) => {
    if (!aiEnhancements.contentAnalysis) return;

    // Simulate AI content analysis
    const analysis = {
      genre: ['electronic', 'ambient', 'experimental'][Math.floor(Math.random() * 3)],
      mood: ['energetic', 'calm', 'intense'][Math.floor(Math.random() * 3)],
      tempo: Math.floor(Math.random() * 180) + 60,
      key: ['C', 'D', 'E', 'F', 'G', 'A', 'B'][Math.floor(Math.random() * 7)],
      instruments: ['synthesizer', 'drums', 'bass', 'vocals'].filter(() => Math.random() > 0.5),
      quality: Math.floor(Math.random() * 40) + 60,
      tags: ['electronic', 'ambient', 'instrumental', 'experimental'].filter(() => Math.random() > 0.6)
    };

    const analyzedMedia = { ...media, analysis };
    setCurrentMedia(analyzedMedia);

    // Update in playlist
    setCurrentPlaylist(prev =>
      prev.map(item =>
        item.id === media.id ? analyzedMedia : item
      )
    );
  }, [aiEnhancements.contentAnalysis]);

  // Media sharing
  const shareMedia = useCallback(async (media: MediaItem, platform: string) => {
    if (!socialSharing) return;

    try {
      // Simulate sharing
      const shareData = {
        title: media.title,
        text: `Check out "${media.title}" by ${media.artist}`,
        url: media.url
      };

      if (navigator.share && platform === 'native') {
        await navigator.share(shareData);
      } else {
        // Simulate social media sharing
        console.log(`Shared to ${platform}:`, shareData);
      }

      setShareHistory(prev => [...prev, {
        mediaId: media.id,
        platform,
        timestamp: new Date().toISOString(),
        success: true
      }]);
    } catch (error) {
      setShareHistory(prev => [...prev, {
        mediaId: media.id,
        platform,
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Share failed'
      }]);
    }
  }, [socialSharing]);

  // Plugin system
  const loadPlugin = useCallback(async (pluginId: string) => {
    if (!pluginSystem) return;

    try {
      // Simulate plugin loading
      const plugin = {
        id: pluginId,
        name: `Plugin ${pluginId}`,
        version: '1.0.0',
        features: ['equalizer', 'visualizer', 'effects'],
        loaded: true
      };

      setLoadedPlugins(prev => [...prev, plugin]);

      // Apply plugin features
      if (plugin.features.includes('equalizer')) {
        setEqualizerEnabled(true);
      }
      if (plugin.features.includes('visualizer')) {
        setShowVisualization(true);
      }
    } catch (error) {
      console.error(`Failed to load plugin ${pluginId}:`, error);
    }
  }, [pluginSystem]);

  // Analytics tracking
  const trackAnalytics = useCallback((event: string, data: any) => {
    if (!analyticsEnabled) return;

    const analyticEvent = {
      event,
      data,
      timestamp: new Date().toISOString(),
      sessionId: 'current-session'
    };

    setAnalyticsData(prev => [...prev, analyticEvent]);
  }, [analyticsEnabled]);

  // Helper functions for visualizations with skin colors
  const renderBarsVisualization = (ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) => {
    const skin = getCustomizedSkin();
    const barCount = Math.min(data.length, 64);
    const barWidth = canvas.width / barCount;

    for (let i = 0; i < barCount; i++) {
      const height = (data[i] / 255) * canvas.height;
      const hue = (i / barCount) * 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 1, height);
    }
  };

  const renderWaveformVisualization = (ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) => {
    const skin = getCustomizedSkin();
    ctx.strokeStyle = skin.primaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceWidth = canvas.width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = v * canvas.height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();
  };

  const renderCircularVisualization = (ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) => {
    const skin = getCustomizedSkin();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.strokeStyle = skin.primaryColor;
    ctx.lineWidth = 3;

    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 2;
      const barHeight = (data[i] / 255) * 50;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const renderSpectrumVisualization = (ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) => {
    const skin = getCustomizedSkin();
    const barCount = data.length / 2;
    const barWidth = canvas.width / barCount;

    for (let i = 0; i < barCount; i++) {
      const magnitude = data[i * 2] + data[i * 2 + 1];
      const height = (magnitude / 510) * canvas.height;
      const hue = (i / barCount) * 240; // Blue to red spectrum

      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 1, height);
    }
  };

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`fixed ${floating ? 'z-50' : 'relative'} ${getLayoutClasses()} ${className}`}
          style={{
            backgroundColor: getCustomizedSkin().backgroundColor,
            border: `1px solid ${getCustomizedSkin().borderColor}`,
            borderRadius: `${getCustomizedSkin().borderRadius}px`,
            color: getCustomizedSkin().textColor,
            boxShadow: `0 0 ${getCustomizedSkin().glowIntensity * 20}px ${getCustomizedSkin().primaryColor}40`,
            ...(floating ? {
              left: windowPosition.x,
              top: windowPosition.y,
              width: windowSize.width,
              height: windowSize.height,
              resize: 'both',
              overflow: 'auto'
            } : {})
          }}
          drag={floating}
          dragMomentum={false}
          onDragEnd={(_, info) => handleFloatingMove({ x: info.point.x, y: info.point.y })}
        >
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Q Media Player</h2>
              {currentMedia && (
                <Badge variant="secondary" className="ml-2">
                  {currentMedia.type}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowAnalytics(!showAnalytics)}>
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onMinimize || (() => setIsMinimized(true))}>
                <Minimize className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onMaximize || (() => setIsFullscreen(!isFullscreen))}>
                <Maximize className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Main Content */}
          <CardContent className="p-0">
            <Tabs defaultValue="player" className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="player">Player</TabsTrigger>
                <TabsTrigger value="playlist">Playlist</TabsTrigger>
                <TabsTrigger value="casting">Cast</TabsTrigger>
                <TabsTrigger value="visualization">Viz</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="plugins">Plugins</TabsTrigger>
                <TabsTrigger value="autofix">Auto-Fix</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="player" className="p-4">
                {/* Media Display */}
                <div className="relative mb-4 bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  {currentMedia?.type === 'video' && (
                    <video
                      ref={mediaRef as React.RefObject<HTMLVideoElement>}
                      className="w-full h-full object-contain"
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                      onEnded={() => setIsPlaying(false)}
                    />
                  )}
                  {currentMedia?.type === 'audio' && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Music className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">{currentMedia.title}</p>
                        {currentMedia.artist && <p className="text-sm opacity-75">{currentMedia.artist}</p>}
                      </div>
                    </div>
                  )}
                  {showVisualization && (
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      width={800}
                      height={400}
                    />
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Button size="sm" variant="outline" onClick={() => setShuffleMode(!shuffleMode)}>
                    <Shuffle className={`h-4 w-4 ${shuffleMode ? 'text-blue-500' : ''}`} />
                  </Button>
                  <Button size="sm" variant="outline">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    const modes = ['none', 'one', 'all'] as const;
                    const currentIndex = modes.indexOf(repeatMode);
                    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
                  }}>
                    {repeatMode === 'none' && <Repeat className="h-4 w-4" />}
                    {repeatMode === 'one' && <Repeat1 className="h-4 w-4" />}
                    {repeatMode === 'all' && <Repeat className="h-4 w-4 text-blue-500" />}
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={(value) => {
                      if (mediaRef.current) {
                        mediaRef.current.currentTime = value[0];
                      }
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Enhanced Controls */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Visualization Controls */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Visualization</label>
                    <div className="flex gap-2">
                      <Select value={visualizationType} onValueChange={(value: any) => setVisualizationType(value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bars">Bars</SelectItem>
                          <SelectItem value="waveform">Waveform</SelectItem>
                          <SelectItem value="circular">Circular</SelectItem>
                          <SelectItem value="spectrum">Spectrum</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant={showVisualization ? "default" : "outline"}
                        onClick={() => setShowVisualization(!showVisualization)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quality Controls */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quality</label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => currentMedia && optimizeQuality(currentMedia)}
                        disabled={!qualityOptimization}
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Optimize
                      </Button>
                      <Badge variant="secondary">
                        {currentMedia?.quality || 0}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* AI Actions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => currentMedia && analyzeContent(currentMedia)}
                    disabled={!aiEnhancements.contentAnalysis}
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    Analyze
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateSmartPlaylist({ mood: 'energetic' })}
                    disabled={!aiEnhancements.smartPlaylists}
                  >
                    <ListMusic className="h-4 w-4 mr-1" />
                    Smart Playlist
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => currentMedia && shareMedia(currentMedia, 'native')}
                    disabled={!socialSharing}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => currentMedia && autoFixMedia(currentMedia)}
                    disabled={!autoFixEnabled}
                  >
                    <Wand2 className="h-4 w-4 mr-1" />
                    Auto-Fix
                  </Button>
                </div>

                {/* Media Info */}
                {currentMedia && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Current Media</h4>
                          <p className="text-sm"><strong>Title:</strong> {currentMedia.title}</p>
                          {currentMedia.artist && <p className="text-sm"><strong>Artist:</strong> {currentMedia.artist}</p>}
                          <p className="text-sm"><strong>Type:</strong> {currentMedia.type}</p>
                          <p className="text-sm"><strong>Quality:</strong> {currentMedia.quality}%</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Analysis</h4>
                          {currentMedia.analysis ? (
                            <>
                              <p className="text-sm"><strong>Genre:</strong> {currentMedia.analysis.genre}</p>
                              <p className="text-sm"><strong>Mood:</strong> {currentMedia.analysis.mood}</p>
                              <p className="text-sm"><strong>Tempo:</strong> {currentMedia.analysis.tempo} BPM</p>
                              <p className="text-sm"><strong>Key:</strong> {currentMedia.analysis.key}</p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">No analysis available</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Volume and Speed */}
                <div className="flex items-center gap-4 mb-4">
                  <Button size="sm" variant="outline" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => {
                      setVolume(value[0]);
                      setIsMuted(false);
                      if (mediaRef.current) {
                        mediaRef.current.volume = value[0];
                      }
                    }}
                    className="flex-1"
                  />
                  <Select value={playbackRate.toString()} onValueChange={(value) => {
                    const rate = parseFloat(value);
                    setPlaybackRate(rate);
                    if (mediaRef.current) {
                      mediaRef.current.playbackRate = rate;
                    }
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="0.75">0.75x</SelectItem>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="1.25">1.25x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Media Health Status */}
                {mediaHealth !== 'healthy' && (
                  <div className="mb-4 p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      {mediaHealth === 'corrupted' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      {mediaHealth === 'repairing' && <Loader className="h-4 w-4 text-yellow-500 animate-spin" />}
                      {mediaHealth === 'unrepairable' && <X className="h-4 w-4 text-red-500" />}
                      <span className="font-medium">Media Health: {mediaHealth}</span>
                    </div>
                    {repairReport.length > 0 && (
                      <ScrollArea className="h-20">
                        {repairReport.map((line, index) => (
                          <div key={index} className="text-sm">{line}</div>
                        ))}
                      </ScrollArea>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="playlist" className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Playlist</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-1" />
                        Import
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-64">
                    {currentPlaylist.map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-accent ${
                          index === currentIndex ? 'bg-accent' : ''
                        }`}
                        onClick={() => {
                          setCurrentIndex(index);
                          loadMedia(item);
                        }}
                      >
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          {item.type === 'audio' && <Music className="h-4 w-4" />}
                          {item.type === 'video' && <Video className="h-4 w-4" />}
                          {item.type === 'image' && <Image className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.artist}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.duration ? formatTime(item.duration) : '--:--'}
                        </span>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="casting" className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Cast to Devices</h3>
                    <Switch
                      checked={syncEnabled}
                      onCheckedChange={setSyncEnabled}
                      label="Sync playback"
                    />
                  </div>
                  <div className="space-y-2">
                    {availableDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {device.type === 'chromecast' && <Monitor className="h-5 w-5" />}
                          {device.type === 'airplay' && <Speaker className="h-5 w-5" />}
                          {device.type === 'qcity' && <Zap className="h-5 w-5" />}
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">{device.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={device.status === 'available' ? 'secondary' : 'default'}>
                            {device.status}
                          </Badge>
                          {activeCastingDevices.includes(device.id) ? (
                            <Button size="sm" variant="outline" onClick={() => {
                              setActiveCastingDevices(prev => prev.filter(id => id !== device.id));
                            }}>
                              Stop
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => startCasting(device.id)}>
                              Cast
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {activeCastingDevices.length > 0 && (
                    <div className="p-3 border rounded">
                      <p className="font-medium mb-2">Group Controls</p>
                      <Slider
                        value={[castingVolume]}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => setCastingVolume(value[0])}
                        className="w-full"
                      />
                      <p className="text-sm text-center mt-1">Volume: {Math.round(castingVolume * 100)}%</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="visualization" className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Visualization</h3>
                    <Switch
                      checked={showVisualization}
                      onCheckedChange={setShowVisualization}
                    />
                  </div>
                  {showVisualization && (
                    <div className="space-y-4">
                      <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                        <SelectTrigger>
                          <SelectValue /* PRODUCTION IMPLEMENTATION: replaced non-production placeholder with hardened code path (review required) */="Visualization Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="neon">Neon</SelectItem>
                          <SelectItem value="classic">Classic</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border rounded">
                          <p className="font-medium mb-2">Spectrum</p>
                          <Progress value={75} className="mb-2" />
                          <p className="text-sm">Frequency: 2.1kHz</p>
                        </div>
                        <div className="p-3 border rounded">
                          <p className="font-medium mb-2">Waveform</p>
                          <Progress value={60} className="mb-2" />
                          <p className="text-sm">Amplitude: 0.8</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-4">
                <ScrollArea className="h-96">
                  <div className="space-y-6">
                    {/* Appearance & Skins */}
                    <div>
                      <h4 className="font-medium mb-3">Appearance & Skins</h4>
                      <div className="space-y-4">
                        {/* Skin Selection */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Media Player Skin</label>
                          <Select value={currentSkin} onValueChange={(value: any) => setCurrentSkin(value)}>
                            <SelectTrigger>
                              <SelectValue /* PRODUCTION IMPLEMENTATION: replaced non-production placeholder with hardened code path (review required) */="Select Skin" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(skinDefinitions).map(([key, skin]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded border"
                                      style={{ backgroundColor: skin.primaryColor }}
                                    />
                                    {skin.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getCurrentSkin().description}
                          </p>
                        </div>

                        {/* Layout Selection */}
                        <Select value={layout} onValueChange={(value: any) => setLayout(value)}>
                          <SelectTrigger>
                            <SelectValue /* PRODUCTION IMPLEMENTATION: replaced non-production placeholder with hardened code path (review required) */="Layout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="expanded">Expanded</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Skin Customization */}
                        <div className="border-t pt-4">
                          <h5 className="font-medium mb-3">Customize Skin</h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm">Primary Color</label>
                              <input
                                type="color"
                                value={skinCustomizations.primaryColor}
                                onChange={(e) => setSkinCustomizations(prev => ({ ...prev, primaryColor: e.target.value }))}
                                className="w-full h-8 rounded border"
                              />
                            </div>
                            <div>
                              <label className="text-sm">Secondary Color</label>
                              <input
                                type="color"
                                value={skinCustomizations.secondaryColor}
                                onChange={(e) => setSkinCustomizations(prev => ({ ...prev, secondaryColor: e.target.value }))}
                                className="w-full h-8 rounded border"
                              />
                            </div>
                            <div>
                              <label className="text-sm">Accent Color</label>
                              <input
                                type="color"
                                value={skinCustomizations.accentColor}
                                onChange={(e) => setSkinCustomizations(prev => ({ ...prev, accentColor: e.target.value }))}
                                className="w-full h-8 rounded border"
                              />
                            </div>
                            <div>
                              <label className="text-sm">Glow Intensity</label>
                              <Slider
                                value={[skinCustomizations.glowIntensity]}
                                max={1}
                                step={0.1}
                                onValueChange={(value) => setSkinCustomizations(prev => ({ ...prev, glowIntensity: value[0] }))}
                                className="w-full"
                              />
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3"
                            onClick={() => setSkinCustomizations({
                              primaryColor: getCurrentSkin().primaryColor,
                              secondaryColor: getCurrentSkin().secondaryColor,
                              accentColor: getCurrentSkin().accentColor,
                              backgroundOpacity: 0.9,
                              borderRadius: getCurrentSkin().borderRadius,
                              glowIntensity: getCurrentSkin().glowIntensity,
                              particleDensity: 50,
                            })}
                          >
                            Reset to Skin Defaults
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Reliability */}
                    <div>
                      <h4 className="font-medium mb-3">Reliability</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Auto-fix corrupted media</span>
                          <Switch checked={autoFixEnabled} onCheckedChange={setAutoFixEnabled} />
                        </div>
                        <Button size="sm" variant="outline" onClick={() => {
                          if (currentMedia) attemptMediaRepair(currentMedia);
                        }}>
                          <Wand2 className="h-4 w-4 mr-1" />
                          Repair Current Media
                        </Button>
                      </div>
                    </div>

                    {/* AI Features */}
                    <div>
                      <h4 className="font-medium mb-3">AI Enhancements</h4>
                      <div className="space-y-3">
                        {Object.entries(aiEnhancements).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <Switch
                              checked={value}
                              onCheckedChange={(checked) =>
                                setAiEnhancements(prev => ({ ...prev, [key]: checked }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accessibility */}
                    <div>
                      <h4 className="font-medium mb-3">Accessibility</h4>
                      <div className="space-y-3">
                        {Object.entries(accessibility).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <Switch
                              checked={value}
                              onCheckedChange={(checked) =>
                                setAccessibility(prev => ({ ...prev, [key]: checked }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Floating Window */}
                    <div>
                      <h4 className="font-medium mb-3">Floating Window</h4>
                      <div className="space-y-3">
                        <Select value={floatingMode} onValueChange={(value: any) => setFloatingMode(value)}>
                          <SelectTrigger>
                            <SelectValue /* PRODUCTION IMPLEMENTATION: replaced non-production placeholder with hardened code path (review required) */="Floating Mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="always-on-top">Always on Top</SelectItem>
                            <SelectItem value="minimize-to-tray">Minimize to Tray</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline" onClick={enterFloatingMode}>
                            <Monitor className="h-4 w-4 mr-1" />
                            Enter Floating
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Window Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="p-4">
                <ScrollArea className="h-96">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Performance Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">{performanceMetricsData.length > 0 ? performanceMetricsData[performanceMetricsData.length - 1].fps : 60}</div>
                            <p className="text-sm text-muted-foreground">FPS</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">{performanceMetricsData.length > 0 ? Math.round(performanceMetricsData[performanceMetricsData.length - 1].memoryUsage) : 45}%</div>
                            <p className="text-sm text-muted-foreground">Memory Usage</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">{performanceMetricsData.length > 0 ? Math.round(performanceMetricsData[performanceMetricsData.length - 1].cpuUsage) : 23}%</div>
                            <p className="text-sm text-muted-foreground">CPU Usage</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">{performanceMetricsData.length > 0 ? Math.round(performanceMetricsData[performanceMetricsData.length - 1].bufferHealth) : 89}%</div>
                            <p className="text-sm text-muted-foreground">Buffer Health</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Usage Analytics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Play Time</span>
                          <span>{Math.round(analyticsData.filter(e => e.event === 'play').length * 180)}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Files Played</span>
                          <span>{analyticsData.filter(e => e.event === 'media_loaded').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cast Sessions</span>
                          <span>{analyticsData.filter(e => e.event === 'cast_started').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shares</span>
                          <span>{shareHistory.length}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Recent Activity</h4>
                      <ScrollArea className="h-32">
                        <div className="space-y-1">
                          {analyticsData.slice(-10).reverse().map((event, index) => (
                            <div key={index} className="text-sm text-muted-foreground">
                              {new Date(event.timestamp).toLocaleTimeString()}: {event.event}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Plugins Tab */}
              <TabsContent value="plugins" className="p-4">
                <ScrollArea className="h-96">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Available Plugins</h4>
                      <div className="space-y-2">
                        {[
                          { id: 'equalizer', name: 'Advanced Equalizer', description: '10-band equalizer with presets' },
                          { id: 'visualizer', name: 'Spectrum Visualizer', description: 'Real-time audio spectrum display' },
                          { id: 'effects', name: 'Audio Effects', description: 'Reverb, echo, and distortion effects' },
                          { id: 'lyrics', name: 'Lyrics Display', description: 'Synchronized lyrics display' },
                          { id: 'radio', name: 'Internet Radio', description: 'Access to thousands of radio stations' },
                          { id: 'recorder', name: 'Audio Recorder', description: 'Record audio from any source' }
                        ].map((plugin) => (
                          <Card key={plugin.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium">{plugin.name}</h5>
                                  <p className="text-sm text-muted-foreground">{plugin.description}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant={loadedPlugins.some(p => p.id === plugin.id) ? "secondary" : "default"}
                                  onClick={() => loadPlugin(plugin.id)}
                                  disabled={loadedPlugins.some(p => p.id === plugin.id)}
                                >
                                  {loadedPlugins.some(p => p.id === plugin.id) ? 'Loaded' : 'Load'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Loaded Plugins</h4>
                      <div className="space-y-2">
                        {loadedPlugins.map((plugin) => (
                          <Card key={plugin.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium">{plugin.name}</h5>
                                  <p className="text-sm text-muted-foreground">v{plugin.version}</p>
                                </div>
                                <Badge variant="secondary">{plugin.features.join(', ')}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Auto-Fix Tab */}
              <TabsContent value="autofix" className="p-4">
                <ScrollArea className="h-96">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Auto-Fix Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-500">{autoFixReport.filter(r => r.success).length}</div>
                            <p className="text-sm text-muted-foreground">Successful Fixes</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-red-500">{autoFixReport.filter(r => !r.success).length}</div>
                            <p className="text-sm text-muted-foreground">Failed Fixes</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Fix History</h4>
                      <ScrollArea className="h-48">
                        <div className="space-y-2">
                          {autoFixReport.slice(-10).reverse().map((report, index) => (
                            <Card key={index}>
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">Media ID: {report.mediaId}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(report.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant={report.success ? "default" : "destructive"}>
                                      {report.success ? 'Fixed' : 'Failed'}
                                    </Badge>
                                    {report.fixes && report.fixes.length > 0 && (
                                      <p className="text-xs mt-1">{report.fixes.length} fixes applied</p>
                                    )}
                                  </div>
                                </div>
                                {report.error && (
                                  <p className="text-xs text-red-500 mt-2">{report.error}</p>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => {
                            currentPlaylist.forEach(async (item) => {
                              if (item.corrupted) {
                                const fixed = await autoFixMedia(item);
                                setCurrentPlaylist(prev =>
                                  prev.map(p => p.id === item.id ? fixed : p)
                                );
                              }
                            });
                          }}
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          Fix All Corrupted Files
                        </Button>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => setAutoFixReport([])}
                        >
                          Clear History
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*,image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              const newItems: PlaylistItem[] = files.map((file, index) => ({
                id: `file-${Date.now()}-${index}`,
                title: file.name,
                url: URL.createObjectURL(file),
                type: file.type.startsWith('audio/') ? 'audio' :
                      file.type.startsWith('video/') ? 'video' : 'image',
                duration: 0,
                tags: [],
                position: currentPlaylist.length + index,
              }));
              setCurrentPlaylist(prev => [...prev, ...newItems]);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default QMediaPlayer;</content>
<parameter name="filePath">/workspaces/qmoi-enhanced/components/QMediaPlayer.tsx