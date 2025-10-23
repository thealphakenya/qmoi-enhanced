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
            **self._generate_stripe_keys()
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