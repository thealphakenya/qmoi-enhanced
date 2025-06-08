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

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  category?: "game" | "animation" | "music" | "architecture" | "general"
}

interface AIProject {
  id: string
  name: string
  type: "game" | "animation" | "movie" | "music" | "architecture"
  status: "creating" | "completed" | "preview"
  progress: number
  preview?: string
  description: string
}

export default function AlphaQAISystem() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to Alpha-Q AI! I can help you create games, animations, movies, music, and architectural designs. What would you like to build today?",
      timestamp: new Date(),
      category: "general",
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [currentProject, setCurrentProject] = useState<AIProject | null>(null)
  const [projects, setProjects] = useState<AIProject[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState<"2d" | "3d" | "audio" | "video">("2d")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsGenerating(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      setMessages((prev) => [...prev, aiResponse])
      setIsGenerating(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): ChatMessage => {
    const lowerInput = input.toLowerCase()

    let response = ""
    let category: ChatMessage["category"] = "general"

    if (lowerInput.includes("game") || lowerInput.includes("play")) {
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
      response =
        "I'm here to help you create amazing content! I specialize in:\n\n🎮 **Games** - Interactive experiences and gameplay\n🎬 **Animations & Movies** - Visual storytelling\n🎵 **Music** - Audio composition and sound design\n🏗️ **Architecture** - Building and space design\n\nWhat would you like to create today?"
    }

    return {
      id: Date.now().toString(),
      type: "ai",
      content: response,
      timestamp: new Date(),
      category,
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
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJkMWI2OSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn46sIEFuaW1hdGlvbiDwn46sPC90ZXh0Pjwvc3ZnPg=="
      case "movie":
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzc5MWEyZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn46lIE1vdmllIFByZXZpZXcg8J+OpTwvdGV4dD48L3N2Zz4="
      case "music":
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhNjkyZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn46tIE11c2ljIENvbXBvc2l0aW9uIPCfjq08L3RleHQ+PC9zdmc+"
      case "architecture":
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJlNGEyZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7wn46XIEFyY2hpdGVjdHVyZSDwn46XPC90ZXh0Pjwvc3ZnPg=="
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
              onClick={() => setIsVoiceActive(!isVoiceActive)}
            >
              {isVoiceActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Badge variant="outline" className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Online</span>
            </Badge>
          </div>
        </div>

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
                              <div
                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
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

                    {currentProject.status === "completed" && currentProject.preview && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Preview</span>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <img
                          src={currentProject.preview || "/placeholder.svg"}
                          alt="Project preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>AI Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Gamepad2 className="h-3 w-3" />
                    <span>Games</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Video className="h-3 w-3" />
                    <span>Animation</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Camera className="h-3 w-3" />
                    <span>Movies</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Music className="h-3 w-3" />
                    <span>Music</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Building className="h-3 w-3" />
                    <span>Architecture</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Palette className="h-3 w-3" />
                    <span>Art</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                            <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
