#!/usr/bin/env python3
"""Webhook processor stub module."""
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class WebhookProcessor:
    def __init__(self, db_conn=None):
        self.conn = db_conn

    def process_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        logger.info('Processing webhook stub')
        return {'status': 'stub', 'payload': payload}
