---
title: "Issue draft for services/payments/sandbox_adapter.py"
generated: 2025-11-08T16:06:39.003054Z
---

# Review needed: services/payments/sandbox_adapter.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:42.162322Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:42.162322Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.162322Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
"""Sandbox payments adapter for testing and local development.
This adapter simulates charges and refunds and writes events to `tracks/` or logs.
"""
from dataclasses import dataclass
import uuid
import time
import json
from pathlib import Path

LOG_DIR = Path(__file__).resolve().parents[2] / 'tracks'
LOG_DIR.mkdir(parents=True, exist_ok=True)

@dataclass
class SandboxAdapter:
    config: dict

    def initialize(self, config: dict):
        self.config = config or {}
        return True

    def charge(self, customer_id: str, amount_cents: int, currency: str = 'KES', metadata: dict = None):
        tx = {
            'id': str(uuid.uuid4()),
            'type': 'charge',
            'customer_id': customer_id,
            'amount_cents': amount_cents,
            'currency': currency,
            'metadata': metadata or {},
            'timestamp': int(time.time()),
            'status': 'succeeded'
        }
        self._log(tx)
        return tx

    def refund(self, transaction_id: str, amount_cents: int = None):
        tx = {
            'id': str(uuid.uuid4()),
            'type': 'refund',
            'refund_of': transaction_id,
            'amount_cents': amount_cents,
            'timestamp': int(time.time()),
            'status': 'succeeded'
        }
        self._log(tx)
        return tx

    def _log(self, event: dict):
        path = LOG_DIR / f"payments_{int(time.time())}.json"
        path.write_text(json.dumps(event, indent=2), encoding='utf8')


def create(config: dict = None):
    a = SandboxAdapter(config or {})
    a.initialize(config or {})
    return a

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
