#!/usr/bin/env python3
"""
comprehensive_production_scanner.py

Comprehensive scanner to identify all non-production implementations across the entire QMOI codebase.
This script performs a thorough analysis of all files to find:
- Non-production markers ([production READY], [production READY], etc.)
- Placeholder implementations
- Mock/test data that should be production-ready
- Development-only code that needs production equivalents
- TODO/FIXME comments indicating incomplete implementations
- Console.log statements and debug code
- Hardcoded development URLs/endpoints
- Test-only configurations

Generates a detailed report for systematic replacement of all non-production code.
"""

import os
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Set, Tuple
import subprocess

class ComprehensiveProductionScanner:
    def __init__(self):
        self.scan_results = {
            'timestamp': datetime.now().isoformat(),
            'total_files_scanned': 0,
            'files_with_issues': 0,
            'total_issues_found': 0,
            'issues_by_category': {},
            'files_by_issue_type': {},
            'critical_findings': [],
            'recommendations': []
        }

        # Non-production patterns to scan for
        self.non_production_patterns = {
            'production_markers': [
                r'\[production READY\]',
                r'\[production READY\]',
                r'\[production READY\]',
                r'\[production READY\]',
                r'\[PRODUCTION READY\]',
                r'\[PRODUCTION_READY\]',
                r'production READY',
                r'PRODUCTION READY'
            ],
            'placeholder_implementations': [
                r'TODO.*implement',
                r'FIXME.*implement',
                r'placeholder',
                r'stub implementation',
                r'mock implementation',
                r'dummy implementation',
                r'not implemented',
                r'throws? new Error.*not implemented',
                r'return null.*TODO',
                r'console\.log.*TODO',
                r'console\.log.*FIXME'
            ],
            'development_urls': [
                r'localhost:\d+',
                r'127\.0\.0\.1:\d+',
                r'0\.0\.0\.0:\d+',
                r'http://localhost',
                r'https://localhost',
                r'dev\..*\.com',
                r'staging\..*\.com',
                r'test\..*\.com'
            ],
            'debug_code': [
                r'console\.log',
                r'console\.debug',
                r'console\.info',
                r'debugger;',
                r'// DEBUG',
                r'/\* DEBUG \*/'
            ],
            'test_data_in_production': [
                r'test@example\.com',
                r'user@test\.com',
                r'admin@test\.com',
                r'fake.*data',
                r'mock.*data',
                r'sample.*data'
            ],
            'hardcoded_credentials': [
                r'password.*=.*["\'][^"\']*["\']',
                r'api_key.*=.*["\'][^"\']*["\']',
                r'secret.*=.*["\'][^"\']*["\']',
                r'token.*=.*["\'][^"\']*["\']'
            ]
        }

        # File extensions to scan
        self.scan_extensions = {
            'code': ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go'],
            'config': ['.json', '.yaml', '.yml', '.toml', '.xml', '.ini', '.cfg'],
            'docs': ['.md', '.txt', '.rst'],
            'web': ['.html', '.css', '.scss', '.sass'],
            'scripts': ['.sh', '.bash', '.ps1', '.bat']
        }

        # Directories to exclude from scanning
        self.exclude_dirs = {
            '.git', 'node_modules', '__pycache__', '.next', 'build', 'dist', 'coverage',
            '.backups', '_backups', 'backups', 'tmp', 'temp', 'cache', '.cache',
            'logs', '.logs', 'test-results', 'reports', '.pytest_cache', '.vscode',
            '.idea', '.DS_Store', 'Thumbs.db'
        }

    def should_scan_file(self, file_path: str) -> bool:
        """Determine if a file should be scanned based on extension and path."""
        path = Path(file_path)

        # Skip excluded directories
        for part in path.parts:
            if part in self.exclude_dirs:
                return False

        # Check if extension is in scan list
        if path.suffix.lower() in [ext for category in self.scan_extensions.values() for ext in category]:
            return True

        # Special cases for files without extensions
        if not path.suffix and path.name in ['Dockerfile', 'Makefile', 'CMakeLists.txt']:
            return True

        return False

    def scan_file(self, file_path: str) -> Dict[str, List[Dict]]:
        """Scan a single file for non-production implementations."""
        issues = {}

        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')

            for category, patterns in self.non_production_patterns.items():
                issues[category] = []

                for pattern in patterns:
                    matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                    for match in matches:
                        line_num = content[:match.start()].count('\n') + 1
                        context_start = max(0, line_num - 3)
                        context_end = min(len(lines), line_num + 3)

                        issues[category].append({
                            'line': line_num,
                            'match': match.group(),
                            'context': lines[context_start:context_end],
                            'pattern': pattern
                        })

        except Exception as e:
            print(f"Error scanning {file_path}: {e}")

        return issues

    def scan_directory(self, root_dir: str) -> None:
        """Recursively scan all files in a directory."""
        print(f"🔍 Starting comprehensive scan of {root_dir}")

        for root, dirs, files in os.walk(root_dir):
            # Remove excluded directories
            dirs[:] = [d for d in dirs if d not in self.exclude_dirs]

            for file in files:
                file_path = os.path.join(root, file)

                if self.should_scan_file(file_path):
                    self.scan_results['total_files_scanned'] += 1

                    issues = self.scan_file(file_path)

                    # Check if file has any issues
                    has_issues = any(issues.values())
                    if has_issues:
                        self.scan_results['files_with_issues'] += 1

                        for category, category_issues in issues.items():
                            if category_issues:
                                self.scan_results['total_issues_found'] += len(category_issues)

                                if category not in self.scan_results['issues_by_category']:
                                    self.scan_results['issues_by_category'][category] = 0
                                self.scan_results['issues_by_category'][category] += len(category_issues)

                                if category not in self.scan_results['files_by_issue_type']:
                                    self.scan_results['files_by_issue_type'][category] = []

                                self.scan_results['files_by_issue_type'][category].append({
                                    'file': file_path,
                                    'issues': category_issues
                                })

                                # Flag critical findings
                                if category in ['hardcoded_credentials', 'production_markers']:
                                    self.scan_results['critical_findings'].append({
                                        'file': file_path,
                                        'category': category,
                                        'issues': category_issues
                                    })

                    # Progress indicator
                    if self.scan_results['total_files_scanned'] % 100 == 0:
                        print(f"📊 Scanned {self.scan_results['total_files_scanned']} files, "
                              f"found issues in {self.scan_results['files_with_issues']} files")

    def generate_recommendations(self) -> None:
        """Generate recommendations based on scan results."""
        recommendations = []

        if self.scan_results['issues_by_category'].get('production_markers', 0) > 0:
            recommendations.append({
                'priority': 'CRITICAL',
                'category': 'Production Markers',
                'description': f"Replace {self.scan_results['issues_by_category']['production_markers']} production markers with actual implementations",
                'action': 'Replace all [production READY] markers with production-quality code'
            })

        if self.scan_results['issues_by_category'].get('hardcoded_credentials', 0) > 0:
            recommendations.append({
                'priority': 'CRITICAL',
                'category': 'Security',
                'description': f"Remove {self.scan_results['issues_by_category']['hardcoded_credentials']} hardcoded credentials",
                'action': 'Replace hardcoded credentials with environment variables or secure key management'
            })

        if self.scan_results['issues_by_category'].get('placeholder_implementations', 0) > 0:
            recommendations.append({
                'priority': 'HIGH',
                'category': 'Implementation Completeness',
                'description': f"Complete {self.scan_results['issues_by_category']['placeholder_implementations']} placeholder implementations",
                'action': 'Replace TODO/FIXME placeholders with actual production code'
            })

        if self.scan_results['issues_by_category'].get('development_urls', 0) > 0:
            recommendations.append({
                'priority': 'HIGH',
                'category': 'Configuration',
                'description': f"Replace {self.scan_results['issues_by_category']['development_urls']} development URLs",
                'action': 'Update localhost and development URLs to production endpoints'
            })

        if self.scan_results['issues_by_category'].get('debug_code', 0) > 0:
            recommendations.append({
                'priority': 'MEDIUM',
                'category': 'Code Quality',
                'description': f"Remove {self.scan_results['issues_by_category']['debug_code']} debug statements",
                'action': 'Remove console.log statements and debugger calls from production code'
            })

        self.scan_results['recommendations'] = recommendations

    def save_report(self, output_file: str = 'comprehensive_production_scan_report.json') -> None:
        """Save the scan results to a JSON file."""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.scan_results, f, indent=2, ensure_ascii=False)

        print(f"📄 Report saved to {output_file}")

    def print_summary(self) -> None:
        """Print a summary of the scan results."""
        print("\n" + "="*80)
        print("🎯 COMPREHENSIVE PRODUCTION READINESS SCAN RESULTS")
        print("="*80)
        print(f"📊 Total files scanned: {self.scan_results['total_files_scanned']}")
        print(f"⚠️  Files with issues: {self.scan_results['files_with_issues']}")
        print(f"🔍 Total issues found: {self.scan_results['total_issues_found']}")
        print(f"🕒 Scan completed: {self.scan_results['timestamp']}")

        print("\n📈 Issues by Category:")
        for category, count in self.scan_results['issues_by_category'].items():
            print(f"  • {category}: {count}")

        if self.scan_results['critical_findings']:
            print(f"\n🚨 Critical Findings: {len(self.scan_results['critical_findings'])}")
            for finding in self.scan_results['critical_findings'][:5]:  # Show first 5
                print(f"  • {finding['category']}: {finding['file']}")

        print("\n💡 Recommendations:")
        for rec in self.scan_results['recommendations']:
            print(f"  {rec['priority']}: {rec['description']}")
            print(f"    → {rec['action']}")

        print("\n📄 Detailed report saved to comprehensive_production_scan_report.json")

def main():
    scanner = ComprehensiveProductionScanner()

    # Scan the entire workspace
    scanner.scan_directory('/workspaces/qmoi-enhanced')

    # Generate recommendations
    scanner.generate_recommendations()

    # Save and print results
    scanner.save_report()
    scanner.print_summary()

if __name__ == '__main__':
    main()