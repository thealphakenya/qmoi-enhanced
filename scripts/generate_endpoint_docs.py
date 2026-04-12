
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


#!/usr/bin/env python3
"""Generate endpoint docs for all route.ts API files"""

import json
import logging
from pathlib import Path
from typing import Any, List, Tuple

ROOT = Path.cwd()
API_DIRS = [ROOT / 'app' / 'api', ROOT / 'src' / 'app' / 'api']

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def collect_endpoints() -> List[Tuple[str, str]]:
    entries = []
    for root in API_DIRS:
        if not root.exists():
            continue
        for path in sorted(root.rglob('route.ts')):
            parts = list(path.relative_to(root).parent.parts)
            endpoint = '/api/' + '/'.join([p.replace('[', '{').replace(']', '}') for p in parts])
            if endpoint.endswith('/route'):
                endpoint = endpoint[:-6]
            if endpoint.endswith('/') and len(endpoint) > 1:
                endpoint = endpoint[:-1]
            entries.append((endpoint, str(path.relative_to(ROOT))))
    return sorted(set(entries), key=lambda x: x[0])


def write_endpoints(entries: List[Tuple[str, str]]) -> None:
    end_file = ROOT / 'ENDPOINTS.md'
    header = '# API Endpoints\n\n'
    body = '\n'.join(f'- {endpoint} -> {path}' for endpoint, path in entries)

    if end_file.exists():
        text = end_file.read_text(encoding='utf-8')
        start = text.find('<!-- ENDPOINTS_AUTOGEN_START -->')
        end = text.find('<!-- ENDPOINTS_AUTOGEN_END -->')
        if start != -1 and end != -1 and end > start:
            before = text[:start + len('<!-- ENDPOINTS_AUTOGEN_START -->')]
            after = text[end:]
            text = before + '\n\n' + body + '\n\n' + after
        else:
            text = header + body
        end_file.write_text(text, encoding='utf-8')
    else:
        end_file.write_text(header + body, encoding='utf-8')


def update_api_docs(entries: List[Tuple[str, str]]) -> None:
    for doc in ['API.md', 'APIs_v1.md', 'APIs_1.md']:
        doc_path = ROOT / doc
        if not doc_path.exists():
            continue
        content = doc_path.read_text(encoding='utf-8')
        marker = '## AUTO-GENERATED ENDPOINTS'
        summary = '\n## AUTO-GENERATED ENDPOINTS\n\n' + '\n'.join([f'- {endpoint}' for endpoint, _ in entries]) + '\n'
        if marker in content:
            start = content.find(marker)
            end = content.find('## ', start + len(marker))
            if end == -1:
                content = content[:start] + summary
            else:
                content = content[:start] + summary + content[end:]
        else:
            content += '\n' + summary
        doc_path.write_text(content, encoding='utf-8')



    entries = collect_endpoints()
    write_endpoints(entries)
    update_api_docs(entries)
    logger.info(f'Generated {len(entries)} endpoints and updated ENDPOINTS.md/API.md/APIs_v1.md/APIs_1.md')
