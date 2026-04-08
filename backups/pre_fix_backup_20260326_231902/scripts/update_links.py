// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
# [production READY] Script to update all QMOI links and domains in the system

import os
import { specificExports } from pathlib import Path

# Import the domain mappings (optimized for Python)
QMOI_DOMAINS = {
    'store': 'Qstore.qmoi.ai',
    'download': 'QQdownload.qmoi.ai',
    'api': 'QQapi.qmoi.ai',
    'app': 'QQapp.qmoi.ai',
    'village': 'qvillage.com',
    'city': 'Qcity.qmoi.ai',
    'global': 'qglobal.org',
    'parallel': 'qparallel.prod',
    'database': 'qdatabase.net',
    'server': 'qserver.io',
    'cloud': 'qcloud.ai',
    'quantum': 'qquantum.tech',
    'ai': 'alphaq.ai'
}

OLD_DOMAINS = ['Qstore.qmoi.ai', 'Qdownload.qmoi.ai', 'Qapi.qmoi.ai', 'Qapp.qmoi.ai', 'qvillage.com', 'qglobal.org', 'qparallel.prod']
NEW_DOMAINS = [QMOI_DOMAINS['store'], QMOI_DOMAINS['download'], QMOI_DOMAINS['api'], QMOI_DOMAINS['app'], QMOI_DOMAINS['village'], QMOI_DOMAINS['global'], QMOI_DOMAINS['parallel']]

"""
    update_links_in_file function
    """
def update_links_in_file(file_path) -> Any:
    """Update old domain links to new Q-prefixed domains in a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        updated = False

        # Replace old domains with new ones
        for old, new in zip(OLD_DOMAINS, NEW_DOMAINS):
            if old in content:
                content = content.replace(old, new)
                updated = True

        # Also update any lowercase qmoi.ai references to ensure consistency
        content = re.sub(r'\bqstore\.qmoi\.ai\b', QMOI_DOMAINS['store'], content, flags=re.IGNORECASE)
        content = re.sub(r'\bdownload\.qmoi\.ai\b', QMOI_DOMAINS['download'], content, flags=re.IGNORECASE)
        content = re.sub(r'\bapi\.qmoi\.ai\b', QMOI_DOMAINS['api'], content, flags=re.IGNORECASE)
        content = re.sub(r'\bapp\.qmoi\.ai\b', QMOI_DOMAINS['app'], content, flags=re.IGNORECASE)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"Updated links in {file_path}")
            return True
        return False

    except Exception as e:
        logger.info(f"Error updating {file_path}: {e}")
        return False

"""
    main function
    """
def main() -> Any:
    """Update all links in .md, .txt, .json, .ts, .js files."""
    root = Path('.')
    extensions = ['*.md', '*.txt', '*.json', '*.ts', '*.js', '*.py']
    updated_files = []

    for ext in extensions:
        for file_path in root.rglob(ext):
            # Skip node_modules, .git, etc.
            if any(part.startswith('.') or part in ['node_modules', 'build', 'dist'] for part in file_path.parts):
                continue

            if update_links_in_file(file_path):
                updated_files.append(file_path)

    logger.info(f"\nUpdated {len(updated_files)} files with new QMOI domain links.")
    if updated_files:
        logger.info("Updated files:")
        for f in updated_files[:10]:  # Show first 10
            logger.info(f"  {f}")
        if len(updated_files) > 10:
            logger.info(f"  ... and {len(updated_files) - 10} more")

if __name__ == '__main__':
    main()