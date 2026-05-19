#!/usr/bin/env python3
"""Payment reconciliation implementation powered by Stripe."""
import logging
from typing import Dict, Any

from payments.stripe_adapter import reconcile_transactions as stripe_reconcile_transactions

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def get_db_connection():
    raise EnvironmentError(
        "Database reconciliation is not configured. Set up DATABASE_URL and a supported DB driver to enable reconciliation."
    )


def reconcile_transactions(limit: int = 50) -> Dict[str, Any]:
    logger.info("Reconciling payment transactions against Stripe")
    return stripe_reconcile_transactions(limit=limit)
