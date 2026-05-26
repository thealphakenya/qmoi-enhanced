"use client";
import React, { useMemo } from "react";
interface ProjectTask {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
}
interface ProjectResource {
  id: string;
  name: string;
  type: "human" | "equipment" | "software" | "other";
  status: "allocated" | "maintenance" | "available";
  cost: number;
}
interface Project {
  id: string;
  name: string;
  tasks: ProjectTask[];
  resources: ProjectResource[];
}
const sampleProjects: Project[] = [
  {
    id: "project-1",
    name: "QMOI Launch",
    tasks: [
      { id: "task-1", title: "Design UI", status: "completed" },
      { id: "task-2", title: "Deploy APIs", status: "in-progress" },
      { id: "task-3", title: "Run QA", status: "pending" },
    ],
    resources: [
      { id: "resource-1", name: "Frontend Team", type: "human", status: "allocated", cost: 12000 },
      { id: "resource-2", name: "GPU Servers", type: "equipment", status: "available", cost: 8000 },
      { id: "resource-3", name: "Automation Scripts", type: "software", status: "allocated", cost: 4000 },
    ],
  },
];
interface ProjectDashboardProps {
  projectId: string;
}
export default function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const project = sampleProjects.find((item) => item.id === projectId) || sampleProjects[0];
  const taskStats = useMemo(
    () => ({
      total: project.tasks.length,
      completed: project.tasks.filter((task) => task.status === "completed").length,
      inProgress: project.tasks.filter((task) => task.status === "in-progress").length,
      pending: project.tasks.filter((task) => task.status === "pending").length,
    }),
    [project.tasks],
  );
  const resourceStats = useMemo(
    () => ({
      total: project.resources.length,
      allocated: project.resources.filter((resource) => resource.status === "allocated").length,
      maintenance: project.resources.filter((resource) => resource.status === "maintenance").length,
      totalCost: project.resources.reduce((sum, resource) => sum + resource.cost, 0),
    }),
    [project.resources],
  );
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{project.name}</h2>
        <p className="text-sm text-slate-500">Project overview with task and resource status.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Tasks</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{taskStats.total}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-500">In Progress</div>
          <div className="mt-2 text-3xl font-semibold text-amber-600">{taskStats.inProgress}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Allocated Resources</div>
          <div className="mt-2 text-3xl font-semibold text-emerald-700">{resourceStats.allocated}</div>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Resource Usage</h3>
        <p className="mt-2 text-sm text-slate-600">{resourceStats.allocated} out of {resourceStats.total} resources allocated.</p>
      </div>
    </div>
  );
}
