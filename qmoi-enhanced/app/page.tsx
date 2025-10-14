"use client";
import React, { useState } from "react";
import { FloatingAQ } from "../src/components/FloatingAQ";
import AlphaQAISystem from "../src/components/alpha-q-ai-system";
import { Chatbot } from "../src/components/Chatbot";
import { QmoiMemory } from "../src/services/QmoiMemory";
import { FileExplorer } from "../src/components/FileExplorer";
import { GitStatus } from "../src/components/GitStatus";
import { PreviewWindow } from "../src/components/PreviewWindow";
import { QIStateWindow } from "../src/components/QIStateWindow";
import { QiSpaces } from "../src/components/QiSpaces";
import { LcSpaces } from "../src/components/LcSpaces";
import DeploymentStatusDashboard from "../components/DeploymentStatusDashboard";
import { MasterProvider, useMaster } from "../components/MasterContext";
import { QmoiMemoryPanel } from "../components/QmoiMemoryPanel";
import { NotificationPanel } from "../components/NotificationPanel";
import { EmergencyPanel } from "../components/EmergencyPanel";

function MainPage() {
  const { isMaster, setRole } = useMaster();
  const [user, setUser] = useState<string>("Victor Kwemoi");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("Auto");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  // Load chat history from memory on mount
  React.useEffect(() => {
    QmoiMemory.list(user).then((mem) => {
      // Convert memory to chat format if needed
      const history = mem.map((entry: any, i: number) => ({
        id: i,
        content: entry.message
          ? `${entry.message}\n${entry.response}`
          : JSON.stringify(entry.value),
        sender: entry.sender || "user",
        timestamp: entry.timestamp,
      }));
      setChatHistory(history);
    });
  }, [user]);

  // Memory search
  React.useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    QmoiMemory.list(user).then((mem) => {
      const results = mem.filter((entry: any) => {
        const text =
          (entry.message || "") +
          " " +
          (entry.response || "") +
          " " +
          (entry.value ? JSON.stringify(entry.value) : "");
        return text.toLowerCase().includes(search.toLowerCase());
      });
      setSearchResults(results);
    });
  }, [search, user]);

  return (
    <>
      <FloatingAQ />
      <button
        style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}
        onClick={() => setRole(isMaster ? "user" : "master")}
      >
        {isMaster ? "Switch to User" : "Switch to Master"}
      </button>
      <DeploymentStatusDashboard isMaster={isMaster} />
      <div className="grid grid-cols-5 grid-rows-[auto_1fr_auto] h-screen bg-[#111] text-[#ccffcc]">
        {/* Sidebar */}
        <aside className="col-span-1 row-span-2 border-r border-green-700 p-2 overflow-y-auto">
          <FileExplorer />
          <GitStatus />
          <EmergencyPanel />
        </aside>
        {/* Main Chat & Preview */}
        <main className="col-span-2 p-2 overflow-y-auto">
          <QIStateWindow />
          {/* Memory search UI */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chat & memory by keyword..."
              className="w-full p-2 rounded border border-green-700 bg-[#222] text-green-200 mb-2"
            />
            {search && (
              <div className="bg-[#222] border border-green-700 rounded p-2 max-h-40 overflow-y-auto mb-2">
                <div className="text-xs text-green-400 mb-1">
                  Search Results:
                </div>
                {searchResults.length === 0 && (
                  <div className="text-xs text-gray-400">No results found.</div>
                )}
                {searchResults.map((entry, i) => (
                  <div key={i} className="mb-2 p-2 bg-gray-800 rounded">
                    <div className="text-xs text-gray-400">
                      {entry.timestamp}
                    </div>
                    <div className="text-sm font-mono whitespace-pre-line">
                      {entry.message}\n{entry.response}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Chatbot
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
          <AlphaQAISystem />
          <div className="mt-6">
            <label htmlFor="userSelect" className="font-semibold mr-2">
              Select User:
            </label>
            <select
              id="userSelect"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="bg-[#222] border border-green-700 p-1 rounded ml-2"
            >
              <option value="Victor Kwemoi">Master (Victor)</option>
              <option value="Leah Chebet">Leah Chebet</option>
            </select>
          </div>
          <QiSpaces />
          <LcSpaces />
          {/* Memory panel for all users */}
          <QmoiMemoryPanel />
        </main>
        {/* Preview Section */}
        <section className="col-span-2 p-2 border-l border-green-700 overflow-auto">
          <PreviewWindow />
          <DeploymentStatusDashboard isMaster={isMaster} />
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
