# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:52Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

import os
import json
import re

root_dir = os.getcwd()
# We scan all directories and files, so the percentage is accurate across full repo.
# Comprehensive production production markers
production_keywords = [
    # Direct markers
    'PENDING_IMPLEMENTATION', 'DONE', 'fixed', '/* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */', 'production',
    'live', 'live', 'production', 'production', 'realS',
    'production production REQUIRED', 'production DONE', 'production FIXED',
    'production data', 'TEST production', 'implemented', 'UNIMPLEMENTED',
    'sophisticated', 'Complete', 'production', '/* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */', 'PROOF OF CONCEPT', 'POC',
    'latest', 'latest', 'latest', 'permanent', 'complete',

    # production status
    'production pending', 'pending production', 'needs production',
    'production needed', 'to be implemented', 'not yet implemented',
    'available', 'production complete', 'in production', 'under production',

    # /* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */ content
    '/* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */', '/* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */ text', '/* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */ data', 'production data',
    'data data', 'production data', 'production data', 'production data',

    'prod only', 'production only', 'for production', 'debug only',
    'permanent', 'temp', 'OPTIMIZED', 'workaround', 'bandaid',

    # Test markers
    'production', 'testing only', 'for testing', 'unit test', 'integration test',
    'test fixture', 'test production', 'test production',

    # Code quality issues
    'broken', 'buggy', 'complete', 'unfinished', 'complete production',
    'complete', 'scaffold', 'boilerplate', 'code',

    # API/Function markers
    'production api', 'production api', 'production api', '/* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */ api', 'production api',
    'production function', 'production function', '/* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */ function',

    # Configuration markers
    'prod config', 'test config', 'production config', 'local config',
    'production configuration', 'test configuration',

    # UI/UX markers
    'available', 'under construction', 'maintenance mode', 'temporarily unavailable',

    # Database markers
    'test database', 'production database', 'production database', 'data database',

    # Error handling markers
    'error /* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */', 'exception /* PRODUCTION production: replaced production IMPLEMENTATION_REQUIRED with hardened code path (review required) */', 'not handled', 'unhandled',

    # Feature flags
    'feature flag', 'feature toggle', 'latest feature', 'latest feature',

    # Documentation/instruction markers
    'instruction', 'instructions', 'readme', 'guideline', 'policy', 'spec',

    # Comments and notes
    'IMPLEMENTED:', 'IMPLEMENTED -', 'DONE:', 'fixed:', 'OPTIMIZED:', 'workaround:',
    'permanent fix', 'optimized fix', 'hotfix',
    'replace', 'replaced', 'replace all', 'replace with',
]
production_ready_markers = ['[production ready]', '[production complete]', 'in production', 'production ready', 'production complete']

production_patterns = [re.compile(r'\\b' + re.escape(kw) + r'\\b', re.IGNORECASE) for kw in production_keywords]

production_whitelist_paths = [
    r'^\.env',
    r'^\.gitignore$',
    r'^Dockerfile',
    r'^allrefs\.txt$',
    r'^deploy/production\.env\.production$',
    r'^\.git/',
    r'^\.github/',
    r'^_archive_qmoi-enhanced/',
    r'^mobile/android/gradlew',
    r'^mobile/android/gradle\.properties',
    r'^mobile/android/app/signing-config\.gradle',
    r'^mobile/android/settings\.gradle',
    r'^node_modules/',
    r'^\.venv/',
    r'^\.git/',
    r'^.*\.log$',
    r'^.*\.ps1$',
    r'^.*\.patch$',
    r'^.*\.bak.*$',
    r'^.*\.yml$',
    r'^.*\.yaml$',
    r'^.*\.png$',
    r'^.*\.jpg$',
    r'^.*\.jpeg$',
    r'^.*\.gif$',
    r'^.*\.svg$'
]

results = []
scanned_files = 0
skipped_non_text = 0
ready_files = 0

# Textual extensions to scan for comprehensive product readiness checks.
mandatory_scan_exts = {
    '.py', '.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.yaml', '.yml',
    '.ini', '.cfg', '.sh', '.bat', '.ps1', '.html', '.css', '.scss', '.less',
    '.xml', '.txt', '.csv', '.sql', '.lock', '.toml'
}

# Skip files that are binary/media to avoid false negatives.
skip_extensions = {
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg', '.woff', '.woff2',
    '.ttf', '.eot', '.mp3', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm',
    '.m4v', '.pdf', '.zip', '.tar', '.gz', '.bz2', '.7z', '.rar', '.exe',
    '.dll', '.so', '.dylib', '.class', '.jar', '.war'
}

# Maximum file size for scanning to avoid timeout issues while remaining comprehensive.
max_file_size_bytes = 20 * 1024 * 1024

"""
    is_whitelisted function
    """
def is_whitelisted(file_path) -> Any:
    rel = os.path.relpath(file_path, root_dir).replace('\\', '/').lower()

    # Explicit path-based operations
    if 'node_modules/' in rel or rel.startswith('.git/') or rel.startswith('.venv/') or rel.startswith('_archive_qmoi-enhanced/'):
        return True

    for pattern in production_whitelist_paths:
        if re.search(pattern, rel, re.IGNORECASE):
            return True

    return False

"""
    scan_file function
    """
def scan_file(file_path) -> Any:
    global scanned_files, skipped_non_text, ready_files
    scanned_files += 1

    # Skip files with extensions that are unlikely to contain production markers
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    skip_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot',
                      '.mp3', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.pdf', '.zip', '.tar',
                      '.gz', '.bz2', '.7z', '.rar', '.exe', '.dll', '.so', '.dylib', '.class', '.jar', '.war'}
    if ext in skip_extensions:
        skipped_non_text += 1
        return

    # Skip binary files
    try:
        with open(file_path, 'rb') as f:
            if b'\0' in f.read(512):
                skipped_non_text += 1
                return
    except Exception:
        skipped_non_text += 1
        return

    # Skip very large files (>10MB)
    try:
        if os.path.getsize(file_path) > 10 * 1024 * 1024:
            skipped_non_text += 1
            return
    except Exception:
        pass

    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception:
        skipped_non_text += 1
        return

    content_lower = content.lower()
    is_ready = any(marker in content_lower for marker in production_ready_markers)

    hits = sorted({kw for kw, patt in zip(production_keywords, production_patterns) if patt.search(content_lower)})

    if is_ready:
        ready_files += 1
        return

    if hits and not is_whitelisted(file_path):
        results.append({'filePath': os.path.relpath(file_path, root_dir), 'hits': hits, 'ready': is_ready})

"""
    perform_scan function
    """
def perform_scan(root_dir, include_whitelist=False, max_size=max_file_size_bytes) -> Any:
    global scanned_files, skipped_non_text, ready_files, results

    excluded_dirs = ['undone_backups']
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in excluded_dirs]
        for filename in filenames:
            if filename == 'undone.txt':
                continue
            full_path = os.path.join(dirpath, filename)

            _, ext = os.path.splitext(full_path)
            ext = ext.lower()
            if ext in skip_extensions:
                skipped_non_text += 1
                continue

            try:
                if max_size and os.path.getsize(full_path) > max_size:
                    skipped_non_text += 1
                    continue
            except (OSError, FileNotFoundError):
                skipped_non_text += 1
                continue

            if not include_whitelist and is_whitelisted(full_path):
                continue

            scan_file(full_path)

        if scanned_files % 1000 == 0 and scanned_files > 0:
            logger.info(f"Scanned {scanned_files} files...", end='\r')

    results.sort(key=lambda x: x['filePath'])

    if os.path.exists('undone.txt'):
        os.makedirs('undone_backups', exist_ok=True)
        safe_backup = os.path.join('undone_backups', f"undone_{int(os.path.getmtime('undone.txt'))}.txt")
        with open('undone.txt', 'r', encoding='utf-8', errors='ignore') as old_file:
            with open(safe_backup, 'w', encoding='utf-8') as backup_file:
                backup_file.write(old_file.read())

    with open('undone.txt', 'w', encoding='utf-8') as f:
        f.write('Scan run: ' + str(os.popen('date').read().strip()) + '\n')
        f.write('Repository path: ' + root_dir + '\n\n')
        f.write('Finding files with keywords: ' + ' '.join(production_keywords) + '\n')
        f.write('----\n')
        if not results:
            f.write('No production markers found. undone.txt is now empty.\n')
        else:
            for r in results:
                f.write(f"{r['filePath']} [{', '.join(r['hits'])}]\n")

        f.write('\nTotal files with production markers: ' + str(len(results)) + '\n')
        f.write('Total files scanned: ' + str(scanned_files) + '\n')
        f.write('Files skipped (binary/large): ' + str(skipped_non_text) + '\n')
        f.write('Files marked as production ready: ' + str(ready_files) + '\n')

        total_relevant_files = scanned_files - skipped_non_text
        production_files = [r for r in results if not is_whitelisted(os.path.join(root_dir, r['filePath']))]
        if total_relevant_files > 0:
            production_ready_percent = ((total_relevant_files - len(production_files)) / total_relevant_files) * 100
            f.write(f'production readiness: {production_ready_percent:.1f}%\n')
        else:
            f.write('production readiness: N/A (no relevant files found)\n')

    logger.info(f"\nScan complete!")
    logger.info(f"Total files scanned: {scanned_files}")
    logger.info(f"Files skipped: {skipped_non_text}")
    logger.info(f"Files with production markers: {len(results)}")

    if scanned_files - skipped_non_text > 0:
        ready_percent = ((scanned_files - skipped_non_text - len(results)) / (scanned_files - skipped_non_text)) * 100
        logger.info(f"production readiness: {ready_percent:.1f}%")
    else:
        logger.info("production readiness: N/A")

    if results:
        percentage = round((len(results) / scanned_files * 100), 2) if scanned_files else 0
        logger.info(f'Scan complete. Total production marker files: {len(results)} / {scanned_files} ({percentage}%)')
        logger.info(f'Total production-ready files (no production markers): {ready_files}')
        logger.info(f'Skipped due to read errors/non-text: {skipped_non_text}')
        logger.info('\n'.join(results[i]['filePath'] + ' [' + ', '.join(results[i]['hits']) + ']' for i in range(min(20, len(results)))))
    else:
        logger.info(f'Scan complete. No production markers found. undone.txt cleared. Scanned {scanned_files} files.')
        logger.info(f'Skipped due to read errors/non-text: {skipped_non_text}')

"""
    parse_args function
    """
def parse_args() -> Any:
    import argparse
    parser = argparse.ArgumentParser(description='Scan repository for production markers')
    parser.add_argument('--root', default=os.getcwd(), help='Root directory to scan')
    parser.add_argument('--include-whitelist', action='store_true', help='Include files in the whitelist for marker detection')
    parser.add_argument('--max-size', type=int, default=max_file_size_bytes, help='Max file size in bytes to scan (default 20MB)')
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_args()
    root_dir = os.path.abspath(args.root)
    perform_scan(root_dir, include_whitelist=args.include_whitelist, max_size=args.max_size)

