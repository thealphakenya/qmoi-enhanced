"use client";
import React, { useMemo, useState } from "react";
interface QVillageTopic {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
}
const sampleTopics: QVillageTopic[] = [
  { id: "health", name: "Community Health", description: "Wellness metrics and local health trends.", updatedAt: "2026-05-01" },
  { id: "agriculture", name: "Local Agriculture", description: "Crop performance, supply routes, and yield forecasts.", updatedAt: "2026-05-15" },
  { id: "education", name: "Education Insights", description: "School attendance, achievement, and learning progress.", updatedAt: "2026-05-20" },
];
export default function QVillage() {
  const [search, setSearch] = useState("");
  const filteredTopics = useMemo(
    () => sampleTopics.filter((topic) => topic.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">QVillage Explorer</h2>
        <p className="text-sm text-slate-500">Browse curated datasets and community insights for QVillage.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          placeholder="Search village topics"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {filteredTopics.length} topic{filteredTopics.length !== 1 ? "s" : ""} available
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredTopics.map((topic) => (
          <div key={topic.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">{topic.name}</h3>
              <span className="text-xs text-slate-500">Updated {topic.updatedAt}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{topic.description}</p>
          </div>
        ))}
        {filteredTopics.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No topics match your search.
          </div>
        )}
      </div>
    </div>
  );
}
