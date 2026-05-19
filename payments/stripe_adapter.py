#!/usr/bin/env python3
"""Stripe adapter integration for production payment flows."""
import base64
import hashlib
import hmac
import json
import logging
import os
import time
from typing import Any, Dict, Optional
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

STRIPE_API_BASE = "https://api.stripe.com/v1"
STRIPE_API_KEY_ENV = "STRIPE_SECRET_KEY"
STRIPE_WEBHOOK_SECRET_ENV = "STRIPE_WEBHOOK_SECRET"


def get_stripe_api_key() -> str:
    api_key = os.getenv(STRIPE_API_KEY_ENV)
    if not api_key:
        raise EnvironmentError(
            f"Missing required Stripe environment variable: {STRIPE_API_KEY_ENV}"
        )
    return api_key


def get_stripe_webhook_secret() -> str:
    secret = os.getenv(STRIPE_WEBHOOK_SECRET_ENV)
    if not secret:
        raise EnvironmentError(
            f"Missing required Stripe webhook secret environment variable: {STRIPE_WEBHOOK_SECRET_ENV}"
        )
    return secret


def basic_auth_header(api_key: str) -> str:
    token = base64.b64encode(f"{api_key}:".encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def stripe_request(path: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    url = f"{STRIPE_API_BASE}/{path.lstrip('/') }"
    payload = urlencode({k: str(v) for k, v in (data or {}).items()}).encode("utf-8")
    api_key = get_stripe_api_key()
    headers = {
        "Authorization": basic_auth_header(api_key),
        "Content-Type": "application/x-www-form-urlencoded",
    }
    request = Request(url=url, data=payload if payload else None, headers=headers)
    try:
        with urlopen(request, timeout=30) as response:
            raw = response.read()
            return json.loads(raw.decode("utf-8"))
    except HTTPError as exc:
        content = exc.read().decode("utf-8") if hasattr(exc, "read") else ""
        logger.error("Stripe API HTTPError %s: %s", exc.code, content)
        return {"error": {"status_code": exc.code, "message": content}}
    except URLError as exc:
        logger.error("Stripe API URLError: %s", exc)
        return {"error": {"message": str(exc)}}


def verify_webhook_signature(payload: bytes, sig_header: str, tolerance: int = 300) -> Dict[str, Any]:
    secret = get_stripe_webhook_secret()
    if not sig_header:
        raise ValueError("Missing Stripe signature header")

    values = dict([item.split("=", 1) for item in sig_header.split(",") if "=" in item])
    timestamp = values.get("t")
    expected = values.get("v1")

    if not timestamp or not expected:
        raise ValueError("Invalid Stripe signature header")

    signed_payload = f"{timestamp}.{payload.decode('utf-8')}"
    signature = hmac.new(
        secret.encode("utf-8"), signed_payload.encode("utf-8"), hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(signature, expected):
        raise ValueError("Stripe webhook signature verification failed")

    if abs(int(time.time()) - int(timestamp)) > tolerance:
        raise ValueError("Stripe webhook timestamp outside tolerance")

    return {"ok": True, "timestamp": int(timestamp)}


def create_payment_intent(
    amount_cents: int,
    currency: str = "USD",
    description: str = "",
    metadata: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    payload: Dict[str, Any] = {
        "amount": amount_cents,
        "currency": currency.lower(),
        "payment_method_types[]": "card",
        "description": description,
    }
    if metadata:
        for key, value in metadata.items():
            payload[f"metadata[{key}]"] = value

    logger.info("Creating Stripe payment intent for amount=%s currency=%s", amount_cents, currency)
    return stripe_request("payment_intents", payload)


def reconcile_transactions(limit: int = 50) -> Dict[str, Any]:
    logger.info("Reconciling Stripe transactions, limit=%s", limit)
    response = stripe_request("charges", {"limit": limit})
    if "error" in response:
        return response
    return {
        "status": "ok",
        "count": len(response.get("data", [])),
        "charges": response.get("data", []),
    }
