"""Clean, class-based ledger implementation (ledger_v2).

This module contains a reviewed Ledger class used for new tests and wiring.
Keep `services/ledger.py` untouched to avoid changing historical artifacts.
"""
import sqlite3
import os
import json
import datetime
from typing import Optional, List, Dict, Any


DEFAULT_DB = os.environ.get("QMOI_LEDGER_DB", ".qmoi/ledger.db")


class Ledger:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or DEFAULT_DB
        d = os.path.dirname(self.db_path)
        if d:
            os.makedirs(d, exist_ok=True)

    def _conn(self):
        return sqlite3.connect(self.db_path)

    def init_db(self) -> None:
        with self._conn() as conn:
            cur = conn.cursor()
            cur.execute(
                """
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                account TEXT NOT NULL,
                amount REAL NOT NULL,
                currency TEXT NOT NULL,
                type TEXT NOT NULL,
                provider TEXT,
                metadata TEXT,
                approved INTEGER DEFAULT 0,
                approver TEXT,
                approved_at TEXT,
                idempotency_key TEXT
            )
            """
            )
            conn.commit()

    def record_transaction(
        self,
        account: str,
        amount: float,
        currency: str = "KSH",
        type: str = "credit",
        provider: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        idempotency_key: Optional[str] = None,
        approved: bool = False,
    ) -> int:
        created_at = datetime.datetime.utcnow().isoformat() + "Z"
        md = json.dumps(metadata or {})
        with self._conn() as conn:
            cur = conn.cursor()
            cur.execute(
                """
                INSERT INTO transactions (created_at, account, amount, currency, type, provider, metadata, approved, idempotency_key)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (created_at, account, amount, currency, type, provider, md, 1 if approved else 0, idempotency_key),
            )
            conn.commit()
            return cur.lastrowid

    def set_approved(self, tx_id: int, approver: str) -> bool:
        approved_at = datetime.datetime.utcnow().isoformat() + "Z"
        with self._conn() as conn:
            cur = conn.cursor()
            cur.execute(
                "UPDATE transactions SET approved=1, approver=?, approved_at=? WHERE id=?",
                (approver, approved_at, tx_id),
            )
            conn.commit()
            return cur.rowcount > 0

    def get_balance(self, account: str) -> float:
        with self._conn() as conn:
            cur = conn.cursor()
            cur.execute(
                "SELECT SUM(CASE WHEN type='credit' THEN amount WHEN type='debit' THEN -amount ELSE 0 END) as bal FROM transactions WHERE account=?",
                (account,),
            )
            r = cur.fetchone()
            return float(r[0] or 0.0)

    def list_transactions(self, limit: int = 100) -> List[Dict[str, Any]]:
        with self._conn() as conn:
            cur = conn.cursor()
            cur.execute("SELECT id, created_at, account, amount, currency, type, provider, metadata, approved, approver, approved_at, idempotency_key FROM transactions ORDER BY id DESC LIMIT ?", (limit,))
            rows = cur.fetchall()
            cols = ["id", "created_at", "account", "amount", "currency", "type", "provider", "metadata", "approved", "approver", "approved_at", "idempotency_key"]
            out = []
            for r in rows:
                d = dict(zip(cols, r))
                try:
                    d["metadata"] = json.loads(d["metadata"] or "{}")
                except Exception:
                    d["metadata"] = {}
                out.append(d)
            return out


if __name__ == "__main__":
    l = Ledger()
    l.init_db()
    print("Ledger DB:", l.db_path)
    tx = l.record_transaction(account="platform", amount=100.0, type="credit", provider="seed", metadata={"note": "seed"}, approved=True)
    print("Inserted tx", tx)
    print("Balance platform:", l.get_balance("platform"))
