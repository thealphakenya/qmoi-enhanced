#!/usr/bin/env python3
"""
Comprehensive credential validator for all wallet systems.
Validates and tests credentials for Bitget, Cashon/PayPal, and Megavault.
"""
import os
import json
import hmac
import time
import base64
import hashlib
import asyncio
import aiohttp
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, List

# Setup logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("credential_validator")

# Constants
ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / '.qmoi_validation'
VALIDATION_DIR.mkdir(parents=True, exist_ok=True)


class CredentialValidator:
    """Validates credentials for all wallet systems."""

    def __init__(self):
        """Initialize validator with API endpoints."""
        self.bitget_api = "https://api.bitget.com"
        self.paypal_api = {
            'sandbox': 'https://api.sandbox.paypal.com',
            'live': 'https://api.paypal.com'
        }
        self.megavault_api = os.getenv('MEGAVAULT_API_URL')

        # Load configurations
        self.load_configurations()

    def load_configurations(self):
        """Load all configurations and credentials."""
        # Bitget credentials
        self.bitget_config = {
            'api_key': os.getenv('BITGET_API_KEY'),
            'api_secret': os.getenv('BITGET_API_SECRET') or os.getenv('BITGET_SECRET_KEY'),
            'passphrase': os.getenv('BITGET_API_PASSPHRASE') or os.getenv('BITGET_PASSPHRASE')
        }

        # PayPal credentials
        self.paypal_config = {
            'client_id': os.getenv('PAYPAL_CLIENT_ID') or os.getenv('PAYPAL_API_KEY') or os.getenv('PESAPAL_CONSUMER_KEY'),
            'client_secret': os.getenv('PAYPAL_CLIENT_SECRET') or os.getenv('PAYPAL_API_SECRET') or os.getenv('PESAPAL_CONSUMER_SECRET'),
            'mode': os.getenv('PAYPAL_MODE') or os.getenv('PAYPAL_ENVIRONMENT') or 'sandbox',
            'callback_url': os.getenv('PAYPAL_CALLBACK_URL', 'https://qmoi.ai/callback'),
            'ipn_url': os.getenv('PAYPAL_IPN_URL', 'https://qmoi.ai/ipn')
        }

        # Megavault credentials
        self.megavault_config = {
            'api_key': os.getenv('MEGAVAULT_API_KEY'),
            'api_url': self.megavault_api
        }

    def sign_bitget_request(self, timestamp: str, method: str,
                            request_path: str, body: str = "") -> str:
        """Sign a Bitget API request."""
        message = timestamp + method.upper() + request_path + body
        mac = hmac.new(
            bytes(self.bitget_config['api_secret'], encoding='utf8'),
            bytes(message, encoding='utf-8'),
            digestmod='sha256'
        )
        return base64.b64encode(mac.digest()).decode()

    async def validate_bitget(self) -> Dict[str, Any]:
        """Validate Bitget credentials."""
        if not all(self.bitget_config.values()):
            return {
                'valid': False,
                'error': 'Missing Bitget credentials',
                'timestamp': datetime.utcnow().isoformat()
            }

        try:
            timestamp = str(int(time.time() * 1000))
            sign = self.sign_bitget_request(
                timestamp, "GET", "/api/spot/v1/account/getInfo"
            )

            headers = {
                "ACCESS-KEY": self.bitget_config['api_key'],
                "ACCESS-SIGN": sign,
                "ACCESS-TIMESTAMP": timestamp,
                "ACCESS-PASSPHRASE": self.bitget_config['passphrase']
            }

            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.bitget_api}/api/spot/v1/account/getInfo",
                    headers=headers
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return {
                            'valid': True,
                            'response': result,
                            'timestamp': datetime.utcnow().isoformat()
                        }
                    else:
                        error_text = await response.text()
                        return {
                            'valid': False,
                            'error': f'API Error: {error_text}',
                            'status': response.status,
                            'timestamp': datetime.utcnow().isoformat()
                        }

        except Exception as e:
            return {
                'valid': False,
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }

    async def validate_paypal(self) -> Dict[str, Any]:
        """Validate PayPal/Cashon credentials."""
        if not (self.paypal_config['client_id'] and
                self.paypal_config['client_secret']):
            return {
                'valid': False,
                'error': 'Missing PayPal credentials',
                'timestamp': datetime.utcnow().isoformat()
            }

        try:
            base_url = self.paypal_api[self.paypal_config['mode']
                                       if self.paypal_config['mode'] in self.paypal_api else 'sandbox']

            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{base_url}/v1/oauth2/token",
                    data={'grant_type': 'client_credentials'},
                    auth=aiohttp.BasicAuth(self.paypal_config['client_id'], self.paypal_config['client_secret']),
                    headers={'Accept': 'application/json'}
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return {
                            'valid': True,
                            'response': result,
                            'timestamp': datetime.utcnow().isoformat()
                        }
                    else:
                        error_text = await response.text()
                        return {
                            'valid': False,
                            'error': f'API Error: {error_text}',
                            'status': response.status,
                            'timestamp': datetime.utcnow().isoformat()
                        }

        except Exception as e:
            return {
                'valid': False,
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }

    async def validate_megavault(self) -> Dict[str, Any]:
        """Validate Megavault credentials."""
        if not (self.megavault_config['api_key'] and
                self.megavault_config['api_url']):
            return {
                'valid': False,
                'error': 'Missing Megavault credentials',
                'timestamp': datetime.utcnow().isoformat()
            }

        try:
            headers = {
                'X-API-Key': self.megavault_config['api_key'],
                'Content-Type': 'application/json'
            }

            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.megavault_config['api_url']}/v1/account/status",
                    headers=headers
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return {
                            'valid': True,
                            'response': result,
                            'timestamp': datetime.utcnow().isoformat()
                        }
                    else:
                        error_text = await response.text()
                        return {
                            'valid': False,
                            'error': f'API Error: {error_text}',
                            'status': response.status,
                            'timestamp': datetime.utcnow().isoformat()
                        }

        except Exception as e:
            return {
                'valid': False,
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }

    async def validate_all(self) -> Dict[str, Any]:
        """Validate all credentials and generate a report."""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'bitget': await self.validate_bitget(),
            'paypal': await self.validate_paypal(),
            'megavault': await self.validate_megavault(),
            'overall_status': 'validating'
        }

        # Calculate overall status
        valid_count = sum(
            1 for k, v in results.items()
            if k != 'timestamp' and k != 'overall_status' and v.get('valid', False)
        )
        total_services = 3  # Bitget, PayPal, Megavault

        results['overall_status'] = 'valid' if valid_count == total_services else 'invalid'

        # Save validation report
        report_file = VALIDATION_DIR / 'credential_validation.json'
        report_file.write_text(json.dumps(results, indent=2))

        # Log validation results
        logger.info(f"Validation complete - Overall status: {results['overall_status']}")
        logger.info(f"Valid credentials: {valid_count}/{total_services}")

        for service, result in results.items():
            if service not in ('timestamp', 'overall_status'):
                status = '✅' if result.get('valid') else '❌'
                logger.info(f"{service}: {status}")
                if not result.get('valid'):
                    logger.error(f"{service} error: {result.get('error')}")

        return results


async def main():
    """Main entry point."""
    validator = CredentialValidator()
    results = await validator.validate_all()

    # Check if any credentials are invalid
    if results['overall_status'] == 'invalid':
        logger.error("⚠️ Some credentials are invalid or missing!")
        for service, result in results.items():
            if service not in ('timestamp', 'overall_status') and not result.get('valid'):
                logger.error(f"❌ {service}: {result.get('error')}")
    else:
        logger.info("✅ All credentials are valid!")

if __name__ == "__main__":
    asyncio.run(main())
