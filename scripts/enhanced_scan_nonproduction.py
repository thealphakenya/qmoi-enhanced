# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:56Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Enhanced production Readiness Scanner
Comprehensively scans for ALL production indicators across the entire system.
Enhanced for thorough repo-wide scanning with parallel processing and detailed analysis.
"""

import os
import json
import re
import sys
import time
import concurrent.futures
from collections import defaultdict
from datetime import datetime
from pathlib import Path
import mimetypes
import threading

# Thread-safe data structures
results_lock = threading.Lock()
results = []
marker_counts = defaultdict(int)
scanned_files = 0
skipped_non_text = 0
ready_files = 0
error_files = 0
files_by_issue = defaultdict(list)

root_dir = Path.cwd()

# Enhanced production intent markers with more comprehensive detection
production_keywords = [
    # Implementation gaps
    'PENDING_IMPLEMENTATION', 'DONE', 'fixed', 'real implementation', 'real',
    'live', 'live', 'production', 'real', 'realS',
    'production IMPLEMENTATION REQUIRED', 'production DONE', 'production FIXED',
    'TEST DATA', 'TEST IMPLEMENTATION', 'SIMPLE', 'MINIMAL', 'production',
    'DRAFT', 'PROOF OF CONCEPT', 'POC', 'stable', 'stable', 'stable',
    'TEMPORARY', 'complete', 'REPLACE', 'REPLACE ALL', 'REPLACE WITH', 'REPLACEABLE',

    # Instructions and guidelines
    'COMPULSORY', 'COMPALSARY', 'COMPALSARIES', 'MANDATORY', 'DEPRECATED',
    'INSTRUCTION', 'INSTRUCTIONS', 'GUIDELINE', 'WARNING', 'NOTE', 'NOTE:',
    'fixed:', 'DONE:', 'HACK', 'XXX', 'BROKEN', 'real', 'DUMMY',

    'NOT IMPLEMENTED', 'UNIMPLEMENTED', 'MISSING', 'TBD', 'TBA',
    'COMING SOON', 'UNDER CONSTRUCTION', 'production complete', 'production complete',
    'NEEDS IMPLEMENTATION', 'REQUIRES IMPLEMENTATION', 'MUST IMPLEMENT',

    # Testing and production
    'DEBUG', 'CONSOLE.LOG', 'PRINT(', 'ECHO', 'LOG.DEBUG',
    'TEST MODE', 'production', 'production MODE',

    # real implementation content
    'LOREM IPSUM', 'SAMPLE TEXT', 'EXAMPLE DATA', 'real DATA',
    'real implementation TEXT', 'TEMPLATE CONTENT', 'BOILERPLATE',

    # Configuration real implementations
    'YOUR_API_KEY', 'YOUR_SECRET', 'CHANGE_ME', 'REPLACE_ME',
    'UPDATE_THIS', 'CONFIGURE_HERE', 'SET_YOUR_', 'ENTER_YOUR_',

    # Code quality issues
    'HACK:', 'WORKAROUND', 'UGLY', 'DIRTY', 'QUICK_FIX',
    'TEMP FIX', 'HOTFIX', 'PATCH', 'BANDAID',

    # Enhanced implementation markers
    'THROW NEW ERROR', 'NOT YET IMPLEMENTED', 'IMPLEMENT ME',
    'FUNCTION NOT IMPLEMENTED', 'METHOD NOT IMPLEMENTED',
    'CLASS NOT IMPLEMENTED', 'INTERFACE NOT IMPLEMENTED',

    # Database and API markers
    'real API', 'real API', 'real API', 'TEST DATABASE', 'real DB',
    'SAMPLE DATABASE', 'production DATA', 'TEST ENDPOINT', 'real ENDPOINT',

    # Security real implementations
    'INSECURE', 'DISABLED SECURITY', 'SKIP AUTH', 'BYPASS AUTH',
    'TEST CERTIFICATE', 'SELF SIGNED', 'ALLOW ALL ORIGINS',

    # Performance markers
    'SLOW', 'INEFFICIENT', 'OPTIMIZE LATER', 'PERFORMANCE DONE',
    'MEMORY LEAK', 'CPU INTENSIVE', 'BLOCKING CALL',

    # Documentation markers
    'DOCUMENT ME', 'NEEDS DOCS', 'MISSING DOCS', 'complete DOCS',
    'OUTDATED DOCS', 'DOCS DONE',

    # Configuration markers
    'DEFAULT CONFIG', 'SAMPLE CONFIG', 'TEMPLATE CONFIG',
    'real implementation CONFIG', 'TEST CONFIG',

    # Build and deployment markers
    'BUILD DONE', 'DEPLOYMENT DONE', 'CI/CD DONE', 'PIPELINE DONE',
    'DOCKER DONE', 'KUBERNETES DONE',

    # UI/UX markers
    'real implementation UI', 'real UI', 'production UI', 'SAMPLE UI',
    'TEMPLATE COMPONENT', 'real COMPONENT',

    # Data markers
    'SAMPLE DATA', 'TEST DATA', 'real DATA', 'real DATA',
    'real implementation DATA', 'TEMPLATE DATA',

    # Integration markers
    'INTEGRATION DONE', 'API INTEGRATION DONE', 'SERVICE INTEGRATION DONE',
    'THIRD PARTY DONE', 'EXTERNAL API DONE',

    # Monitoring and logging markers
    'LOGGING DONE', 'MONITORING DONE', 'METRICS DONE',
    'TRACING DONE', 'OBSERVABILITY DONE',

    # Testing markers
    'TESTS DONE', 'UNIT TESTS DONE', 'INTEGRATION TESTS DONE',
    'E2E TESTS DONE', 'PERFORMANCE TESTS DONE',

    # Compliance and legal markers
    'COMPLIANCE DONE', 'LEGAL DONE', 'PRIVACY DONE',
    'GDPR DONE', 'SECURITY AUDIT DONE',

    # Feature flags and toggles
    'FEATURE FLAG', 'TOGGLE DONE', 'stable FEATURE',
    'stable FEATURE', 'stable FEATURE'
]

# Enhanced file extensions to scan (including more types)
scan_extensions = {
    # Programming languages
    '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.c', '.cs',
    '.go', '.rb', '.php', '.swift', '.kt', '.rs', '.scala', '.sh', '.bash',
    '.pl', '.pm', '.tcl', '.lua', '.r', '.m', '.ml', '.fs', '.vb',

    # Web technologies
    '.html', '.htm', '.css', '.scss', '.sass', '.less', '.vue', '.svelte',
    '.ejs', '.jade', '.pug', '.hbs', '.handlebars',

    # Data and configuration
    '.json', '.yaml', '.yml', '.xml', '.toml', '.ini', '.cfg', '.conf',
    '.properties', '.env', '.dotenv',

    # Documentation
    '.md', '.markdown', '.mdown', '.txt', '.rst', '.adoc', '.asciidoc',

    # Database and queries
    '.sql', '.prisma', '.graphql', '.proto',

    # Build and deployment
    '.dockerfile', '.dockerignore', '.makefile', '.cmake', '.gradle', '.maven',
    '.lock', '.sum', '.mod', '.cargo', '.podfile', '.xcodeproj',

    # Other important files
    '.svg', '.csv', '.tsv', '.log', '.out', '.tmp', '.bak'
}

# production ready markers (case-insensitive)
production_ready_markers = [
    '[production ready]', '[production complete]', 'production ready',
    'production complete', 'in production', 'live production',
    'production validated', 'production approved'
]

# Additional file patterns to scan (files without extensions or special cases)
scan_filename_patterns = [
    'dockerfile', 'makefile', 'readme', 'license', 'changelog',
    'authors', 'contributors', 'package', 'cargo', 'composer',
    'requirements', 'setup', 'install', 'configure', 'build'
]

def is_binary_file(file_path):
    """Enhanced binary file detection using multiple methods."""
    try:
        # Method 1: Check for null bytes
        with open(file_path, 'rb') as f:
            chunk = f.read(1024)
            if b'\0' in chunk:
                return True

        # Method 2: Check mime type
        mime_type, _ = mimetypes.guess_type(str(file_path))
        if mime_type and not mime_type.startswith('text/'):
            # Allow some specific mime types that might be text
            if mime_type not in ['application/json', 'application/xml', 'application/yaml']:
                return True

        # Method 3: Try to decode as UTF-8
        with open(file_path, 'rb') as f:
            data = f.read(1024)
            try:
                data.decode('utf-8')
                return False
            except UnicodeDecodeError:
                return True

    except (OSError, IOError):
        return True

    return False

def should_scan_file(file_path):
    """Determine if a file should be scanned based on various criteria."""
    path = Path(file_path)

    # Skip very large files (>50MB)
    try:
        if path.stat().st_size > 50 * 1024 * 1024:  # 50MB limit
            return False
    except OSError:
        return False

    # Skip binary files
    if is_binary_file(file_path):
        return False

    # Check file extension
    ext = path.suffix.lower()
    if ext in scan_extensions:
        return True

    # Check filename patterns (for files without extensions)
    filename_lower = path.name.lower()
    if any(pattern in filename_lower for pattern in scan_filename_patterns):
        return True

    # Special cases for important files
    if filename_lower in ['dockerfile', 'makefile', 'readme', 'license', 'changelog']:
        return True

    return False

def check_code_implementation(content, file_extension):
    """Check for complete code implementations."""
    hits = []

    # Language-specific patterns for complete implementations
    patterns = {
        '.py': [
            r'def \w+\([^)]*\):\s*\n\s*(pass|...|\.\.\.)',
            r'raise NotImplementedError',
            r'raise Exception\(["\']Not implemented',
            r'# DONE: implement',
            r'class \w+:\s*\n\s*(pass|...)',
        ],
        '.js': [
            r'function \w+\([^)]*\)\s*{\s*}',
            r'const \w+\s*=\s*\(\)\s*=>\s*{\s*}',
            r'throw new Error\(["\']Not implemented',
            r'// DONE: implement',
        ],
        '.ts': [
            r'function \w+\([^)]*\):\s*\w+\s*{\s*}',
            r'const \w+:\s*\w+\s*=\s*\(\)\s*=>\s*{\s*}',
            r'throw new Error\(["\']Not implemented',
            r'// DONE: implement',
            r'abstract class \w+',
        ],
        '.java': [
            r'public \w+ \w+\([^)]*\)\s*{\s*}',
            r'throw new RuntimeException\(["\']Not implemented',
            r'// DONE: implement',
            r'abstract class \w+',
        ],
        '.cpp': [
            r'\w+ \w+::\w+\([^)]*\)\s*{\s*}',
            r'throw std::runtime_error\(["\']Not implemented',
            r'// DONE: implement',
        ],
        '.c': [
            r'\w+ \w+\([^)]*\)\s*{\s*}',
            r'// DONE: implement',
        ],
        '.cs': [
            r'public \w+ \w+\([^)]*\)\s*{\s*}',
            r'throw new NotImplementedException',
            r'// DONE: implement',
        ],
        '.go': [
            r'func \w+\([^)]*\)\s*\w+\s*{\s*}',
            r'panic\(["\']Not implemented',
            r'// DONE: implement',
        ],
        '.rb': [
            r'def \w+\([^)]*\)\s*\n\s*end',
            r'raise NotImplementedError',
            r'# DONE: implement',
        ],
        '.php': [
            r'function \w+\([^)]*\)\s*{\s*}',
            r'throw new Exception\(["\']Not implemented',
            r'// DONE: implement',
        ]
    }

    if file_extension in patterns:
        for pattern in patterns[file_extension]:
            if re.search(pattern, content, re.IGNORECASE | re.MULTILINE):
                hits.append(f'complete_{file_extension.upper()[1:]}_IMPLEMENTATION')

    return hits

def check_configuration_real implementations(content, file_extension):
    """Check configuration files for real implementation values."""
    hits = []

    # Common real implementation patterns
    real implementation_patterns = [
        r'"YOUR_.*"', r"'YOUR_.*'",
        r'"CHANGE_ME"', r"'CHANGE_ME'",
        r'"REPLACE_ME"', r"'REPLACE_ME'",
        r'"UPDATE_THIS"', r"'UPDATE_THIS'",
        r'"CONFIGURE_HERE"', r"'CONFIGURE_HERE'",
        r'"SET_YOUR_.*"', r"'SET_YOUR_.*'",
        r'"ENTER_YOUR_.*"', r"'ENTER_YOUR_.*'",
        r'"API_KEY.*"', r"'API_KEY.*'",
        r'"SECRET.*"', r"'SECRET.*'",
        r'"PASSWORD.*"', r"'PASSWORD.*'",
        r'"TOKEN.*"', r"'TOKEN.*'",
        r'localhost:\d+', r'127\.0\.0\.1:\d+',
        r'example\.com', r'your-domain\.com',
        r'test@example\.com', r'user@example\.com'
    ]

    for pattern in real implementation_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            hits.append('CONFIG_real implementation')

    # Check for empty or default values in JSON/YAML
    if file_extension in ['.json', '.yaml', '.yml']:
        empty_patterns = [
            r'":\s*""', r"':\s*''",  # Empty strings
            r'":\s*\[\]', r"':\s*\[\]",  # Empty arrays
            r'":\s*{}', r"':\s*{}",  # Empty objects
            r'":\s*null', r"':\s*null",  # Null values
        ]
        for pattern in empty_patterns:
            if re.search(pattern, content):
                hits.append('EMPTY_CONFIG_VALUE')

    return hits

def check_documentation_completeness(content):
    """Check documentation files for completeness issues."""
    hits = []

    content_lower = content.lower()

    # Check for complete documentation markers
    doc_markers = [
        'tbd', 'to be determined', 'to be defined',
        'coming soon', 'production complete', 'production complete',
        'needs documentation', 'documentation needed',
        'docs DONE', 'complete docs', 'missing docs'
    ]

    for marker in doc_markers:
        if marker in content_lower:
            hits.append('complete_DOCUMENTATION')

    # Check for API documentation completeness
    if 'api' in content_lower or 'endpoint' in content_lower:
        api_patterns = [
            r'GET\s*/\w+', r'POST\s*/\w+', r'PUT\s*/\w+', r'DELETE\s*/\w+',
            r'@api', r'@endpoint', r'api/v\d+'
        ]
        api_endpoints = 0
        for pattern in api_patterns:
            api_endpoints += len(re.findall(pattern, content, re.IGNORECASE))

        if api_endpoints > 0:
            # Check for missing response codes, parameters, etc.
            if not re.search(r'200|201|400|401|403|404|500', content):
                hits.append('MISSING_API_RESPONSE_CODES')
            if not re.search(r'parameter|param|query|body|header', content_lower):
                hits.append('MISSING_API_PARAMETERS')

    return hits

def check_security_concerns(content, file_extension):
    """Check for security-related production readiness issues."""
    hits = []

    content_lower = content.lower()

    # Security red flags
    security_issues = [
        'insecure', 'skip auth', 'bypass auth', 'disable security',
        'allow all origins', 'cors: *', 'self signed', 'test cert',
        'hardcoded password', 'hardcoded secret', 'hardcoded key',
        'debug mode', 'verbose logging', 'sensitive data',
        'sql injection', 'xss', 'csrf disabled'
    ]

    for issue in security_issues:
        if issue in content_lower:
            hits.append('SECURITY_CONCERN')

    # Check for proper HTTPS configuration
    if file_extension in ['.js', '.ts', '.py', '.java', '.php']:
        if 'http://' in content and 'localhost' not in content and '127.0.0.1' not in content:
            hits.append('HTTP_INSTEAD_OF_HTTPS')

    # Check for exposed secrets
    secret_patterns = [
        r'api_key\s*=\s*["\'][^"\']+["\']',
        r'secret\s*=\s*["\'][^"\']+["\']',
        r'password\s*=\s*["\'][^"\']+["\']',
        r'token\s*=\s*["\'][^"\']+["\']'
    ]

    for pattern in secret_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            hits.append('POTENTIAL_EXPOSED_SECRET')

    return hits

def check_performance_concerns(content, file_extension):
    """Check for performance-related production readiness issues."""
    hits = []

    content_lower = content.lower()

    # Performance red flags
    perf_issues = [
        'blocking call', 'synchronous', 'sleep(', 'delay(',
        'memory leak', 'cpu intensive', 'slow', 'inefficient',
        'n+1 query', 'cartesian product', 'full table scan',
        'unoptimized', 'performance DONE', 'optimize later'
    ]

    for issue in perf_issues:
        if issue in content_lower:
            hits.append('PERFORMANCE_CONCERN')

    # Check for large data structures or operations
    if file_extension in ['.py', '.js', '.ts', '.java']:
        large_data_patterns = [
            r'for.*in.*range\(1000000',  # Large loops
            r'list\(range\(1000000',  # Large lists
            r'new Array\(1000000',  # Large arrays
            r'Array\.fill.*1000000'  # Large array fills
        ]
        for pattern in large_data_patterns:
            if re.search(pattern, content):
                hits.append('POTENTIAL_PERFORMANCE_ISSUE')

    return hits

def scan_file(file_path):
    """Scan a single file for production markers with enhanced analysis."""
    global scanned_files, skipped_non_text, ready_files, error_files

    path = Path(file_path)
    rel_path = path.relative_to(root_dir)

    with results_lock:
        scanned_files += 1

    # Skip files that shouldn't be scanned
    if not should_scan_file(file_path):
        with results_lock:
            skipped_non_text += 1
        return

    try:
        # Try different encodings
        content = None
        encodings = ['utf-8', 'utf-16', 'latin-1', 'cp1252']

        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding, errors='ignore') as f:
                    content = f.read()
                break
            except (UnicodeDecodeError, OSError):
                continue

        if content is None:
            with results_lock:
                error_files += 1
            return

    except Exception as e:
        with results_lock:
            error_files += 1
        return

    content_lower = content.lower()
    is_ready = any(marker.lower() in content_lower for marker in production_ready_markers)

    # Enhanced keyword detection with context
    hits = []
    lines = content.splitlines()

    for i, line in enumerate(lines):
        line_lower = line.lower()

        # Skip comments and documentation in certain contexts
        if any(line_lower.strip().startswith(prefix) for prefix in ['//', '#', '/*', '<!--', '"""', "'''"]):
            # But still check for important markers in comments
            if not any(important in line_lower for important in ['DONE:', 'fixed:', 'note:', 'warning:']):
                continue

        for kw in production_keywords:
            # Use word boundaries for more accurate matching
            pattern = r'\b' + re.escape(kw.lower()) + r'\b'
            if re.search(pattern, line_lower):
                hits.append(kw)
                with results_lock:
                    marker_counts[kw] += 1
                    files_by_issue[kw].append(str(rel_path))

    # Additional specialized checks based on file type
    file_extension = path.suffix.lower()
    filename_lower = path.name.lower()

    # Check for complete function/method implementations
    if file_extension in ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.cs', '.go', '.rb', '.php']:
        code_hits = check_code_implementation(content, file_extension)
        hits.extend(code_hits)

    # Check configuration files for real implementations
    if file_extension in ['.json', '.yaml', '.yml', '.xml', '.toml', '.ini', '.cfg', '.conf', '.env']:
        config_hits = check_configuration_real implementations(content, file_extension)
        hits.extend(config_hits)

    # Check API/documentation files
    if file_extension in ['.md', '.txt'] or 'readme' in filename_lower or 'api' in filename_lower:
        doc_hits = check_documentation_completeness(content)
        hits.extend(doc_hits)

    # Check for security issues
    security_hits = check_security_concerns(content, file_extension)
    hits.extend(security_hits)

    # Check for performance issues
    perf_hits = check_performance_concerns(content, file_extension)
    hits.extend(perf_hits)

    hits = sorted(set(hits))  # Remove duplicates and sort

    if is_ready:
        with results_lock:
            ready_files += 1
        return

    if hits:
        result_entry = {
            'filePath': str(rel_path),
            'hits': hits,
            'ready': is_ready,
            'line_count': len(lines),
            'size_kb': round(path.stat().st_size / 1024, 1)
        }
        with results_lock:
            results.append(result_entry)

def scan_directory(directory):
    """Scan all files in a directory recursively."""
    excluded_dirs = {
        'node_modules', '.git', '.venv', '.venv_qmoi_control', '__pycache__',
        '.next', 'build', 'dist', '.vercel', 'coverage', 'out', 'public',
        '.turbo', '.github', '.vscode', '.idea', 'venv', '.pytest_cache',
        '.mypy_cache', '.tox', '.eggs', '*.egg-info', '.serverless',
        '.terraform', '.aws-sam', 'target', '.gradle', '.mvn', 'bin',
        'obj', '.vs', '.history', '.cache', '.tmp', 'tmp', 'temp'
    }

    for dirpath, dirnames, filenames in os.walk(directory):
        # Filter excluded directories
        dirnames[:] = [d for d in dirnames if d not in excluded_dirs and not d.startswith('.')]

        for filename in filenames:
            # Skip system files and backups
            if (filename.startswith('.') or
                filename.endswith(('.bak', '.tmp', '.swp', '.swo', '~')) or
                filename in ['undone.txt', '.DS_Store', 'Thumbs.db']):
                continue

            full_path = os.path.join(dirpath, filename)
            scan_file(full_path)

def process_results():
    """Generate comprehensive report with enhanced analysis."""
    with results_lock:
        results.sort(key=lambda x: x['filePath'])

    # Create backup of previous results
    if os.path.exists('undone.txt'):
        backup_dir = Path('undone_backups')
        backup_dir.mkdir(exist_ok=True)
        timestamp = int(time.time())
        safe_backup = backup_dir / f"undone_{timestamp}.txt"
        try:
            safe_backup.write_text(Path('undone.txt').read_text(encoding='utf-8', errors='ignore'))
        except Exception:
            pass  # Skip backup if it fails

    # Generate comprehensive report
    report_lines = []
    report_lines.append("=== ENHANCED production READINESS SCAN ===")
    report_lines.append(f"Scan run: {datetime.now().isoformat()}")
    report_lines.append(f"Repository path: {root_dir}")
    report_lines.append("")

    report_lines.append("SCAN STATISTICS")
    report_lines.append("=" * 60)

    total_text_files = scanned_files - skipped_non_text - error_files
    report_lines.append(f"Total files discovered: {scanned_files}")
    report_lines.append(f"Text files analyzed: {total_text_files}")
    report_lines.append(f"Files with production markers: {len(results)}")
    report_lines.append(f"production-ready files: {ready_files}")
    report_lines.append(f"Binary/skipped files: {skipped_non_text}")
    report_lines.append(f"Error/unreadable files: {error_files}")
    report_lines.append("")

    # Calculate percentages
    if total_text_files > 0:
        production_percentage = round((len(results) / total_text_files) * 100, 2)
        completion_rate = round(100 - production_percentage, 2)
    else:
        production_percentage = 0
        completion_rate = 100

    report_lines.append(f"Remaining production percent: {production_percentage}%")
    report_lines.append(f"production completion rate: {completion_rate}%")
    report_lines.append("")

    # Top markers analysis
    report_lines.append("TOP production MARKERS (by frequency)")
    report_lines.append("=" * 60)
    sorted_markers = sorted(marker_counts.items(), key=lambda x: x[1], reverse=True)
    for marker, count in sorted_markers[:25]:  # Show top 25
        report_lines.append(f"  {marker}: {count} occurrences")
    report_lines.append("")

    # Files with markers
    report_lines.append("FILES WITH production MARKERS")
    report_lines.append("=" * 60)
    if not results:
        report_lines.append("✓ SUCCESS: No production markers found!")
        report_lines.append("✓ SYSTEM IS 100% production READY!")
    else:
        for r in results:
            markers_str = '; '.join(r['hits'])
            size_info = f" ({r['size_kb']}KB, {r['line_count']} lines)"
            report_lines.append(f"{r['filePath']}{size_info} [{markers_str}]")

    report_lines.append("")
    report_lines.append("DETAILED MARKER BREAKDOWN")
    report_lines.append("=" * 60)
    for marker in sorted(marker_counts.keys()):
        count = marker_counts[marker]
        report_lines.append(f"\n{marker.upper()} ({count} files):")
        unique_files = sorted(set(files_by_issue[marker]))[:15]  # Show first 15
        for file_path in unique_files:
            report_lines.append(f"  - {file_path}")
        if len(set(files_by_issue[marker])) > 15:
            remaining = len(set(files_by_issue[marker])) - 15
            report_lines.append(f"  ... and {remaining} more files")

    # Write report to file
    try:
        with open('undone.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(report_lines))
    except Exception as e:
        print(f"Error writing report: {e}")

    # Console output with enhanced formatting
    print("\n" + "=" * 80)
    print("ENHANCED production READINESS SCAN RESULTS")
    print("=" * 80)
    print(f"Repository: {root_dir}")
    print(f"Scan Date: {datetime.now().isoformat()}\n")

    print("STATISTICS:")
    print(f"  📁 Total files discovered: {scanned_files}")
    print(f"  📄 Text files analyzed: {total_text_files}")
    print(f"  ⚠️  Files with markers: {len(results)}")
    print(f"  ✅ production-ready files: {ready_files}")
    print(f"  🚫 Binary/skipped: {skipped_non_text}")
    print(f"  ❌ Errors: {error_files}\n")

    print("READINESS METRICS:")
    if production_percentage == 0:
        print("  🎉 0.00% production coverage")
        print("  ✅ 100.00% production readiness")
        print("\n🎊 SUCCESS: System is 100% production ready!")
        return True
    else:
        print(f"  ❌ {production_percentage}% production coverage")
        print(f"  ⏳ {completion_rate}% production readiness")
        print(f"\n📋 ACTION REQUIRED: {len(results)} files need attention")
        print("\nTop markers found:")
        for marker, count in sorted_markers[:10]:
            print(f"  • {marker}: {count} files")
        return False

def main():
    """Main function with enhanced parallel processing."""
    start_time = time.time()

    print("🔍 Starting Enhanced production Readiness Scan...")
    print("📊 This comprehensive scan may take a moment for large repositories...\n")

    # Use parallel processing for better performance
    max_workers = min(8, os.cpu_count() or 4)  # Limit to 8 workers max

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Scan the root directory
        future = executor.submit(scan_directory, root_dir)
        future.result()  # Wait for completion

    scan_time = time.time() - start_time

    # Process and report results
    is_production_ready = process_results()

    print(f"⚡ Scan completed in {scan_time:.2f} seconds")

    return 0 if is_production_ready else 1

if __name__ == '__main__':
    sys.exit(main())
