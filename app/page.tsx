"use client";

import AlphaQAISystem from "@/components/alpha-q-ai-system";
import { Chatbot } from "@/components/Chatbot";
import { FileExplorer } from "@/components/FileExplorer";
import { GitStatus } from "@/components/GitStatus";
import { PreviewWindow } from "@/components/PreviewWindow";
import { QIStateWindow } from "@/components/QIStateWindow";
import { QiSpaces } from "@/components/QiSpaces";
import { LcSpaces } from "@/components/LcSpaces";
import DeploymentStatusDashboard from '../components/DeploymentStatusDashboard';
import { MasterProvider, useMaster } from '../components/MasterContext';
import { QmoiMemoryPanel } from '../components/QmoiMemoryPanel';
import { NotificationPanel } from '../components/NotificationPanel';

import { useState, useEffect } from "react";

function MainPage() {
  const { isMaster, setIsMaster } = useMaster();
  // Stores chat history messages
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  // Currently selected Model
  const [selectedModel, setSelectedModel] = useState("Auto");

  // Currently selected User
  const [user, setUser] = useState<string>("Victor Kwemoi");

  // Stores the user's name after first render
  const [sessionUsername, setSessionUsername] = useState("User");

  // Retrieve the user's name from localStorage after first render
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionUsername(localStorage.getItem("username") || "User");

      // Optional: you can fallback or set another fallback here
    }
  }, []);

  // Compose a realistic, example session state
  const sessionState = {
    user: sessionUsername,
    memory: chatHistory.length,
    recent: chatHistory.slice(-3).map((m) => m.content || m.text),
  };

  return (
    <>
      <button
        style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}
        onClick={() => setIsMaster(!isMaster)}
      >
        {isMaster ? 'Switch to User' : 'Switch to Master'}
      </button>
      <DeploymentStatusDashboard isMaster={isMaster} />
    <div className="grid grid-cols-4 grid-rows-[auto_1fr_auto] h-screen bg-[#111] text-[#ccffcc]">
      {/* Sidebar */}
      <aside className="col-span-1 row-span-2 border-r border-green-700 p-2 overflow-y-auto">
        <FileExplorer />
        <GitStatus />
      </aside>

      {/* Main Chat & Preview */}
      <main className="col-span-2 p-2 overflow-y-auto">
        {/* QI state window with context about the chat */}
        <QIStateWindow state="active" session={sessionState} />

        {/* Chatbot for interacting with the AI */}
        <Chatbot
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />

        {/* Additional UI related to the QAI System */}
        <AlphaQAISystem />

        {/* User picker */}
        <div className="mt-6">
          <label htmlFor="userSelect" className="font-semibold mr-2">
            Select User:
          </label>
          <select
            id="userSelect"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="bg-[#222] border border-green-700 p-1 rounded ml-2">
            <option value="Victor Kwemoi">Master (Victor)</option>
            <option value="Leah Chebet">Leah Chebet</option>
          </select>
        </div>

        {/* Spaces related to QAI */}
        <QiSpaces user={user} />
        <LcSpaces user={user} />

        {/* Master-only QMOI Memory & Evolution Panel */}
        {isMaster && <QmoiMemoryPanel />}
      </main>

      {/* Preview Section */}
      <section className="col-span-1 p-2 border-l border-green-700 overflow-auto">
        <PreviewWindow />
      </section>
    </div>
    </>
  );
}

export default function Page() {
  return (
    <div>
      <NotificationPanel />
      <MasterProvider>
        <MainPage />
      </MasterProvider>
    </div>
  );
}
