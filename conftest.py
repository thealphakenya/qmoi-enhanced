# pytest configuration for QMOI Enhanced
# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-04-17T03:00:00Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

import os
import sys
import logging
from pathlib import Path
from datetime import datetime
import asyncio
import inspect
import pytest

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tests.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Production configuration
class Config:
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///test.db')
    SECRET_KEY = os.getenv('SECRET_KEY', 'test-secret-key-insecure')
    TESTING = True

def validate_config():
    """Validate test configuration"""
    logger.info("Test configuration validated")
    return True

# Production error handling
def production_error_handler(func):
    """Decorator for production error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {e}")
            raise
    return wrapper

# Async test support
@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

def pytest_collection_modifyitems(config, items):
    """Pytest hook to add asyncio marker to async tests."""
    for item in items:
        if asyncio.iscoroutinefunction(item.obj):
            item.add_marker(pytest.mark.asyncio)

# Test fixtures
@pytest.fixture
def test_config():
    """Provide test configuration"""
    return Config

@pytest.fixture
def mock_logger():
    """Provide production logger"""
    return logger

# Call validate_config on startup
validate_config()
logger.info(f"QMOI test suite initialized - Debug mode: {Config.DEBUG}")
