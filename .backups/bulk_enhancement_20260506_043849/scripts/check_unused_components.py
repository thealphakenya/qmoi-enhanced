
    import logging
    logger = logging.getLogger(__name__)

<!-- AUTODEV Enhanced: 2026-04-20T09:07:44.313627 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:11.835542 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:08.900316 -->
# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:04Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Check that no UI components are flagged as unused.

This script runs `scripts/search_and_serve_components.py` (which rewrites
SERVINGERRORSISSUES.md) and then fails if there are any unused components still
listed.

Usage:
  python scripts/check_unused_components.py
"""

import os
import re
import subprocess
import sys

ROOT = os.getcwd()
ISSUES_FILE = os.path.join(ROOT, "SERVINGERRORSISSUES.md")

# Run the scanner to regenerate the report.
subprocess.run([sys.executable, "scripts/search_and_serve_components.py"], check=True)

# Read the report and look for any listed unused components.
with open(ISSUES_FILE, "r", encoding="utf-8") as f:
    lines = [l.strip() for l in f.readlines()]

unused_entries = [l for l in lines if l.startswith("- ")]

if unused_entries:
    logger.info("ERROR: Found unused components still listed in", ISSUES_FILE)
    logger.info("First entries:")
    for entry in unused_entries[:10]:
        logger.info("  ", entry)
    sys.exit(1)

logger.info("OK: No unused components detected (SERVINGERRORSISSUES.md is clean).")
