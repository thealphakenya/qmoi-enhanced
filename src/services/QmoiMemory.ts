// In-memory storage for QMOI memory (client-side only)
import { getSessionHeaders } from "./qmoiSession";
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
        (project ? r.project === project : true)
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
        fetch("/api/qmoi/memory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getSessionHeaders(),
          },
          body: JSON.stringify({
            conversations: [],
            profiles: {},
            sessions: {},
            // store a key-value record for cross-sync purposes
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
        (project ? r.project === project : true)
    );
    return record ? JSON.parse(record.value) : null;
  }

  static list(user?: string, project?: string) {
    // Kick off a background fetch to refresh client memoryStore from server
    try {
      if (typeof fetch === "function") {
        fetch("/api/qmoi/memory", { headers: getSessionHeaders() })
          .then((r) => r.json())
          .then((data) => {
            if (data && data.profiles) {
              // merge conversations if present
              if (Array.isArray(data.conversations)) {
                data.conversations.forEach((c: any) => {
                  memoryStore.push({
                    id: recordId++,
                    key: "conversation",
                    user: c.role || "",
                    project: "",
                    value: JSON.stringify(c),
                    timestamp: c.timestamp || new Date().toISOString(),
                  });
                });
              }
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
          (project ? r.project === project : true)
      )
      .map((row) => ({
        key: row.key,
        value: JSON.parse(row.value),
        timestamp: row.timestamp,
      }));
  }
}
