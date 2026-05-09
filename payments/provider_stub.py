#!/usr/bin/env python3
"""Payment provider stub module."""
import logging
import uuid
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def create_charge(username: str, amount_cents: int, currency: str = 'USD') -> Dict[str, Any]:
    logger.info(f'Creating charge stub for {username} {amount_cents} {currency}')
    txid = f"provider-{int(datetime.utcnow().timestamp() * 1000)}-{uuid.uuid4().hex[:6]}"
    return {'id': txid, 'status': 'settled', 'provider_ref': txid}


def handle_webhook(evt: Dict[str, Any]) -> Dict[str, Any]:
    logger.info('Handling payment webhook stub')
    return {'handled': True, 'event': evt}
#!/usr/bin/env python3
"""Payment provider stub module."""
import logging
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def create_charge(username: str, amount_cents: int, currency: str = 'USD') -> dict:
    logger.info(f'Creating charge stub for {username} {amount_cents} {currency}')
    txid = f"provider-{int(datetime.utcnow().timestamp() * 1000)}-{uuid.uuid4().hex[:6]}"
    return {'id': txid, 'status': 'settled', 'provider_ref': txid}


def handle_webhook(evt: dict) -> dict:
    logger.info('Handling payment webhook stub')
    return {'handled': True, 'event': evt}
