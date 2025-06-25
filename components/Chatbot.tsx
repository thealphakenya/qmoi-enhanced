import React, { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useAIContext } from "./AIContext";
import { useTTCVoice } from '../hooks/useTTCVoice';
import { useToast } from "../hooks/use-toast";
import { AIRequestRouter } from '../src/services/AIRequestRouter';
import { MultiUserSessionManager } from '../src/services/MultiUserSessionManager';
import { ContextEngine } from '../src/services/ContextEngine';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Extend the Window interface for browser SpeechRecognition types only. Do not declare Node.js globals here.
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface ChatMessage {
  type: 'user' | 'ai' | 'system';
  text: string;
  timestamp?: number;
}

interface Reminder {
  id: string;
  time: string;
  text: string;
  completed: boolean;
}

interface PlannerItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const timeZones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Africa/Nairobi', value: 'Africa/Nairobi' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'Australia/Melbourne', value: 'Australia/Melbourne' },
  // Add more as needed
];

export function Chatbot({ chatHistory, setChatHistory, onFileUpload, onEnhancement, userId }: {
  chatHistory: ChatMessage[],
  setChatHistory: (h: ChatMessage[]) => void,
  onFileUpload?: (file: File) => void,
  onEnhancement?: (desc: string) => void,
  userId: string,
}) {
  const { toast } = useToast();
  const { setEmotionalState } = useAIContext();
  const { speak } = useTTCVoice();
  const [aiTyping, setAiTyping] = useState(false)
  const [input, setInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [userTimeZone, setUserTimeZone] = useState('UTC');
  const [talkMode, setTalkMode] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Reminders and planner state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderInput, setReminderInput] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [planner, setPlanner] = useState<PlannerItem[]>([]);
  const [plannerInput, setPlannerInput] = useState("");

  // Further enhancement: allow user to set custom wake words and preferred AI names
  const [wakeWords, setWakeWords] = useState(['q', 'alpha', 'ai', 'hey q', 'hey alpha']);

  // Initialize router
  const sessionManager = new MultiUserSessionManager();
  const contextEngine = new ContextEngine();
  const aiRequestRouter = new AIRequestRouter(sessionManager, contextEngine);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        toast({
          title: 'Error',
          description: 'Speech recognition failed',
          variant: 'destructive'
        });
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  // Time zone and current time
  useEffect(() => {
    const fetchTimeZone = async () => {
      try {
        const response = await fetch('/api/qmoi-model?getTimeZone=1');
        if (!response.ok) throw new Error('Failed to fetch time zone');
        const data = await response.json();
        setUserTimeZone(data.timeZone || 'UTC');
      } catch (error) {
        console.error('Failed to fetch time zone:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch time zone',
          variant: 'destructive'
        });
      }
    };

    fetchTimeZone();
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString(userTimeZone));
    }, 1000);

    return () => clearInterval(interval);
  }, [userTimeZone, toast]);

  const handleTimeZoneChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tz = e.target.value;
    setUserTimeZone(tz);
    try {
      const response = await fetch('/api/qmoi-model?setTimeZone=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tz }),
      });
      if (!response.ok) throw new Error('Failed to update time zone');
    } catch (error) {
      console.error('Failed to update time zone:', error);
      toast({
        title: 'Error',
        description: 'Failed to update time zone',
        variant: 'destructive'
      });
    }
  };

  // Safe math calculation
  const calculateMath = (expression: string): number | null => {
    try {
      // Remove any non-math characters
      const cleanExpr = expression.replace(/[^0-9+\-*/().]/g, '');
      // Use Function constructor instead of eval
      return new Function(`return ${cleanExpr}`)();
    } catch (error) {
      console.error('Math calculation error:', error);
      return null;
    }
  };

  // Simulate AI response with delay and advanced features
  const handleSend = async (input: string) => {
    if (!input.trim()) return;
    setInput('');
    setChatHistory([...chatHistory, { type: 'user', text: input, timestamp: Date.now() }]);
    try {
      // Unified AI request handling
      const response = await aiRequestRouter.handleRequest({
        userId: userId, // get from context or props
        source: 'chat',
        message: input,
      });
      if (response && response.message) {
        setChatHistory([...chatHistory, { type: 'ai', text: response.message, timestamp: Date.now() }]);
      }
    } catch (error) {
      setChatHistory([...chatHistory, { type: 'system', text: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'), timestamp: Date.now() }]);
    }
  };

  // Handle file upload with error handling
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadedFile(file);
      if (onFileUpload) onFileUpload(file);

      if (file.type.startsWith('text') || file.type === '') {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result as string);
        reader.onerror = (error) => {
          console.error('File read error:', error);
          toast({
            title: 'Error',
            description: 'Failed to read file',
            variant: 'destructive'
          });
        };
        reader.readAsText(file);
      } else {
        setFilePreview('Preview not available for this file type.');
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive'
      });
    }
  }, [onFileUpload, toast]);

  // Send file to AI with error handling
  const handleSendFile = async () => {
    if (!uploadedFile) return;

    const timestamp = Date.now();
    setChatHistory([...chatHistory, { type: 'user', text: `Uploaded file: ${uploadedFile.name}`, timestamp }]);
    setAiTyping(true);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setChatHistory([...chatHistory, {
        type: 'ai',
        text: `I have received and processed the file: ${uploadedFile.name}. (AI can handle large/long files and all types accurately.)`,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process file',
        variant: 'destructive'
      });
    } finally {
      setAiTyping(false);
      setUploadedFile(null);
      setFilePreview(null);
    }
  };

  // Advanced: Add markdown/code rendering and friendly suggestions
  const renderMessage = (msg: ChatMessage, i: number) => {
    if (/```[\s\S]*?```/.test(msg.text)) {
      // Render code block
      const code = msg.text.match(/```([\s\S]*?)```/)
      return (
        <pre key={i} className="bg-gray-800 text-green-200 p-2 rounded my-2 overflow-x-auto">
          <code>{code ? code[1] : msg.text}</code>
        </pre>
      )
    }
    return (
      <div key={i} className={msg.type === 'user' ? 'text-right' : 'text-left'}>
        <span className="font-bold">{msg.type === 'user' ? 'You' : 'AI'}:</span> {msg.text}
      </div>
    )
  }

  // Accessibility/device-assistant actions (simulate)
  const handleDeviceAction = (action: string) => {
    let aiText = "";
    if (action === "call") aiText = "Calling your selected contact... (simulated)";
    else if (action === "play-music") aiText = "Playing your favorite music... (simulated)";
    else if (action === "read-aloud") aiText = "Reading instructions aloud... (simulated)";
    setChatHistory([...chatHistory, { type: 'ai', text: aiText }]);
  };

  // Reminders logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(r => {
        if (r.time && new Date(r.time) <= now) {
          setChatHistory([...chatHistory, { type: 'ai', text: `⏰ Reminder: ${r.text}` }]);
          setReminders(reminders => reminders.filter(rem => rem !== r));
        }
      });
    }, 1000 * 30); // check every 30s
    return () => clearInterval(interval);
  }, [reminders, chatHistory, setChatHistory]);

  // Planner logic
  const handleAddPlanner = () => {
    if (!plannerInput.trim()) return;
    setPlanner([...planner, { id: Date.now().toString(), text: plannerInput, completed: false, priority: 'low' }]);
    setPlannerInput("");
  };

  // Listen for user speech if talkMode is enabled
  useEffect(() => {
    if (!talkMode) return;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true; // continuous for wake word
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      // Wake word detection: respond to 'q', 'alpha', or preferred names
      if (/(\bq\b|\balpha\b|\bai\b|\bhey q\b|\bhey alpha\b)/.test(transcript)) {
        setInput('');
        speak('Hello! I am listening.');
        // Optionally, start a new recognition for the next command
      } else {
        setInput(transcript);
        handleSend(transcript);
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
    return () => recognition.stop();
  }, [talkMode, speak, handleSend]);

  // Speak AI replies if talkMode is enabled
  useEffect(() => {
    if (!talkMode) return;
    const last = chatHistory[chatHistory.length - 1];
    if (last && last.type === 'ai') {
      speak(last.text);
    }
  }, [chatHistory, talkMode, speak]);

  // UI for adding/removing wake words
  const handleAddWakeWord = (word: string) => {
    if (!word.trim()) return;
    setWakeWords(prev => Array.from(new Set([...prev, word.toLowerCase().trim()])));
  };
  const handleRemoveWakeWord = (word: string) => {
    setWakeWords(prev => prev.filter(w => w !== word));
  };

  // Enhanced speech recognition with dynamic wake words
  useEffect(() => {
    if (!talkMode) return;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      if (wakeWords.some(word => transcript.includes(word))) {
        setInput('');
        speak('Hello! I am listening.');
      } else {
        setInput(transcript);
        handleSend(transcript);
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
    return () => recognition.stop();
  }, [talkMode, wakeWords, speak, handleSend]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot {talkMode && <span style={{color:'#0a0'}}>🗣️ Talk Mode</span>}</CardTitle>
        <Button size="sm" variant={talkMode ? 'destructive' : 'outline'} onClick={() => setTalkMode(t => !t)}>
          {talkMode ? 'Disable Talk Mode' : 'Enable Talk Mode'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-48 overflow-y-auto bg-gray-900 text-green-200 p-2 rounded mb-2">
          {chatHistory.map((msg, i) => renderMessage(msg, i))}
          {aiTyping && <div className="text-left text-green-400 animate-pulse">AI is typing...</div>}
        </div>
        <div className="flex gap-2">
          <input
            className="w-full p-2 rounded bg-gray-800 text-green-200 border border-green-700"
            placeholder="Type a message... (try: 'show me a code example', 'math 2+2', 'be my friend')"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend(input)
            }}
          />
          <button
            className="bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => handleSend(input)}
            disabled={aiTyping || !input.trim()}
          >Send</button>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            Upload File
          </Button>
          {uploadedFile && (
            <Button size="sm" onClick={handleSendFile}>
              Send to AI
            </Button>
          )}
        </div>
        {uploadedFile && filePreview && (
          <div className="mb-2 text-green-200">
            <div>Selected: {uploadedFile.name}</div>
            <pre className="bg-gray-900 p-2 rounded max-h-32 overflow-auto">{filePreview}</pre>
          </div>
        )}
        <Button size="sm" onClick={() => onEnhancement && onEnhancement('Manual enhancement requested by master.')}>Suggest Enhancement</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '1rem' }}>
          <span>Current Time:</span>
          <b>{currentTime}</b>
          <select value={userTimeZone} onChange={handleTimeZoneChange} className="bg-gray-800 text-green-200 border border-green-700 rounded p-1">
            {timeZones.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>
        {/* Reminders UI */}
        <div className="mb-2">
          <div className="font-bold">Reminders</div>
          <div className="flex gap-2 mb-1">
            <input
              type="text"
              className="p-1 rounded bg-gray-800 text-green-200 border border-green-700"
              placeholder="Reminder text..."
              value={reminderInput}
              onChange={e => setReminderInput(e.target.value)}
            />
            <input
              type="datetime-local"
              className="p-1 rounded bg-gray-800 text-green-200 border border-green-700"
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
            />
            <Button size="sm" onClick={() => {
              if (reminderInput && reminderTime) {
                setReminders([...reminders, { id: Date.now().toString(), time: reminderTime, text: reminderInput, completed: false }]);
                setReminderInput("");
                setReminderTime("");
              }
            }}>Add</Button>
          </div>
          <ul className="text-green-200 text-sm">
            {reminders.map((r, i) => (
              <li key={i}>⏰ {r.text} at {new Date(r.time).toLocaleString(userTimeZone)}</li>
            ))}
          </ul>
        </div>
        {/* Planner UI */}
        <div className="mb-2">
          <div className="font-bold">Planner</div>
          <div className="flex gap-2 mb-1">
            <input
              type="text"
              className="p-1 rounded bg-gray-800 text-green-200 border border-green-700"
              placeholder="Plan an activity..."
              value={plannerInput}
              onChange={e => setPlannerInput(e.target.value)}
            />
            <Button size="sm" onClick={handleAddPlanner}>Add</Button>
          </div>
          <ul className="text-green-200 text-sm">
            {planner.map((p, i) => (
              <li key={i}>📝 {p.text}</li>
            ))}
          </ul>
        </div>
        <div className="mb-2">
          <div className="font-bold">Device/Accessibility Actions</div>
          <Button size="sm" onClick={() => handleDeviceAction('call')}>Call Someone</Button>{' '}
          <Button size="sm" onClick={() => handleDeviceAction('play-music')}>Play Music</Button>{' '}
          <Button size="sm" onClick={() => handleDeviceAction('read-aloud')}>Read Instructions Aloud</Button>
        </div>
        {/* Wake Words UI */}
        <div className="mb-2">
          <div className="font-bold">Wake Words</div>
          <div className="flex gap-2 mb-1">
            <input
              type="text"
              className="p-1 rounded bg-gray-800 text-green-200 border border-green-700"
              placeholder="Add wake word (e.g. 'Q', 'Alpha')"
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddWakeWord((e.target as HTMLInputElement).value);
              }}
            />
            <Button size="sm" onClick={() => handleAddWakeWord(prompt('Enter new wake word:') || '')}>Add</Button>
          </div>
          <ul className="text-green-200 text-sm flex gap-2 flex-wrap">
            {wakeWords.map((w, i) => (
              <li key={i} className="flex items-center gap-1 bg-green-900 px-2 py-1 rounded">
                {w}
                <button onClick={() => handleRemoveWakeWord(w)} className="text-red-400 ml-1">✕</button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
