#!/usr/bin/env python3
"""PA stub module."""
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def ensure_download_directory() -> None:
    logger.info('Ensuring download directory exists')
