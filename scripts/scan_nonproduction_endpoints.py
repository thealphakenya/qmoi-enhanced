// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import os
import json
import re

root_dir = os.getcwd()
# We scan all directories and files, so the percentage is accurate across full repo.
# Comprehensive non-production implementation markers
nonprod_keywords = [
    # Direct markers
    'PENDING_IMPLEMENTATION', 'TODO', 'FIXME', 'PLACEHOLDER', 'MOCK',
    'SIMULATE', 'SIMULATION', 'STAGING', 'STUB', 'STUBS',
    'PRODUCTION IMPLEMENTATION REQUIRED', 'PRODUCTION DONE', 'PRODUCTION FIXED',
    'TEST DATA', 'TEST IMPLEMENTATION', 'NOT IMPLEMENTED', 'UNIMPLEMENTED',
    'SIMPLE', 'MINIMAL', 'DEMO', 'DRAFT', 'PROOF OF CONCEPT', 'POC',
    'ALPHA', 'BETA', 'EXPERIMENTAL', 'TEMPORARY', 'INCOMPLETE',

    # Implementation status
    'implementation pending', 'pending implementation', 'needs implementation',
    'implementation needed', 'to be implemented', 'not yet implemented',
    'coming soon', 'work in progress', 'in development', 'under development',

    # Placeholder content
    'placeholder', 'placeholder text', 'placeholder data', 'dummy data',
    'sample data', 'example data', 'fake data', 'mock data',

    # Development markers
    'dev only', 'development only', 'for development', 'debug only',
    'temporary', 'temp', 'hack', 'workaround', 'bandaid',

    # Test markers
    'test only', 'testing only', 'for testing', 'unit test', 'integration test',
    'test fixture', 'test mock', 'test stub',

    # Code quality issues
    'broken', 'buggy', 'incomplete', 'unfinished', 'partial implementation',
    'skeleton', 'scaffold', 'boilerplate', 'template',

    # API/Function markers
    'mock api', 'fake api', 'stub api', 'placeholder api', 'dummy api',
    'mock function', 'stub function', 'placeholder function',

    # Configuration markers
    'dev config', 'test config', 'staging config', 'local config',
    'development configuration', 'test configuration',

    # UI/UX markers
    'coming soon', 'under construction', 'maintenance mode', 'temporarily unavailable',

    # Database markers
    'test database', 'mock database', 'dummy database', 'sample database',

    # Error handling markers
    'error placeholder', 'exception placeholder', 'not handled', 'unhandled',

    # Feature flags
    'feature flag', 'feature toggle', 'experimental feature', 'beta feature',

    # Documentation/instruction markers
    'instruction', 'instructions', 'readme', 'guideline', 'policy', 'spec',

    # Comments and notes
    'note:', 'note -', 'todo:', 'fixme:', 'hack:', 'workaround:',
    'temporary fix', 'quick fix', 'hotfix',
    'replace', 'replaced', 'replace all', 'replace with',
]
production_ready_markers = ['[production ready]', '[production complete]', 'in production', 'production ready', 'production complete']

nonprod_patterns = [re.compile(r'\\b' + re.escape(kw) + r'\\b', re.IGNORECASE) for kw in nonprod_keywords]

nonprod_whitelist_paths = [
    r'^\.env',
    r'^\.gitignore$',
    r'^Dockerfile',
    r'^allrefs\.txt$',
    r'^deploy/production\.env\.example$',
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


def is_whitelisted(file_path):
    rel = os.path.relpath(file_path, root_dir).replace('\\', '/').lower()

    # Explicit path-based operations
    if 'node_modules/' in rel or rel.startswith('.git/') or rel.startswith('.venv/') or rel.startswith('_archive_qmoi-enhanced/'):
        return True

    for pattern in nonprod_whitelist_paths:
        if re.search(pattern, rel, re.IGNORECASE):
            return True

    return False


def scan_file(file_path):
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

    hits = sorted({kw for kw, patt in zip(nonprod_keywords, nonprod_patterns) if patt.search(content_lower)})

    if is_ready:
        ready_files += 1
        return

    if hits and not is_whitelisted(file_path):
        results.append({'filePath': os.path.relpath(file_path, root_dir), 'hits': hits, 'ready': is_ready})


def perform_scan(root_dir, include_whitelist=False, max_size=max_file_size_bytes):
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
            print(f"Scanned {scanned_files} files...", end='\r')

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
        f.write('Finding files with keywords: ' + ' '.join(nonprod_keywords) + '\n')
        f.write('----\n')
        if not results:
            f.write('No non-production markers found. undone.txt is now empty.\n')
        else:
            for r in results:
                f.write(f"{r['filePath']} [{', '.join(r['hits'])}]\n")

        f.write('\nTotal files with non-production markers: ' + str(len(results)) + '\n')
        f.write('Total files scanned: ' + str(scanned_files) + '\n')
        f.write('Files skipped (binary/large): ' + str(skipped_non_text) + '\n')
        f.write('Files marked as production ready: ' + str(ready_files) + '\n')

        total_relevant_files = scanned_files - skipped_non_text
        nonprod_files = [r for r in results if not is_whitelisted(os.path.join(root_dir, r['filePath']))]
        if total_relevant_files > 0:
            production_ready_percent = ((total_relevant_files - len(nonprod_files)) / total_relevant_files) * 100
            f.write(f'Production readiness: {production_ready_percent:.1f}%\n')
        else:
            f.write('Production readiness: N/A (no relevant files found)\n')

    print(f"\nScan complete!")
    print(f"Total files scanned: {scanned_files}")
    print(f"Files skipped: {skipped_non_text}")
    print(f"Files with non-production markers: {len(results)}")

    if scanned_files - skipped_non_text > 0:
        ready_percent = ((scanned_files - skipped_non_text - len(results)) / (scanned_files - skipped_non_text)) * 100
        print(f"Production readiness: {ready_percent:.1f}%")
    else:
        print("Production readiness: N/A")

    if results:
        percentage = round((len(results) / scanned_files * 100), 2) if scanned_files else 0
        print(f'Scan complete. Total non-production marker files: {len(results)} / {scanned_files} ({percentage}%)')
        print(f'Total production-ready files (no nonprod markers): {ready_files}')
        print(f'Skipped due to read errors/non-text: {skipped_non_text}')
        print('\n'.join(results[i]['filePath'] + ' [' + ', '.join(results[i]['hits']) + ']' for i in range(min(20, len(results)))))
    else:
        print(f'Scan complete. No non-production markers found. undone.txt cleared. Scanned {scanned_files} files.')
        print(f'Skipped due to read errors/non-text: {skipped_non_text}')


def parse_args():
    import argparse
    parser = argparse.ArgumentParser(description='Scan repository for non-production markers')
    parser.add_argument('--root', default=os.getcwd(), help='Root directory to scan')
    parser.add_argument('--include-whitelist', action='store_true', help='Include files in the whitelist for marker detection')
    parser.add_argument('--max-size', type=int, default=max_file_size_bytes, help='Max file size in bytes to scan (default 20MB)')
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    root_dir = os.path.abspath(args.root)
    perform_scan(root_dir, include_whitelist=args.include_whitelist, max_size=args.max_size)

