"""Lightweight Telco adapter interfaces and stubs.

This module defines a small TelcoAdapter interface and three provider stubs
for Safaricom, Telkom and Airtel. Implementations should live in a separate
module and be wired from configuration (env or secrets manager).

The stubs are intentionally non-networking and raise NotImplementedError so
they're safe to import during tests and CI.
"""
from typing import Dict, Any
import os


class TelcoAdapter:
    """Abstract adapter contract for telco providers.

    Methods should raise exceptions on permanent failure and return provider
    specific dict payloads on success.
    """

    def send_sms(self, msisdn: str, message: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Send an SMS to a mobile number.

        Returns provider response payload.
        """
        raise NotImplementedError()

    def charge_msisdn(self, msisdn: str, amount_cents: int, currency: str = "KES") -> Dict[str, Any]:
        """Charge (push) a payment request to a mobile number.

        For MPESA-like flows this may initiate a STK Push and return a transaction id.
        """
        raise NotImplementedError()

    def verify_callback(self, payload: Dict[str, Any]) -> bool:
        """Verify incoming webhook/callback authenticity from the provider."""
        raise NotImplementedError()


class SafaricomAdapter(TelcoAdapter):
    """Stub adapter for Safaricom (MPESA) integrations.

    Expected env/secret keys (example):
      SAFARICOM_CONSUMER_KEY
      SAFARICOM_CONSUMER_SECRET
      SAFARICOM_SHORTCODE
      SAFARICOM_PASSKEY
    """

    def __init__(self):
        self.consumer_key = os.environ.get("SAFARICOM_CONSUMER_KEY")
        self.consumer_secret = os.environ.get("SAFARICOM_CONSUMER_SECRET")
        # keep this intentionally minimal — real implementation belongs in a secure module

    def send_sms(self, msisdn: str, message: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        raise NotImplementedError("SafaricomAdapter.send_sms is a stub; implement provider integration")

    def charge_msisdn(self, msisdn: str, amount_cents: int, currency: str = "KES") -> Dict[str, Any]:
        raise NotImplementedError("SafaricomAdapter.charge_msisdn is a stub; implement MPESA STK push")

    def verify_callback(self, payload: Dict[str, Any]) -> bool:
        raise NotImplementedError("SafaricomAdapter.verify_callback is a stub")


class TelkomAdapter(TelcoAdapter):
    """Stub adapter for Telkom provider (placeholder)."""

    def send_sms(self, msisdn: str, message: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        raise NotImplementedError("TelkomAdapter.send_sms is a stub")

    def charge_msisdn(self, msisdn: str, amount_cents: int, currency: str = "KES") -> Dict[str, Any]:
        raise NotImplementedError("TelkomAdapter.charge_msisdn is a stub")

    def verify_callback(self, payload: Dict[str, Any]) -> bool:
        raise NotImplementedError("TelkomAdapter.verify_callback is a stub")


class AirtelAdapter(TelcoAdapter):
    """Stub adapter for Airtel provider (placeholder)."""

    def send_sms(self, msisdn: str, message: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        raise NotImplementedError("AirtelAdapter.send_sms is a stub")

    def charge_msisdn(self, msisdn: str, amount_cents: int, currency: str = "KES") -> Dict[str, Any]:
        raise NotImplementedError("AirtelAdapter.charge_msisdn is a stub")

    def verify_callback(self, payload: Dict[str, Any]) -> bool:
        raise NotImplementedError("AirtelAdapter.verify_callback is a stub")


# Helper: lightweight factory (can be extended to read config)
def get_adapter(name: str) -> TelcoAdapter:
    name = (name or "").strip().lower()
    if name == "safaricom":
        return SafaricomAdapter()
    if name == "telkom":
        return TelkomAdapter()
    if name == "airtel":
        return AirtelAdapter()
    raise ValueError(f"Unknown telco adapter: {name}")
