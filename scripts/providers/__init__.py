"""QMOI Provider API.

Exposes DNS and infrastructure provider interfaces. Each provider implements
the ProviderBase abstract class for consistent behavior around logging,
dry-run safety, and error handling.

All operations are dry-run by default and require QMOI_PROVISION_DNS=1 to apply changes.
Each provider requires its own specific API credentials set as environment variables.
All provider operations are logged to `.qmoi_validation/provider_calls.log`.
"""
from __future__ import annotations

from .provider_base import ProviderBase, ProviderError
from .aws_route53 import Route53Provider
from .cloudflare import CloudflareProvider
from .netlify import NetlifyProvider

__all__ = [
    'ProviderBase',
    'ProviderError',
    'Route53Provider',
    'CloudflareProvider',
    'NetlifyProvider',
]

# Provider API version
VERSION = '1.0.0'
