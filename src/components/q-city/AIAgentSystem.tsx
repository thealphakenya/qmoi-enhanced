"use client";
import React, { useState } from "react";
const tools = ["Planner", "Debugger", "Auto-fix", "Analyzer"];
const agents = [
  { id: "agent-1", name: "Agent Alpha", lastAction: "Reviewing issues" },
  { id: "agent-2", name: "Agent Beta", lastAction: "Optimizing models" },
];
export default function AIAgentSystem() {
  const [activeTab, setActiveTab] = useState("agents");
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">AI Agent System</h2>
        <div className="flex gap-2">
          <button className={`rounded-2xl px-4 py-2 text-sm ${activeTab === "agents" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`} onClick={() => setActiveTab("agents")}>Agents</button>
          <button className={`rounded-2xl px-4 py-2 text-sm ${activeTab === "tools" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`} onClick={() => setActiveTab("tools")}>Tools</button>
        </div>
      </div>
      {activeTab === "agents" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">{agent.name}</div>
              <div className="text-sm text-slate-500">Last action: {agent.lastAction}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <div key={tool} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">{tool}</div>
              <div className="text-sm text-slate-500">Tool available for AI task orchestration.</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
