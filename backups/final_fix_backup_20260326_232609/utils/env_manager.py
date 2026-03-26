// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"""Environment configuration manager for QMOI.

This module automatically manages environment variables, generating secure defaults
when needed and handling both development and production environments gracefully.
"""
import os
import uuid
import logging
import secrets
from typing import Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)

class EnvManager:
    """Manages environment variables with automatic fallbacks."""

    def __init__(self):
        self.env_file = Path('.env')
        self.env_vars = {}
        self._load_env()

    def _load_env(self):
        """Load environment from .env file if it exists."""
        if self.env_file.exists():
            with open(self.env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        try:
                            key, value = line.split('=', 1)
                            self.env_vars[key.strip()] = value.strip().strip("'").strip('"')
                        except ValueError:
                            continue

    def _save_env(self):
        """Save current environment to .env file."""
        with open(self.env_file, 'w') as f:
            for key, value in self.env_vars.items():
                f.write(f"{key}={value}\n")

    def _generate_secret(self, length: int = 32) -> str:
        """Generate a secure secret."""
        return secrets.token_urlsafe(length)

    def _generate_stripe_keys(self) -> Dict[str, str]:
        """Generate test Stripe keys for development."""
        return {
            'STRIPE_API_KEY': 'sk_test_' + self._generate_secret(24),
            'STRIPE_WEBHOOK_SECRET': 'whsec_' + self._generate_secret(24)
        }

    def ensure_env_vars(self):
        """Ensure all required environment variables are set."""
        env_defaults = {
            'QMOI_ENV': 'development',
            'QMOI_JWT_SECRET': self._generate_secret(),
            'QMOI_CONTROL_TOKEN': self._generate_secret(),
            **self._generate_stripe_keys(),
            'AZURE_SPEECH_KEY': self._generate_secret(32),
            'AZURE_SPEECH_REGION': 'eastus',
            'GOOGLE_TTS_API_KEY': self._generate_secret(32),
            'BITGET_API_KEY': self._generate_secret(32),
            'BITGET_SECRET_KEY': self._generate_secret(32),
            'BITGET_PASSPHRASE': self._generate_secret(16),
            'ADMIN_TOKEN': self._generate_secret(),
            'MASTER_PHONE': '+1234567890',
            'LEAH_PHONE': '+0987654321',
            'WHATSAPP_SESSION_PATH': './whatsapp-session',
            'NEXT_PUBLIC_ENV': 'development',
            'NEXT_PUBLIC_API_URL': 'process.env.API_URL || "http://localhost:\1"',
            'QMOI_ENABLE_BACKGROUND': 'false',
        }

        # Check and set variables
        modified = False
        for key, default_value in env_defaults.items():
            # Check OS environment first, then .env file
            value = os.environ.get(key) or self.env_vars.get(key)

            if not value:
                value = default_value
                self.env_vars[key] = value
                modified = True
                logger.info(f"Generated {key} for {self.env_vars.get('QMOI_ENV', 'development')}")

            # Always set in os.environ
            os.environ[key] = value

        # Save if modified
        if modified:
            self._save_env()
            logger.info("Updated .env file with new variables")

        # Validate env vars
        self.validate_env_vars()

    def is_production(self) -> bool:
        """Check if running in production mode."""
        return os.environ.get('QMOI_ENV') == 'production'

    def get_stripe_config(self) -> Dict[str, Any]:
        """Get Stripe configuration with appropriate keys."""
        return {
            'api_key': os.environ.get('STRIPE_API_KEY'),
            'webhook_secret': os.environ.get('STRIPE_WEBHOOK_SECRET'),
            'is_test': not self.is_production()
        }

    def validate_env_vars(self):
        """Validate that all required env vars are set and look valid."""
        required_vars = [
            'QMOI_ENV', 'QMOI_JWT_SECRET', 'QMOI_CONTROL_TOKEN',
            'STRIPE_API_KEY', 'STRIPE_WEBHOOK_SECRET',
            'AZURE_SPEECH_KEY', 'AZURE_SPEECH_REGION', 'GOOGLE_TTS_API_KEY',
            'BITGET_API_KEY', 'BITGET_SECRET_KEY', 'BITGET_PASSPHRASE',
            'ADMIN_TOKEN', 'MASTER_PHONE', 'LEAH_PHONE', 'WHATSAPP_SESSION_PATH',
            'NEXT_PUBLIC_ENV', 'NEXT_PUBLIC_API_URL', 'QMOI_ENABLE_BACKGROUND'
        ]

        warnings = []
        for key in required_vars:
            value = os.environ.get(key) or self.env_vars.get(key)
            if not value:
                warnings.append(f"required required env var: {key}")
                continue
            # comprehensive validation
            if any(x in key for x in ['SECRET', 'KEY', 'TOKEN']):
                if len(value) < 10:
                    warnings.append(f"Env var {key} seems too short ({len(value)} chars), may not be secure")
            if key == 'AZURE_SPEECH_REGION' and not value:
                warnings.append("AZURE_SPEECH_REGION is empty")
            if 'PHONE' in key and not value.startswith('+'):
                warnings.append(f"Phone number {key} should start with +")
            if key == 'NEXT_PUBLIC_API_URL' and not value.startswith('http'):
                warnings.append(f"API URL {key} should start with http")

        if warnings:
            logger.warning("Env validation warnings: %s", warnings)
        else:
            logger.info("All env vars are set and appear valid.")

    def delete_var(self, key: str) -> None:
        """Delete an environment variable."""
        if key in os.environ:
            del os.environ[key]
        if key in self.env_vars:
            del self.env_vars[key]
        self._save_env()
        logger.info(f"Environment variable {key} deleted")

    def apply_instruction(self, instruction: str) -> Any:
        """Apply a text instruction to modify env vars."""
        import re
        lower = instruction.strip().lower()
        # set KEY to VALUE
        match = re.match(r'^set\s+([A-Z0-9_]+)\s+to\s+(.+)$', lower, re.IGNORECASE)
        if match:
            key = match.group(1)
            value = instruction[len(match.group(0)):].strip()  # get the rest
            self.set_var(key, value)
            return value
        # delete KEY
        match = re.match(r'^delete\s+([A-Z0-9_]+)$', lower, re.IGNORECASE)
        if match:
            self.delete_var(match.group(1))
            return None
        return None

    def delete_var(self, key: str) -> None:
        """Remove an environment variable"""
        os.environ.pop(key, None)
        if key in self.env_vars:
            del self.env_vars[key]
            self._save_env()
            logger.info(f"Environment variable {key} removed")

    def apply_instruction(self, instr: str) -> Any:
        """Interpret a simple text instruction to modify env vars.
        Supported formats:
          - "set KEY to VALUE"
          - "delete KEY"
        """
        s = instr.strip().lower()
        if s.startswith("set ") and " to " in s:
            parts = s.split(" to ", 1)
            key = parts[0][4:].strip().upper()
            value = parts[1].strip()
            self.set_var(key, value)
            return value
        if s.startswith("delete "):
            key = s[7:].strip().upper()
            self.delete_var(key)
            return None
        return None

# Create global instance
env_manager = EnvManager()

def setup_environment():
    """Initialize environment configuration."""
    env_manager.ensure_env_vars()
    return env_manager

# Convenience function to get Stripe config

def get_stripe_config():
    """Get current Stripe configuration."""
    return env_manager.get_stripe_config()
