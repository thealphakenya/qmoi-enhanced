"use client";
import React, { useState } from "react";
interface Resource {
  id: string;
  name: string;
  type: "human" | "equipment" | "software" | "other";
  status: "allocated" | "maintenance" | "available";
  cost: number;
}
const sampleResources: Resource[] = [
  { id: "resource-1", name: "Frontend Team", type: "human", status: "allocated", cost: 12000 },
  { id: "resource-2", name: "GPU Cluster", type: "equipment", status: "available", cost: 8000 },
  { id: "resource-3", name: "Model Training Pipeline", type: "software", status: "maintenance", cost: 5000 },
];
interface ResourceListProps {
  projectId: string;
}
export default function ResourceList({ projectId }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const handleStatusChange = (resourceId: string, newStatus: Resource["status"]) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === resourceId ? { ...resource, status: newStatus } : resource,
      ),
    );
  };
  return (
    <div className="space-y-4 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Resource List</h2>
        <p className="text-sm text-slate-500">Manage resource status for project {projectId}.</p>
      </div>
      <div className="space-y-3">
        {resources.map((resource) => (
          <div key={resource.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-slate-900">{resource.name}</div>
                <div className="text-sm text-slate-500">{resource.type} • ${resource.cost.toLocaleString()}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700">{resource.status}</span>
                <select
                  value={resource.status}
                  onChange={(event) => handleStatusChange(resource.id, event.target.value as Resource["status"])}
                  className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="allocated">allocated</option>
                  <option value="maintenance">maintenance</option>
                  <option value="available">available</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
