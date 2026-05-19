#!/usr/bin/env python3
"""Payments adapters package for production and sandbox payment flows."""
import logging

from . import production_adapter
from .sandbox_adapter import SandboxPaymentAdapter
from .stripe_adapter import StripePaymentAdapter

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

__all__ = ["production_adapter", "SandboxPaymentAdapter", "StripePaymentAdapter"]
