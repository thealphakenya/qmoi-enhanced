#!/usr/bin/env python3
"""Stripe reconciliation stub."""
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def get_db_connection():
    logger.info('Returning stub DB connection from reconciliation module')
    return None


def reconcile_transactions():
    logger.info('Stub reconcile_transactions called')
    return {'status': 'stub', 'matched': 0}
