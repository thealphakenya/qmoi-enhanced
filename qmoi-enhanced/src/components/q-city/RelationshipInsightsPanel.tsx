import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface RelationshipData {
  progress: { level: number; milestones: string[] };
  preferences: Record<string, string>;
  adaptation: { score: number; changes: string[] };
  lastUpdated?: string;
}

export default function RelationshipInsightsPanel() {
  const [data, setData] = useState<RelationshipData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qmoi/relationship");
      if (!res.ok) throw new Error("Failed to fetch relationship data");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      // fallback to sample data
      setData({
        progress: { level: 3, milestones: ["Profile completed", "First project created"] },
        preferences: { language: "en", notifications: "enabled" },
        adaptation: { score: 72, changes: ["Learns from feedback", "Prioritizes tasks"] },
        lastUpdated: new Date().toISOString(),
      });
      setError(err.message || "Using fallback data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "relationship_insights.json";
    a.click();
  };

  const resetLearntPreferences = async () => {
    if (!confirm("Reset QMOI learned preferences and progress?")) return;
    try {
      const res = await fetch("/api/qmoi/relationship/reset", { method: "POST" });
      if (!res.ok) throw new Error("Reset failed");
      await fetchData();
      alert("Reset successful");
    } catch (err: any) {
      alert(err.message || "Failed to reset");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Relationship Insights</h2>
      {loading && <div>Loading…</div>}
      {error && <div className="text-sm text-red-400 mb-2">{error}</div>}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Progress (Level {data.progress.level})</h3>
            <ul className="list-disc ml-6">
              {data.progress.milestones.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <div className="mt-3 text-xs text-gray-500">Last updated: {new Date(data.lastUpdated || Date.now()).toLocaleString()}</div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Preferences</h3>
            <table className="text-sm w-full">
              <tbody>
                {Object.entries(data.preferences).map(([k, v]) => (
                  <tr key={k} className="border-t">
                    <td className="py-1 font-medium w-1/3">{k}</td>
                    <td className="py-1">{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3">
              <h4 className="font-medium mb-1">Adaptation</h4>
              <div>Score: <b>{data.adaptation.score}%</b></div>
              <ul className="list-disc ml-6 mt-2">
                {data.adaptation.changes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={fetchData}>Sync Now</Button>
        <Button size="sm" variant="outline" onClick={exportJSON}>Export</Button>
        <Button size="sm" variant="destructive" onClick={resetLearntPreferences}>Reset</Button>
      </div>
    </div>
  );
}
