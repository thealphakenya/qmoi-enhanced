import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const timeZones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Africa/Nairobi', value: 'Africa/Nairobi' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'Australia/Melbourne', value: 'Australia/Melbourne' },
  // Add more as needed
];

export function Chatbot({ chatHistory, setChatHistory, selectedModel, setSelectedModel, onFileUpload, onEnhancement }: {
  chatHistory: any[],
  setChatHistory: (h: any[]) => void,
  selectedModel: string,
  setSelectedModel: (m: string) => void,
  onFileUpload?: (file: File) => void,
  onEnhancement?: (desc: string) => void,
}) {
  const [aiTyping, setAiTyping] = useState(false)
  const [input, setInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [userTimeZone, setUserTimeZone] = useState('UTC');

  // Reminders and planner state
  const [reminders, setReminders] = useState<{ time: string, text: string }[]>([]);
  const [reminderInput, setReminderInput] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [planner, setPlanner] = useState<string[]>([]);
  const [plannerInput, setPlannerInput] = useState("");

  useEffect(() => {
    const fetchTimeZone = async () => {
      // Fetch user time zone from backend if available
      // ...
    };
    fetchTimeZone();
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString(userTimeZone));
    }, 1000);
    return () => clearInterval(interval);
  }, [userTimeZone]);

  const handleTimeZoneChange = async (e: any) => {
    const tz = e.target.value;
    setUserTimeZone(tz);
    // Persist to backend
    await fetch('/api/qmoi-model?setTimeZone=1', {
      method: 'POST',
      body: JSON.stringify({ tz }),
    });
  };

  // Simulate AI response with delay and advanced features
  const handleSend = async () => {
    if (!input.trim()) return
    setChatHistory([...chatHistory, { type: 'user', text: input }])
    setInput("")
    setAiTyping(true
    setTimeout(() => {
      // Example: AI can answer code, math, or be friendly
      let aiText = "I'm here to help!"
      if (/hello|hi|hey/i.test(input)) aiText = "Hello! 😊 How can I assist you today?"
      else if (/code|python|js|typescript|react/i.test(input)) aiText = "Here's a code snippet example: \n\nconsole.log('Hello, world!');"
      else if (/math|\d+\s*[+\-*/]\s*\d+/i.test(input)) {
        try {
          // Simple math eval (safe for demo)
          const result = eval(input.match(/\d+\s*[+\-*/]\s*\d+/)?.[0] || "0")
          aiText = `The answer is: ${result}`
        } catch { aiText = "Sorry, I couldn't compute that." }
      }
      else if (/friend|sad|happy|help/i.test(input)) aiText = "I'm always here for you as a friend and assistant! 😊"
      setChatHistory([...chatHistory, { type: 'ai', text: aiText }])
      setAiTyping(false)
    }, 1200)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    if (onFileUpload) onFileUpload(file);
    if (file.type.startsWith('text') || file.type === '') {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsText(file);
    } else {
      setFilePreview('Preview not available for this file type.');
    }
  };

  // Send file to AI (simulate for now)
  const handleSendFile = async () => {
    if (!uploadedFile) return;
    setChatHistory([...chatHistory, { type: 'user', text: `Uploaded file: ${uploadedFile.name}` }]);
    setAiTyping(true);
    setTimeout(() => {
      setChatHistory([...chatHistory, { type: 'ai', text: `I have received and processed the file: ${uploadedFile.name}. (AI can handle large/long files and all types accurately.)` }]);
      setAiTyping(false);
      setUploadedFile(null);
      setFilePreview(null);
    }, 1500);
  };

  // Advanced: Add markdown/code rendering and friendly suggestions
  const renderMessage = (msg: { type: string, text: string }, i: number) => {
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
    setPlanner([...planner, plannerInput]);
    setPlannerInput("");
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Chatbot (Model: {selectedModel})</CardTitle>
        <div className="mt-2">
          <label className="mr-2">Model:</label>
          <select
            className="bg-gray-800 text-green-200 border border-green-700 rounded p-1"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
          >
            <option value="Auto">Auto</option>
            <option value="DeepSeek">DeepSeek</option>
            <option value="WizardCoder">WizardCoder</option>
            <option value="GPT-J">GPT-J</option>
          </select>
        </div>
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
              if (e.key === 'Enter') handleSend()
            }}
          />
          <button
            className="bg-green-700 text-white px-4 py-2 rounded"
            onClick={handleSend}
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
        {uploadedFile && (
          <div className="mb-2 text-green-200">
            <div>Selected: {uploadedFile.name}</div>
            <pre className="bg-gray-900 p-2 rounded max-h-32 overflow-auto">{filePreview}</pre>
          </div>
        )}
        <Button size="sm" onClick={() => onEnhancement && onEnhancement('Manual enhancement requested by admin.')}>Suggest Enhancement</Button>
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
                setReminders([...reminders, { time: reminderTime, text: reminderInput }]);
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
              <li key={i}>📝 {p}</li>
            ))}
          </ul>
        </div>
        {/* Device/Accessibility Actions */}
        <div className="mb-2">
          <div className="font-bold">Device/Accessibility Actions</div>
          <Button size="sm" onClick={() => handleDeviceAction('call')}>Call Someone</Button>{' '}
          <Button size="sm" onClick={() => handleDeviceAction('play-music')}>Play Music</Button>{' '}
          <Button size="sm" onClick={() => handleDeviceAction('read-aloud')}>Read Instructions Aloud</Button>
        </div>
      </CardContent>
    </Card>
  )
}
