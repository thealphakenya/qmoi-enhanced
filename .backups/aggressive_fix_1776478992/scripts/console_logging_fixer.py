#!/usr/bin/env python3
"""
QMOI Specialized Console Logging Standardization Fixer

Standardizes console.* calls to proper logger.* calls across the codebase.
"""

import re
from pathlib import Path
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent

CONSOLE_REPLACEMENTS = [
    (r'console\.log\((.*?)\);?', r'logger.info(\1);'),
    (r'console\.debug\((.*?)\);?', r'logger.debug(\1);'),
    (r'console\.info\((.*?)\);?', r'logger.info(\1);'),
    (r'console\.warn\((.*?)\);?', r'logger.warning(\1);'),
    (r'console\.error\((.*?)\);?', r'logger.error(\1);'),
    (r'print\((.*?)\)', r'logger.info(\1)')
]

LOGGER_DEF = '''
// Production logging configuration
const logger = {
  info: (msg, ...args) => console.log(`[${new Date().toISOString()}] INFO: ${msg}`, ...args),
  debug: (msg, ...args) => console.debug(`[${new Date().toISOString()}] DEBUG: ${msg}`, ...args),
  warning: (msg, ...args) => console.warn(`[${new Date().toISOString()}] WARN: ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[${new Date().toISOString()}] ERROR: ${msg}`, ...args)
};
'''

JS_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs']


def standardize_console_logging():
    logger.info('Starting console logging standardization fixer')
    fixes_applied = 0

    for ext in JS_EXTENSIONS:
        for file_path in BASE_DIR.rglob(f'*{ext}'):
            if any(skip in str(file_path) for skip in ['node_modules', '.git', '__pycache__', 'backups', '.backups']):
                continue

            try:
                content = file_path.read_text(encoding='utf-8')
                original = content
                had_logger = 'const logger' in content or 'let logger' in content or 'var logger' in content or 'import logger' in content

                for pattern, replacement in CONSOLE_REPLACEMENTS:
                    content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

                if content != original and not had_logger:
                    imports = list(re.finditer(r'^import .*$', content, flags=re.MULTILINE))
                    if imports:
                        last_import = imports[-1]
                        pos = last_import.end()
                        content = content[:pos] + '\n' + LOGGER_DEF + '\n' + content[pos:]
                    else:
                        content = LOGGER_DEF + '\n' + content

                if content != original:
                    file_path.write_text(content, encoding='utf-8')
                    fixes_applied += len(re.findall(r'logger\.(?:info|debug|warning|error)\(', content))
                    logger.info(f'Standardized logging in {file_path.relative_to(BASE_DIR)}')

            except Exception as exc:
                logger.error(f'Error processing {file_path}: {exc}')

    return fixes_applied


def main():
    logger.info('=' * 60)
    logger.info('QMOI SPECIALIZED CONSOLE LOGGING STANDARDIZATION FIXER')
    logger.info('=' * 60)
    fixes = standardize_console_logging()
    logger.info(f'✅ Completed: Standardized {fixes} console logging calls')
    logger.info('🎯 console.* calls now use production logger infrastructure')


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    main()
