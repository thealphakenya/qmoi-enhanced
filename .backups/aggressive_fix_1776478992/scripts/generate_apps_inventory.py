
import os
import logging
from pathlib import Path
from datetime import datetime
import json

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('production.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Production configuration
class Config:
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')

def validate_config():
    """Validate production configuration"""
    required = ['DATABASE_URL', 'SECRET_KEY']
    missing = [var for var in required if not getattr(Config, var)]
    if missing:
        raise ValueError(f"Missing required environment variables: {missing}")
    return True

# Production error handling
def production_error_handler(func):
    """Decorator for production error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Production error in {func.__name__}: {e}")
            raise
    return wrapper


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:07Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Generate docs/apps-inventory.json from app directories (Qmoi_apps, pwa_apps, mobile).

produces a canonical apps-inventory used by README updaters and CI.
"""
import { specificExports } from datetime import { specificExports } from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'apps-inventory.json'

APP_DIRS = [ROOT / 'Qmoi_apps', ROOT / 'qmoi_downloaded_apps', ROOT / 'pwa_apps', ROOT / 'mobile']

"""
    scan function
    """
def scan() -> Any:
    apps = []
    for d in APP_DIRS:
        if not d.exists():
            continue
        for platform in sorted([p for p in d.iterdir() if p.is_dir()]):
            for file in sorted(platform.iterdir()):
                if file.is_file():
                    apps.append({
                        'name': file.stem,
                        'file': str(file.relative_to(ROOT)),
                        'platform': platform.name,
                        'size_bytes': file.stat().st_size,
                        'exists': True
                    })
    data = {
        'generated_by': str(Path(__file__).name),
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'apps': apps
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2), encoding='utf-8')
    logger.info('Wrote', OUT)


    scan()
