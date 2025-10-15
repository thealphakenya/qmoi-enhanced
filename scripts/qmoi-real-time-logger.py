#!/usr/bin/env python3
"""Minimal QMOI real-time logger used for automation cleanup.

This tiny module is intentionally small and deterministic so automation can
parse, format and run it reliably. It appends JSONL entries and writes a
single sqlite row per activity.
"""

from __future__ import annotations

import json
import logging
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

logger = logging.getLogger("qmoi_real_time_logger")
logger.setLevel(logging.INFO)
if not logger.handlers:
    logger.addHandler(logging.StreamHandler())


class QMOIRealTimeLogger:
    """A very small logger used during automated cleanup and tests."""

    def __init__(
        self, db_path: str = "qmoi_logs.db", logs_dir: str = "qmoi_logs"
    ) -> None:
        self.db_path = db_path
        self.logs_dir = Path(logs_dir)
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        self._ensure_db()

    def _ensure_db(self) -> None:
        conn = sqlite3.connect(self.db_path)
        try:
            cur = conn.cursor()
            cur.execute(
                "CREATE TABLE IF NOT EXISTS activity_logs (id INTEGER PRIMARY KEY, timestamp TEXT, category TEXT, action TEXT, details TEXT)"
            )
            conn.commit()
        finally:
            conn.close()

    def log_activity(
        self, category: str, action: str, details: Optional[Dict[str, Any]] = None
    ) -> None:
        payload = {
            "timestamp": datetime.utcnow().isoformat(),
            "category": category,
            "action": action,
            "details": details,
        }
        path = self.logs_dir / f"{category}.jsonl"
        with open(path, "a", encoding="utf-8") as fh:
            fh.write(json.dumps(payload, default=str) + "\n")

        conn = sqlite3.connect(self.db_path)
        try:
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO activity_logs (timestamp, category, action, details) VALUES (?, ?, ?, ?)",
                (
                    payload["timestamp"],
                    payload["category"],
                    payload["action"],
                    json.dumps(payload["details"]),
                ),
            )
            conn.commit()
        finally:
            conn.close()

        logger.info("Logged activity: %s %s", category, action)


def main() -> None:
    r = QMOIRealTimeLogger()
    r.log_activity("demo", "started", {"note": "minimal smoke test"})
    print("ok")


if __name__ == "__main__":
    main()
