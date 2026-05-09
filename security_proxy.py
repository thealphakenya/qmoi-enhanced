#!/usr/bin/env python3
"""Security proxy stub module."""
import logging
import os

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def validate_config() -> bool:
    return True
