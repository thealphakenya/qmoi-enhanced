import Database from 'better-sqlite3';

const db = new Database('qmoi_memory.db');

db.exec(`
CREATE TABLE IF NOT EXISTS memory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT,
  user TEXT,
  project TEXT,
  value TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export class QmoiMemory {
  static save(key: string, value: any, user?: string, project?: string) {
    db.prepare('INSERT INTO memory (key, value, user, project) VALUES (?, ?, ?, ?)')
      .run(key, JSON.stringify(value), user || '', project || '');
  }

  static get(key: string, user?: string, project?: string) {
    let stmt = 'SELECT value FROM memory WHERE key = ?';
    let params: any[] = [key];
    if (user) {
      stmt += ' AND user = ?';
      params.push(user);
    }
    if (project) {
      stmt += ' AND project = ?';
      params.push(project);
    }
    const row = db.prepare(stmt).get(...params);
    return row ? JSON.parse(row.value) : null;
  }

  static list(user?: string, project?: string) {
    let stmt = 'SELECT key, value, timestamp FROM memory WHERE 1=1';
    let params: any[] = [];
    if (user) {
      stmt += ' AND user = ?';
      params.push(user);
    }
    if (project) {
      stmt += ' AND project = ?';
      params.push(project);
    }
    return db.prepare(stmt).all(...params).map(row => ({
      key: row.key,
      value: JSON.parse(row.value),
      timestamp: row.timestamp
    }));
  }
} 