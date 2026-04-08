#!/usr/bin/env python3
"""
Comprehensive Non-Production Implementation Scanner
Scans the entire codebase for placeholder implementations, TODOs, and non-production code
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple

class NonProductionScanner:
    def __init__(self, root_dir: str):
        self.root_dir = Path(root_dir)
        self.findings = {
            'placeholder_implementations': [],
            'todo_comments': [],
            'mock_stubs': [],
            'not_implemented': [],
            'coming_soon': [],
            'test_data': [],
            'hardcoded_values': [],
            'empty_functions': []
        }

    def scan_file(self, file_path: Path) -> None:
        """Scan a single file for non-production implementations"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')

            for line_num, line in enumerate(lines, 1):
                self._check_line(file_path, line_num, line, content)

        except Exception as e:
            print(f"Error scanning {file_path}: {e}")

    def _check_line(self, file_path: Path, line_num: int, line: str, content: str) -> None:
        """Check a single line for non-production patterns"""
        line_lower = line.lower().strip()

        # Placeholder implementations
        if any(pattern in line_lower for pattern in [
            'placeholder', 'placeholder implementation', 'placeholder calculation',
            'placeholder data', 'placeholder - would'
        ]):
            self.findings['placeholder_implementations'].append({
                'file': str(file_path),
                'line': line_num,
                'content': line.strip(),
                'type': 'placeholder'
            })

        # TODO comments
        if 'todo' in line_lower and ('//' in line or '#' in line or '/*' in line):
            self.findings['todo_comments'].append({
                'file': str(file_path),
                'line': line_num,
                'content': line.strip(),
                'type': 'todo'
            })

        # Mock/Stubs
        if any(pattern in line_lower for pattern in ['mock', 'stub', 'fake', 'dummy']):
            if not any(skip in line_lower for skip in ['jest.mock', 'mockedfunction', 'mockmedia']):
                self.findings['mock_stubs'].append({
                    'file': str(file_path),
                    'line': line_num,
                    'content': line.strip(),
                    'type': 'mock_stub'
                })

        # Not implemented
        if any(pattern in line_lower for pattern in [
            'not implemented', 'unimplemented', 'not yet implemented'
        ]):
            self.findings['not_implemented'].append({
                'file': str(file_path),
                'line': line_num,
                'content': line.strip(),
                'type': 'not_implemented'
            })

        # Coming soon
        if 'coming soon' in line_lower:
            self.findings['coming_soon'].append({
                'file': str(file_path),
                'line': line_num,
                'content': line.strip(),
                'type': 'coming_soon'
            })

        # Test data in production code
        if any(pattern in line_lower for pattern in ['test data', 'sample data', 'example data']):
            if not file_path.name.endswith(('.test.ts', '.test.js', '.spec.ts', '.spec.js', 'test_')):
                self.findings['test_data'].append({
                    'file': str(file_path),
                    'line': line_num,
                    'content': line.strip(),
                    'type': 'test_data'
                })

        # Hardcoded values
        if re.search(r'\b(127\.0\.0\.1|localhost|example\.com|test\.com)\b', line):
            if not any(skip in str(file_path) for skip in ['test', 'spec', '__tests__']):
                self.findings['hardcoded_values'].append({
                    'file': str(file_path),
                    'line': line_num,
                    'content': line.strip(),
                    'type': 'hardcoded'
                })

        # Empty functions
        if re.search(r'(function|def|const)\s+\w+\s*\([^)]*\)\s*{\s*}\s*$', line) or \
           re.search(r'(function|def|const)\s+\w+\s*\([^)]*\)\s*{\s*return\s*;\s*}\s*$', line):
            self.findings['empty_functions'].append({
                'file': str(file_path),
                'line': line_num,
                'content': line.strip(),
                'type': 'empty_function'
            })

    def scan_directory(self) -> None:
        """Scan entire directory recursively"""
        print(f"🔍 Scanning {self.root_dir} for non-production implementations...")

        for root, dirs, files in os.walk(self.root_dir):
            # Skip certain directories
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in [
                'node_modules', '__pycache__', '.git', 'backups', 'dist', 'build'
            ]]

            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.py')):
                    file_path = Path(root) / file
                    self.scan_file(file_path)

    def generate_report(self) -> Dict:
        """Generate comprehensive report"""
        total_findings = sum(len(findings) for findings in self.findings.values())

        report = {
            'summary': {
                'total_files_scanned': len([f for f in self.root_dir.rglob('*') if f.suffix in ['.ts', '.tsx', '.js', '.jsx', '.py']]),
                'total_findings': total_findings,
                'findings_by_type': {k: len(v) for k, v in self.findings.items()}
            },
            'findings': self.findings
        }

        return report

    def save_report(self, output_file: str) -> None:
        """Save report to JSON file"""
        report = self.generate_report()
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"📊 Report saved to {output_file}")
        print(f"📈 Total findings: {report['summary']['total_findings']}")

        for finding_type, count in report['summary']['findings_by_type'].items():
            if count > 0:
                print(f"  - {finding_type}: {count}")

def main():
    scanner = NonProductionScanner('.')
    scanner.scan_directory()
    scanner.save_report('non_production_implementations_report.json')

    # Print summary
    report = scanner.generate_report()
    print("\n🎯 NON-PRODUCTION IMPLEMENTATIONS SCAN COMPLETE")
    print("=" * 60)
    print(f"Total findings: {report['summary']['total_findings']}")
    print("\nBreakdown:")
    for finding_type, findings in report['findings'].items():
        if findings:
            print(f"\n{finding_type.upper().replace('_', ' ')} ({len(findings)}):")
            for finding in findings[:5]:  # Show first 5 of each type
                print(f"  📁 {finding['file']}:{finding['line']}")
                print(f"    {finding['content'][:100]}...")
            if len(findings) > 5:
                print(f"    ... and {len(findings) - 5} more")

if __name__ == '__main__':
    main()