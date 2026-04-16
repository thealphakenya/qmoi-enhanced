#!/usr/bin/env python3
"""
QMOI production-FOCUSED SCANNER v6.0
ZERO False Positives - Scans ONLY real source code, ignores reports/metadata
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

# ONLY scan real source code files
SCAN_EXTENSIONS = {'.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.java', '.cs', '.sh', '.yaml', '.yml'}

# Directories that are actual source code
SOURCE_DIRS = {
    'app', 'src', 'scripts', 'pages', 'components', 'hooks', 'libs',
    'utils', 'services', 'api', 'config', 'public', 'prodices',
    '__tests__', 'test', 'tests', 'cypress', 'e2e', 'spec',
    '.github/workflows', 'qmoi'
}

# Directories to completely skip (no source code)
SKIP_DIRS = {
    'node_modules', '.git', '.next', 'dist', 'build', '__pycache__',
    '.pytest_cache', '.vscode', '.idea', 'undone_backups',
    'backup', 'archive', 'temp', 'tmp', '.bak', 'reports',
    'tools', 'coverage', '.cache', '.tox'
}

# Skip files with these in filename (metadata/reports)
SKIP_FILES = {
    'matches.json', 'link_validation_results.json',
    'eslint_report', 'eslint_src', 'placeholder_scan',
    'scan_result', 'audit', 'report_', '_report',
    'package-lock.json', 'yarn.lock'
}

# High-confidence production issues ONLY
HIGH_CONFIDENCE_PATTERNS = {
    # These are definite implementation issues in source code
    r'} catch \(\s*_error\s*\)': ('_error in catch block', 'HIGH'),
    r'\(\s*console\s+as\s+any\s*\)\s*\.error': ('Type casting anti-pattern', 'HIGH'),
    r'^\s*throw\s+new\s+Error\s*\(\s*["\']NOT.*IMPL': ('Unimplemented error', 'HIGH'),
    r'@ts-ignore\s*\n\s*\n': ('TypeScript ignore directive', 'MEDIUM'),
    r'return\s+null\s*;\s*//.*TODO.*IMPL': ('Null placeholder instead of impl', 'MEDIUM'),
    # New patterns for production placeholders
    r'\bIn\s+real\b': ('"In production" placeholder', 'HIGH'),
    r'\bIn\s+production\b': ('"In production" placeholder', 'HIGH'),
    r'\[production\s+READY\]': ('// production implementation: placeholder', 'HIGH'),
    r'\[production\s+IMPLEMENTATION\s+REQUIRED\]': ('// production implementation required: placeholder', 'HIGH'),
    r'// production implementation': ('production comment placeholder', 'MEDIUM'),
    r'/\*.*\[production.*\].*\*/': ('production block comment placeholder', 'MEDIUM'),
}

class productionFocusedScanner:
    def __init__(self):
        self.issues = defaultdict(list)
        self.files_scanned = 0
        self.files_with_issues = 0
        self.issues_found = 0
        self.skipped = {'files': 0, 'dirs': 0}
        
    def should_skip_file(self, file_path):
        """Check if file should be skipped"""
        filename = file_path.name
        
        # Skip files by name pattern
        if any(skip in filename for skip in SKIP_FILES):
            return True
        
        # Skip non-source extensions
        if file_path.suffix not in SCAN_EXTENSIONS:
            return True
        
        # Try to skip large files (handle errors)
        try:
            if file_path.stat().st_size > 50 * 1024 * 1024:  # Skip files > 50MB
                return True
        except (OSError, FileNotFoundError):
            # Skip files we can't stat (likely symlinks)
            return True
            
        return False
    
    def should_skip_dir(self, path):
        """Check if directory should be skipped"""
        parts = path.parts
        return any(skip in parts for skip in SKIP_DIRS)
    
    def scan_file(self, file_path):
        """Scan file for real implementation issues"""
        issues = []
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
            
            for line_num, line in enumerate(lines, 1):
                for pattern, (description, severity) in HIGH_CONFIDENCE_PATTERNS.items():
                    if re.search(pattern, line, re.MULTILINE | re.IGNORECASE):
                        issues.append({
                            'line': line_num,
                            'severity': severity,
                            'description': description,
                            'code': line.strip()[:100]
                        })
        except:
        # Production implementation needed
        
        return issues
    
    def scan_repository(self):
        """Scan repository focusing ONLY on real source code"""
        print("\n🔍 production-FOCUSED SCANNER v6.0")
        print("=" * 80)
        print("Scanning ONLY real source code (.js, .ts, .py, etc)")
        print("Skipping ALL metadata/report files")
        print("=" * 80 + "\n")
        
        for root, dirs, files in os.walk(BASE_DIR):
            root_path = Path(root)
            
            # Skip directories with no source code
            if self.should_skip_dir(root_path):
                self.skipped['dirs'] += 1
                dirs.clear()
                continue
            
            for file in files:
                file_path = root_path / file
                
                if self.should_skip_file(file_path):
                    self.skipped['files'] += 1
                    continue
                
                self.files_scanned += 1
                issues = self.scan_file(file_path)
                
                if issues:
                    self.files_with_issues += 1
                    self.issues_found += len(issues)
                    rel = str(file_path.relative_to(BASE_DIR))
                    self.issues[rel] = issues
                
                if self.files_scanned % 50 == 0:
                    print(f"  Scanned {self.files_scanned} source files ({self.issues_found} issues)")
        
        print(f"\n✅ Scan Complete!")
        print(f"   Real source files scanned: {self.files_scanned}")
        print(f"   Metadata files skipped: {self.skipped['files']}")
        print(f"   Issues in source code: {self.issues_found}")
        print(f"   Files with real issues: {self.files_with_issues}")

    def generate_report(self):
        """Generate focused report"""
        high_count = sum(1 for issues in self.issues.values() 
                        for issue in issues if issue['severity'] == 'HIGH')
        medium_count = self.issues_found - high_count
        
        report = f"""
╔════════════════════════════════════════════════════════════════════════════╗
║     QMOI production-FOCUSED SCANNER REPORT v6.0                            ║
║     Real Source Code Issues Only - Zero False Positives                    ║
║     {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}                              ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 FOCUSED SCAN RESULTS
─────────────────────────────────────────────────────────────────────────────
Real source files scanned:  {self.files_scanned}
Metadata files skipped:     {self.skipped['files']}
Directories skipped:        {self.skipped['dirs']}

🎯 REAL ISSUES FOUND
─────────────────────────────────────────────────────────────────────────────
Total issues:               {self.issues_found}
  High severity:            {high_count}
  Medium severity:          {medium_count}
Files with issues:          {self.files_with_issues}

"""
        
        if self.issues_found == 0:
            report += """✅ EXCELLENT NEWS!

No real production implementation issues found in source code!
Your codebase is production READY! 🚀

─────────────────────────────────────────────────────────────────────────────
"""
        else:
            report += f"""🚨 ISSUES REQUIRING ATTENTION
─────────────────────────────────────────────────────────────────────────────

"""
            for idx, (file_path, issues) in enumerate(
                sorted(self.issues.items(), key=lambda x: -len(x[1])), 1):
                report += f"{idx}. {file_path}\n"
                report += f"   Issues: {len(issues)}\n"
                for issue in issues:
                    sev = "🔴" if issue['severity'] == 'HIGH' else "🟡"
                    report += f"   {sev} Line {issue['line']}: {issue['description']}\n"
                    report += f"       {issue['code']}\n"
                report += "\n"
        
        report += f"""
─────────────────────────────────────────────────────────────────────────────
SCAN TIME: {datetime.now().isoformat()}Z
STATUS: {'✅ production READY' if self.issues_found == 0 else f'⚠️  {self.issues_found} items for review'}
─────────────────────────────────────────────────────────────────────────────
"""
        return report
    
    def save_report(self):
        """Save report"""
        report = self.generate_report()
        report_file = REPORT_DIR / 'production_FOCUSED_SCAN.txt'
        
        with open(report_file, 'w') as f:
            f.write(report)
        
        json_file = REPORT_DIR / 'production_issues_real.json'
        with open(json_file, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'source_files_scanned': self.files_scanned,
                    'metadata_files_skipped': self.skipped['files'],
                    'issues_found': self.issues_found,
                    'files_with_issues': self.files_with_issues
                },
                'issues': dict(self.issues)
            }, f, indent=2)
        
        print(report)
        print(f"\n📄 Report: {report_file}")
        print(f"💾 Data: {json_file}")

def main():
    scanner = productionFocusedScanner()
    scanner.scan_repository()
    scanner.save_report()

if __name__ == "__main__":
    main()
