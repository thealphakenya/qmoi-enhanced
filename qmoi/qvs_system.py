#!/usr/bin/env python3
"""Quality validation system for QMOI."""
import logging
from typing import Any, Dict, Optional

from .validation_system import ValidationSystem

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class QvsSystem:
    def __init__(self, config: Optional[Dict[str, Any]] = None) -> None:
        self.config = config or {}
        self.validator = ValidationSystem()

    def validate(self, payload: Dict[str, Any], schema: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        logger.info("Running QVS validation")
        return self.validator.validate(payload, schema)
