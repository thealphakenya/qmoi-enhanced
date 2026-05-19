#!/usr/bin/env python3
"""Validation utilities for QMOI."""
import logging
from typing import Any, Dict, Iterable, List, Optional

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class ValidationSystem:
    def validate(self, data: Dict[str, Any], schema: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        logger.info("Validating payload with optional schema")
        results: Dict[str, Any] = {"valid": True, "errors": []}
        if schema:
            required = schema.get("required", []) if isinstance(schema, dict) else []
            errors = self.validate_required_fields(data, required)
            if errors:
                results["valid"] = False
                results["errors"] = errors
        return results

    def validate_required_fields(self, data: Dict[str, Any], required_fields: Iterable[str]) -> List[str]:
        missing: List[str] = []
        for field in required_fields:
            if field not in data:
                missing.append(field)
        return missing
