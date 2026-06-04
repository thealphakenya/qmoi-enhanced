"use client";

import React, { useEffect, useState } from "react";
import { readPersistedUser } from "@/app/lib/auth/persistence";

interface PersistedUser {
  id?: string | null;
  role?: string | null;
  displayName?: string | null;
}

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
}

export const QMoiProjectDashboard: React.FC = () => {
  const [user, setUser] = useState<PersistedUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "Alpha Engine", status: "active", progress: 85 },
    { id: 2, name: "Q-City Deployment", status: "active", progress: 60 },
    { id: 3, name: "Automation Suite", status: "planning", progress: 30 },
  ]);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    setUser(readPersistedUser());
    setLoaded(true);
  }, []);

  const isMaster = user?.role === "master";

  const addProject = () => {
    if (!newProjectName.trim()) return;

    setProjects((current) => [
      ...current,
      {
        id: Date.now(),
        name: newProjectName.trim(),
        status: "planning",
        progress: 0,
      },
    ]);
    setNewProjectName("");
  };

  const removeProject = (id: number) => {
    setProjects((current) => current.filter((project) => project.id !== id));
  };

  if (!loaded) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-cyan-400">QMOI Project Dashboard</h2>
        <div className="text-gray-300">Loading project access...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">QMOI Project Dashboard</h2>
      {!isMaster ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Access Denied</strong>
          <p>Master users only. This project management dashboard requires elevated access.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <p className="text-sm text-slate-400">Status: {project.status}</p>
                <p className="text-sm text-slate-400">Progress: {project.progress}%</p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center rounded bg-cyan-600 px-3 py-1 text-sm text-white hover:bg-cyan-500"
                  onClick={() => removeProject(project.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-slate-950 border border-slate-800 p-4">
            <label className="block text-sm font-medium text-slate-200 mb-2" htmlFor="new-project-name">
              Create a new project
            </label>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                id="new-project-name"
                type="text"
                value={newProjectName}
                onChange={(event) => setNewProjectName(event.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                placeholder="Enter a project name"
              />
              <button
                type="button"
                onClick={addProject}
                className="rounded bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
