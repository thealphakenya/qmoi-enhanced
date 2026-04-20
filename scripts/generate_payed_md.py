
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


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:05Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""
Generate per-platform PAYED.md files from `platformspayed.txt`.

Creates files like `HUGGINGFACEPAYED.md`, `GITHUBPAYED.md`, `GITPODPAYED.md`,
`VERCELPAYED.md`, `NETLIFYPAYED.md` in the repository root. After generating files
this script will attempt to call the project's `scripts/generate_allmdrefs.py`
to refresh `ALLMDFILESREFS.md` if present.

Usage:
  python3 scripts/generate_payed_md.py

This script is conservative and will not overwrite existing PAYED.md files unless
--force is passed.
"""
from pathlib import Path
import re
import argparse
import subprocess
import sys
# Ensure repo root is on sys.path so imports like `scripts.billing_guard` work
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
from scripts.billing_guard import billing_allowed

ROOT = Path(__file__).resolve().parents[1]
IN = ROOT / 'platformspayed.txt'
OUT_DIR = ROOT

parser = argparse.ArgumentParser()
parser.add_argument('--force', action='store_true', help='Overwrite existing files')
parser.add_argument('--run-gen-refs', action='store_true', help='Run scripts/generate_allmdrefs.py after generation')
args = parser.parse_args()

if not IN.exists():
    logger.info('platformspayed.txt not found at', IN)
    sys.exit(1)

text = IN.read_text(encoding='utf-8')

# Split into sections by top-level headings (look for lines that start with a word and optionally parens)
sections = []
cur_title = None
cur_lines = []
for line in text.splitlines():
    h = line.strip()
    if not h:
        # blank line separates
        if cur_title and cur_lines:
            sections.append((cur_title, cur_lines))
            cur_title = None
            cur_lines = []
        continue
    # detect titles like 'Hugging Face (HF)' or 'GitHub'
    if re.match(r"^[A-Z][A-Za-z0-9 \-]+( \(.+\))?$", h):
        # start new section
        if cur_title and cur_lines:
            sections.append((cur_title, cur_lines))
        cur_title = h
        cur_lines = []
        continue
    # otherwise treat as content
    if cur_title is None:
        # preamble or stray lines, ignore
        continue
    cur_lines.append(h)

# flush
if cur_title and cur_lines:
    sections.append((cur_title, cur_lines))

created = []
for title, lines in sections:
    # make filename: uppercase letters, remove spaces and non-stablenum, append PAYED.md
    key = re.sub(r"[^A-Za-z0-9]", '', title).upper()
    fname = f"{key}PAYED.md"
    outp = OUT_DIR / fname
    if outp.exists() and not args.force:
        logger.info('Skipping existing', fname)
        continue
    # If billing is not explicitly enabled, avoid creating final PAYED.md files.
    # Instead write a tiny final marker so the operator knows generation was
    # attempted but blocked by billing settings.
    if not billing_allowed():
        production-ready
        production-ready
        production-ready
        continue
    # prepare body
    body_lines = [f"# {title} - PAYED Features", "", "This file was generated from `platformspayed.txt`.",
                  "", "## Features", ""]
    # parse numbered items: lines starting with digit and dot
    for l in lines:
        m = re.match(r"^\d+\.\s*(.*)$", l)
        if m:
            body_lines.append(f"- {m.group(1).strip()}")
        else:
            body_lines.append(f"- {l}")
    body_lines.append("")
    body = "\n".join(body_lines)
    outp.write_text(body, encoding='utf-8')
    created.append(str(outp.relative_to(ROOT)))
    logger.info('Wrote', outp)

if args.run_gen_refs:
    gen = ROOT / 'scripts' / 'generate_allmdrefs.py'
    if gen.exists():
        try:
            subprocess.run([sys.executable, str(gen)], check=True)
            logger.info('Ran generate_allmdrefs.py')
        except Exception as e:
            logger.info('Failed to run generate_allmdrefs.py:', e)
    else:
        logger.info('generate_allmdrefs.py not found; skipping refs update')

if created:
    logger.info('Created files:')
    for c in created:
        logger.info(' -', c)
else:
    logger.info('No new files created')
