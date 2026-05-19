#!/usr/bin/env python3
"""Webhook processor for payment events."""
import json
import logging
from typing import Any, Dict, Optional

from payments.stripe_adapter import verify_webhook_signature

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class WebhookProcessor:
    def __init__(self, db_conn: Optional[Any] = None):
        self.conn = db_conn

    def process_webhook(self, payload: Dict[str, Any], sig_header: str = "") -> Dict[str, Any]:
        if sig_header:
            payload_bytes = json.dumps(payload).encode("utf-8")
            verify_webhook_signature(payload_bytes, sig_header)

        event_type = payload.get("type")
        event_data = payload.get("data", {}).get("object", {})
        logger.info("Processing payment webhook event type=%s", event_type)

        result: Dict[str, Any] = {
            "status": "processed",
            "event_type": event_type,
            "data": event_data,
        }

        if event_type == "payment_intent.succeeded":
            result["message"] = "Payment intent succeeded"
        elif event_type == "charge.succeeded":
            result["message"] = "Charge succeeded"
        elif event_type == "invoice.payment_failed":
            result["message"] = "Invoice payment failed"
        else:
            result["message"] = "Unhandled webhook event"

        return result
