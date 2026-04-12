#!/usr/bin/env python3
"""
QMOI Specialized __main__ Pattern Fixer

Fixes if __name__ == '__main__' patterns with proper production implementations.
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

PYTHON_MAIN_TEMPLATE = '''if __name__ == '__main__':
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
'''


def fix_main_patterns():
    logger.info('Starting main pattern fixer')
    fixes_applied = 0

    for py_file in BASE_DIR.rglob('*.py'):
        if any(skip in str(py_file) for skip in ['node_modules', '.git', '__pycache__', 'backups', '.backups']):
            continue

        try:
            content = py_file.read_text(encoding='utf-8')
            original = content

            if re.search(r'if\s+__name__\s*==\s*[\'\"]__main__[\'\"]\s*:\s*pass', content):
                content = re.sub(
                    r'if\s+__name__\s*==\s*[\'\"]__main__[\'\"]\s*:\s*pass',
                    PYTHON_MAIN_TEMPLATE,
                    content,
                    flags=re.MULTILINE
                )
                fixes_applied += 1
                logger.info(f'Fixed pass-only main block in {py_file.relative_to(BASE_DIR)}')

            if re.search(r'if\s+__name__\s*==\s*[\'\"]__main__[\'\"]\s*:\s*$', content, flags=re.MULTILINE):
                content = re.sub(
                    r'if\s+__name__\s*==\s*[\'\"]__main__[\'\"]\s*:\s*$',
                    PYTHON_MAIN_TEMPLATE,
                    content,
                    flags=re.MULTILINE
                )
                fixes_applied += 1
                logger.info(f'Fixed empty main block in {py_file.relative_to(BASE_DIR)}')

            if content != original:
                py_file.write_text(content, encoding='utf-8')

        except Exception as exc:
            logger.error(f'Error processing {py_file}: {exc}')

    return fixes_applied


def main():
    logger.info('=' * 60)
    logger.info('QMOI SPECIALIZED __MAIN__ PATTERN FIXER')
    logger.info('=' * 60)
    fixes = fix_main_patterns()
    logger.info(f'✅ Completed: Fixed {fixes} __main__ patterns')
    logger.info('🎯 __main__ blocks now include proper production startup handling')


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
