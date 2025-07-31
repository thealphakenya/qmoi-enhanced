import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import Database from 'better-sqlite3';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

function isMaster(req: NextApiRequest | NextRequest) {
  return req.headers['x-qmoi-master'] === 'true';
}

interface MediaItem {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'documentary' | 'animation';
  source: 'public_domain' | 'youtube' | 'user_upload';
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: 'available' | 'downloading' | 'downloaded' | 'error';
  createdAt: number;
  updatedAt: number;
}

function getDb(): Database.Database {
  const dbPath = path.join(process.cwd(), 'qmoi.db');
  return new Database(dbPath);
}

function initializeMediaTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      source TEXT NOT NULL,
      url TEXT NOT NULL,
      local_path TEXT,
      duration INTEGER,
      size INTEGER,
      status TEXT NOT NULL DEFAULT 'available',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS media_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      media_id TEXT,
      details TEXT,
      user_id TEXT,
      timestamp INTEGER NOT NULL
    );
  `);
}

async function searchMedia(query: string, type?: string, source?: string): Promise<MediaItem[]> {
  const db = getDb();
  initializeMediaTables(db);

  let sql = 'SELECT * FROM media_items WHERE title LIKE ?';
  const params: any[] = [`%${query}%`];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }

  if (source) {
    sql += ' AND source = ?';
    params.push(source);
  }

  sql += ' ORDER BY created_at DESC';
  return db.prepare(sql).all(...params);
}

async function downloadMedia(mediaId: string): Promise<{ success: boolean; message: string }> {
  const db = getDb();
  const media = db.prepare('SELECT * FROM media_items WHERE id = ?').get(mediaId);

  if (!media) return { success: false, message: 'Media not found' };
  if (media.status === 'downloaded') return { success: true, message: 'Already downloaded' };

  try {
    db.prepare('UPDATE media_items SET status = ? WHERE id = ?').run('downloading', mediaId);

    const mediaDir = path.join(process.cwd(), 'media');
    if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

    const response = await axios.get(media.url, {
      responseType: 'stream',
      timeout: 30000
    });

    const fileName = `${mediaId}_${Date.now()}.mp4`;
    const filePath = path.join(mediaDir, fileName);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve) => {
      writer.on('finish', () => {
        const stats = fs.statSync(filePath);
        db.prepare(`
          UPDATE media_items SET local_path = ?, size = ?, status = ?, updated_at = ? WHERE id = ?
        `).run(filePath, stats.size, 'downloaded', Date.now(), mediaId);

        db.prepare(`
          INSERT INTO media_logs (action, media_id, details, timestamp)
          VALUES (?, ?, ?, ?)
        `).run('download', mediaId, `Downloaded to ${filePath}`, Date.now());

        resolve({ success: true, message: 'Media downloaded successfully' });
      });

      writer.on('error', (error) => {
        db.prepare('UPDATE media_items SET status = ?, updated_at = ? WHERE id = ?')
          .run('error', Date.now(), mediaId);

        db.prepare('INSERT INTO media_logs (action, media_id, details, timestamp) VALUES (?, ?, ?, ?)')
          .run('download_error', mediaId, error.message, Date.now());

        resolve({ success: false, message: `Download failed: ${error.message}` });
      });
    });
  } catch (error: any) {
    db.prepare('UPDATE media_items SET status = ?, updated_at = ? WHERE id = ?')
      .run('error', Date.now(), mediaId);

    return { success: false, message: `Download failed: ${error.message}` };
  }
}

function getMediaLogs(filter?: { action?: string; mediaId?: string; limit?: number }) {
  const db = getDb();
  let sql = 'SELECT * FROM media_logs';
  const params: any[] = [];

  if (filter?.action || filter?.mediaId) {
    sql += ' WHERE';
    if (filter.action) {
      sql += ' action = ?';
      params.push(filter.action);
    }
    if (filter.mediaId) {
      sql += filter.action ? ' AND' : '';
      sql += ' media_id = ?';
      params.push(filter.mediaId);
    }
  }

  sql += ' ORDER BY timestamp DESC';
  if (filter?.limit) {
    sql += ' LIMIT ?';
    params.push(filter.limit);
  }

  return db.prepare(sql).all(...params);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isMaster(req)) {
    return res.status(403).json({ error: 'Master access required' });
  }

  const db = getDb();
  initializeMediaTables(db);

  const { method, query, body } = req;

  if (method === 'GET' && query.search) {
    try {
      const results = await searchMedia(query.search as string, query.type as string, query.source as string);
      return res.json({ media: results });
    } catch (error) {
      return res.status(500).json({ error: `Search failed: ${error}` });
    }
  }

  if (method === 'POST' && body.download) {
    const result = await downloadMedia(body.mediaId);
    return res.json(result);
  }

  if (method === 'GET' && query.logs) {
    const logs = getMediaLogs({
      action: query.action as string,
      mediaId: query.mediaId as string,
      limit: query.limit ? parseInt(query.limit as string) : undefined
    });
    return res.json({ logs });
  }

  if (method === 'POST' && body.addMedia) {
    const mediaItem: MediaItem = {
      id: body.id || `media_${Date.now()}`,
      title: body.title,
      type: body.type,
      source: body.source,
      url: body.url,
      status: 'available',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    db.prepare(`
      INSERT INTO media_items (id, title, type, source, url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      mediaItem.id,
      mediaItem.title,
      mediaItem.type,
      mediaItem.source,
      mediaItem.url,
      mediaItem.status,
      mediaItem.createdAt,
      mediaItem.updatedAt
    );

    return res.json({ success: true, media: mediaItem });
  }

  if (method === 'GET' && query.tables) {
    const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all();
    return res.json({ tables });
  }

  if (method === 'POST' && body.createTable) {
    db.exec(body.createTable);
    return res.json({ status: 'Table created' });
  }

  if (method === 'POST' && body.insert) {
    db.prepare(body.insert).run(...(body.values || []));
    return res.json({ status: 'Row inserted' });
  }

  if (method === 'GET' && query.schema) {
    const schema = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table'`).all();
    return res.json({ schema });
  }

  return res.status(400).json({ error: 'Invalid request' });
}
