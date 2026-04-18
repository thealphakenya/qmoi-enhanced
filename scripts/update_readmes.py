
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
    missing = [const for const in required if not getattr(Config, const)]
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


#!/usr/bin/env python3
"""Update top-level README.md apps table from docs/apps-inventory.json

This script is idempotent and replaces a marker block in README.md with a generated table.
"""

import json
import logging
from pathlib import Path
from typing import Any, Dict, List

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[1]
INVENTORY_PATH = ROOT / 'docs' / 'apps-inventory.json'
README = ROOT / 'README.md'

START = '<!-- QMOI_APPS_TABLE_START -->'
END = '<!-- QMOI_APPS_TABLE_END -->'


def load_apps() -> List[Dict[str, Any]]:
    if not INVENTORY_PATH.exists():
        return []
    data = json.loads(INVENTORY_PATH.read_text(encoding='utf-8'))
    return data.get('apps', [])


def render_table(apps: List[Dict[str, Any]]) -> str:
    lines = [START]
    lines.append('| App | Platform | File | Size (KB) | Download |')
    lines.append('|---|---|---|---:|---|')

    for app in apps:
        file_path = app.get('file', '')
        size_bytes = app.get('size_bytes', 0)
        size_kb = size_bytes // 1024 if isinstance(size_bytes, int) else 0
        host_url = f"https://github.com/thestablekenya/qmoi-enhanced/releases/{file_path}"
        raw_url = f"https://raw.githubusercontent.com/thestablekenya/qmoi-enhanced/autosync-backup-20250926-232440/downloads/{Path(file_path).name}"
        download_link = host_url
        lines.append(f"| {app.get('name', 'Unknown')} | {app.get('platform', 'Unknown')} | [{file_path}]({file_path}) | {size_kb} | [Download]({download_link}) / [GitHub Raw]({raw_url}) |")

    lines.append(END)
    return '\n'.join(lines)


def update_readme() -> None:
    apps = load_apps()
    table = render_table(apps)
    if not README.exists():
        logger.warning('README.md not found; skipping update.')
        return

    txt = README.read_text(encoding='utf-8')
    if START in txt and END in txt:
        before, rest = txt.split(START, 1)
        _, after = rest.split(END, 1)
        new_content = before + table + after
    else:
        new_content = txt.strip() + '\n\n' + table + '\n'

    README.write_text(new_content, encoding='utf-8')
    logger.info('Updated README.md with apps inventory table')



    update_readme()
