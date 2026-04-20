#!/usr/bin/env python3
"""comprehensive_production_scanner.py

Comprehensive scanner to identify all non-production implementations and PRODUCTION content across the QMOI codebase.
"""

import json
import re
from datetime import datetime
from pathlib import Path

ISSUE_PATTERNS = [
    r'production implementation required',
    r'PRODUCTION',
    r'PRODUCTION_IMPLEMENTED implementation',
    r'PENDING_IMPLEMENTATION',
    r'IMPLEMENTED',
    r'PROOF OF CONCEPT',
    r'\bPOC\b',
    r'needs implementation',
    r'COMPLETE.*implement',
    r'PRODUCTION_READY.*implement',
    r'nonproduction',
    r'placeholder_fix_report',
    r'placeholder_scanner',
    r'placeholder_actions',
]

STATUS_PATTERNS = [
    r'PRODUCTION_IMPLEMENTED',
    r'production-ready',
]

EXCLUDE_DIRS = {
    'node_modules',
    '.git',
    '.backups',
    '__pycache__',
    'backups',
    '.venv',
    'dist',
    'build',
}

TEXT_EXTENSIONS = {
    '.py', '.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.yaml', '.yml', '.sh', '.bash', '.txt', '.cfg', '.ini', '.toml'
}

class ComprehensiveProductionScanner:
    def __init__(self):
        self.issue_patterns = [re.compile(pat, re.IGNORECASE) for pat in ISSUE_PATTERNS]
        self.status_patterns = [re.compile(pat, re.IGNORECASE) for pat in STATUS_PATTERNS]
        self.scan_results = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'workspace': str(Path.cwd()),
            'total_files_scanned': 0,
            'files_with_issues': 0,
            'files_with_status_markers': 0,
            'total_issues_found': 0,
            'total_status_markers_found': 0,
            'files': [],
            'files_by_directory': {},
            'issues_by_category': {},
            'critical_findings': [],
        }

    def is_text_file(self, file_path: Path) -> bool:
        return file_path.suffix.lower() in TEXT_EXTENSIONS

    def scan_file(self, file_path: Path):
        if not self.is_text_file(file_path):
            return None
        try:
            text = file_path.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            return None

        issues = []
        status_markers = []
        for pattern in self.issue_patterns:
            for match in pattern.finditer(text):
                line = text.count('\n', 0, match.start()) + 1
                start = max(0, match.start() - 40)
                end = min(len(text), match.end() + 40)
                snippet = text[start:end].replace('\n', ' ')[:160]
                issues.append({
                    'pattern': pattern.pattern,
                    'snippet': snippet,
                    'line': line,
                    'category': self.classify_issue(pattern.pattern),
                })

        for pattern in self.status_patterns:
            for match in pattern.finditer(text):
                line = text.count('\n', 0, match.start()) + 1
                start = max(0, match.start() - 40)
                end = min(len(text), match.end() + 40)
                snippet = text[start:end].replace('\n', ' ')[:160]
                status_markers.append({
                    'pattern': pattern.pattern,
                    'snippet': snippet,
                    'line': line,
                })

        if not issues and not status_markers:
            return None

        return {
            'file': str(file_path.relative_to(Path.cwd())),
            'issues': issues,
            'status_markers': status_markers,
            'issue_count': len(issues),
            'status_count': len(status_markers),
        }

    def classify_issue(self, pattern: str) -> str:
        lower = pattern.lower()
        if 'production implementation required' in lower or 'PRODUCTION' in lower or 'PRODUCTION_IMPLEMENTED implementation' in lower:
            return 'PRODUCTION'
        if 'pending_implementation' in lower or 'IMPLEMENTED' in lower or 'needs implementation' in lower:
            return 'implementation gap'
        if 'proof of concept' in lower or 'poc' in lower:
            return 'proof of concept'
        if 'COMPLETE' in lower or 'PRODUCTION_READY' in lower:
            return 'COMPLETE/PRODUCTION_READY'
        if 'nonproduction' in lower:
            return 'nonproduction marker'
        return 'other'

    def scan_directory(self, root: str):
        root_path = Path(root)
        for file_path in root_path.rglob('*'):
            if any(part in EXCLUDE_DIRS for part in file_path.parts):
                continue
            if file_path.is_dir():
                continue
            self.scan_results['total_files_scanned'] += 1
            result = self.scan_file(file_path)
            if not result:
                continue
            if result['issue_count']:
                self.scan_results['files_with_issues'] += 1
                self.scan_results['total_issues_found'] += result['issue_count']
            if result['status_count']:
                self.scan_results['files_with_status_markers'] += 1
                self.scan_results['total_status_markers_found'] += result['status_count']
            self.scan_results['files'].append(result)

            directory = str(file_path.parent.relative_to(root_path) or '.')
            self.scan_results['files_by_directory'][directory] = self.scan_results['files_by_directory'].get(directory, 0) + 1

            for issue in result['issues']:
                category = self.classify_issue(issue['pattern'])
                self.scan_results['issues_by_category'][category] = self.scan_results['issues_by_category'].get(category, 0) + 1
                if category in ('PRODUCTION', 'implementation gap', 'proof of concept'):
                    self.scan_results['critical_findings'].append({
                        'file': result['file'],
                        'pattern': issue['pattern'],
                        'snippet': issue['snippet'],
                    })

    def save_report(self, output_file: str = 'comprehensive_production_scan_report.json'):
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.scan_results, f, indent=2, ensure_ascii=False)
        print(f'📄 Report saved to {output_file}')

    def write_undone(self, output_file: str = 'undone.txt'):
        lines = [
            '# QMOI COMPREHENSIVE NONPRODUCTION IMPLEMENTATIONS TRACKER',
            f'# Auto-generated by comprehensive_production_scanner.py on {self.scan_results["timestamp"]}',
            f'# Workspace: {self.scan_results["workspace"]}',
            f'# Total files scanned: {self.scan_results["total_files_scanned"]}',
            f'# Files with unresolved issue markers: {self.scan_results["files_with_issues"]}',
            f'# Files with production status markers: {self.scan_results["files_with_status_markers"]}',
            f'# Total unresolved issue markers: {self.scan_results["total_issues_found"]}',
            f'# Total production status markers: {self.scan_results["total_status_markers_found"]}',
            '',
            '## DIRECTORY SUMMARY',
        ]
        for directory, count in sorted(self.scan_results['files_by_directory'].items()):
            lines.append(f'- {directory}: {count} impacted file(s)')
        lines.append('')
        lines.append('## FILES WITH REMAINING NONPRODUCTION ISSUE MARKERS')
        for entry in sorted(self.scan_results['files'], key=lambda x: x['file']):
            if entry['issue_count'] == 0:
                continue
            lines.append(f'[PENDING] ./{entry["file"]} - {entry["issue_count"]} unresolved marker(s)')
            for issue in entry['issues']:
                lines.append(f'  - {issue["category"]} (line {issue["line"]}): {issue["pattern"]} -> {issue["snippet"]}')
        lines.append('')
        lines.append('## FILES WITH PRODUCTION STATUS MARKERS ONLY')
        for entry in sorted(self.scan_results['files'], key=lambda x: x['file']):
            if entry['issue_count'] > 0 or entry['status_count'] == 0:
                continue
            lines.append(f'[REVIEW] ./{entry["file"]} - {entry["status_count"]} production status marker(s)')
            for marker in entry['status_markers']:
                lines.append(f'  - line {marker["line"]}: {marker["pattern"]} -> {marker["snippet"]}')
        lines.append('')
        lines.append('## AUTO-UPDATE INSTRUCTIONS')
        lines.append('Run `python3 comprehensive_production_scanner.py` to refresh this tracker and regenerate the report.')
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')
        print(f'📄 Updated undone tracker at {output_file}')

    def print_summary(self):
        print('\n' + '='*80)
        print('🎯 COMPREHENSIVE PRODUCTION READINESS SCAN RESULTS')
        print('='*80)
        print(f"📊 Total files scanned: {self.scan_results['total_files_scanned']}")
        print(f"⚠️  Files with issues: {self.scan_results['files_with_issues']}")
        print(f"🔍 Total issues found: {self.scan_results['total_issues_found']}")
        print(f"🕒 Scan completed: {self.scan_results['timestamp']}")
        print('\n📈 Issues by Category:')
        for category, count in self.scan_results['issues_by_category'].items():
            print(f"  • {category}: {count}")
        if self.scan_results['critical_findings']:
            print(f"\n🚨 Critical Findings: {len(self.scan_results['critical_findings'])}")
            for finding in self.scan_results['critical_findings'][:5]:
                print(f"  • {finding['file']} - {finding['pattern']}")


def main():
    scanner = ComprehensiveProductionScanner()
    scanner.scan_directory(str(Path.cwd()))
    scanner.save_report()
    scanner.write_undone()
    scanner.print_summary()


if __name__ == '__main__':
    main()
