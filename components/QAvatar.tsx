import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2, Settings, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QAvatarProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  defaultAvatar?: 'human' | 'animal' | 'robot' | 'abstract';
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
}

interface AvatarConfig {
  type: 'human' | 'animal' | 'robot' | 'abstract' | 'fantasy' | 'cyberpunk' | 'nature' | 'space';
  size: { width: number; height: number };
  position: { x: number; y: number };
  isFloating: boolean;
  isMinimized: boolean;
  isMuted: boolean;
  volume: number;
  animationSpeed: number;
  emotionalStyle: 'neutral' | 'friendly' | 'professional' | 'playful' | 'mysterious' | 'energetic' | 'calm' | 'focused';
  quality: 'low' | 'medium' | 'high' | 'ultra' | 'ai-enhanced';
  autoEnhance: boolean;
  lipSync: boolean;
  gestures: boolean;
  expressions: boolean;
  floatingBehavior: 'static' | 'gentle' | 'active' | 'responsive' | 'intelligent' | 'adaptive';
  environment: 'office' | 'nature' | 'space' | 'cyberpunk' | 'fantasy' | 'beach' | 'mountain' | 'city' | 'home' | 'dynamic';
  weather: 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'stormy' | 'clear' | 'dynamic';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'dynamic';
  props: string[];
  accessories: string[];
  backgroundEffects: string[];
  particleEffects: boolean;
  lightingEffects: boolean;
  soundEffects: boolean;
  aiEnhancement: boolean;
  creativityMode: boolean;
  adaptiveBehavior: boolean;
  moodDetection: boolean;
  contextAwareness: boolean;
  performanceOptimization: boolean;
}

const QAvatar: React.FC<QAvatarProps> = ({
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 300, height: 400 },
  defaultAvatar = 'human',
  onClose,
  onMinimize,
  onMaximize,
  className = ''
}) => {
  const [config, setConfig] = useState<AvatarConfig>({
    type: defaultAvatar,
    size: initialSize,
    position: initialPosition,
    isFloating: true,
    isMinimized: false,
    isMuted: false,
    volume: 0.7,
    animationSpeed: 1,
    emotionalStyle: 'friendly',
    quality: 'ai-enhanced',
    autoEnhance: true,
    lipSync: true,
    gestures: true,
    expressions: true,
    floatingBehavior: 'intelligent',
    environment: 'dynamic',
    weather: 'dynamic',
    timeOfDay: 'dynamic',
    props: ['chair', 'umbrella'],
    accessories: ['glasses', 'hat'],
    backgroundEffects: ['gradient', 'particles'],
    particleEffects: true,
    lightingEffects: true,
    soundEffects: true,
    aiEnhancement: true,
    creativityMode: true,
    adaptiveBehavior: true,
    moodDetection: true,
    contextAwareness: true,
    performanceOptimization: true
  });

  const [showSettings, setShowSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const enhancementRef = useRef<NodeJS.Timeout>();

  // AI Enhancement System
  const enhanceAvatar = useCallback(() => {
    if (!config.aiEnhancement) return;

    // Simulate AI enhancement process
    const enhancements = [
      () => setConfig(prev => ({ ...prev, quality: 'ai-enhanced' })),
      () => setConfig(prev => ({ ...prev, particleEffects: true })),
      () => setConfig(prev => ({ ...prev, lightingEffects: true })),
      () => setConfig(prev => ({ ...prev, creativityMode: true })),
      () => setConfig(prev => ({ 
        ...prev, 
        props: [...prev.props, 'magic-wand', 'crystal-ball'].filter((_, i) => i < 5) 
      })),
      () => setConfig(prev => ({ 
        ...prev, 
        accessories: [...prev.accessories, 'crown', 'cape'].filter((_, i) => i < 3) 
      })),
      () => setConfig(prev => ({ 
        ...prev, 
        backgroundEffects: [...prev.backgroundEffects, 'aurora', 'stars'].filter((_, i) => i < 4) 
      }))
    ];

    const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    randomEnhancement();

    // Schedule next enhancement
    enhancementRef.current = setTimeout(enhanceAvatar, 30000 + Math.random() * 60000); // 30-90 seconds
  }, [config.aiEnhancement]);

  // Start AI enhancement
  useEffect(() => {
    if (config.aiEnhancement) {
      enhancementRef.current = setTimeout(enhanceAvatar, 10000); // Start after 10 seconds
    }
    return () => {
      if (enhancementRef.current) {
        clearTimeout(enhancementRef.current);
      }
    };
  }, [config.aiEnhancement, enhanceAvatar]);

  // Adaptive behavior system
  const adaptiveBehavior = useCallback(() => {
    if (!config.adaptiveBehavior) return;

    const hour = new Date().getHours();
    
    // Time-based adaptations
    if (hour >= 6 && hour < 12) {
      setConfig(prev => ({ ...prev, timeOfDay: 'morning', weather: 'sunny' }));
    } else if (hour >= 12 && hour < 18) {
      setConfig(prev => ({ ...prev, timeOfDay: 'afternoon', weather: 'clear' }));
    } else if (hour >= 18 && hour < 22) {
      setConfig(prev => ({ ...prev, timeOfDay: 'evening', weather: 'cloudy' }));
    } else {
      setConfig(prev => ({ ...prev, timeOfDay: 'night', weather: 'clear' }));
    }

    // Random environment changes
    const environments = ['nature', 'space', 'cyberpunk', 'fantasy', 'beach', 'mountain', 'city', 'home'];
    const randomEnv = environments[Math.floor(Math.random() * environments.length)];
    
    setTimeout(() => {
      setConfig(prev => ({ ...prev, environment: randomEnv }));
    }, 60000 + Math.random() * 120000); // 1-3 minutes
  }, [config.adaptiveBehavior]);

  useEffect(() => {
    if (config.adaptiveBehavior) {
      adaptiveBehavior();
      const interval = setInterval(adaptiveBehavior, 300000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [config.adaptiveBehavior, adaptiveBehavior]);

  // Floating animation
  const floatingAnimation = useCallback(() => {
    if (!config.isFloating || config.isMinimized) return;

    const amplitude = config.floatingBehavior === 'gentle' ? 3 : 
                     config.floatingBehavior === 'active' ? 8 : 
                     config.floatingBehavior === 'responsive' ? 5 : 0;
    
    const frequency = config.floatingBehavior === 'gentle' ? 0.02 : 
                     config.floatingBehavior === 'active' ? 0.03 : 
                     config.floatingBehavior === 'responsive' ? 0.025 : 0;

    const time = Date.now() * frequency;
    const y = Math.sin(time) * amplitude;

    setConfig(prev => ({
      ...prev,
      position: { ...prev.position, y: prev.position.y + y * 0.1 }
    }));

    animationRef.current = requestAnimationFrame(floatingAnimation);
  }, [config.isFloating, config.isMinimized, config.floatingBehavior]);

  useEffect(() => {
    if (config.isFloating && !config.isMinimized) {
      animationRef.current = requestAnimationFrame(floatingAnimation);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config.isFloating, config.isMinimized, floatingAnimation]);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem('qmoi-avatar-config', JSON.stringify(config));
  }, [config]);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('qmoi-avatar-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to load Q-Avatar config:', error);
      }
    }
  }, []);

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (config.isMinimized) return;
    
    setIsDragging(true);
    const rect = avatarRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || config.isMinimized) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep within viewport bounds
    const maxX = window.innerWidth - config.size.width;
    const maxY = window.innerHeight - config.size.height;

    setConfig(prev => ({
      ...prev,
      position: {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }
    }));
  }, [isDragging, dragOffset, config.size, config.isMinimized]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Enhanced avatar content with environments, props, and effects
  const renderAvatarContent = () => {
    const baseClasses = "w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg relative overflow-hidden";
    
    // Environment-based backgrounds
    const getEnvironmentBackground = () => {
      switch (config.environment) {
        case 'nature': return 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600';
        case 'space': return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900';
        case 'cyberpunk': return 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500';
        case 'fantasy': return 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500';
        case 'beach': return 'bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400';
        case 'mountain': return 'bg-gradient-to-br from-gray-600 via-slate-600 to-blue-600';
        case 'city': return 'bg-gradient-to-br from-gray-700 via-slate-700 to-blue-700';
        case 'home': return 'bg-gradient-to-br from-amber-400 via-orange-400 to-red-400';
        case 'office': return 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600';
        default: return 'bg-gradient-to-br from-blue-500 to-purple-600';
      }
    };

    // Weather effects
    const getWeatherEffects = () => {
      if (config.weather === 'rainy') {
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-8 bg-blue-300/50 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        );
      }
      if (config.weather === 'snowy') {
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/70 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        );
      }
      if (config.weather === 'sunny') {
        return (
          <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse shadow-lg">
            <div className="absolute inset-2 bg-yellow-300 rounded-full"></div>
          </div>
        );
      }
      return null;
    };

    // Props rendering
    const renderProps = () => {
      return (
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-4">
          {config.props.includes('chair') && (
            <div className="w-8 h-6 bg-brown-600 rounded-t-lg border-2 border-brown-800">
              <div className="w-6 h-2 bg-brown-700 rounded-t-sm mx-auto"></div>
            </div>
          )}
          {config.props.includes('umbrella') && config.weather === 'rainy' && (
            <div className="absolute top-2 right-8">
              <div className="w-6 h-8 bg-red-500 rounded-t-full border-2 border-red-700">
                <div className="w-1 h-4 bg-brown-600 mx-auto"></div>
              </div>
            </div>
          )}
          {config.props.includes('car') && (
            <div className="absolute bottom-2 left-4 w-12 h-4 bg-blue-600 rounded-lg border-2 border-blue-800">
              <div className="w-2 h-2 bg-black rounded-full absolute bottom-0 left-1"></div>
              <div className="w-2 h-2 bg-black rounded-full absolute bottom-0 right-1"></div>
            </div>
          )}
        </div>
      );
    };

    // Accessories rendering
    const renderAccessories = () => {
      return (
        <div className="absolute top-2 left-2 right-2 flex justify-center gap-2">
          {config.accessories.includes('glasses') && (
            <div className="w-8 h-3 bg-black/50 rounded-full border border-white/30"></div>
          )}
          {config.accessories.includes('hat') && (
            <div className="w-6 h-3 bg-red-500 rounded-t-full border border-red-700"></div>
          )}
          {config.accessories.includes('crown') && (
            <div className="w-8 h-4 bg-yellow-400 rounded-t-lg border-2 border-yellow-600 flex items-center justify-center">
              <span className="text-xs">👑</span>
            </div>
          )}
        </div>
      );
    };

    // Particle effects
    const renderParticles = () => {
      if (!config.particleEffects) return null;
      return (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      );
    };

    // Avatar core based on type
    const getAvatarCore = () => {
      const avatarData = {
        human: { emoji: '👤', title: 'QMOI', subtitle: 'AI Assistant', color: 'from-blue-500 to-purple-600' },
        animal: { emoji: '🦊', title: 'QMOI', subtitle: 'Smart Fox', color: 'from-green-500 to-teal-600' },
        robot: { emoji: '🤖', title: 'QMOI', subtitle: 'AI Bot', color: 'from-gray-600 to-slate-800' },
        abstract: { emoji: '✨', title: 'QMOI', subtitle: 'Digital Entity', color: 'from-pink-500 to-orange-500' },
        fantasy: { emoji: '🧙‍♂️', title: 'QMOI', subtitle: 'Mystical Being', color: 'from-purple-500 to-indigo-600' },
        cyberpunk: { emoji: '⚡', title: 'QMOI', subtitle: 'Cyber Entity', color: 'from-cyan-500 to-blue-600' },
        nature: { emoji: '🌿', title: 'QMOI', subtitle: 'Nature Spirit', color: 'from-green-400 to-emerald-500' },
        space: { emoji: '🚀', title: 'QMOI', subtitle: 'Cosmic Explorer', color: 'from-indigo-900 to-purple-900' }
      };

      const avatar = avatarData[config.type] || avatarData.human;
      
      return (
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <span className="text-3xl animate-pulse">{avatar.emoji}</span>
          </div>
          <div className="text-xl font-bold mb-1">{avatar.title}</div>
          <div className="text-sm opacity-75">{avatar.subtitle}</div>
          
          {/* AI Enhancement indicator */}
          {config.aiEnhancement && (
            <div className="mt-2 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-300">AI Enhanced</span>
            </div>
          )}
          
          {/* Creativity mode indicator */}
          {config.creativityMode && (
            <div className="mt-1">
              <span className="text-xs text-yellow-300">✨ Creative Mode</span>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className={`${baseClasses} ${getEnvironmentBackground()}`}>
        {/* Weather Effects */}
        {getWeatherEffects()}
        
        {/* Particle Effects */}
        {renderParticles()}
        
        {/* Lighting Effects */}
        {config.lightingEffects && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none"></div>
        )}
        
        {/* Props */}
        {renderProps()}
        
        {/* Accessories */}
        {renderAccessories()}
        
        {/* Avatar Core */}
        {getAvatarCore()}
        
        {/* Sound Effects Indicator */}
        {config.soundEffects && (
          <div className="absolute bottom-2 right-2">
            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xs">🔊</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Settings panel
  const SettingsPanel = () => (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Q-Avatar Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar Type</label>
                <Select value={config.type} onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="human">Human</SelectItem>
                    <SelectItem value="animal">Animal</SelectItem>
                    <SelectItem value="robot">Robot</SelectItem>
                    <SelectItem value="abstract">Abstract</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="space">Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Environment */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Environment</label>
                <Select value={config.environment} onValueChange={(value: any) => setConfig(prev => ({ ...prev, environment: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dynamic">Dynamic</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="space">Space</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="mountain">Mountain</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Weather */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Weather</label>
                <Select value={config.weather} onValueChange={(value: any) => setConfig(prev => ({ ...prev, weather: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dynamic">Dynamic</SelectItem>
                    <SelectItem value="sunny">Sunny</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="snowy">Snowy</SelectItem>
                    <SelectItem value="stormy">Stormy</SelectItem>
                    <SelectItem value="clear">Clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Floating Behavior */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Floating Behavior</label>
                <Select value={config.floatingBehavior} onValueChange={(value: any) => setConfig(prev => ({ ...prev, floatingBehavior: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Static</SelectItem>
                    <SelectItem value="gentle">Gentle</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="responsive">Responsive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quality</label>
                <Select value={config.quality} onValueChange={(value: any) => setConfig(prev => ({ ...prev, quality: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                    <SelectItem value="ai-enhanced">AI Enhanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Volume</label>
                <Slider
                  value={[config.volume]}
                  onValueChange={([value]) => setConfig(prev => ({ ...prev, volume: value }))}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Switches */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Floating</label>
                  <Switch
                    checked={config.isFloating}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isFloating: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Muted</label>
                  <Switch
                    checked={config.isMuted}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isMuted: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Lip Sync</label>
                  <Switch
                    checked={config.lipSync}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, lipSync: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Gestures</label>
                  <Switch
                    checked={config.gestures}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, gestures: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Expressions</label>
                  <Switch
                    checked={config.expressions}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, expressions: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto Enhance</label>
                  <Switch
                    checked={config.autoEnhance}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoEnhance: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">AI Enhancement</label>
                  <Switch
                    checked={config.aiEnhancement}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, aiEnhancement: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Creativity Mode</label>
                  <Switch
                    checked={config.creativityMode}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, creativityMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Adaptive Behavior</label>
                  <Switch
                    checked={config.adaptiveBehavior}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, adaptiveBehavior: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Mood Detection</label>
                  <Switch
                    checked={config.moodDetection}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, moodDetection: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Context Awareness</label>
                  <Switch
                    checked={config.contextAwareness}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, contextAwareness: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Particle Effects</label>
                  <Switch
                    checked={config.particleEffects}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, particleEffects: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Lighting Effects</label>
                  <Switch
                    checked={config.lightingEffects}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, lightingEffects: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Sound Effects</label>
                  <Switch
                    checked={config.soundEffects}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, soundEffects: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Performance Optimization</label>
                  <Switch
                    checked={config.performanceOptimization}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, performanceOptimization: checked }))}
                  />
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant={config.isFloating ? "default" : "secondary"}>
                  {config.isFloating ? "Floating" : "Static"}
                </Badge>
                <Badge variant={config.isMuted ? "destructive" : "default"}>
                  {config.isMuted ? "Muted" : "Audio"}
                </Badge>
                <Badge variant="outline">{config.quality}</Badge>
                <Badge variant="outline">{config.floatingBehavior}</Badge>
                <Badge variant="outline">{config.environment}</Badge>
                <Badge variant="outline">{config.weather}</Badge>
                {config.aiEnhancement && (
                  <Badge variant="default" className="bg-green-500">AI Enhanced</Badge>
                )}
                {config.creativityMode && (
                  <Badge variant="default" className="bg-yellow-500">Creative</Badge>
                )}
                {config.particleEffects && (
                  <Badge variant="outline">✨ Particles</Badge>
                )}
                {config.lightingEffects && (
                  <Badge variant="outline">💡 Lighting</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (config.isMinimized) {
    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 0.8, y: 20 }}
        className={`fixed z-50 ${className}`}
        style={{
          left: config.position.x,
          top: config.position.y,
          width: 60,
          height: 60
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg">
          <span className="text-xl">Q</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-white shadow-md"
          onClick={() => setConfig(prev => ({ ...prev, isMinimized: false }))}
        >
          <Maximize2 className="w-3 h-3" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={avatarRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: config.position.x,
        y: config.position.y
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed z-50 ${className}`}
      style={{
        width: config.size.width,
        height: config.size.height
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Main Avatar Container */}
      <div className="relative w-full h-full">
        {/* Avatar Content */}
        <div className="w-full h-full rounded-lg overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700">
          {renderAvatarContent()}
        </div>

        {/* Control Bar */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-md"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-md"
            onClick={() => setConfig(prev => ({ ...prev, isMuted: !prev.isMuted }))}
          >
            {config.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-md"
            onClick={() => setConfig(prev => ({ ...prev, isMinimized: true }))}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full bg-red-500/80 hover:bg-red-500 text-white shadow-md"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          {config.lipSync && (
            <Badge variant="outline" className="text-xs">
              <Mic className="w-3 h-3 mr-1" />
              Lip Sync
            </Badge>
          )}
          {config.gestures && (
            <Badge variant="outline" className="text-xs">
              ✋ Gestures
            </Badge>
          )}
          {config.expressions && (
            <Badge variant="outline" className="text-xs">
              😊 Expressions
            </Badge>
          )}
        </div>

        {/* Settings Panel */}
        <SettingsPanel />
      </div>
    </motion.div>
  );
};

export default QAvatar; 