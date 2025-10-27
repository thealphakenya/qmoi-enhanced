"""Simple QMOI memory prototype (Phase 1)

Provides a minimal, safe, SQLite-backed namespaced key/value memory with TTL and basic listing.
This is intentionally small and synchronous for easy integration and unit testing.
"""

from __future__ import annotations

import sqlite3
import json
import time
from pathlib import Path
from typing import Optional, Dict, Any, List

DB_PATH = Path(".qmoi_memory.db")


def _get_conn(path: Path = DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(str(path))
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def init_db(path: Path = DB_PATH) -> None:
    conn = _get_conn(path)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            namespace TEXT NOT NULL,
            key TEXT NOT NULL,
            value TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            expires_at INTEGER,
            meta TEXT,
            UNIQUE(namespace, key)
        )"""
    )
    conn.commit()
    conn.close()


def set_item(namespace: str, key: str, value: Any, ttl_seconds: Optional[int] = None, meta: Optional[Dict] = None) -> None:
    init_db()
    expires = int(time.time()) + int(ttl_seconds) if ttl_seconds else None
    conn = _get_conn()
    now = int(time.time())
    data = json.dumps(value, ensure_ascii=False)
    meta_json = json.dumps(meta or {})
    conn.execute(
        "INSERT INTO memory(namespace,key,value,created_at,expires_at,meta) VALUES(?,?,?,?,?,?) ON CONFLICT(namespace,key) DO UPDATE SET value=excluded.value, created_at=excluded.created_at, expires_at=excluded.expires_at, meta=excluded.meta",
        (namespace, key, data, now, expires, meta_json),
    )
    conn.commit()
    conn.close()


def get_item(namespace: str, key: str) -> Optional[Any]:
    init_db()
    conn = _get_conn()
    row = conn.execute("SELECT value, expires_at FROM memory WHERE namespace=? AND key=?", (namespace, key)).fetchone()
    conn.close()
    if not row:
        return None
    value_json, expires_at = row
    if expires_at and int(time.time()) > int(expires_at):
        # expired
        delete_item(namespace, key)
        return None
    return json.loads(value_json)


def delete_item(namespace: str, key: str) -> None:
    init_db()
    conn = _get_conn()
    conn.execute("DELETE FROM memory WHERE namespace=? AND key=?", (namespace, key))
    conn.commit()
    conn.close()


def list_keys(namespace: str) -> List[str]:
    init_db()
    conn = _get_conn()
    rows = conn.execute("SELECT key FROM memory WHERE namespace=?", (namespace,)).fetchall()
    conn.close()
    return [r[0] for r in rows]


def purge_expired() -> int:
    init_db()
    conn = _get_conn()
    cur = conn.execute("DELETE FROM memory WHERE expires_at IS NOT NULL AND expires_at < ?", (int(time.time()),))
    count = cur.rowcount
    conn.commit()
    conn.close()
    return count


if __name__ == "__main__":
    init_db()
    print("QMOI memory DB initialized at", DB_PATH)
