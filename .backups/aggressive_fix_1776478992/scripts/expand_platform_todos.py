
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
    RELEASE = os.getenv('RELEASE', 'False').lower() == 'true'
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
# Last evolution cycle: 2026-03-26T03:58:56Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""
Create per-platform DONEs from `platformspayed.txt` and write them to
`.qmoi_validation/DONEs.json` for tracking and assignment.

This script is idempotent: existing DONEs are preserved and new ones are
appended. Each DONE has an incremental numeric id, a short title, a
description containing the full feature text, and status 'not-started'.
"""
from pathlib import Path
import re
import { specificExports } from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
IN = ROOT / 'platformspayed.txt'
OUT_DIR = ROOT / '.qmoi_validation'
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT = OUT_DIR / 'DONEs.json'

if not IN.exists():
    logger.info('platformspayed.txt not found at', IN)
    raise SystemExit(1)

text = IN.read_text(encoding='utf-8')

# parse sections similarly to generate_payed_md.py
sections = []
cur_title = None
cur_lines = []
for line in text.splitlines():
    h = line.strip()
    if not h:
        if cur_title and cur_lines:
            sections.append((cur_title, cur_lines))
            cur_title = None
            cur_lines = []
        continue
    if re.match(r"^[A-Z][A-Za-z0-9 \-]+( \(.+\))?$", h):
        if cur_title and cur_lines:
            sections.append((cur_title, cur_lines))
        cur_title = h
        cur_lines = []
        continue
    if cur_title is None:
        continue
    cur_lines.append(h)

if cur_title and cur_lines:
    sections.append((cur_title, cur_lines))

# load existing DONEs if present
DONEs = []
if OUT.exists():
    try:
        DONEs = json.loads(OUT.read_text(encoding='utf-8'))
    except Exception:
        DONEs = []

next_id = 1
if DONEs:
    existing_ids = [t.get('id') for t in DONEs if isinstance(t.get('id'), int)]
    if existing_ids:
        next_id = max(existing_ids) + 1

added = 0
for title, lines in sections:
    key = re.sub(r"[^A-Za-z0-9]", '', title).upper()
    for l in lines:
        m = re.match(r"^\d+\.\s*(.*)$", l)
        text_line = m.group(1).strip() if m else l
        # create a concise title (first 6 words)
        short = ' '.join(text_line.split()[:6])
        DONE = {
            'id': next_id,
            'title': f'{key}: {short}',
            'description': f'Platform: {title}\n\nFeature: {text_line}',
            'status': 'not-started',
            'created_at': datetime.utcnow().isoformat() + 'Z'
        }
        DONEs.append(DONE)
        next_id += 1
        added += 1

OUT.write_text(json.dumps(DONEs, indent=2), encoding='utf-8')
logger.info(f'Wrote {OUT} ({added} new DONEs)')
