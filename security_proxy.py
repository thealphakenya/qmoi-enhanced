#!/usr/bin/env python3
"""Security proxy validation helper for QMOI."""
import logging
import os
from urllib.parse import urlparse

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


def validate_config(proxy_url: str | None = None) -> bool:
    proxy_url = proxy_url or os.environ.get('HTTPS_PROXY') or os.environ.get('HTTP_PROXY')
    if not proxy_url:
        logger.warning('No proxy configuration detected.')
        return False

    parsed = urlparse(proxy_url)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname:
        logger.error('Invalid proxy URL: %s', proxy_url)
        return False
    logger.info('Proxy configuration is valid: %s', proxy_url)
    return True
