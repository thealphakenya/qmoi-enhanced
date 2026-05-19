# QMOI Enhanced pytest configuration
import os
import sys
import logging
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Configure logging for tests
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tests.log'),
        logging.StreamHandler()
    ]
)

# Test configuration
class Config:
    RELEASE = os.getenv('RELEASE', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///test.db')
    SECRET_KEY = os.getenv('SECRET_KEY', 'test-secret-key-insecure')
    TESTING = True

def pytest_configure(config):
    """Configure pytest"""
    config.addinivalue_line("markers", "slow: marks tests as slow")
    config.addinivalue_line("markers", "integration: marks tests as integration tests")

def pytest_collection_modifyitems(config, items):
    """Modify test collection"""
    for item in items:
        # Add markers based on test path or name
        if "integration" in str(item.fspath):
            item.add_marker("integration")
        elif "slow" in item.keywords:
            item.add_marker("slow")

# Test fixtures
@pytest.fixture
def test_config():
    """Provide test configuration"""
    return Config()

@pytest.fixture
def test_logger():
    """Provide test logger"""
    return logging.getLogger(__name__)