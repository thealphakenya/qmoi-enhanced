"""Simple payments provider stub for local simulations.

This module provides a pluggable interface that real provider adapters (Stripe,
M-Pesa, etc.) should implement. For now it only simulates immediate
settlement.
"""
import uuid
import datetime


def create_charge(username: str, amount_cents: int, currency: str = 'USD') -> dict:
    """Simulate creating a charge with an external provider.

    Returns a dict with keys: id, status, provider_ref
    Status: 'pending' or 'settled'
    """
    txid = f"provider-{int(datetime.datetime.utcnow().timestamp()*1000)}-{uuid.uuid4().hex[:6]}"
    return {'id': txid, 'status': 'settled', 'provider_ref': txid}


def handle_webhook(evt: dict) -> dict:
    """Simulate handling a webhook event from a provider.

    Returns a dict describing action taken (for tests).
    """
    # echo back for now
    return {'handled': True, 'event': evt}
