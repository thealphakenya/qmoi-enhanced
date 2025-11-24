"""Test automatic environment configuration for QMOI.

This script validates that the environment manager properly handles:
1. Automatic environment variable generation
2. Environment persistence
3. Stripe configuration
"""
import os
from utils.env_manager import setup_environment, get_stripe_config

def test_env_setup():
    """Test environment setup and configuration."""
    print("\nTesting environment setup...")
    
    # Clear any existing environment variables
    for key in ['QMOI_JWT_SECRET', 'QMOI_CONTROL_TOKEN', 'STRIPE_API_KEY', 'STRIPE_WEBHOOK_SECRET']:
        os.environ.pop(key, None)
    
    # Initialize environment
    env = setup_environment()
    
    # Verify environment variables were created
    print("\nChecking environment variables...")
    for key in ['QMOI_JWT_SECRET', 'QMOI_CONTROL_TOKEN', 'STRIPE_API_KEY', 'STRIPE_WEBHOOK_SECRET']:
        value = os.environ.get(key)
        exists = "✓" if value else "✗"
        print(f"{exists} {key}: {'<generated>' if value else 'missing'}")
    
    # Check Stripe configuration
    print("\nChecking Stripe configuration...")
    stripe_config = get_stripe_config()
    print(f"API Key Format: {'sk_test_' in stripe_config['api_key']}")
    print(f"Webhook Secret Format: {'whsec_' in stripe_config['webhook_secret']}")
    print(f"Test Mode: {stripe_config['is_test']}")
    
    # Check .env file creation
    from pathlib import Path
    env_file = Path('.env')
    print(f"\n.env file created: {env_file.exists()}")
    
    print("\nEnvironment setup test complete!")

if __name__ == '__main__':
    test_env_setup()