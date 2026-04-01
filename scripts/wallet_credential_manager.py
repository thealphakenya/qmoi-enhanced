# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:54Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Enhanced credentials management system for QMOI trading wallets.
Implements secure credential storage, rotation, and monitoring.
"""
from pathlib import Path
import argparse
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
    
    def __init__(self):
        self.root = Path(__file__).resolve().parents[1]
        self.validation_dir = self.root / ".qmoi_validation"
        self.validation_dir.mkdir(exist_ok=True)
        
        # Initialize encryption
        self.encryption_key = self._get_or_create_key()
        self.fernet = Fernet(self.encryption_key)
        
        # Load credentials
        self.credentials = self._load_credentials()
        
    def _get_or_create_key(self) -> bytes:
        """Get or create encryption key."""
        key_file = self.validation_dir / "credential.key"
        if key_file.exists():
            return key_file.read_bytes()
        
        key = Fernet.generate_key()
        key_file.write_bytes(key)
        return key
    
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
        creds = {
            "bitget": {
                "api_key": os.environ.get("BITGET_API_KEY", ""),
                "api_secret": os.environ.get("BITGET_API_SECRET", ""),
                "passphrase": os.environ.get("BITGET_API_PASSPHRASE", ""),
                "last_rotation": datetime.utcnow().isoformat(),
                "status": "active"
            },
            "cashon": {
                "consumer_key": os.environ.get("PESAPAL_CONSUMER_KEY", ""),
                "consumer_secret": os.environ.get("PESAPAL_CONSUMER_SECRET", ""),
                "environment": os.environ.get("PESAPAL_ENVIRONMENT", "production"),
                "callback_url": os.environ.get("PESAPAL_CALLBACK_URL", ""),
                "ipn_url": os.environ.get("PESAPAL_IPN_URL", ""),
                "last_rotation": datetime.utcnow().isoformat(),
                "status": "active"
            },
            "megavault": {
                "api_key": os.environ.get("MEGAVAULT_API_KEY", ""),
                "api_url": os.environ.get("MEGAVAULT_API_URL", ""),
                "last_rotation": datetime.utcnow().isoformat(),
                "status": "active"
            }
        }
        
        # Save encrypted credentials
        self._save_credentials(creds)
        return creds
    
    def _save_credentials(self, creds: Dict[str, Any]):
        """Save encrypted credentials."""
        cred_file = self.validation_dir / "credentials.enc"
        encrypted_data = self.fernet.encrypt(json.dumps(creds).encode())
        cred_file.write_bytes(encrypted_data)
    
    def get_credentials(self, wallet: str) -> Optional[Dict[str, str]]:
        """Get credentials for a specific wallet."""
        if wallet not in self.credentials:
            return None
        
        creds = self.credentials[wallet]
        if creds["status"] != "active":
            logger.warning(f"Wallet {wallet} credentials are not active")
            return None
        
        return {k: v for k, v in creds.items() 
                if k not in ["last_rotation", "status"]}
    
    def rotate_credentials(self, wallet: str, force: bool = False) -> Dict[str, Any]:
        """Rotate credentials for a wallet using environment values."""
        if wallet not in self.credentials:
            raise ValueError(f"Unknown wallet: {wallet}")

        env_map = self._wallet_rotation_env_map(wallet)
        if not env_map:
            raise ValueError(f"No rotation mapping defined for wallet {wallet}")

        updated_fields = []
        for field, env_key in env_map.items():
            env_value = os.environ.get(env_key, "").strip()
            current_value = self.credentials[wallet].get(field, "")

            if env_value:
                if env_value != current_value or force:
                    self.credentials[wallet][field] = env_value
                    updated_fields.append(field)
            elif force and current_value:
                # Force rotation can refresh the current stored value
                updated_fields.append(field)

        if not updated_fields and not force:
            logger.info(
                "No new environment credentials detected for %s; rotation not performed.",
                wallet,
            )
            return {
                "wallet": wallet,
                "rotated": False,
                "updated_fields": [],
                "reason": "no_environment_updates"
            }

        self.credentials[wallet]["last_rotation"] = datetime.utcnow().isoformat()
        self.credentials[wallet]["status"] = "active"
        self._save_credentials(self.credentials)

        logger.info(
            "Credentials rotated for %s. Updated fields: %s",
            wallet,
            updated_fields,
        )
        return {
            "wallet": wallet,
            "rotated": bool(updated_fields),
            "updated_fields": updated_fields,
            "last_rotation": self.credentials[wallet]["last_rotation"]
        }

    def _wallet_rotation_env_map(self, wallet: str) -> Dict[str, str]:
        """Return environment variable mappings for wallet rotation."""
        mapping = {
            "bitget": {
                "api_key": "BITGET_API_KEY",
                "api_secret": "BITGET_API_SECRET",
                "passphrase": "BITGET_API_PASSPHRASE",
            },
            "cashon": {
                "consumer_key": "PESAPAL_CONSUMER_KEY",
                "consumer_secret": "PESAPAL_CONSUMER_SECRET",
                "callback_url": "PESAPAL_CALLBACK_URL",
                "ipn_url": "PESAPAL_IPN_URL",
            },
            "megavault": {
                "api_key": "MEGAVAULT_API_KEY",
                "api_url": "MEGAVAULT_API_URL",
            },
        }
        return mapping.get(wallet, {})

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
                issues.append(f"required {field}")
        
        # Check credential age
        last_rotation = datetime.fromisoformat(creds["last_rotation"])
        age_days = (datetime.utcnow() - last_rotation).days
        if age_days > 30:
            issues.append(f"Credentials are {age_days} days old")
        
        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "age_days": age_days,
            "status": creds["status"]
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
                    result = self.credential_manager.rotate_credentials(wallet)
                    if result.get("rotated"):
                        logger.info(f"Rotated credentials for {wallet}")
                    else:
                        logger.info(
                            f"No new environment credentials found for {wallet}; rotation skipped."
                        )
                except Exception as e:
                    logger.error(f"Failed to rotate {wallet} credentials: {e}")

def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="QMOI Wallet Credential Rotation and Monitoring"
    )
    parser.add_argument(
        "--status",
        action="store_true",
        help="Show credential validation state for all wallets",
    )
    parser.add_argument(
        "--wallet",
        choices=["bitget", "cashon", "megavault"],
        help="Target wallet for rotation or status checks",
    )
    parser.add_argument(
        "--rotate",
        action="store_true",
        help="Rotate credentials for the selected wallet or all wallets",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Apply credential rotation to all supported wallets",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force rotation even if environment values have not changed",
    )
    parser.add_argument(
        "--monitor",
        action="store_true",
        help="Start continuous credential monitoring",
    )
    return parser.parse_args()


def main():
    """Main entry point."""
    manager = CredentialManager()
    args = _parse_args()

    if args.status:
        wallets = [args.wallet] if args.wallet else list(manager.credentials.keys())
        for wallet in wallets:
            validation = manager.validate_credentials(wallet)
            print(f"{wallet}: {validation}")
        return

    if args.rotate:
        if args.all:
            results = []
            for wallet in manager.credentials.keys():
                result = manager.rotate_credentials(wallet, force=args.force)
                results.append(result)
            print(json.dumps(results, indent=2))
            return

        if not args.wallet:
            print("Error: specify --wallet or --all when using --rotate")
            return

        result = manager.rotate_credentials(args.wallet, force=args.force)
        print(json.dumps(result, indent=2))
        return

    if args.monitor:
        monitor = WalletCredentialMonitor()
        logger.info("Starting credential monitoring")
        monitor.start_monitoring()
        return

    print("No action specified. Use --status, --rotate, or --monitor.")

if __name__ == "__main__":
    main()