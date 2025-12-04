import type { NextApiRequest, NextApiResponse } from "next";
// NOTE: sqlite3 is a native module and cannot be used in Next.js
// Using in-memory storage instead
import fs from "fs";
import path from "path";

// Mock in-memory database
class MockDatabase {
  private data: Map<string, Record<string, unknown>> = new Map();

  async run(_sql: string, _params?: unknown[]): Promise<{ changes: number }> {
    return { changes: 1 };
  }

  async get(
    _sql: string,
    _params?: unknown[]
  ): Promise<Record<string, unknown> | null> {
    return null;
  }

  async all(
    _sql: string,
    _params?: unknown[]
  ): Promise<Record<string, unknown>[]> {
    return [];
  }

  async exec(_sql: string): Promise<void> {
    // No-op for mock
  }
}

// Mock database instance
async function getDb() {
  return new MockDatabase();
}

// Master-only access stub
function isMaster(req: NextApiRequest) {
  // TODO: Implement real master auth logic
  return req.headers["x-qmoi-master"] === "true";
}

// Media management types
interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "documentary" | "animation";
  source: "public_domain" | "youtube" | "user_upload";
  url: string;
  localPath?: string;
  duration?: number;
  size?: number;
  status: "available" | "downloading" | "downloaded" | "error";
  createdAt: number;
  updatedAt: number;
}

// Initialize media tables
async function initializeMediaTables(db: MockDatabase) {
  await db.exec(`
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
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS media_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      media_id TEXT,
      details TEXT,
      user_id TEXT,
      timestamp INTEGER NOT NULL
    )
  `);
}

// Media search implementation
async function searchMedia(
  query: string,
  type?: string,
  source?: string
): Promise<MediaItem[]> {
  const db = await getDb();

  let sql = "SELECT * FROM media_items WHERE title LIKE ?";
  const params = [`%${query}%`];

  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }

  if (source) {
    sql += " AND source = ?";
    params.push(source);
  }

  sql += " ORDER BY created_at DESC";

  const results = await db.all(sql, params);
  return results.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    title: String(row.title),
    type: String(row.type) as "movie" | "series" | "documentary" | "animation",
    source: String(row.source) as "public_domain" | "youtube" | "user_upload",
    url: String(row.url),
    localPath: row.local_path ? String(row.local_path) : undefined,
    duration: row.duration ? Number(row.duration) : undefined,
    size: row.size ? Number(row.size) : undefined,
    status: String(row.status) as
      | "available"
      | "downloading"
      | "downloaded"
      | "error",
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  }));
}

// Media download implementation
async function downloadMedia(mediaId: string): Promise<{
  success: boolean;
  message: string;
  filePath?: string;
  error?: string;
}> {
  const db = await getDb();

  // Get media item
  const media = await db.get("SELECT * FROM media_items WHERE id = ?", [
    mediaId,
  ]);
  if (!media) {
    return { success: false, message: "Media not found" };
  }

  if (media.status === "downloaded") {
    return { success: true, message: "Media already downloaded" };
  }

  try {
    // Update status to downloading
    await db.run("UPDATE media_items SET status = ? WHERE id = ?", [
      "downloading",
      mediaId,
    ]);

    // Create media directory if it doesn't exist
    const mediaDir = path.join(process.cwd(), "media");
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    // Download file
    try {
      if (typeof media.url !== "string" || !media.url) {
        throw new Error("Invalid media URL");
      }
      const response = await fetch(media.url);

      if (!response.ok) {
        throw new Error(`Failed to download media: ${response.statusText}`);
      }

      const fileName = `${mediaId}_${Date.now()}.mp4`;
      const filePath = path.join(mediaDir, fileName);

      // Write the response body to file
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));

      return {
        success: true,
        message: "Media downloaded successfully",
        filePath,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Media download failed: ${errorMessage}`,
        error: errorMessage,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Download failed: ${errorMessage}` };
  }
}

// Get media logs
async function getMediaLogs(filter?: {
  action?: string;
  mediaId?: string;
  limit?: number;
}) {
  const db = await getDb();

  let sql = "SELECT * FROM media_logs";
  const params: any[] = [];

  if (filter?.action || filter?.mediaId) {
    sql += " WHERE";
    if (filter.action) {
      sql += " action = ?";
      params.push(filter.action);
    }
    if (filter.mediaId) {
      sql += filter.action ? " AND" : "";
      sql += " media_id = ?";
      params.push(filter.mediaId);
    }
  }

  sql += " ORDER BY timestamp DESC";

  if (filter?.limit) {
    sql += " LIMIT ?";
    params.push(filter.limit);
  }

  return await db.all(sql, params);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isMaster(req)) {
    return res.status(403).json({ error: "Master access required" });
  }

  const db = await getDb();
  await initializeMediaTables(db);

  const { method, query, body } = req;

  // Media search endpoint
  if (method === "GET" && query.search) {
    try {
      const results = await searchMedia(
        query.search as string,
        query.type as string,
        query.source as string
      );
      return res.json({ media: results });
    } catch (error) {
      return res.status(500).json({ error: `Search failed: ${error}` });
    }
  }

  // Media download endpoint
  if (method === "POST" && body.download) {
    try {
      const result = await downloadMedia(body.mediaId);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: `Download failed: ${error}` });
    }
  }

  // Get media logs endpoint
  if (method === "GET" && query.logs) {
    try {
      const logs = await getMediaLogs({
        action: query.action as string,
        mediaId: query.mediaId as string,
        limit: query.limit ? parseInt(query.limit as string) : undefined,
      });
      return res.json({ logs });
    } catch (error) {
      return res.status(500).json({ error: `Failed to get logs: ${error}` });
    }
  }

  // Add new media item
  if (method === "POST" && body.addMedia) {
    try {
      const mediaItem: MediaItem = {
        id: body.id || `media_${Date.now()}`,
        title: body.title,
        type: body.type,
        source: body.source,
        url: body.url,
        status: "available",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.run(
        "INSERT INTO media_items (id, title, type, source, url, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          mediaItem.id,
          mediaItem.title,
          mediaItem.type,
          mediaItem.source,
          mediaItem.url,
          mediaItem.status,
          mediaItem.createdAt,
          mediaItem.updatedAt,
        ]
      );

      return res.json({ success: true, media: mediaItem });
    } catch (error) {
      return res.status(500).json({ error: `Failed to add media: ${error}` });
    }
  }

  // Example: Table management
  if (method === "GET" && query.tables) {
    const tables = await db.all(
      `SELECT name FROM sqlite_master WHERE type='table'`
    );
    return res.json({ tables });
  }
  if (method === "POST" && body.createTable) {
    await db.exec(body.createTable);
    return res.json({ status: "Table created" });
  }
  // Example: Row CRUD
  if (method === "POST" && body.insert) {
    await db.run(body.insert, body.values || []);
    return res.json({ status: "Row inserted" });
  }
  // Example: Schema introspection
  if (method === "GET" && query.schema) {
    const schema = await db.all(
      `SELECT sql FROM sqlite_master WHERE type='table'`
    );
    return res.json({ schema });
  }

  return res.status(400).json({ error: "Invalid request" });
}
