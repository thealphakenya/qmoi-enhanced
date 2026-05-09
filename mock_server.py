#!/usr/bin/env python3
"""Mock server stub."""
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def run_mock_server():
    logger.info('Mock server stub running')
