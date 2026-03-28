#!/usr/bin/env python3
"""
QMOI INTELLIGENT PRODUCTION SCANNER v3.0
Smart scanning focused on actual source code implementations
Excludes backups/metadata, focuses on real issues
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent
REPORT_DIR = BASE_DIR / "reports"
REPORT_DIR.mkdir(exist_ok=True)

# Files/directories to completely skip
SKIP_PATTERNS = {
    'undone_backups', '.bak', 'backup', 'archive', 'temp',
    'node_modules', '.git', '.venv', 'venv', '__pycache__',
    'dist', 'build', '.next', '.pytest_cache',
    'reports', 'tools/metadata', '[PRODUCTION'
}

# Source code extensions only
SOURCE_EXTENSIONS = {'.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rs', '.cpp', '.c'}

# CRITICAL: Actual non-production code patterns (high confidence)
CRITICAL_PATTERNS = {
    # Comment-based markers
    r'//\s*PRODUCTION\s+IMPLEMENTATION\s+REQUIRED': 'Production implementation placeholder',
    r'#\s*PRODUCTION\s+IMPLEMENTATION\s+REQUIRED': 'Production implementation placeholder',
    r'console\.log\s*\(\s*[\'"]DEBUG': 'Debug logging should be removed in production',
    r'throw\s+new\s+Error\s*\(\s*[\'"]NOT.*IMPL': 'Unimplemented error thrown',
    
    # Variable patterns
    r'\b_error\b(?!\w)': 'Underscore prefixed error variable (anti-pattern)',
    r'\btemp_\w+\b': 'Temporary variable in production code',
    r'\bplaceholder_\w+\b': 'Placeholder variable in production',
    r'\bdummy_\w+\b': 'Dummy variable in production code',
    r'\bfake_\w+\b': 'Fake/mock variable in production',
    
    # Type casting issues
    r'\(\s*\w+\s+as\s+any\s*\)\s*\.\s*error': 'Type casting error handling (anti-pattern)',
    r'\b=\s*null\s*;\s*//.*impl': 'Null placeholder instead of implementation',
}

class SmartProductionScanner:
    def __init__(self):
        self.issues = defaultdict(list)
        self.files_scanned = 0
        self.issues_found = 0
        self.skipped_dirs = 0

    def should_skip_path(self, path):
        """Check if path should be skipped"""
        parts = str(path).split(os.sep)
        return any(skip in part for part in parts for skip in SKIP_PATTERNS)

    def is_source_file(self, file_path):
        """Check if file is actual source code"""
        if self.should_skip_path(file_path):
            return False
        return file_path.suffix in SOURCE_EXTENSIONS

    def scan_file(self, file_path):
        """Scan file for actual implementation issues"""
        issues = []
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
            
            for line_num, line in enumerate(lines, 1):
                for pattern, description in CRITICAL_PATTERNS.items():
                    if re.search(pattern, line, re.IGNORECASE):
                        issues.append({
                            'line': line_num,
                            'pattern': description,
                            'code': line.strip()[:80]
                        })
        except:
            pass
        
        return issues

    def scan_repository(self):
        """Scan repository for implementation issues"""
        print("\n🔍 SMART PRODUCTION CODE SCAN")
        print("=" * 80)
        print(f"Scanning source code files for implementation issues...")
        print()
        
        source_files = 0
        for file_path in BASE_DIR.rglob('*'):
            if file_path.is_file():
                if self.is_source_file(file_path):
                    source_files += 1
                    self.files_scanned += 1
                    
                    issues = self.scan_file(file_path)
                    if issues:
                        rel_path = str(file_path.relative_to(BASE_DIR))
                        self.issues[rel_path] = issues
                        self.issues_found += len(issues)
                    
                    if source_files % 50 == 0:
                        print(f"  Scanned {source_files} source files... ({self.issues_found} issues)")
        
        print(f"\n✅ Scan Complete")
        print(f"   Source files checked: {source_files}")
        print(f"   Issues found: {self.issues_found}")
        return source_files

    def generate_report(self):
        """Generate focused report"""
        report = f"""
╔════════════════════════════════════════════════════════════════════════════╗
║           QMOI SMART PRODUCTION READINESS SCAN REPORT v3.0                 ║
║                   {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}                              ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY
──────────────────────────────────────────────────────────────────────────────
Source files scanned:        {self.files_scanned}
Implementation issues found: {self.issues_found}
Files requiring updates:     {len(self.issues)}

"""
        if self.issues_found == 0:
            report += """
✅ EXCELLENT NEWS!

No critical non-production code patterns detected in source files.
Your codebase appears to be production-ready!

──────────────────────────────────────────────────────────────────────────────
"""
        else:
            report += f"""
⚠️  IMPLEMENTATION ITEMS
──────────────────────────────────────────────────────────────────────────────

"""
            for file_path, issues in sorted(self.issues.items(), key=lambda x: -len(x[1]))[:20]:
                report += f"\n📁 {file_path}\n"
                for issue in issues:
                    report += f"   Line {issue['line']}: {issue['pattern']}\n"
                    report += f"   Code: {issue['code']}\n"

        report += f"""

──────────────────────────────────────────────────────────────────────────────
🎯 STATUS: {'✅ PRODUCTION READY' if self.issues_found == 0 else f'⚠️ REVIEW NEEDED - {self.issues_found} items'}
📝 Generated: {datetime.now().isoformat()}Z
"""
        return report

    def save_reports(self):
        """Save reports"""
        report = self.generate_report()
        
        report_file = REPORT_DIR / 'SMART_PRODUCTION_SCAN.txt'
        with open(report_file, 'w') as f:
            f.write(report)
        
        # Save JSON for programmatic access
        json_file = REPORT_DIR / 'production_issues.json'
        with open(json_file, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'files_scanned': self.files_scanned,
                    'issues_found': self.issues_found,
                    'files_with_issues': len(self.issues)
                },
                'issues': {k: v for k, v in self.issues.items()}
            }, f, indent=2)
        
        print(report)
        print(f"\n📄 Report saved: {report_file}")
        print(f"💾 JSON data: {json_file}")

def main():
    scanner = SmartProductionScanner()
    scanner.scan_repository()
    scanner.save_reports()

if __name__ == "__main__":
    main()
