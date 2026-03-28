// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

# 
#!/usr/bin/env python3
"""
Link Validation Script - Discover and analyze all URLs in the codebase
Scans all files for HTTP/HTTPS URLs, relative links, and internal references
Generates comprehensive reports for documentation audits and fixes
"""

import os
import re
import json
import sys
from pathlib import Path
from collections import defaultdict
from datetime import datetime
from typing import List, Dict, Set, Tuple
import csv

# Configuration
WORKSPACE_ROOT = Path('/workspaces/qmoi-enhanced')
SCRIPTS_DIR = WORKSPACE_ROOT / 'scripts'
RESULTS_DIR = WORKSPACE_ROOT / 'results'
OUTPUT_FILE = RESULTS_DIR / 'discovered_urls.csv'
JSON_REPORT = RESULTS_DIR / 'link_validation_report.json'

# File extensions to scan
SCANNABLE_EXTENSIONS = {
    '.md', '.ts', '.tsx', '.js', '.jsx', '.json', 
    '.py', '.sh', '.html', '.css', '.yaml', '.yml',
    '.txt', '.env', '.config', '.gradle'
}

# Directories to exclude
EXCLUDE_DIRS = {
    '.git', 'node_modules', '.next', 'dist', 'build',
    '_archive_qmoi-enhanced', 'tempinit', '.vscode',
    'backups', '__pycache__', '.pytest_cache'
}

# URL patterns to detect
URL_PATTERNS = {
    'https': re.compile(r'https?://[^\s\'"<>]+'),
    'relative': re.compile(r'(?:^|\s)([./]+[^\s\'"<>]*(?:\.md|\.tsx?|\.jsx?|\.html|\.css|\.js|\.json)?)'),
    'anchor': re.compile(r'#([a-zA-Z0-9_-]+)'),
    'markdown_link': re.compile(r'\[([^\]]+)\]\(([^)]+)\)'),
    'html_href': re.compile(r'href=[\'"]([^\'"]+)[\'"]'),
}

# Domain inventory
KNOWN_DOMAINS = {
    'qvillage.com', 'qdatabase.net', 'qserver.io', 'qcloud.ai',
    'qquantum.tech', 'alphaq.ai', 'qglobal.org', 'qparallel.dev',
    'qvillage.net',  # fallback
    'localhost', '127.0.0.1', '0.0.0.0'
}

class LinkValidator:
    def __init__(self):
        self.discovered_urls = defaultdict(list)
        self.url_categories = defaultdict(list)
        self.file_count = 0
        self.processed_count = 0
        self.total_urls_found = 0
        self.broken_patterns = []
        self.stats = {
            'total_files': 0,
            'scanned_files': 0,
            'total_urls': 0,
            'by_type': {},
            'by_domain': {},
            'broken_links': 0,
            'warnings': []
        }

    def should_scan_file(self, file_path: Path) -> bool:
        """Determine if file should be scanned"""
        # Check extension
        if file_path.suffix not in SCANNABLE_EXTENSIONS:
            return False
        
        # Check excluded directories
        for excluded in EXCLUDE_DIRS:
            if excluded in file_path.parts:
                return False
        
        # Skip large binary-like files
        try:
            if file_path.stat().st_size > 10_000_000:  # Skip files > 10MB
                return False
        except:
            return False
        
        return True

    def extract_urls(self, content: str, file_path: Path) -> List[Dict]:
        """Extract all URLs from file content"""
        urls = []
        
        # HTTP/HTTPS URLs
        for match in URL_PATTERNS['https'].finditer(content):
            url = match.group(0)
            urls.append({
                'url': url,
                'type': 'http_https',
                'file': str(file_path.relative_to(WORKSPACE_ROOT)),
                'line': content[:match.start()].count('\n') + 1
            })
        
        # Markdown links [text](url)
        for match in URL_PATTERNS['markdown_link'].finditer(content):
            text, url = match.groups()
            if url and not url.startswith('#'):
                urls.append({
                    'url': url,
                    'type': 'markdown_link',
                    'text': text,
                    'file': str(file_path.relative_to(WORKSPACE_ROOT)),
                    'line': content[:match.start()].count('\n') + 1
                })
        
        # HTML hrefs
        for match in URL_PATTERNS['html_href'].finditer(content):
            url = match.group(1)
            if url and not url.startswith('#'):
                urls.append({
                    'url': url,
                    'type': 'html_href',
                    'file': str(file_path.relative_to(WORKSPACE_ROOT)),
                    'line': content[:match.start()].count('\n') + 1
                })
        
        return urls

    def categorize_url(self, url: str) -> str:
        """Categorize URL type"""
        if url.startswith('http://') or url.startswith('https://'):
            return 'external_http'
        elif url.startswith('/'):
            return 'absolute_path'
        elif url.startswith('./') or url.startswith('../'):
            return 'relative_path'
        elif url.startswith('#'):
            return 'anchor'
        elif '.' in url and '/' not in url:
            return 'file_reference'
        else:
            return 'internal_reference'

    def validate_url(self, url_entry: Dict) -> Dict:
        """Validate individual URL"""
        url = url_entry['url']
        category = self.categorize_url(url)
        status = 'valid'
        error = None
        
        # Check for broken patterns
        if '{{' in url or '}}' in url:
            status = 'template_placeholder'
            error = 'Contains template variables'
        elif url.endswith('undefined') or 'undefined' in url:
            status = 'undefined_reference'
            error = 'References undefined variable'
        elif url.strip() != url:
            status = 'whitespace_issue'
            error = 'Contains leading/trailing whitespace'
        elif 'TODO' in url or 'FIXME' in url:
            status = 'incomplete'
            error = 'Marked as TODO/FIXME'
        
        return {
            **url_entry,
            'category': category,
            'status': status,
            'error': error
        }

    def scan_file(self, file_path: Path) -> int:
        """Scan single file for URLs"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return 0
        
        urls = self.extract_urls(content, file_path)
        
        for url_entry in urls:
            validated = self.validate_url(url_entry)
            self.discovered_urls[str(file_path.relative_to(WORKSPACE_ROOT))].append(validated)
            
            category = validated['category']
            self.url_categories[category].append(validated)
            self.total_urls_found += 1
            
            if validated['status'] != 'valid':
                self.stats['warnings'].append({
                    'file': validated['file'],
                    'url': validated['url'],
                    'status': validated['status'],
                    'error': validated['error']
                })
        
        return len(urls)

    def scan_directory(self):
        """Recursively scan workspace directory"""
        print("🔍 Starting link discovery scan...")
        
        for root, dirs, files in os.walk(WORKSPACE_ROOT):
            # Remove excluded directories in-place to prevent traversal
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                file_path = Path(root) / file
                self.stats['total_files'] += 1
                
                if self.should_scan_file(file_path):
                    self.processed_count += 1
                    self.stats['scanned_files'] += 1
                    try:
                        self.scan_file(file_path)
                    except Exception as e:
                        print(f"Error processing {file_path}: {e}")
                
                # Progress indicator
                if self.stats['scanned_files'] % 100 == 0:
                    print(f"  Scanned {self.stats['scanned_files']} files...")

    def count_by_domain(self):
        """Count URLs by domain"""
        for urls in self.discovered_urls.values():
            for url_entry in urls:
                url = url_entry['url']
                if url.startswith('http'):
                    try:
                        domain = url.split('/')[2]
                        self.stats['by_domain'][domain] = self.stats['by_domain'].get(domain, 0) + 1
                    except:
                        pass

    def generate_reports(self):
        """Generate CSV and JSON reports"""
        print("\n📊 Generating reports...")
        
        # Create results directory
        RESULTS_DIR.mkdir(exist_ok=True)
        
        # CSV Report
        with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['File', 'URL', 'Type', 'Category', 'Status', 'Error', 'Line'])
            
            for file, urls in sorted(self.discovered_urls.items()):
                for url_entry in urls:
                    writer.writerow([
                        file,
                        url_entry['url'],
                        url_entry.get('type', 'unknown'),
                        url_entry.get('category', ''),
                        url_entry.get('status', ''),
                        url_entry.get('error', ''),
                        url_entry.get('line', '')
                    ])
        
        print(f"✅ CSV Report: {OUTPUT_FILE}")
        
        # JSON Report with statistics
        self.stats['by_type'] = {
            category: len(urls) 
            for category, urls in self.url_categories.items()
        }
        self.stats['total_urls'] = self.total_urls_found
        self.stats['broken_links'] = len(self.stats['warnings'])
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'statistics': self.stats,
            'urls_by_category': {
                category: len(urls)
                for category, urls in self.url_categories.items()
            },
            'warnings_count': len(self.stats['warnings']),
            'warnings_sample': self.stats['warnings'][:20],  # First 20 warnings
            'files_with_issues': [
                {
                    'file': file,
                    'url_count': len(urls),
                    'issue_count': len([u for u in urls if u['status'] != 'valid'])
                }
                for file, urls in sorted(self.discovered_urls.items())
                if any(u['status'] != 'valid' for u in urls)
            ]
        }
        
        with open(JSON_REPORT, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
        
        print(f"✅ JSON Report: {JSON_REPORT}")

    def print_summary(self):
        """Print summary statistics"""
        print("\n" + "="*60)
        print("📈 LINK VALIDATION SUMMARY")
        print("="*60)
        print(f"\nScanning Results:")
        print(f"  Total files in workspace: {self.stats['total_files']}")
        print(f"  Files scanned: {self.stats['scanned_files']}")
        print(f"  Total URLs discovered: {self.total_urls_found}")
        
        print(f"\nURL Categories:")
        for category, urls in sorted(self.url_categories.items(), key=lambda x: len(x[1]), reverse=True):
            print(f"  {category}: {len(urls)}")
        
        print(f"\nTop Domains:")
        sorted_domains = sorted(self.stats['by_domain'].items(), key=lambda x: x[1], reverse=True)
        for domain, count in sorted_domains[:10]:
            print(f"  {domain}: {count} references")
        
        print(f"\nIssues Found: {self.stats['broken_links']}")
        if self.stats['warnings']:
            print(f"\nFirst 10 Issues:")
            for warning in self.stats['warnings'][:10]:
                print(f"  ⚠️  {warning['file']}:{warning.get('url', 'unknown')}")
                print(f"      Status: {warning['status']} - {warning['error']}")
        
        print("\n" + "="*60)

    def run(self):
        """Main execution"""
        start_time = datetime.now()
        
        try:
            self.scan_directory()
            self.count_by_domain()
            self.generate_reports()
            self.print_summary()
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            print(f"\n✅ Scan completed in {duration:.2f} seconds\n")
            
            return 0
        except Exception as e:
            print(f"\n❌ Error: {e}\n", file=sys.stderr)
            return 1

if __name__ == '__main__':
    validator = LinkValidator()
    sys.exit(validator.run())
