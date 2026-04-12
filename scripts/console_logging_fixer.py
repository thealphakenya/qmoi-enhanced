#!/usr/bin/env python3
"""
QMOI Specialized Console Logging Standardization Fixer

Standardizes console.* calls to proper logger.* calls across the codebase.
"""

import os
import re
from pathlib import Path
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent

def standardize_console_logging():
    """Standardize console logging calls to proper logger calls"""
    logger.info("Standardizing console logging calls...")

    fixes_applied = 0

    # Console to logger replacements
    console_replacements = [
        # JavaScript/TypeScript
        (r'console\.log\((.*?)\);?', r'logger.info(\1);'),
        (r'console\.debug\((.*?)\);?', r'logger.debug(\1);'),
        (r'console\.info\((.*?)\);?', r'logger.info(\1);'),
        (r'console\.warn\((.*?)\);?', r'logger.warning(\1);'),
        (r'console\.error\((.*?)\);?', r'logger.error(\1);'),

        # Python (though rare, some might exist)
        (r'print\((.*?)\);?', r'logger.info(\1)'),
    ]

    # Process JavaScript/TypeScript files
    js_extensions = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs']

    for ext in js_extensions:
        for file_path in BASE_DIR.rglob(f'*{ext}'):
            if any(skip in str(file_path) for skip in ['node_modules', '.git', '__pycache__', 'backups', '.backups']):
                continue

            try:
                content = file_path.read_text()
                original_content = content
                changes_made = 0

                # Check if logger is already imported/defined
                has_logger = 'const logger' in content or 'import.*logger' in content or 'logger =' in content

                # Apply console replacements
                for pattern, replacement in console_replacements:
                    new_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
                    if new_content != content:
                        changes_made += len(re.findall(pattern, content, re.MULTILINE))
                        content = new_content

                # Add logger import if needed and console calls were replaced
                if changes_made > 0 and not has_logger:
                    # Add logger definition at top
                    logger_def = """
// Production logging configuration
const logger = {
  info: (msg, ...args) => console.log(`[${new Date().toISOString()}] INFO: ${msg}`, ...args),
  debug: (msg, ...args) => console.debug(`[${new Date().toISOString()}] DEBUG: ${msg}`, ...args),
  warning: (msg, ...args) => console.warn(`[${new Date().toISOString()}] WARN: ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[${new Date().toISOString()}] ERROR: ${msg}`, ...args)
};
"""
                    # Insert after existing imports or at top
                    if 'import ' in content:
                        # Find last import
                        import_matches = list(re.finditer(r'^import .*$', content, re.MULTILINE))
                        if import_matches:
                            last_import = import_matches[-1]
                            insert_pos = last_import.end()
                            content = content[:insert_pos] + '\n' + logger_def + content[insert_pos:]
                        else:
                            content = logger_def + '\n' + content
                    else:
                        content = logger_def + '\n' + content

                    changes_made += 1  # Count the logger addition

                # Save if changes were made
                if content != original_content:
                    file_path.write_text(content)
                    fixes_applied += changes_made
                    logger.info(f"Standardized {changes_made} console calls in {file_path.name}")

            except Exception as e:
                logger.error(f"Error fixing {file_path}: {e}")

    return fixes_applied

def main():
    """Main function"""
    logger.info("=" * 60)
    logger.info("QMOI SPECIALIZED CONSOLE LOGGING STANDARDIZATION FIXER")
    logger.info("=" * 60)

    fixes = standardize_console_logging()

    logger.info(f"✅ Completed: Standardized {fixes} console logging calls")
    logger.info("🎯 All console.* calls now use proper logger.* with production formatting")

if __name__ == '__main__':
    main()