

"use client";
import React, { useState } from "react";
import { FloatingAQ } from "../src/components/FloatingAQ";
import AlphaQAISystem from "../src/components/alpha-q-ai-system";
import { Chatbot } from "../src/components/Chatbot";
import { FileExplorer } from "../src/components/FileExplorer";
import { GitStatus } from "../src/components/GitStatus";
import { PreviewWindow } from "../src/components/PreviewWindow";
import { QIStateWindow } from "../src/components/QIStateWindow";
import { QiSpaces } from "../src/components/QiSpaces";
import { LcSpaces } from "../src/components/LcSpaces";
import DeploymentStatusDashboard from '../components/DeploymentStatusDashboard';
import { MasterProvider, useMaster } from '../components/MasterContext';
import { QmoiMemoryPanel } from '../components/QmoiMemoryPanel';
import { NotificationPanel } from '../components/NotificationPanel';
import { EmergencyPanel } from "../components/EmergencyPanel";


function MainPage() {
  const { isMaster, setRole } = useMaster();
  const [user, setUser] = useState<string>("Victor Kwemoi");
  return (
    <>
      <FloatingAQ />
      <button
        style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}
        onClick={() => setRole(isMaster ? 'user' : 'master')}
      >
        {isMaster ? 'Switch to User' : 'Switch to Master'}
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
          <Chatbot />
          <AlphaQAISystem />
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
          <QiSpaces />
          <LcSpaces />
          {isMaster && <QmoiMemoryPanel />}
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
