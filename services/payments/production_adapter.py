#!/usr/bin/env python3
"""Production payment adapter factory for services.payments."""
import logging
import os
from typing import Any, Dict, Optional

from .sandbox_adapter import SandboxPaymentAdapter
from .stripe_adapter import StripePaymentAdapter

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

SANDBOX_FLAG_VALUES = {"1", "true", "yes", "sandbox"}
ENV_FLAG = os.getenv("PAYMENTS_ENV", "").strip().lower()
USE_SANDBOX_ENV = os.getenv("PAYMENTS_USE_SANDBOX", "").strip().lower()


def _should_use_sandbox(config: Optional[Dict[str, Any]] = None) -> bool:
    config = config or {}
    if config.get("use_sandbox") is not None:
        return bool(config.get("use_sandbox"))

    if config.get("env", "").strip().lower() == "sandbox":
        return True

    if USE_SANDBOX_ENV in SANDBOX_FLAG_VALUES:
        return True

    if ENV_FLAG == "sandbox":
        return True

    return False


def create(config: Optional[Dict[str, Any]] = None) -> Any:
    config = config or {}
    if _should_use_sandbox(config):
        logger.info("Creating sandbox payment adapter.")
        adapter = SandboxPaymentAdapter(config=config)
    else:
        logger.info("Creating Stripe payment adapter.")
        adapter = StripePaymentAdapter(config=config)
    adapter.initialize(config)
    return adapter
