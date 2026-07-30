#!/usr/bin/env python3
"""
Enhanced credentials management system for QMOI trading wallets.
Implements secure credential storage, rotation, and monitoring.
"""
from pathlib import Path
import json
import os
import time
from datetime import datetime
import hmac
import hashlib
import base64
from typing import Dict, Any, Optional
import logging
from cryptography.fernet import Fernet
import yaml

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("wallet_credentials")


class CredentialManager:
    """Secure credential management for trading wallets."""

    def __init__(self, root: Path | None = None):
        self.root = root or Path(__file__).resolve().parents[1]
        self.validation_dir = self.root / ".qmoi_validation"
        self.validation_dir.mkdir(exist_ok=True)

        # Initialize encryption
        self.encryption_key = self._get_or_create_key()
        self.fernet = Fernet(self.encryption_key)

        # Load credentials and keep them synced with environment data.
        self.credentials = self._load_credentials()
        self._merge_environment_updates()

    def sync_environment(self) -> None:
        """Refresh stored credentials from environment variables."""
        self._merge_environment_updates()

    def _get_or_create_key(self) -> bytes:
        """Get or create encryption key."""
        key_file = self.validation_dir / "credential.key"
        if key_file.exists():
            return key_file.read_bytes()

        key = Fernet.generate_key()
        key_file.write_bytes(key)
        return key

    def _load_environment_credentials(self) -> Dict[str, Any]:
        """Load credential values from environment variables."""
        return {
            "bitget": {
                "api_key": os.environ.get("BITGET_API_KEY", ""),
                "api_secret": os.environ.get("BITGET_API_SECRET", "") or os.environ.get("BITGET_SECRET_KEY", ""),
                "passphrase": os.environ.get("BITGET_API_PASSPHRASE", ""),
                "source": "environment",
                "last_synced": datetime.utcnow().isoformat(),
                "status": "active",
            },
            "cashon": {
                "consumer_key": os.environ.get("PESAPAL_CONSUMER_KEY", ""),
                "consumer_secret": os.environ.get("PESAPAL_CONSUMER_SECRET", ""),
                "environment": os.environ.get("PESAPAL_ENVIRONMENT", "sandbox"),
                "callback_url": os.environ.get("PESAPAL_CALLBACK_URL", ""),
                "ipn_url": os.environ.get("PESAPAL_IPN_URL", ""),
                "source": "environment",
                "last_synced": datetime.utcnow().isoformat(),
                "status": "active",
            },
            "megavault": {
                "api_key": os.environ.get("MEGAVAULT_API_KEY", ""),
                "api_url": os.environ.get("MEGAVAULT_API_URL", ""),
                "source": "environment",
                "last_synced": datetime.utcnow().isoformat(),
                "status": "active",
            }
        }

    def _load_credentials(self) -> Dict[str, Any]:
        """Load encrypted credentials."""
        cred_file = self.validation_dir / "credentials.enc"
        if not cred_file.exists():
            return self._initialize_credentials()

        try:
            encrypted_data = cred_file.read_bytes()
            decrypted_data = self.fernet.decrypt(encrypted_data)
            return json.loads(decrypted_data)
        except Exception as e:
            logger.error(f"Failed to load credentials: {e}")
            return self._initialize_credentials()

    def _initialize_credentials(self) -> Dict[str, Any]:
        """Initialize credential structure from environment."""
        creds = self._load_environment_credentials()

        # Ensure each provider record contains metadata fields.
        for provider, data in creds.items():
            data.setdefault("last_rotation", datetime.utcnow().isoformat())
            data.setdefault("status", "active")
            data.setdefault("source", "environment")
            data.setdefault("last_synced", datetime.utcnow().isoformat())

        # Save encrypted credentials
        self._save_credentials(creds)
        return creds

    def _save_credentials(self, creds: Dict[str, Any]):
        """Save encrypted credentials."""
        cred_file = self.validation_dir / "credentials.enc"
        encrypted_data = self.fernet.encrypt(json.dumps(creds).encode())
        cred_file.write_bytes(encrypted_data)

    def _merge_environment_updates(self) -> None:
        """Merge environment vars into stored credentials during load."""
        env_creds = self._load_environment_credentials()
        updated = False
        for wallet, env_data in env_creds.items():
            stored = self.credentials.get(wallet, {})
            merged = {**stored, **{k: v for k, v in env_data.items() if v}}
            if merged != stored:
                merged["last_synced"] = datetime.utcnow().isoformat()
                merged["source"] = "environment"
                self.credentials[wallet] = merged
                updated = True
        if updated:
            self._save_credentials(self.credentials)

    def require_live_credentials(self, wallet: str) -> None:
        """Ensure required live credentials are present before write or use."""
        if wallet not in self.credentials:
            raise ValueError(f"Unknown wallet: {wallet}")
        creds = self.credentials[wallet]
        required_fields = {
            "bitget": ["api_key", "api_secret", "passphrase"],
            "cashon": ["consumer_key", "consumer_secret"],
            "megavault": ["api_key", "api_url"]
        }
        missing = [field for field in required_fields.get(wallet, []) if not creds.get(field)]
        if missing:
            raise ValueError(
                f"Missing required live credentials for {wallet}: {', '.join(missing)}"
            )

    def get_credentials(self, wallet: str) -> Optional[Dict[str, str]]:
        """Get credentials for a specific wallet."""
        if wallet not in self.credentials:
            return None

        creds = self.credentials[wallet]
        if creds["status"] != "active":
            logger.warning(f"Wallet {wallet} credentials are not active")
            return None

        return {k: v for k, v in creds.items()
                if k not in ["last_rotation", "status", "source", "last_synced"]}

    def rotate_credentials(self, wallet: str):
        """Rotate credentials for a wallet."""
        if wallet not in self.credentials:
            raise ValueError(f"Unknown wallet: {wallet}")

        # Implement actual credential rotation here
        # This would involve API calls to the respective platforms
        self.credentials[wallet]["last_rotation"] = datetime.utcnow().isoformat()
        self._save_credentials(self.credentials)

    def validate_credentials(self, wallet: str) -> Dict[str, Any]:
        """Validate credentials for a wallet."""
        if wallet not in self.credentials:
            return {"valid": False, "error": "Unknown wallet"}

        creds = self.credentials[wallet]
        issues = []

        # Check required fields
        required_fields = {
            "bitget": ["api_key", "api_secret", "passphrase"],
            "cashon": ["consumer_key", "consumer_secret"],
            "megavault": ["api_key", "api_url"]
        }

        for field in required_fields.get(wallet, []):
            if not creds.get(field):
                issues.append(f"Missing {field}")

        # Check credential age
        last_rotation = datetime.fromisoformat(
            creds.get("last_rotation", creds.get("last_synced", datetime.utcnow().isoformat())))
        age_days = (datetime.utcnow() - last_rotation).days
        if age_days > 30:
            issues.append(f"Credentials are {age_days} days old")

        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "age_days": age_days,
            "status": creds["status"],
            "source": creds.get("source", "unknown"),
            "last_synced": creds.get("last_synced")
        }


class WalletCredentialMonitor:
    """Monitor and maintain wallet credentials."""

    def __init__(self):
        self.credential_manager = CredentialManager()
        self.config = self._load_config()

    def _load_config(self) -> Dict[str, Any]:
        """Load monitoring configuration."""
        config_file = Path(__file__).resolve().parents[1] / \
            ".qmoi_validation" / "credential_monitor.yaml"

        default_config = {
            "check_interval": 3600,  # 1 hour
            "max_credential_age": 30,  # days
            "alert_thresholds": {
                "validation_failures": 3,
                "rotation_failures": 2
            },
            "monitoring": {
                "enabled": True,
                "log_level": "INFO",
                "alert_channels": ["log"]
            }
        }

        if config_file.exists():
            with open(config_file) as f:
                return {**default_config, **yaml.safe_load(f)}

        # Save default config
        with open(config_file, "w") as f:
            yaml.dump(default_config, f)

        return default_config

    def start_monitoring(self):
        """Start credential monitoring."""
        while True:
            try:
                self._check_credentials()
                time.sleep(self.config["check_interval"])
            except Exception as e:
                logger.error(f"Monitoring error: {e}")
                time.sleep(60)

    def _check_credentials(self):
        """Check all wallet credentials."""
        for wallet in ["bitget", "cashon", "megavault"]:
            validation = self.credential_manager.validate_credentials(wallet)

            if not validation["valid"]:
                logger.warning(
                    f"Credential issues for {wallet}: {validation['issues']}"
                )

            if validation["age_days"] >= self.config["max_credential_age"]:
                try:
                    self.credential_manager.rotate_credentials(wallet)
                    logger.info(f"Rotated credentials for {wallet}")
                except Exception as e:
                    logger.error(f"Failed to rotate {wallet} credentials: {e}")


def main():
    """Main entry point."""
    monitor = WalletCredentialMonitor()
    logger.info("Starting credential monitoring")
    monitor.start_monitoring()


if __name__ == "__main__":
    main()
