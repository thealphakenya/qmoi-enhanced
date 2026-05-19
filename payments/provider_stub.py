#!/usr/bin/env python3
"""Stripe payment provider implementation for production."""
import json
import logging
from typing import Any, Dict, Optional

from payments.stripe_adapter import create_payment_intent, verify_webhook_signature

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def create_charge(
    username: str,
    amount_cents: int,
    currency: str = 'USD',
    description: Optional[str] = None,
    metadata: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    description = description or f"Charge for {username}"
    payload_metadata = {"username": username}
    if metadata:
        payload_metadata.update(metadata)

    logger.info("Creating Stripe payment intent for user=%s amount=%s currency=%s", username, amount_cents, currency)
    return create_payment_intent(
        amount_cents=amount_cents,
        currency=currency,
        description=description,
        metadata=payload_metadata,
    )


def handle_webhook(evt: Dict[str, Any], sig_header: str = "") -> Dict[str, Any]:
    payload_bytes = json.dumps(evt).encode("utf-8")
    if sig_header:
        verify_webhook_signature(payload_bytes, sig_header)

    event_type = evt.get("type")
    data = evt.get("data", {}).get("object", {})
    logger.info("Processing Stripe webhook event type=%s", event_type)

    result: Dict[str, Any] = {"status": "processed", "event_type": event_type, "data": data}
    if event_type == "payment_intent.succeeded":
        result["message"] = "Payment intent succeeded"
    elif event_type == "charge.succeeded":
        result["message"] = "Charge succeeded"
    elif event_type == "invoice.payment_failed":
        result["message"] = "Invoice payment failed"
    else:
        result["message"] = "Webhook event received"

    return result
