#!/usr/bin/env python3
"""Stripe payment adapter for services.payments."""
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


def _get_stripe_api_key(config: Optional[Dict[str, Any]] = None) -> str:
    config = config or {}
    api_key = config.get("stripe_api_key") or os.getenv(STRIPE_API_KEY_ENV)
    if not api_key:
        raise EnvironmentError(
            f"Missing required Stripe environment variable: {STRIPE_API_KEY_ENV}"
        )
    return api_key


def _get_stripe_webhook_secret(config: Optional[Dict[str, Any]] = None) -> str:
    config = config or {}
    secret = config.get("stripe_webhook_secret") or os.getenv(STRIPE_WEBHOOK_SECRET_ENV)
    if not secret:
        raise EnvironmentError(
            f"Missing required Stripe webhook secret environment variable: {STRIPE_WEBHOOK_SECRET_ENV}"
        )
    return secret


def _basic_auth_header(api_key: str) -> str:
    token = base64.b64encode(f"{api_key}:".encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def _stripe_request(
    path: str,
    data: Optional[Dict[str, Any]] = None,
    method: str = "POST",
    api_key: Optional[str] = None,
) -> Dict[str, Any]:
    api_key = api_key or _get_stripe_api_key()
    url = f"{STRIPE_API_BASE}/{path.lstrip('/')}"
    payload: Dict[str, Any] = {k: str(v) for k, v in (data or {}).items()}
    request_data = None

    if method.upper() == "GET":
        if payload:
            url = f"{url}?{urlencode(payload)}"
    else:
        request_data = urlencode(payload).encode("utf-8")

    headers = {
        "Authorization": _basic_auth_header(api_key),
        "Content-Type": "application/x-www-form-urlencoded",
    }
    request = Request(url=url, data=request_data, headers=headers, method=method.upper())

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


def verify_webhook_signature(
    payload: bytes,
    sig_header: str,
    tolerance: int = 300,
    config: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    secret = _get_stripe_webhook_secret(config)
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


class StripePaymentAdapter:
    def __init__(self, config: Optional[Dict[str, Any]] = None) -> None:
        self.config = config or {}
        self.api_key = _get_stripe_api_key(self.config)
        self.webhook_secret = self.config.get("stripe_webhook_secret")

    def initialize(self, config: Optional[Dict[str, Any]] = None) -> bool:
        self.config.update(config or {})
        self.api_key = _get_stripe_api_key(self.config)
        self.webhook_secret = self.config.get("stripe_webhook_secret") or os.getenv(STRIPE_WEBHOOK_SECRET_ENV)
        logger.info("Initialized Stripe payment adapter")
        return True

    def charge(
        self,
        customer_id: Optional[str],
        amount_cents: int,
        currency: str = "USD",
        payment_method_id: Optional[str] = None,
        description: str = "Purchase",
        metadata: Optional[Dict[str, str]] = None,
        confirm: bool = True,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "amount": amount_cents,
            "currency": currency.lower(),
            "description": description,
            "payment_method_types[]": "card",
        }
        if customer_id:
            payload["customer"] = customer_id
        if payment_method_id:
            payload["payment_method"] = payment_method_id
            payload["confirm"] = "true" if confirm else "false"
        if metadata:
            for key, value in metadata.items():
                payload[f"metadata[{key}]"] = value

        logger.info(
            "Creating Stripe payment intent amount=%s currency=%s customer=%s",
            amount_cents,
            currency,
            customer_id,
        )
        return _stripe_request("payment_intents", payload, api_key=self.api_key)

    def refund(
        self,
        transaction_id: str,
        amount_cents: Optional[int] = None,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {"charge": transaction_id}
        if amount_cents is not None:
            payload["amount"] = amount_cents

        logger.info("Issuing Stripe refund for charge=%s amount=%s", transaction_id, amount_cents)
        return _stripe_request("refunds", payload, api_key=self.api_key)

    def reconcile(self, limit: int = 50) -> Dict[str, Any]:
        logger.info("Reconciling Stripe charges, limit=%s", limit)
        return _stripe_request("charges", {"limit": limit}, method="GET", api_key=self.api_key)

    def verify_event(
        self,
        payload: bytes,
        sig_header: str,
        tolerance: int = 300,
    ) -> Dict[str, Any]:
        return verify_webhook_signature(payload, sig_header, tolerance, config=self.config)


def create(config: Optional[Dict[str, Any]] = None) -> StripePaymentAdapter:
    adapter = StripePaymentAdapter(config=config)
    adapter.initialize(config)
    return adapter
