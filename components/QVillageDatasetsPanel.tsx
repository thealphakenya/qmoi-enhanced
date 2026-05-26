"use client";
import React, { useEffect, useState } from "react";
export interface QVillageDataset {
  id: string;
  name: string;
  description: string;
  type: string;
  metadata: { tags: string[] };
  stats: { totalItems: number };
}
const mockDatasets: QVillageDataset[] = [
  {
    id: "1",
    name: "Community Health",
    description: "Public health surveys and community wellness indicators.",
    type: "health",
    metadata: { tags: ["health", "community", "survey"] },
    stats: { totalItems: 782 },
  },
  {
    id: "2",
    name: "Local Agriculture",
    description: "Crop yields, weather impact, and supply chain insights.",
    type: "agribusiness",
    metadata: { tags: ["agriculture", "farming", "logistics"] },
    stats: { totalItems: 418 },
  },
  {
    id: "3",
    name: "Education Outcomes",
    description: "School attendance, performance, and learning metrics.",
    type: "education",
    metadata: { tags: ["education", "learning", "performance"] },
    stats: { totalItems: 529 },
  },
];
export default function QVillageDatasetsPanel(): JSX.Element {
  const [datasets, setDatasets] = useState<QVillageDataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    setDatasets(mockDatasets);
  }, []);
  const loadDatasets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/qvillage?endpoint=datasets");
      if (!response.ok) {
        throw new Error("Failed to fetch datasets.");
      }
      const data = (await response.json()) as QVillageDataset[];
      setDatasets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setDatasets(mockDatasets);
    } finally {
      setLoading(false);
    }
  };
  const filtered = datasets.filter((ds) =>
    query ? ds.name.toLowerCase().includes(query.toLowerCase()) : true,
  );
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">QVillage Datasets</h2>
            <p className="text-sm text-slate-500 mt-1">
              Datasets used by QMOI for smarter responses and platform insights.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
              placeholder="Search datasets"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              onClick={loadDatasets}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="p-4 rounded-3xl border border-amber-200 bg-amber-50 text-amber-700">
          Loading datasets...
        </div>
      )}
      {error && (
        <div className="p-4 rounded-3xl border border-rose-200 bg-rose-50 text-rose-700">
          {error}
        </div>
      )}
      <div className="grid gap-4">
        {filtered.map((ds) => (
          <div key={ds.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{ds.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{ds.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ds.metadata.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500">
              Total items: {ds.stats.totalItems}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No datasets match your search.
          </div>
        )}
      </div>
    </div>
  );
}
