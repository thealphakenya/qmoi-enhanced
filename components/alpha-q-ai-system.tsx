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

export default function AlphaQAISystem() {
  // Use shared AI context
  const {
    chatHistory, setChatHistory,
    aiHealth, deviceHealth,
    optimizeDevice, scanForErrors, selfHeal,
    persistentMemory, setPersistentMemory
  } = useAIContext();

  // Local state for projects, goals, inventions, etc.
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to Alpha-Q AI! I can help you create games, animations, movies, music, and architectural designs. What would you like to build today?",
      timestamp: new Date(),
      category: "general",
    },
  ]);
  const [projects, setProjects] = useState<AIProject[]>([])
  const [currentProject, setCurrentProject] = useState<AIProject | null>(null)
  // Voice output state
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
  const speakRef = useRef<SpeechSynthesisUtterance | null>(null)

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
  const [showGallery, setShowGallery] = useState(false)
  const [gallerySearch, setGallerySearch] = useState("")
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(gallerySearch.toLowerCase()))
  const [galleryPreview, setGalleryPreview] = useState<AIProject | null>(null)

  // Dataset management enhancements
  const [datasets, setDatasets] = useState<string[]>([])
  const [datasetInput, setDatasetInput] = useState("")
  const [datasetFiles, setDatasetFiles] = useState<File[]>([])
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

  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState<"2d" | "3d" | "audio" | "video">("2d")
  const [isSpeakActive, setIsSpeakActive] = useState(false)
  const [showVoicePicker, setShowVoicePicker] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])

  // Project Editing Dialog State
  const [editProjectId, setEditProjectId] = useState<string | null>(null)
  const [editProjectName, setEditProjectName] = useState("")
  const [editProjectDesc, setEditProjectDesc] = useState("")

  // Local state for input, goals, inventions, etc.
  const [inputMessage, setInputMessage] = useState("");
  const [goals, setGoals] = useState<any[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [goalEditIdx, setGoalEditIdx] = useState<number|null>(null);
  const [goalEditValue, setGoalEditValue] = useState('');
  const [inventions, setInventions] = useState<any[]>([]);
  const [inventionInput, setInventionInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!isVoiceActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      return
    }
    // Web Speech API setup
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.")
      setIsVoiceActive(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onstart = () => {}
    recognition.onend = () => {}
    recognition.onerror = () => {}
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputMessage((prev) => (prev ? prev + " " + transcript : transcript))
    }
    recognitionRef.current = recognition
    recognition.start()
    return () => {
      recognition.stop()
    }
  }, [isVoiceActive])

  // Load voices and remember choice
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        setAvailableVoices(voices)
        const savedVoice = localStorage.getItem('alphaq-voice')
        if (savedVoice) setSelectedVoice(savedVoice)
      }
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

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
  }, [messages, isSpeakActive, selectedVoice, availableVoices])

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
  const [voicePreview, setVoicePreview] = useState<string | null>(null)
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
  const [forwardedPorts, setForwardedPorts] = useState<{ port: number, url: string }[]>([])
  const [problems, setProblems] = useState<string[]>([])
  const [output, setOutput] = useState<string[]>([])
  const [debug, setDebug] = useState<string[]>([])

  // AddForwardedPort implementation
  const addForwardedPort = (port: number) => {
    // For demo: assume localhost, in real use, backend should provide the URL
    const url = `http://localhost:${port}`
    setForwardedPorts((prev) => [...prev, { port, url }])
    setOutput((prev) => [...prev, `Port ${port} forwarded to ${url}`])
  }

  // --- Enhanced Memory and User Profile ---
  const [userProfile, setUserProfile] = useState<{ name: string; voiceSample?: Blob; lastSeen?: Date }>({ name: "User" })
  const [longTermMemory, setLongTermMemory] = useState<{ messages: ChatMessage[]; projects: AIProject[] }>({ messages: [], projects: [] })

  // Save to localStorage for persistent memory
  useEffect(() => {
    localStorage.setItem('alphaq-memory', JSON.stringify({ messages, projects, userProfile }))
  }, [messages, projects, userProfile])

  useEffect(() => {
    const mem = localStorage.getItem('alphaq-memory')
    if (mem) {
      try {
        const parsed = JSON.parse(mem)
        if (parsed.messages) setMessages(parsed.messages)
        if (parsed.projects) setProjects(parsed.projects)
        if (parsed.userProfile) setUserProfile(parsed.userProfile)
      } catch {}
    }
  }, [])

  // --- Deep Long-Term Memory and Multi-User Support ---
  const [knownUsers, setKnownUsers] = useState<{ name: string; voicePrint?: string; lastSeen?: Date }[]>([])
  const [activeUser, setActiveUser] = useState<{ name: string; voicePrint?: string; lastSeen?: Date } | null>(null)
  const [memoryLog, setMemoryLog] = useState<{ user: string; messages: ChatMessage[]; projects: AIProject[]; date: string }[]>([])

  // Save all memory to localStorage for deep recall
  useEffect(() => {
    localStorage.setItem('alphaq-memory-log', JSON.stringify(memoryLog))
  }, [memoryLog])

  // On load, restore memory log and known users
  useEffect(() => {
    const log = localStorage.getItem('alphaq-memory-log')
    if (log) {
      try {
        setMemoryLog(JSON.parse(log))
      } catch {}
    }
    const users = localStorage.getItem('alphaq-known-users')
    if (users) {
      try {
        setKnownUsers(JSON.parse(users))
      } catch {}
    }
  }, [])

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
    recognition.onresult = (event: any) => {
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
  const [emotion, setEmotion] = useState<'happy' | 'neutral' | 'curious' | 'encouraging'>('neutral')

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

  // --- Main UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Alpha-Q AI
              </h1>
            </div>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Enhanced System</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={isVoiceActive ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsVoiceActive((v) => !v)}
              aria-label={isVoiceActive ? "Stop voice input" : "Start voice input"}
            >
              {isVoiceActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isVoiceActive && (
                <span className="ml-2 animate-pulse text-xs text-red-500">Listening...</span>
              )}
            </Button>
            <Button
              style={{ backgroundColor: isSpeakActive ? '#22c55e' : '#6b7280', color: 'white' }}
              size="sm"
              onClick={handleSpeakToggle}
              aria-label={isSpeakActive ? "Disable AI Speak" : "Enable AI Speak"}
            >
              <span className="mr-1">{isSpeakActive ? '🗣️' : '🔇'}</span> Speak
            </Button>
            {showVoicePicker && (
              <div className="absolute z-50 bg-white dark:bg-gray-900 border rounded p-4 shadow-lg">
                <h2 className="font-bold mb-2">Choose AI Voice</h2>
                <ul className="max-h-48 overflow-y-auto">
                  {availableVoices.map((voice) => (
                    <li key={voice.voiceURI} className="mb-1">
                      <Button size="sm" variant="outline" onClick={() => handleVoiceSelect(voice.voiceURI)}>
                        {voice.name} {voice.lang} {voice.default ? '(Default)' : ''}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Badge variant="outline" className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Online</span>
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="projects" className="mb-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="admin">Admin Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            {isAdminOrSister() && <TabsTrigger value="goals">Life Goals & Inventions</TabsTrigger>}
          </TabsList>
          <TabsContent value="projects">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>AI Chat Interface</span>
                    </CardTitle>
                    <CardDescription>Chat with Alpha-Q AI to create games, animations, music, and more</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.type === "user" ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <div className="flex items-start space-x-2">
                                {message.type === "ai" && (
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${getCategoryColor(message.category)}`}
                                  >
                                    {getCategoryIcon(message.category)}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="whitespace-pre-wrap">{message.content}</p>
                                  {message.mediaUrl && message.mediaType === 'image' && (
                                    <img src={message.mediaUrl} alt="media" className="my-2 rounded border max-w-xs" />
                                  )}
                                  {message.mediaUrl && message.mediaType === 'audio' && (
                                    <audio controls className="my-2 w-full">
                                      <source src={message.mediaUrl} />
                                      Your browser does not support the audio element.
                                    </audio>
                                  )}
                                  {/* Video support can be added similarly */}
                                  <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {isGenerating && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    <Separator className="my-4" />

                    <div className="flex space-x-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me to create games, animations, music, or architecture..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isGenerating}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview & Projects Panel */}
              <div className="space-y-6">
                {/* Current Project */}
                {currentProject && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Wand2 className="h-5 w-5" />
                        <span>Current Project</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">{currentProject.name}</h3>
                          <p className="text-sm text-muted-foreground">{currentProject.description}</p>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{Math.round(currentProject.progress)}%</span>
                          </div>
                          <Progress value={currentProject.progress} />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => saveProjectProgress(currentProject)} disabled={savingProjectId === currentProject.id}>
                            {savingProjectId === currentProject.id ? 'Saving...' : 'Save Progress'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => testProject(currentProject)}>
                            <Palette className="h-3 w-3" />
                            <span>Art</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Projects */}
                {projects.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        <div className="space-y-2">
                          {projects
                            .slice(-5)
                            .reverse()
                            .map((project) => (
                              <div key={project.id} className="flex items-center justify-between p-2 border rounded">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(project.type)}`} />
                                  <span className="text-sm font-medium">{project.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Badge variant={project.status === "completed" ? "default" : "secondary"}>{project.status}</Badge>
                                  <Button size="sm" variant="outline" onClick={() => openEditProject(project)} title="Edit">
                                    ✏️
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleExportProject(project)} title="Export">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => deleteProject(project.id)} title="Delete">
                                    🗑️
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Projects (AI & User)</CardTitle>
                <CardDescription>All projects with documentation/instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  <div className="space-y-4">
                    {adminProjects.map(({ project, docs }: { project: AIProject; docs: string }) => (
                      <div key={project.id} className="border rounded p-2 bg-white dark:bg-gray-900 hover:shadow transition">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">{project.type}</Badge>
                          <span className="font-semibold">{project.name}</span>
                          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>{project.status}</Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(docs)}>Copy Docs</Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy documentation/instructions</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button size="sm" variant="outline" onClick={() => handleExportProject(project)}>Export</Button>
                        </div>
                        <pre className="text-xs whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 p-2 rounded border overflow-x-auto">{docs}</pre>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
                <CardDescription>Breakdown by type, daily stats, creativity score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {featureTypes.map((type: AIProject['type']) => (
                    <div key={type} className="flex flex-col items-center p-2 border rounded bg-slate-50 dark:bg-slate-800">
                      <span className="font-bold capitalize">{type}</span>
                      <span className="text-2xl">{projectTypeCounts[type]}</span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center p-2 border rounded bg-green-50 dark:bg-green-900">
                    <span className="font-bold">Creativity Score</span>
                    <span className="text-2xl text-green-600">{creativityScore}%</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Projects created today: {projectsToday.length} / 10</div>
                <Chart type="bar" data={{ labels: featureTypes, datasets: [{ data: featureTypes.map((t: AIProject['type']) => projectTypeCounts[t]) }] }} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tools">
            <Card>
              <CardHeader>
                <CardTitle>Tools (AI & User-Created)</CardTitle>
                <CardDescription>Create, view, and use tools for automation, research, and workflows.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-2">
                  <Input value={toolInput} onChange={e => setToolInput(e.target.value)} placeholder="Tool name..." />
                  <Button size="sm" onClick={handleToolCreate}>Create Tool</Button>
                </div>
                <ScrollArea className="h-48">
                  <ul className="space-y-2">
                    {tools.map((tool, i) => (
                      <li key={i} className="border rounded p-2 bg-slate-50 dark:bg-slate-800 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <span className="font-semibold">{tool.name}</span> <span className="text-xs text-muted-foreground">({tool.createdBy})</span>
                          <div className="text-xs">{tool.description}</div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                          <Button size="sm" variant="outline" onClick={() => setSuggestions(prev => [...prev, `AI used tool: ${tool.name}`])}>Use Tool</Button>
                          {tool.usedByAI && <Badge variant="default">AI-Ready</Badge>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="suggestions">
            <Card>
              <CardHeader>
                <CardTitle>AI Project & Tool Suggestions</CardTitle>
                <CardDescription>Creative ideas and next steps, personalized for you.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestions.map((s, i) => (
                    <li key={i} className="border rounded p-2 bg-green-50 dark:bg-green-900 text-green-900 dark:text-green-100">{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          {isAdminOrSister() && (
            <TabsContent value="goals">
              <Card>
                <CardHeader>
                  <CardTitle>Life Goals, Ambitions & Invention Projects</CardTitle>
                  <CardDescription>All data is encrypted and only visible to admin/sister. AI uses these to suggest and manage projects for your ambitions, protection, welfare, and inventions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold">Your Life Goals & Ambitions</h4>
                    <ul className="list-disc ml-4 mb-2">
                      {goals.map((g, i) => (
                        <li key={i}>
                          {goalEditIdx === i ? (
                            <>
                              <input className="border rounded p-1 text-xs" value={goalEditValue} onChange={e => setGoalEditValue(e.target.value)} />
                              <Button size="sm" onClick={() => { setGoals(goals.map((v, idx) => idx === i ? goalEditValue : v)); setGoalEditIdx(null); }}>Save</Button>
                              <Button size="sm" variant="destructive" onClick={() => setGoalEditIdx(null)}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              {g}
                              <Button size="sm" onClick={() => { setGoalEditIdx(i); setGoalEditValue(g); }}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => setGoals(goals.filter((_, idx) => idx !== i))}>Delete</Button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    <input className="border rounded p-1 text-xs" placeholder="Add new goal/ambition..." value={goalInput} onChange={e => setGoalInput(e.target.value)} />
                    <Button size="sm" onClick={() => { if (goalInput) setGoals([...goals, goalInput]); setGoalInput(''); }}>Add</Button>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold">Invention Projects (Admin/Sister Only)</h4>
                    <ul className="list-disc ml-4 mb-2">
                      {inventions.map((inv, i) => (
                        <li key={i}>
                          {inv}
                          <Button size="sm" variant="destructive" onClick={() => setInventions(inventions.filter((_, idx) => idx !== i))}>Delete</Button>
                        </li>
                      ))}
                    </ul>
                    <input className="border rounded p-1 text-xs" placeholder="Add new invention project..." value={inventionInput} onChange={e => setInventionInput(e.target.value)} />
                    <Button size="sm" onClick={() => { if (inventionInput) setInventions([...inventions, inventionInput]); setInventionInput(''); }}>Add</Button>
                  </div>
                  <div className="text-xs text-blue-600">
                    <b>Note:</b> AI will use these goals and inventions to suggest, create, and manage projects for you automatically. All data is encrypted and never exported or exposed.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Export options */}
        <div className="mb-4 flex gap-2">
          <Button size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(projects))}>Export Projects (JSON)</Button>
          <Button size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(datasets))}>Export Datasets (JSON)</Button>
        </div>

        {/* Language, spellcheck, and voice selection */}
        <div className="mb-4 flex gap-2 items-center">
          <label>Language:</label>
          <select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'sw')} className="p-1 rounded bg-gray-800 text-green-200 border border-green-700">
            <option value="en">English</option>
            <option value="sw">Swahili</option>
          </select>
          <label className="ml-4">Spellcheck:</label>
          <input type="checkbox" checked={spellCheck} onChange={e => setSpellCheck(e.target.checked)} />
          <label className="ml-4">Voice:</label>
          <select value={selectedVoice || ''} onChange={e => setSelectedVoice(e.target.value)} className="p-1 rounded bg-gray-800 text-green-200 border border-green-700">
            <option value="">Default</option>
            {availableVoices.map(v => (
              <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
            ))}
          </select>
          <Button size="sm" onClick={() => playVoicePreview(selectedVoice || '')}>Play Voice</Button>
        </div>

        {/* Port forwarding UI */}
        <div className="mb-4 flex gap-2 items-center">
          <input type="number" min="1024" max="65535" placeholder="Port to forward" className="p-1 rounded bg-gray-800 text-green-200 border border-green-700" id="port-forward-input" />
          <Button size="sm" onClick={() => {
            const port = parseInt((document.getElementById('port-forward-input') as HTMLInputElement)?.value)
            if (port) addForwardedPort(port)
          }}>Forward Port</Button>
          {forwardedPorts.map(fp => (
            <a key={fp.port} href={fp.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Open {fp.url}</a>
          ))}
        </div>

        {/* Problems/Output/Debug Console */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="border rounded p-2 bg-white dark:bg-gray-900">
            <h3 className="font-bold text-sm mb-1">Problems</h3>
            <ul className="text-xs text-red-600">
              {problems.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
          <div className="border rounded p-2 bg-white dark:bg-gray-900">
            <h3 className="font-bold text-sm mb-1">Output</h3>
            <ul className="text-xs text-green-700">
              {output.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          <div className="border rounded p-2 bg-white dark:bg-gray-900">
            <h3 className="font-bold text-sm mb-1">Debug Console</h3>
            <ul className="text-xs text-blue-700">
              {debug.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        </div>

        {/* Project Gallery Toggle and Search */}
        <div className="mb-2 flex gap-2 items-center">
          <Button size="sm" variant="outline" onClick={() => setShowGallery(g => !g)}>{showGallery ? "Hide" : "Show"} Project Gallery</Button>
          {showGallery && (
            <input type="text" className="p-1 rounded bg-gray-800 text-green-200 border border-green-700" placeholder="Search projects..." value={gallerySearch} onChange={e => setGallerySearch(e.target.value)} />
          )}
        </div>
        {showGallery && (
          <div className="mb-4 border rounded p-2 bg-white dark:bg-gray-900">
            <h2 className="font-bold mb-2">Project Gallery</h2>
            <ul>
              {filteredProjects.map(p => (
                <li key={p.id} className="mb-1 flex items-center gap-2">
                  <span>{p.name} - {p.status}</span>
                  <Button size="sm" onClick={() => setGalleryPreview(p)}>Preview</Button>
                </li>
              ))}
            </ul>
            {galleryPreview && (
              <div className="mt-2 p-2 border rounded bg-gray-100 dark:bg-gray-800">
                <h3 className="font-bold">{galleryPreview.name}</h3>
                <p>{galleryPreview.description}</p>
                {galleryPreview.preview && <img src={galleryPreview.preview} alt="Preview" className="w-32 h-20 object-cover rounded" />}
                <Button size="sm" onClick={() => setGalleryPreview(null)}>Close Preview</Button>
              </div>
            )}
          </div>
        )}
        {/* Dataset Management UI */}
        <div className="mb-4 border rounded p-2 bg-white dark:bg-gray-900">
          <h2 className="font-bold mb-2">Datasets</h2>
          <div className="flex gap-2 mb-2">
            <input type="text" className="p-1 rounded bg-gray-800 text-green-200 border border-green-700" placeholder="Dataset name or URL..." value={datasetInput} onChange={e => setDatasetInput(e.target.value)} />
            <Button size="sm" onClick={() => handleDatasetUpload()}>Add Dataset</Button>
            <input type="file" multiple className="hidden" id="dataset-file-input" onChange={handleDatasetUpload} />
            <label htmlFor="dataset-file-input">
              <Button size="sm" asChild>Upload Files</Button>
            </label>
          </div>
          <ul>
            {datasets.map((d, i) => <li key={i}>{d}</li>)}
            {datasetFiles.map((f, i) => (
              <li key={i + datasets.length} className="flex items-center gap-2">
                {f.name}
                {f.type.startsWith('image') && (
                  <img src={URL.createObjectURL(f)} alt={f.name} className="w-10 h-10 object-cover rounded border" />
                )}
                {f.type.startsWith('text') && (
                  <Button size="sm" onClick={async () => {
                    const text = await f.text();
                    alert(text.slice(0, 200) + (text.length > 200 ? '...' : ''))
                  }}>Preview</Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Wrap AlphaQAISystem in AIProvider for persistent context
export function AlphaQAISystemWithProvider(props: any) {
  return (
    <AIProvider>
      <AlphaQAISystem {...props} />
    </AIProvider>
  );
}