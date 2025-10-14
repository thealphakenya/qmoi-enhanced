#!/usr/bin/env python3
"""
QMOI Enhanced System Environment Setup

This script sets up the complete environment for the QMOI Enhanced System including:
- Directory structure
- Environment variables
- Dependencies installation
- Database initialization
- Configuration files
"""

import os
import sys
import subprocess
import json
from pathlib import Path


def create_directories():
    """Create necessary directories"""
    directories = [
        "employment_letters",
        "logs",
        "reports",
        "models/latest",
        "huggingface_space",
        "data",
        "config",
        "keys",
        "backups",
    ]

    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {directory}")


def create_env_file():
    """Create environment file with necessary variables"""
    env_content = """# QMOI Enhanced System Environment Variables

# Hugging Face Configuration
HUGGINGFACE_TOKEN=your_huggingface_token_here
HUGGINGFACE_MODEL=alphaqmoi/qmoi

# API Keys (Add your actual keys)
OPENAI_API_KEY=your_openai_key_here
AWS_ACCESS_KEY_ID=your_aws_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_here

# Database Configuration
DATABASE_URL=sqlite:///qmoi_enhanced.db

# Revenue Targets
DAILY_REVENUE_TARGET=100000
WEEKLY_REVENUE_TARGET=700000
MONTHLY_REVENUE_TARGET=3000000

# Employment Configuration
DEFAULT_SALARY=5000
PERFORMANCE_BONUS_PERCENTAGE=20

# Platform Configuration
ENABLE_HUGGINGFACE_SPACE=true
ENABLE_WHATSAPP_BOT=true
ENABLE_DISCORD_BOT=true
ENABLE_TELEGRAM_BOT=true

# Security Configuration
ENCRYPTION_KEY=your_encryption_key_here
JWT_SECRET=your_jwt_secret_here

# Monitoring Configuration
ENABLE_HEALTH_MONITORING=true
ENABLE_PERFORMANCE_TRACKING=true
ENABLE_ERROR_REPORTING=true

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=qmoi_enhanced.log

# Development Configuration
DEBUG_MODE=false
TEST_MODE=false
"""

    with open(".env", "w") as f:
        f.write(env_content)
    print("✅ Created .env file")


def install_dependencies():
    """Install required dependencies"""
    requirements_file = "requirements/qmoi_enhanced_requirements.txt"

    if os.path.exists(requirements_file):
        try:
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", "-r", requirements_file]
            )
            print("✅ Dependencies installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install dependencies: {e}")
    else:
        print("⚠️ Requirements file not found")


def create_config_files():
    """Create configuration files"""

    # QMOI configuration
    qmoi_config = {
        "system_name": "QMOI Enhanced System",
        "version": "2.0",
        "daily_revenue_target": 100000,
        "revenue_streams": {
            "animation_movies": {
                "daily_target": 20000,
                "platforms": ["netflix", "disney", "amazon", "youtube"],
            },
            "app_development": {
                "daily_target": 15000,
                "platforms": ["app_store", "google_play", "amazon"],
            },
            "trading_automation": {
                "daily_target": 25000,
                "platforms": ["binance", "coinbase", "kraken"],
            },
            "music_production": {
                "daily_target": 10000,
                "platforms": ["spotify", "apple_music", "soundcloud"],
            },
            "content_creation": {
                "daily_target": 8000,
                "platforms": ["youtube", "tiktok", "instagram"],
            },
            "ai_services": {
                "daily_target": 12000,
                "platforms": ["huggingface", "openai", "aws"],
            },
            "consulting": {
                "daily_target": 10000,
                "platforms": ["linkedin", "upwork", "fiverr"],
            },
        },
        "employment": {
            "default_salary": 5000,
            "performance_bonus_percentage": 20,
            "payment_schedules": ["monthly", "semi_monthly", "weekly", "daily"],
        },
        "platforms": {
            "social_media": ["linkedin", "twitter", "instagram", "tiktok", "facebook"],
            "professional": ["upwork", "fiverr", "freelancer", "guru", "99designs"],
            "content": ["youtube", "medium", "substack", "patreon", "onlyfans"],
            "trading": ["binance", "coinbase", "kraken", "etoro", "robinhood"],
            "music": ["spotify", "apple_music", "soundcloud", "bandcamp", "tidal"],
            "app_stores": [
                "app_store",
                "google_play",
                "amazon_appstore",
                "microsoft_store",
            ],
            "ecommerce": ["amazon", "etsy", "shopify", "ebay", "walmart"],
            "ai_platforms": ["huggingface", "openai", "aws", "azure", "google_cloud"],
        },
    }

    with open("config/qmoi_enhanced_config.json", "w") as f:
        json.dump(qmoi_config, f, indent=2)
    print("✅ Created QMOI configuration file")


def main():
    """Main setup function"""
    print("🚀 Setting up QMOI Enhanced System Environment...")

    # Create directories
    create_directories()

    # Create environment file
    create_env_file()

    # Install dependencies
    install_dependencies()

    # Create configuration files
    create_config_files()

    print("\n✅ QMOI Enhanced System environment setup completed!")
    print("\n📋 Next steps:")
    print("1. Update the .env file with your actual API keys")
    print("2. Run: python scripts/start_qmoi_enhanced.py")
    print("3. Access the system at: http://localhost:7861")


if __name__ == "__main__":
    main()
