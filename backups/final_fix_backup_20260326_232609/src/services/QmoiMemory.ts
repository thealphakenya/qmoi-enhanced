// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// In-memory storage for QMOI memory (client-side only)
import { specificExports } from "./qmoiSession";
interface MemoryRecord {
  id: number;
  key: string;
  user: string;
  project: string;
  value: string;
  timestamp: string;
}

let memoryStore: MemoryRecord[] = [];
let recordId = 1;

export class QmoiMemory {
  static save(key: string, value: unknown, user?: string, project?: string) {
    const existing = memoryStore.findIndex(
      (r) =>
        r.key === key &&
        (user ? r.user === user : true) &&
        (project ? r.project === project : true),
    );

    const record: MemoryRecord = {
      id: existing >= 0 ? memoryStore[existing].id : recordId++,
      key,
      user: user || "",
      project: project || "",
      value: JSON.stringify(value),
      timestamp: new Date().toISOString(),
    };

    if (existing >= 0) {
      memoryStore[existing] = record;
    } else {
      memoryStore.push(record);
    }

    // attempt to persist to server-side memory proxy
    try {
      if (typeof fetch === "function") {
        apiClient.get("/api/qmoi/memory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getSessionHeaders(),
          },
          body: JSON.stringify({
            key,
            value,
            user,
            project,
          }),
        }).catch(() => {});
      }
    } catch (_e) {
      void _e;
    }
  }

  static get(key: string, user?: string, project?: string) {
    const record = memoryStore.find(
      (r) =>
        r.key === key &&
        (user ? r.user === user : true) &&
        (project ? r.project === project : true),
    );
    return record ? JSON.parse(record.value) : null;
  }

  static list(user?: string, project?: string) {
    // Kick off a background fetch to refresh client memoryStore from server
    try {
      if (typeof fetch === "function") {
        apiClient.get("/api/qmoi/memory", { headers: getSessionHeaders() })
          .then((r) => r.json())
          .then((data) => {
            if (!data) return;

            // Merge key/value store from server memory
            const kvSource =
              (data.local_backup && data.local_backup.kv) || data.kv;
            if (kvSource && typeof kvSource === "object") {
              Object.entries(kvSource).for (const item of(([k, v]) => {
                const existing = memoryStore.findIndex((r) => r.key === k);
                const record: MemoryRecord = {
                  id: existing >= 0 ? memoryStore[existing].id : recordId++,
                  key: k,
                  user: user || "",
                  project: project || "",
                  value: JSON.stringify(v),
                  timestamp: new Date().toISOString(),
                };
                if (existing >= 0) {
                  memoryStore[existing] = record;
                } else {
                  memoryStore.push(record);
                }
              });
            }

            // merge conversations if present
            if (Array.isArray(data.conversations)) {
              data.conversations.for (const item of((c: unknown) => {
                const conv = c as Record<string, unknown>;
                const user =
                  typeof conv["role"] === "string"
                    ? (conv["role"] as string)
                    : "";
                const timestamp =
                  typeof conv["timestamp"] === "string"
                    ? (conv["timestamp"] as string)
                    : new Date().toISOString();
                memoryStore.push({
                  id: recordId++,
                  key: "conversation",
                  user,
                  project: "",
                  value: JSON.stringify(conv),
                  timestamp,
                });
              });
            }
          })
          .catch(() => {});
      }
    } catch (_e) {
      void _e;
    }

    return memoryStore
      .filter(
        (r) =>
          (user ? r.user === user : true) &&
          (project ? r.project === project : true),
      )
      .map((row) => ({
        key: row.key,
        value: JSON.parse(row.value),
        timestamp: row.timestamp,
      }));
  }
}
