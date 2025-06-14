"use client"
import AlphaQAISystem from "@/components/alpha-q-ai-system"
import { Chatbot } from "@/components/Chatbot"
import { FileExplorer } from "@/components/FileExplorer"
import { GitStatus } from "@/components/GitStatus"
import { PreviewWindow } from "@/components/PreviewWindow"
import { QIStateWindow } from "@/components/QIStateWindow"
import { QiSpaces } from "@/components/QiSpaces"
import { LcSpaces } from "@/components/LcSpaces"
import { useState } from "react"

export default function Home() {
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState("Auto")
  // Example session state (replace with real data)
  const sessionState = {
    user: typeof window !== 'undefined' ? localStorage.getItem('username') || 'User' : 'User',
    memory: chatHistory.length,
    recent: chatHistory.slice(-3).map((m: any) => m.content || m.text),
  };
  // Demo: simple user selector
  const [user, setUser] = useState<string>("Victor Kwemoi")
  return (
    <div className="grid grid-cols-4 grid-rows-[auto_1fr_auto] h-screen bg-[#111] text-[#ccffcc]">
      {/* Sidebar */}
      <aside className="col-span-1 row-span-2 border-r border-green-700 p-2 overflow-y-auto">
        <FileExplorer />
        <GitStatus />
      </aside>
      {/* Main Chat & Preview */}
      <main className="col-span-2 p-2 overflow-y-auto">
        <QIStateWindow state="active" session={sessionState} />
        <Chatbot
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
        <AlphaQAISystem />
        <div style={{ marginTop: 24 }}>
          <label style={{ fontWeight: 600 }}>Select User: </label>
          <select value={user} onChange={e => setUser(e.target.value)} className="bg-[#222] border border-green-700 p-1 rounded">
            <option value="Victor Kwemoi">Master (Victor)</option>
            <option value="Leah Chebet">Leah Chebet</option>
          </select>
        </div>
        <QiSpaces user={user} />
        <LcSpaces user={user} />
      </main>
      {/* Preview */}
      <section className="col-span-1 p-2 border-l border-green-700 overflow-auto">
        <PreviewWindow />
      </section>
    </div>
  )
}
