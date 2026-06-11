"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/api/client";

interface QMoiMemoryPanelProps {
  isMaster?: boolean;
}

interface MemoryData {
  personality?: Record<string, unknown>;
  master_feedback?: Array<unknown>;
  history?: Array<{ input?: string; emotion?: string }>;
}

export default function QMoiMemoryPanel({ isMaster = false }: QMoiMemoryPanelProps): React.ReactElement | null {
  const [memory, setMemory] = useState<MemoryData | null>(null);
  const [feedback, setFeedback] = useState("");
  const [correction, setCorrection] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchMemory(): Promise<void> {
    try {
      const res = await apiClient.get("/api/qmoi/memory");
      if (res.ok) {
        setMemory(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch memory:", error);
    } finally {
      setLoading(false);
    }
  }

  async function submitFeedback(): Promise<void> {
    try {
      const res = await apiClient.post("/api/qmoi/feedback", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback,
          correction: correction ? { custom: correction } : undefined,
        }),
      });
      if (res.ok) {
        setMessage("Feedback submitted!");
        fetchMemory();
      } else {
        setMessage("Error submitting feedback.");
      }
    } catch (error) {
      console.error("Feedback submission failed:", error);
      setMessage("Error submitting feedback.");
    }
  }

  async function backupMemory(): Promise<void> {
    try {
      const res = await apiClient.get("/api/qmoi/memory-backup");
      if (res.ok) {
        setMessage("Memory backup created!");
      } else {
        setMessage("Backup failed.");
      }
    } catch (error) {
      console.error("Backup failed:", error);
      setMessage("Backup failed.");
    }
  }

  useEffect(() => {
    if (isMaster) {
      fetchMemory();
    }
  }, [isMaster]);

  if (!isMaster) return null;

  return (
    <div
      style={{
        border: "1px solid #444",
        padding: 16,
        borderRadius: 8,
        background: "#181818",
        color: "#e0ffe0",
        marginTop: 16,
      }}
    >
      <h3>QMOI Memory & Personality</h3>
      {loading ? (
        <p>Loading...</p>
      ) : memory ? (
        <>
          <p>
            <b>Personality:</b> {JSON.stringify(memory.personality)}
          </p>
          <p>
            <b>Recent Feedback:</b>
          </p>
          <ul>
            {(memory.master_feedback || [])
              .slice(-5)
              .map((f: unknown, i: number) => (
                <li key={i}>{JSON.stringify(f)}</li>
              ))}
          </ul>
          <p>
            <b>Recent Interactions:</b>
          </p>
          <ul>
            {(memory.history || []).slice(-5).map((h, i) => (
              <li key={i}>
                {h.input || "No input"} ({h.emotion || "unknown"})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No memory data available.</p>
      )}
      <div style={{ marginTop: 12 }}>
        <input
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback (praise/correction)"
          style={{ marginRight: 8 }}
        />
        <input
          value={correction}
          onChange={(e) => setCorrection(e.target.value)}
          placeholder="Correction (optional)"
          style={{ marginRight: 8 }}
        />
        <button onClick={submitFeedback}>Submit Feedback</button>
        <button onClick={backupMemory} style={{ marginLeft: 8 }}>
          Backup Memory
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
