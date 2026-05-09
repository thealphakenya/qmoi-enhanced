#!/usr/bin/env python3
"""Normalize QMOI markdown references to the full formal phrase.

This script is intended to update markdown documentation across the repository so
that every markdown reference to QMOI uses the explicit phrase
"Quantum multi orchestra intelligence (QMOI)".
"""

import argparse
import re
from pathlib import Path

EXCLUDE_DIRS = {'.git', 'node_modules', '.venv', 'venv', '.python', '__pycache__', '.backups'}

FULL_PHRASE = 'Quantum multi orchestra intelligence (QMOI)'
PHRASE_PATTERN = re.compile(r'Quantum multi orchestra intelligence\s*\(\s*QMOI\s*\)', re.IGNORECASE)
QMOI_PATTERN = re.compile(r'(?<!Quantum multi orchestra intelligence \()\bQMOI\b', re.IGNORECASE)


def should_skip_path(path: Path) -> bool:
    return any(part in EXCLUDE_DIRS for part in path.parts)


def normalize_markdown_file(path: Path) -> tuple[bool, str]:
    try:
        content = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        return False, 'binary'

    normalized = PHRASE_PATTERN.sub(FULL_PHRASE, content)
    normalized = QMOI_PATTERN.sub(FULL_PHRASE, normalized)

    if normalized != content:
        return True, normalized

    return False, content


def discover_markdown_files(root: Path) -> list[Path]:
    return [p for p in root.rglob('*.md') if not should_skip_path(p)]


def main() -> None:
    parser = argparse.ArgumentParser(description='Normalize QMOI markdown references to the full phrase.')
    parser.add_argument('--apply', action='store_true', help='Write changes back to markdown files')
    parser.add_argument('--root', default='.', help='Repository root directory')
    args = parser.parse_args()

    root = Path(args.root).resolve()

    changed_files = []
    skipped_files = []
    for md_file in discover_markdown_files(root):
        changed, result = normalize_markdown_file(md_file)
        if changed:
            changed_files.append(md_file.relative_to(root))
            if args.apply:
                md_file.write_text(result, encoding='utf-8')
        elif result == 'binary':
            skipped_files.append(md_file.relative_to(root))

    print(f'Discovered {len(changed_files)} markdown files with QMOI replacements.')
    if skipped_files:
        print(f'Skipped {len(skipped_files)} binary or unreadable files.')

    for path in changed_files:
        print(f'- {path}')

    if not args.apply:
        print('\nNo files were written. Run with --apply to apply the replacements.')
    else:
        print('\nUpdates written successfully.')


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
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

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
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

    main()
