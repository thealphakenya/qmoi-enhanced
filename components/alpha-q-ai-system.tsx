"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  Camera,
  Gamepad2,
  MessageSquare,
  Mic,
  MicOff,
  Music,
  Palette,
  Send,
  Video,
  Building,
  Eye,
  Download,
  Share,
  Zap,
  Sparkles,
  Brain,
  Wand2,
} from "lucide-react"
import Chart from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AIProvider, useAIContext } from "./AIContext"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  category?: "game" | "animation" | "music" | "architecture" | "general"
  mediaUrl?: string // For rich media (image/audio/video)
  mediaType?: "image" | "audio" | "video"
}

interface AIProject {
  id: string
  name: string
  type: "game" | "animation" | "movie" | "music" | "architecture" | "invention"
  status: "creating" | "completed" | "preview"
  progress: number
  preview?: string
  description: string
}

// Contextual memory: keep last 10 messages and all projects
const MAX_MEMORY = 10

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: SpeechRecognitionResult;
    };
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

interface Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

export default function AlphaQAISystem() {
  // Use shared AI context
  const {
    chatHistory, setChatHistory,
    aiHealth, deviceHealth,
    optimizeDevice, scanForErrors, selfHeal,
    persistentMemory, setPersistentMemory
  } = useAIContext();

  // Move all useState hooks to the top level
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "Welcome to Alpha-Q AI! I can help you create games, animations, movies, music, and architectural designs. What would you like to build today?",
      timestamp: new Date(),
      category: "general",
    },
  ]);
  const [projects, setProjects] = useState<AIProject[]>([]);
  const [currentProject, setCurrentProject] = useState<AIProject | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");
  const [galleryPreview, setGalleryPreview] = useState<AIProject | null>(null);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [datasetInput, setDatasetInput] = useState("");
  const [datasetFiles, setDatasetFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<"2d" | "3d" | "audio" | "video">("2d");
  const [isSpeakActive, setIsSpeakActive] = useState(false);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectDesc, setEditProjectDesc] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [goals, setGoals] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [goalEditIdx, setGoalEditIdx] = useState<number|null>(null);
  const [goalEditValue, setGoalEditValue] = useState('');
  const [inventions, setInventions] = useState<{ id: string; name: string; description: string }[]>([]);
  const [inventionInput, setInventionInput] = useState('');
  const [voicePreview, setVoicePreview] = useState<string | null>(null);
  const [forwardedPorts, setForwardedPorts] = useState<{ port: number, url: string }[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [output, setOutput] = useState<string[]>([]);
  const [debug, setDebug] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{ name: string; voiceSample?: Blob; lastSeen?: Date }>({ name: "User" });
  const [longTermMemory, setLongTermMemory] = useState<{ messages: ChatMessage[]; projects: AIProject[] }>({ messages: [], projects: [] });
  const [knownUsers, setKnownUsers] = useState<{ name: string; voicePrint?: string; lastSeen?: Date }[]>([]);
  const [activeUser, setActiveUser] = useState<{ name: string; voicePrint?: string; lastSeen?: Date } | null>(null);
  const [memoryLog, setMemoryLog] = useState<{ user: string; messages: ChatMessage[]; projects: AIProject[]; date: string }[]>([]);
  const [emotion, setEmotion] = useState<'happy' | 'neutral' | 'curious' | 'encouraging'>('neutral');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speakRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fix useEffect dependencies
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isVoiceActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      setIsVoiceActive(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => {};
    recognition.onend = () => {};
    recognition.onerror = () => {};
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [isVoiceActive, setInputMessage]);

  // Save to localStorage for persistent memory
  useEffect(() => {
    localStorage.setItem('alphaq-memory', JSON.stringify({ messages, projects, userProfile }));
  }, [messages, projects, userProfile]);

  // Load memory from localStorage
  useEffect(() => {
    const mem = localStorage.getItem('alphaq-memory');
    if (mem) {
      try {
        const parsed = JSON.parse(mem);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
      } catch (error) {
        console.error('Error loading memory:', error);
      }
    }
  }, []);

  // Save memory log
  useEffect(() => {
    localStorage.setItem('alphaq-memory-log', JSON.stringify(memoryLog));
  }, [memoryLog]);

  // Load memory log and known users
  useEffect(() => {
    const log = localStorage.getItem('alphaq-memory-log');
    if (log) {
      try {
        setMemoryLog(JSON.parse(log));
      } catch (error) {
        console.error('Error loading memory log:', error);
      }
    }
    const users = localStorage.getItem('alphaq-known-users');
    if (users) {
      try {
        setKnownUsers(JSON.parse(users));
      } catch (error) {
        console.error('Error loading known users:', error);
      }
    }
  }, []);

  // Load voices and remember choice
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        const savedVoice = localStorage.getItem('alphaq-voice');
        if (savedVoice) setSelectedVoice(savedVoice);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Speak AI messages if enabled
  useEffect(() => {
    if (isSpeakActive && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.type === 'ai') {
        const utter = new window.SpeechSynthesisUtterance(lastMsg.content);
        if (selectedVoice) {
          const voice = window.speechSynthesis.getVoices().find(v => v.voiceURI === selectedVoice);
          if (voice) utter.voice = voice;
        }
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      }
    }
  }, [messages, isSpeakActive, selectedVoice]);

  // Device API hooks
  const callContact = (number: string) => {
    // On mobile, use tel: link
    window.open(`tel:${number}`)
  }
  const playMusic = (url: string) => {
    const audio = new Audio(url)
    audio.play()
  }
  const readAloud = (text: string) => {
    const utter = new window.SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utter)
  }

  // Project gallery enhancements
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(gallerySearch.toLowerCase()))

  // Dataset management enhancements
  const handleDatasetUpload = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target.files) {
      setDatasetFiles([...datasetFiles, ...Array.from(e.target.files)])
    } else if (datasetInput.trim()) {
      setDatasets([...datasets, datasetInput])
      setDatasetInput("")
    }
  }

  // Speak a message aloud
  const speak = (text: string) => {
    if (!isVoiceActive) return
    const utter = new window.SpeechSynthesisUtterance(text)
    if (selectedVoice) {
      const voice = window.speechSynthesis.getVoices().find(v => v.voiceURI === selectedVoice)
      if (voice) utter.voice = voice
    }
    window.speechSynthesis.speak(utter)
    speakRef.current = utter
  }

  // Example: speak AI responses
  useEffect(() => {
    if (isVoiceActive && currentProject && currentProject.status === 'completed') {
      speak(`Project ${currentProject.name} is completed. Would you like to preview or export it?`)
    }
  }, [isVoiceActive, currentProject])

  // Language and autocorrect state
  const [language, setLanguage] = useState<'en' | 'sw'>('en')
  const [spellCheck, setSpellCheck] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Autocorrect and Swahili/English support
  const autocorrect = (text: string) => {
    // Simple demo: fix common typos, add Swahili support
    let corrected = text.replace(/teh/g, 'the').replace(/recieve/g, 'receive')
    if (language === 'sw') {
      // Translate common phrases to Swahili (demo)
      if (/hello|hi|hey/i.test(corrected)) corrected = 'Habari! Naweza kukusaidia vipi leo?'
      if (/how are you/i.test(corrected)) corrected = 'U hali gani?'
    }
    return corrected
  }

  // Enhanced handleSendMessage with autocorrect and language
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    let userText = spellCheck ? autocorrect(inputMessage) : inputMessage
    if (userText !== inputMessage) setInputMessage(userText)
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: userText,
      timestamp: new Date(),
    }
    setMessages((prev: ChatMessage[]) => {
      const next = [...prev, userMessage]
      return next.length > MAX_MEMORY ? next.slice(-MAX_MEMORY) : next
    })
    setInputMessage("")
    setIsGenerating(true)
    setTimeout(() => {
      const aiResponse = generateAIResponse(userText)
      setMessages((prev: ChatMessage[]) => {
        const next = [...prev, aiResponse]
        return next.length > MAX_MEMORY ? next.slice(-MAX_MEMORY) : next
      })
      setIsGenerating(false)
    }, 1500)
  }

  // Enhanced AI response with context and rich media
  const generateAIResponse = (input: string): ChatMessage => {
    const lowerInput = input.toLowerCase()
    let response = ""
    let category: ChatMessage["category"] = "general"
    let mediaUrl: string | undefined
    let mediaType: "image" | "audio" | "video" | undefined

    // Example: If user asks for a cat image
    if (lowerInput.includes("cat image")) {
      response = "Here's a cat image for you!"
      mediaUrl = "https://placekitten.com/300/200"
      mediaType = "image"
    } else if (lowerInput.includes("sample music")) {
      response = "Here's a sample music clip."
      mediaUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      mediaType = "audio"
    } else if (lowerInput.includes("game") || lowerInput.includes("play")) {
      category = "game"
      response =
        "🎮 I'll help you create an amazing game! I can generate:\n\n• 2D/3D game mechanics\n• Character designs and animations\n• Level layouts and environments\n• Game physics and interactions\n• Sound effects and music\n\nWhat type of game would you like to create? (RPG, Platformer, Puzzle, etc.)"
      createProject("game", "Interactive Game", "Creating game mechanics and assets...")
    } else if (lowerInput.includes("animation") || lowerInput.includes("animate")) {
      category = "animation"
      response =
        "🎬 Let's create stunning animations! I can help with:\n\n• Character animation sequences\n• Motion graphics and effects\n• 2D/3D animation workflows\n• Keyframe generation\n• Particle systems\n\nDescribe the animation you'd like to create!"
      createProject("animation", "Animation Sequence", "Generating animation frames and sequences...")
    } else if (lowerInput.includes("movie") || lowerInput.includes("film")) {
      category = "animation"
      response =
        "🎥 Time to make a movie! I can assist with:\n\n• Storyboard creation\n• Scene composition\n• Character development\n• Visual effects\n• Cinematic sequences\n\nWhat's your movie concept?"
      createProject("movie", "Movie Project", "Creating storyboard and visual sequences...")
    } else if (lowerInput.includes("music") || lowerInput.includes("song") || lowerInput.includes("audio")) {
      category = "music"
      response =
        "🎵 Let's compose beautiful music! I can create:\n\n• Melodies and harmonies\n• Rhythm patterns\n• Instrumental arrangements\n• Sound synthesis\n• Audio effects\n\nWhat genre or mood are you looking for?"
      createProject("music", "Music Composition", "Composing melodies and generating audio...")
    } else if (lowerInput.includes("architect") || lowerInput.includes("building") || lowerInput.includes("design")) {
      category = "architecture"
      response =
        "🏗️ Let's design amazing structures! I can help with:\n\n• Building layouts and floor plans\n• 3D architectural models\n• Interior design concepts\n• Landscape architecture\n• Structural engineering\n\nWhat type of structure would you like to design?"
      createProject("architecture", "Architectural Design", "Creating blueprints and 3D models...")
    } else {
      // Use context: reference last user message or project
      const lastUserMsg = messages.filter(m => m.type === 'user').slice(-1)[0]
      const lastProject = projects.slice(-1)[0]
      if (lastUserMsg && lastProject) {
        response = `You last asked: "${lastUserMsg.content}". Your current project is: ${lastProject.name}. How can I assist further?`
      } else {
        response =
          "I'm here to help you create amazing content! I specialize in:\n\n🎮 **Games** - Interactive experiences and gameplay\n🎬 **Animations & Movies** - Visual storytelling\n🎵 **Music** - Audio composition and sound design\n🏗️ **Architecture** - Building and space design\n\nWhat would you like to create today?"
      }
    }

    return {
      id: Date.now().toString(),
      type: "ai",
      content: response,
      timestamp: new Date(),
      category,
      mediaUrl,
      mediaType,
    }
  }

  const createProject = (type: AIProject["type"], name: string, description: string) => {
    const project: AIProject = {
      id: Date.now().toString(),
      name,
      type,
      status: "creating",
      progress: 0,
      description,
    }

    setCurrentProject(project)
    setProjects((prev) => [...prev, project])

    // Simulate project creation progress
    const interval = setInterval(() => {
      setCurrentProject((prev) => {
        if (!prev) return null
        const newProgress = Math.min(prev.progress + Math.random() * 15, 100)
        const updatedProject = { ...prev, progress: newProgress }

        if (newProgress >= 100) {
          updatedProject.status = "completed"
          updatedProject.preview = generatePreview(type)
          clearInterval(interval)
        }

        setProjects((prevProjects) => prevProjects.map((p) => (p.id === prev.id ? updatedProject : p)))

        return updatedProject
      })
    }, 500)
  }

  const generatePreview = (type: AIProject["type"]): string => {
    switch (type) {
      case "game":
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMWEyZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn46uIEdhbWUgUHJldmlldyDwn46uPC90ZXh0Pjwvc3ZnPg=="
      case "animation":
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJkMWI2OSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn46sIEFuaW1hdGlvbiDwn46sPC90ZXh0Pjwvc3ZnPg=="
      case "movie":
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzc5MWEyZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn46lIE1vdmllIFByZXZpZXcg8J+OpTwvdGV4dD48L3N2Zz4="
      case "music":
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhNjkyZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn46tIE11c2ljIENvbXBvc2l0aW9uIPCfjq08L3RleHQ+PC9zdmc+"
      case "architecture":
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJlNGEyZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn46XIEFyY2hpdGVjdHVyZSDwn46XPC90ZXh0Pjwvc3ZnPg=="
      case "invention":
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzQ0YjVmZiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn5KpIEludmVudGlvbiA8L3RleHQ+PC9zdmc+"
      default:
        return ""
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "game":
        return <Gamepad2 className="h-4 w-4" />
      case "animation":
        return <Video className="h-4 w-4" />
      case "music":
        return <Music className="h-4 w-4" />
      case "architecture":
        return <Building className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "game":
        return "bg-purple-500"
      case "animation":
        return "bg-blue-500"
      case "music":
        return "bg-green-500"
      case "architecture":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  // Show voice picker on first enable
  const handleSpeakToggle = () => {
    if (!isSpeakActive && !selectedVoice) {
      setShowVoicePicker(true)
    } else {
      setIsSpeakActive(v => !v)
    }
  }

  const handleVoiceSelect = (voiceURI: string) => {
    setSelectedVoice(voiceURI)
    localStorage.setItem('alphaq-voice', voiceURI)
    setIsSpeakActive(true)
    setShowVoicePicker(false)
  }

  // Export Project (dummy implementation)
  const handleExportProject = (project: AIProject) => {
    // For now, just download a JSON file
    const data = JSON.stringify(project, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Edit Project
  const openEditProject = (project: AIProject) => {
    setEditProjectId(project.id)
    setEditProjectName(project.name)
    setEditProjectDesc(project.description)
  }
  const saveEditProject = () => {
    setProjects((prev) => prev.map(p => p.id === editProjectId ? { ...p, name: editProjectName, description: editProjectDesc } : p))
    setEditProjectId(null)
  }
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter(p => p.id !== id))
    if (currentProject && currentProject.id === id) setCurrentProject(null)
  }

  // Advanced device integrations
  const vibrateDevice = (pattern: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(pattern)
  }
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text)
  }
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => alert(`Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}`),
        err => alert('Location error: ' + err.message)
      )
    }
  }
  const sendNotification = (title: string, body: string) => {
    if (window.Notification && Notification.permission === 'granted') {
      new Notification(title, { body })
    } else if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') new Notification(title, { body })
      })
    }
  }
  // Project/dataset analytics
  const totalProjects = projects.length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalDatasets = datasets.length + datasetFiles.length

  // Enhanced voice selection with audio preview
  const playVoicePreview = (voiceURI: string) => {
    const utter = new window.SpeechSynthesisUtterance('Sample voice. Sauti ya mfano. This is a test.')
    const voice = availableVoices.find(v => v.voiceURI === voiceURI)
    if (voice) utter.voice = voice
    window.speechSynthesis.speak(utter)
    setVoicePreview(voiceURI)
  }

  // Simultaneous talk/listen (demo: allow both toggles)
  // const handleSimultaneousToggle = () => {
  //   setIsVoiceActive(v => !v)
  //   setIsSpeakActive(v => !v)
  // }

  // Enhanced project save: save to Alpha-Qmoi folder, icons, shortcuts, install terms
  const saveProjectToFolder = (project: AIProject) => {
    // Simulate folder save
    const folder = `/Alpha-Qmoi/${project.type}/${project.name}`
    // Save logic here (backend integration needed)
    alert(`Project saved to ${folder}`)
  }

  // Add state for port forwarding and debug/probs/output
  // const [forwardedPorts, setForwardedPorts] = useState<{ port: number, url: string }[]>([])
  // const [problems, setProblems] = useState<string[]>([])
  // const [output, setOutput] = useState<string[]>([])
  // const [debug, setDebug] = useState<string[]>([])

  // AddForwardedPort implementation
  const addForwardedPort = (port: number) => {
    // For demo: assume localhost, in real use, backend should provide the URL
    const url = `http://localhost:${port}`
    setForwardedPorts((prev) => [...prev, { port, url }])
    setOutput((prev) => [...prev, `Port ${port} forwarded to ${url}`])
  }

  // --- Enhanced Memory and User Profile ---
  // const [userProfile, setUserProfile] = useState<{ name: string; voiceSample?: Blob; lastSeen?: Date }>({ name: "User" })
  // const [longTermMemory, setLongTermMemory] = useState<{ messages: ChatMessage[]; projects: AIProject[] }>({ messages: [], projects: [] })

  // --- Deep Long-Term Memory and Multi-User Support ---
  // const [knownUsers, setKnownUsers] = useState<{ name: string; voicePrint?: string; lastSeen?: Date }[]>([])
  // const [activeUser, setActiveUser] = useState<{ name: string; voicePrint?: string; lastSeen?: Date } | null>(null)
  // const [memoryLog, setMemoryLog] = useState<{ user: string; messages: ChatMessage[]; projects: AIProject[]; date: string }[]>([])

  // --- Advanced Voice Biometrics (Simulated) ---
  const simulateVoicePrint = (transcript: string) => {
    // In real use, extract features from audio. Here, hash transcript for demo.
    return btoa(unescape(encodeURIComponent(transcript))).slice(0, 16)
  }

  const identifyUserByVoice = (voicePrint: string) => {
    const match = knownUsers.find(u => u.voicePrint === voicePrint)
    if (match) {
      setActiveUser(match)
      setUserProfile({ ...userProfile, name: match.name })
      speak(`Welcome back, ${match.name}!`)
      return match.name
    }
    return null
  }

  // On voice recognition, try to identify user and update memory
  useEffect(() => {
    if (!isVoiceActive) return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'sw' ? 'sw-KE' : 'en-US'
    recognition.interimResults = false
    recognition.continuous = true
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript
      setInputMessage((prev) => (prev ? prev + ' ' + transcript : transcript))
      // Simulate voiceprint extraction
      const voicePrint = simulateVoicePrint(transcript)
      let userName = identifyUserByVoice(voicePrint)
      if (!userName) {
        // New user: ask for name and save
        userName = prompt('I do not recognize your voice. What is your name?') || 'User'
        setKnownUsers(prev => {
          const updated = [...prev, { name: userName!, voicePrint, lastSeen: new Date() }]
          localStorage.setItem('alphaq-known-users', JSON.stringify(updated))
          return updated
        })
        setActiveUser({ name: userName, voicePrint, lastSeen: new Date() })
        setUserProfile({ ...userProfile, name: userName })
        speak(`Nice to meet you, ${userName}! I'll remember your voice for next time.`)
      }
      // Log memory for this user
      setMemoryLog(prev => {
        const today = new Date().toISOString().slice(0, 10)
        const entryIdx = prev.findIndex(e => e.user === userName && e.date === today)
        const newEntry = { user: userName!, messages, projects, date: today }
        if (entryIdx >= 0) {
          const updated = [...prev]
          updated[entryIdx] = newEntry
          return updated
        } else {
          return [...prev, newEntry]
        }
      })
    }
    recognitionRef.current = recognition
    recognition.start()
    return () => recognition.stop()
  }, [isVoiceActive, language, knownUsers])

  // --- Relationship/UX: Personalized Greetings, Memory Recall, Emotional Context ---
  // const [emotion, setEmotion] = useState<'happy' | 'neutral' | 'curious' | 'encouraging'>('neutral')

  useEffect(() => {
    if (isVoiceActive && activeUser) {
      // Personalized greeting with emotional context
      let greeting = ''
      switch (emotion) {
        case 'happy': greeting = `😊 Hi ${activeUser.name}, I'm happy to see you!`; break
        case 'curious': greeting = `🤔 Hello ${activeUser.name}, what shall we explore today?`; break
        case 'encouraging': greeting = `🚀 Welcome back ${activeUser.name}, let's achieve something great!`; break
        default: greeting = `Hello ${activeUser.name}, welcome back to Alpha-Q AI!`;
      }
      speak(greeting)
      setEmotion('neutral')
    }
  }, [isVoiceActive, activeUser])

  // Memory recall: allow user to ask "What did we do last time?" or "Remind me my last project"
  useEffect(() => {
    if (!inputMessage) return
    if (/what did we do last time|remind me my last project/i.test(inputMessage)) {
      const today = new Date().toISOString().slice(0, 10)
      const user = activeUser?.name || userProfile.name
      const lastEntry = memoryLog.filter(e => e.user === user && e.date !== today).slice(-1)[0]
      if (lastEntry) {
        const lastProj = lastEntry.projects.slice(-1)[0]
        if (lastProj) {
          speak(`Last time, you worked on project ${lastProj.name}: ${lastProj.description}`)
        } else {
          speak('I do not recall a project from last time.')
        }
      } else {
        speak('I do not have memory of your last session.')
      }
      setInputMessage('')
    }
  }, [inputMessage, memoryLog, activeUser, userProfile])

  // --- Enhanced Project Save/Progress/Preview/Testing ---
  const [savingProjectId, setSavingProjectId] = useState<string | null>(null)
  const [testingProjectId, setTestingProjectId] = useState<string | null>(null)
  const saveProjectProgress = (project: AIProject) => {
    setSavingProjectId(project.id)
    setTimeout(() => {
      setSavingProjectId(null)
      speak(`Project ${project.name} progress saved!`)
    }, 1000)
  }
  const testProject = (project: AIProject) => {
    setTestingProjectId(project.id)
    setTimeout(() => {
      setProjects((prev) => prev.map(p => p.id === project.id ? { ...p, status: 'completed' } : p))
      setTestingProjectId(null)
      speak(`Project ${project.name} test completed!`)
    }, 2000)
  }

  // --- Autonomous AI Creativity Engine ---
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return
    // Check if already created projects today
    const today = new Date().toISOString().slice(0, 10)
    const creativityLogKey = 'alphaq-creativity-log'
    let creativityLog: { date: string; projectIds: string[] }[] = []
    try {
      creativityLog = JSON.parse(localStorage.getItem(creativityLogKey) || '[]')
    } catch {}
    const todayLog = creativityLog.find(l => l.date === today)
    // Project types to ensure daily
    let featureTypes: AIProject['type'][] = ['game', 'animation', 'movie', 'music', 'architecture']
    if (isAdminOrSister()) featureTypes.push('invention')
    // At least 10 projects, one per type
    const neededProjects = 10
    const projectsToday = projects.filter(p => {
      const d = new Date(parseInt(p.id)).toISOString().slice(0, 10)
      return d === today
    })
    if (todayLog && todayLog.projectIds.length >= neededProjects) return // Already done
    if (projectsToday.length >= neededProjects) return
    // Helper: create a random project for a type
    const randomName = (type: AIProject['type']) => {
      const names = {
        game: ['Galactic Quest', 'Puzzle Master', 'Jungle Run', 'Sky Defender'],
        animation: ['Dancing Pixels', 'Magic Forest', 'Robot Parade', 'Epic Journey'],
        movie: ['The Long Night', 'AI Odyssey', 'Dreams of Tomorrow', 'Quantum Leap'],
        music: ['Synthwave Dreams', 'AI Sings the Blues', 'Cosmic Harmony', 'Electric Sunrise'],
        architecture: ['Sky Tower', 'Eco Villa', 'Urban Oasis', 'Futurist Dome'],
        invention: ['Smart Water Purifier', 'AI Crop Monitor', 'Solar Microgrid', 'Health Tracker Patch'],
      }
      return names[type][Math.floor(Math.random() * names[type].length)]
    }
    const randomDesc = (type: AIProject['type']) => {
      switch (type) {
        case 'game': return 'A new interactive game with unique mechanics.'
        case 'animation': return 'A creative animation sequence with rich visuals and effects.'
        case 'movie': return 'A long-form AI-generated movie (min 1hr 20min) with story, visuals, and audio.'
        case 'music': return 'An advanced music composition with AI singing and production.'
        case 'architecture': return 'A visionary architectural design with 3D models and blueprints.'
        case 'invention': return 'A new invention project for business, welfare, or national impact.'
        default: return 'AI-generated creative project.'
      }
    }
    // Ensure at least one long-form movie, one advanced music, and (if admin/sister) one invention
    const mustHaveTypes: AIProject['type'][] = ['movie', 'music']
    if (isAdminOrSister()) mustHaveTypes.push('invention')
    const createdTypes = new Set(projectsToday.map(p => p.type))
    const toCreate: AIProject['type'][] = []
    mustHaveTypes.forEach(t => { if (!createdTypes.has(t)) toCreate.push(t) })
    // Fill up to neededProjects with random types
    while (toCreate.length < neededProjects) {
      const t = featureTypes[Math.floor(Math.random() * featureTypes.length)]
      toCreate.push(t)
    }
    // Create projects
    toCreate.forEach((type, idx) => {
      setTimeout(() => {
        const name = randomName(type)
        const desc = randomDesc(type)
        // Use createProject, then testProject after creation
        const project: AIProject = {
          id: Date.now().toString() + Math.floor(Math.random()*10000),
          name,
          type,
          status: 'creating',
          progress: 0,
          description: desc,
        }
        setProjects(prev => [...prev, project])
        setTimeout(() => {
          setProjects(prev => prev.map(p => p.id === project.id ? { ...p, progress: 100, status: 'completed', preview: generatePreview(type) } : p))
        }, 1000 + idx * 500)
      }, idx * 200)
    })
    // Log in creativity log
    const newLog = { date: today, projectIds: toCreate.map((_, idx) => Date.now().toString() + idx) }
    creativityLog = creativityLog.filter(l => l.date !== today)
    creativityLog.push(newLog)
    localStorage.setItem(creativityLogKey, JSON.stringify(creativityLog))
  }, [projects])

  // --- Project Documentation & Admin Integration ---
  // Helper: Generate documentation/instructions for a project
  const generateProjectDocs = (project: AIProject) => {
    let doc = `# ${project.name}\n\n`;
    doc += `**Type:** ${project.type}\n`;
    doc += `**Status:** ${project.status}\n`;
    doc += `**Description:** ${project.description}\n\n`;
    switch (project.type) {
      case 'game':
        doc += '## Instructions\n- Use arrow keys or touch to play.\n- Each level is procedurally generated.\n- Save progress from the menu.';
        break;
      case 'animation':
        doc += '## Instructions\n- Preview the animation in the gallery.\n- Download frames or export as video.';
        break;
      case 'movie':
        doc += '## Instructions\n- Play the movie in the preview window.\n- Download or share the full-length video.\n- Series episodes are available in the gallery.';
        break;
      case 'music':
        doc += '## Instructions\n- Listen to the AI-composed track.\n- Download as MP3/WAV.\n- Lyrics and vocals are AI-generated.';
        break;
      case 'architecture':
        doc += '## Instructions\n- View 3D models and blueprints.\n- Download design files.\n- Use AR/VR preview if available.';
        break;
      case 'invention':
        doc += '## Instructions\n- Review the invention details and specifications.\n- Download design files or reports.\n- Use AR/VR preview if available.';
        break;
      default:
        doc += '## Instructions\n- Explore project features.';
    }
    doc += '\n\n---\n*Generated by Alpha-Q AI on ' + new Date().toLocaleDateString() + '*';
    return doc;
  }

  // --- Admin Projects State ---
  const [adminProjects, setAdminProjects] = useState<{ project: AIProject; docs: string }[]>([])

  // Ensure all AI-created projects are added to adminProjects with docs
  useEffect(() => {
    // Only add if not already present
    projects.forEach(p => {
      if (!adminProjects.find(ap => ap.project.id === p.id)) {
        setAdminProjects(prev => [...prev, { project: p, docs: generateProjectDocs(p) }])
      }
    })
  }, [projects])

  // --- UX/Analytics/Creativity Enhancements ---
  // Project analytics: type breakdown, daily/weekly stats
  const featureTypes: AIProject['type'][] = ['game', 'animation', 'movie', 'music', 'architecture', 'invention']
  const projectTypeCounts = featureTypes.reduce((acc, t) => {
    acc[t] = projects.filter(p => p.type === t).length
    return acc
  }, {} as Record<AIProject['type'], number>)
  const today = new Date().toISOString().slice(0, 10)
  const projectsToday = projects.filter(p => {
    const d = new Date(parseInt(p.id)).toISOString().slice(0, 10)
    return d === today
  })
  const creativityScore = Math.min(100, (projectsToday.length / 10) * 100)

  // --- In the UI, add: ---
  // - Admin Projects tab with docs/instructions
  // - Analytics cards: project type breakdown, creativity score
  // - More polished project cards (hover, tooltips, icons)
  // - Decision-making: AI suggests next project type if user is idle
  // (UI code not shown here, but add new tabs/cards/sections as described)

  // --- Tool Creation, Research, and Suggestions UI ---
  const [tools, setTools] = useState<{ name: string; description: string; createdBy: string; usedByAI: boolean }[]>([])
  const [toolInput, setToolInput] = useState("")

  const [suggestions, setSuggestions] = useState<string[]>([])

  const createTool = (name: string, description: string, createdBy: string = "AI") => {
    setTools(prev => [...prev, { name, description, createdBy, usedByAI: true }])
    setSuggestions(prev => [
      ...prev,
      `New tool created: ${name} — ${description}`
    ])
  }

  useEffect(() => {
    if (suggestions.length === 0) {
      setSuggestions([
        "Try creating a new tool for data visualization!",
        "How about an AI-powered code refactoring utility?",
        "Consider a project that combines music and animation.",
        "Build a tool to automate dataset cleaning.",
        "Explore a research project using real-time web data."
      ])
    }
  }, [])

  const handleToolCreate = () => {
    if (toolInput.trim()) {
      createTool(toolInput.trim(), "User-defined tool", "User")
      setToolInput("")
    }
  }

  // Add isAdminOrSister function
  const isAdminOrSister = () => {
    // For now, return true for testing
    // In production, this should check user roles/permissions
    return true;
  };

  // --- Main UI ---
  return (
    <div className="flex flex-col h-screen">
      <Tabs defaultValue="chat" className="flex-1">
          <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
        <TabsContent value="chat">
                  <Card>
                    <CardContent>
              {/* Chat content */}
                    </CardContent>
                  </Card>
          </TabsContent>
        <TabsContent value="projects">
            <Card>
              <CardContent>
              {/* Projects content */}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tools">
            <Card>
              <CardContent>
              {/* Tools content */}
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
                  </div>
  );
}
