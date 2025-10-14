#!/usr/bin/env python3
"""
QMOI Permission Fix Utility
Checks and fixes write permissions for all QMOI system files in the scripts directory.
"""
import os
import sys
import logging
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("qmoi_permission_fix")

SCRIPTS_DIR = Path(__file__).parent

# List of important QMOI system files to check
QMOI_FILES = [
    'qmoi-system-controller.py',
    'qmoi-enhanced-controller.py',
    'qmoi_enhanced_ai.py',
    'qmoi_model_enhancer.py',
    'qmoi_earning_daemon.py',
    'qmoi_earning_enhanced.py',
    'qmoi_self_evolve.py',
    'qmoi_auto_evolution.py',
]

def check_and_fix_permissions(file_path):
    abs_path = SCRIPTS_DIR / file_path
    if not abs_path.exists():
        logger.warning(f"File not found: {abs_path}")
        return
    if not os.access(abs_path, os.W_OK):
        logger.info(f"Attempting to fix permissions for {abs_path}")
        try:
            os.chmod(abs_path, 0o666)
            if os.access(abs_path, os.W_OK):
                logger.info(f"Permissions fixed for {abs_path}")
            else:
                logger.error(f"Failed to fix permissions for {abs_path}")
        except Exception as e:
            logger.error(f"Error fixing permissions for {abs_path}: {e}")
    else:
        logger.info(f"{abs_path} is already writable.")

def main():
    for file in QMOI_FILES:
        check_and_fix_permissions(file)

if __name__ == "__main__":
    main() 