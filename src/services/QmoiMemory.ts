// In-memory storage for QMOI memory (client-side only)
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
  static save(key: string, value: any, user?: string, project?: string) {
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
