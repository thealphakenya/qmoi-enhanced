#!/usr/bin/env python3
"""Stripe adapter stub module."""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def verify_webhook_signature(payload: bytes, sig_header: str) -> Dict[str, Any]:
    logger.info('Stripe webhook verification stub called')
    return {'ok': True, 'event': {}}


def reconcile_transactions() -> Dict[str, Any]:
    logger.info('Stripe reconciliation stub called')
    return {'status': 'stub'}
