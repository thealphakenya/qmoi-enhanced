#!/usr/bin/env python3
"""Sandbox payment adapter for services.payments.

This adapter simulates payment events in a local development environment.
"""
import json
import logging
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

TRACKS_DIR = Path(__file__).resolve().parents[2] / "tracks" / "payments"
TRACKS_DIR.mkdir(parents=True, exist_ok=True)


class SandboxPaymentAdapter:
    def __init__(self, config: Optional[Dict[str, Any]] = None) -> None:
        self.config = config or {}
        self.environment = self.config.get("env", "sandbox")

    def initialize(self, config: Optional[Dict[str, Any]] = None) -> bool:
        self.config.update(config or {})
        self.environment = self.config.get("env", self.environment)
        logger.info("Initialized sandbox payment adapter in environment=%s", self.environment)
        return True

    def charge(
        self,
        customer_id: str,
        amount_cents: int,
        currency: str = "USD",
        metadata: Optional[Dict[str, str]] = None,
        description: str = "Sandbox charge",
    ) -> Dict[str, Any]:
        transaction = {
            "id": str(uuid.uuid4()),
            "type": "charge",
            "customer_id": customer_id,
            "amount_cents": amount_cents,
            "currency": currency.upper(),
            "description": description,
            "metadata": metadata or {},
            "timestamp": int(time.time()),
            "status": "succeeded",
        }
        self._log_event(transaction)
        logger.info("Sandbox charge created: %s", transaction["id"])
        return transaction

    def refund(
        self,
        transaction_id: str,
        amount_cents: Optional[int] = None,
    ) -> Dict[str, Any]:
        refund_event = {
            "id": str(uuid.uuid4()),
            "type": "refund",
            "refund_of": transaction_id,
            "amount_cents": amount_cents,
            "timestamp": int(time.time()),
            "status": "succeeded",
        }
        self._log_event(refund_event)
        logger.info("Sandbox refund created for transaction=%s", transaction_id)
        return refund_event

    def reconcile(self, limit: int = 50) -> Dict[str, Any]:
        events = self._load_events(limit)
        return {"status": "ok", "count": len(events), "events": events}

    def _log_event(self, event: Dict[str, Any]) -> None:
        path = TRACKS_DIR / f"sandbox_payment_{int(time.time() * 1000)}_{uuid.uuid4().hex}.json"
        path.write_text(json.dumps(event, indent=2), encoding="utf-8")

    def _load_events(self, limit: int = 50) -> List[Dict[str, Any]]:
        events: List[Dict[str, Any]] = []
        for path in sorted(TRACKS_DIR.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)[:limit]:
            try:
                events.append(json.loads(path.read_text(encoding="utf-8")))
            except (OSError, ValueError):
                continue
        return events


def create(config: Optional[Dict[str, Any]] = None) -> SandboxPaymentAdapter:
    adapter = SandboxPaymentAdapter(config=config)
    adapter.initialize(config)
    return adapter
