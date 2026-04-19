#!/usr/bin/env python3
"""
THOROUGH PRODUCTION READINESS SCANNER
Scans ALL directories and files for nonproduction markers and creates comprehensive undone.txt
"""

import os
import re
import json
import time
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib

class ThoroughProductionScanner:
    def __init__(self, root_dir="/workspaces/qmoi-enhanced"):
        self.root_dir = Path(root_dir)
        self.scan_timestamp = datetime.now().isoformat()
        self.scan_id = int(time.time())

        # Comprehensive nonproduction markers to search for
        self.markers = {
            'PRODUCTION_READY': re.compile(r'\bFIXME\b', re.IGNORECASE),
            'COMPLETE': re.compile(r'\bTODO\b', re.IGNORECASE),
            'COMPLETED': re.compile(r'\bIN PROGRESS\b', re.IGNORECASE),
            'IMPLEMENTED': re.compile(r'\bUNIMPLEMENTED\b', re.IGNORECASE),
            'FINALIZED': re.compile(r'\bWIP\b', re.IGNORECASE),
            'PRODUCTION': re.compile(r'\bPLACEHOLDER\b', re.IGNORECASE),
            'NOT IMPLEMENTED': re.compile(r'\bNOT IMPLEMENTED\b', re.IGNORECASE),
            'STUB': re.compile(r'\bSTUB\b', re.IGNORECASE),
            'MOCK': re.compile(r'\bMOCK\b', re.IGNORECASE),
            'DUMMY': re.compile(r'\bDUMMY\b', re.IGNORECASE),
            'STABLE': re.compile(r'\bTEMP\b', re.IGNORECASE),
            'PRODUCTION_FIX': re.compile(r'\bHACK\b', re.IGNORECASE),
            'BROKEN': re.compile(r'\bBROKEN\b', re.IGNORECASE),
            'FAKE': re.compile(r'\bFAKE\b', re.IGNORECASE),
            'TEST ONLY': re.compile(r'\bTEST ONLY\b', re.IGNORECASE),
            'DEVELOPMENT': re.compile(r'\bDEVELOPMENT\b', re.IGNORECASE),
            'DEBUG': re.compile(r'\bDEBUG\b', re.IGNORECASE),
            'REMOVE BEFORE PRODUCTION': re.compile(r'\bREMOVE BEFORE PRODUCTION\b', re.IGNORECASE),
            'PRODUCTION READY': re.compile(r'\bPRODUCTION READY\b', re.IGNORECASE),  # This might indicate incomplete work
        }

        # File extensions to scan (comprehensive list)
        self.extensions_to_scan = {
            # Code files
            '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala',
            # Web files
            '.html', '.htm', '.css', '.scss', '.sass', '.less',
            # Config files
            '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf',
            # Documentation
            '.md', '.txt', '.rst', '.adoc',
            # Shell scripts
            '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
            # Other
            '.sql', '.graphql', '.proto', '.dockerfile', 'Dockerfile', '.env'
        }

        # Directories to exclude
        self.exclude_dirs = {
            '.git', '.svn', '.hg', '__pycache__', 'node_modules', '.next', '.nuxt',
            'dist', 'build', 'target', 'bin', 'obj', '.vscode', '.idea', '.DS_Store',
            '.backups', 'backups', 'tmp', 'STABLE', 'cache', 'logs', '.pytest_cache',
            '.mypy_cache', '.tox', '.coverage', 'htmlcov', '.terraform'
        }

        self.results = {
            'scan_info': {
                'timestamp': self.scan_timestamp,
                'scan_id': self.scan_id,
                'root_directory': str(self.root_dir),
                'total_files_scanned': 0,
                'total_directories_scanned': 0,
                'files_with_markers': 0,
                'total_markers_found': 0
            },
            'files_with_markers': [],
            'marker_summary': {},
            'errors': []
        }

    def should_scan_file(self, file_path):
        """Determine if a file should be scanned"""
        if not file_path.is_file():
            return False

        # Check file extension
        if file_path.suffix.lower() in self.extensions_to_scan or file_path.name in self.extensions_to_scan:
            return True

        # Check if file has no extension but is a script (shebang)
        if not file_path.suffix:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    first_line = f.readline().strip()
                    if first_line.startswith('#!') or 'script' in first_line.lower():
                        return True
            except:
                pass

        return False

    def should_scan_directory(self, dir_path):
        """Determine if a directory should be scanned"""
        if not dir_path.is_dir():
            return False

        # Skip excluded directories
        if dir_path.name in self.exclude_dirs:
            return False

        # Skip hidden directories (starting with .)
        if dir_path.name.startswith('.'):
            return False

        return True

    def scan_file(self, file_path):
        """Scan a single file for nonproduction markers"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            file_markers = {}
            total_markers = 0

            for marker_name, pattern in self.markers.items():
                matches = pattern.findall(content)
                if matches:
                    count = len(matches)
                    file_markers[marker_name] = count
                    total_markers += count

            if file_markers:
                return {
                    'file_path': str(file_path.relative_to(self.root_dir)),
                    'absolute_path': str(file_path),
                    'file_size': file_path.stat().st_size,
                    'last_modified': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                    'markers': file_markers,
                    'total_markers': total_markers,
                    'file_hash': hashlib.md5(content.encode('utf-8')).hexdigest()[:8]
                }

        except Exception as e:
            self.results['errors'].append({
                'file': str(file_path),
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })

        return None

    def scan_directory(self, dir_path):
        """Scan all files in a directory"""
        files_scanned = 0
        files_with_markers = []

        for file_path in dir_path.rglob('*'):
            if self.should_scan_file(file_path):
                files_scanned += 1
                result = self.scan_file(file_path)
                if result:
                    files_with_markers.append(result)

        return files_scanned, files_with_markers

    def perform_thorough_scan(self):
        """Perform a thorough scan of all directories"""
        print(f"🔍 Starting thorough production readiness scan...")
        print(f"📁 Root directory: {self.root_dir}")
        print(f"🕒 Scan timestamp: {self.scan_timestamp}")
        print(f"📊 Scan ID: {self.scan_id}")

        all_files_with_markers = []
        total_files_scanned = 0
        total_dirs_scanned = 0

        # Get all directories to scan
        directories_to_scan = []
        for dir_path in self.root_dir.rglob('*'):
            if self.should_scan_directory(dir_path):
                directories_to_scan.append(dir_path)
                total_dirs_scanned += 1

        print(f"📂 Found {total_dirs_scanned} directories to scan")

        # Scan directories with thread pool for performance
        with ThreadPoolExecutor(max_workers=min(8, len(directories_to_scan))) as executor:
            future_to_dir = {executor.submit(self.scan_directory, dir_path): dir_path for dir_path in directories_to_scan}

            for future in as_completed(future_to_dir):
                dir_path = future_to_dir[future]
                try:
                    files_scanned, files_with_markers = future.result()
                    total_files_scanned += files_scanned
                    all_files_with_markers.extend(files_with_markers)

                    if files_with_markers:
                        print(f"⚠️  {dir_path.relative_to(self.root_dir)}: {len(files_with_markers)} files with markers")

                except Exception as e:
                    print(f"❌ Error scanning {dir_path}: {e}")
                    self.results['errors'].append({
                        'directory': str(dir_path),
                        'error': str(e),
                        'timestamp': datetime.now().isoformat()
                    })

        # Update results
        self.results['scan_info']['total_files_scanned'] = total_files_scanned
        self.results['scan_info']['total_directories_scanned'] = total_dirs_scanned
        self.results['scan_info']['files_with_markers'] = len(all_files_with_markers)
        self.results['scan_info']['total_markers_found'] = sum(f['total_markers'] for f in all_files_with_markers)

        # Sort files by total markers (most problematic first)
        all_files_with_markers.sort(key=lambda x: x['total_markers'], reverse=True)
        self.results['files_with_markers'] = all_files_with_markers

        # Create marker summary
        marker_summary = {}
        for file_result in all_files_with_markers:
            for marker, count in file_result['markers'].items():
                marker_summary[marker] = marker_summary.get(marker, 0) + count
        self.results['marker_summary'] = dict(sorted(marker_summary.items(), key=lambda x: x[1], reverse=True))

        print("\n📊 SCAN RESULTS:")
        print(f"   Total files scanned: {total_files_scanned}")
        print(f"   Files with markers: {len(all_files_with_markers)}")
        print(f"   Total markers found: {sum(f['total_markers'] for f in all_files_with_markers)}")
        print(f"   Errors encountered: {len(self.results['errors'])}")

        if self.results['marker_summary']:
            print("\n🔍 MARKER SUMMARY:")
            for marker, count in self.results['marker_summary'].items():
                print(f"   {marker}: {count}")

        return self.results

    def save_results(self):
        """Save scan results to undone.txt and other files"""
        # Create undone.txt
        undone_content = self.generate_undone_txt()
        undone_path = self.root_dir / 'undone.txt'
        with open(undone_path, 'w', encoding='utf-8') as f:
            f.write(undone_content)
        print(f"✅ Created: {undone_path}")

        # Create detailed JSON report
        json_path = self.root_dir / f'production_scan_{self.scan_id}.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        print(f"✅ Created: {json_path}")

        # Update INSTANCES.md
        self.update_instances_md()

        return undone_path, json_path

    def generate_undone_txt(self):
        """Generate the undone.txt content"""
        lines = []
        lines.append("# UNDONE.TXT - THOROUGH PRODUCTION READINESS SCAN")
        lines.append(f"# Generated: {self.scan_timestamp}")
        lines.append(f"# Scan ID: {self.scan_id}")
        lines.append(f"# Root Directory: {self.root_dir}")
        lines.append("")

        lines.append("## SCAN SUMMARY")
        lines.append(f"- Total files scanned: {self.results['scan_info']['total_files_scanned']}")
        lines.append(f"- Total directories scanned: {self.results['scan_info']['total_directories_scanned']}")
        lines.append(f"- Files with markers: {self.results['scan_info']['files_with_markers']}")
        lines.append(f"- Total markers found: {self.results['scan_info']['total_markers_found']}")
        lines.append("")

        if self.results['marker_summary']:
            lines.append("## MARKER SUMMARY (Most Critical First)")
            for marker, count in self.results['marker_summary'].items():
                lines.append(f"- {marker}: {count} instances")
            lines.append("")

        if self.results['files_with_markers']:
            lines.append("## FILES REQUIRING PRODUCTION IMPLEMENTATION")
            lines.append("")

            for i, file_result in enumerate(self.results['files_with_markers'], 1):
                lines.append(f"### {i}. {file_result['file_path']}")
                lines.append(f"   - Size: {file_result['file_size']} bytes")
                lines.append(f"   - Last modified: {file_result['last_modified']}")
                lines.append(f"   - Total markers: {file_result['total_markers']}")
                lines.append(f"   - File hash: {file_result['file_hash']}")
                lines.append("   - Markers found:")

                for marker, count in file_result['markers'].items():
                    lines.append(f"     * {marker}: {count}")

                lines.append("")

        if self.results['errors']:
            lines.append("## SCAN ERRORS")
            lines.append(f"Total errors: {len(self.results['errors'])}")
            lines.append("")
            for error in self.results['errors'][:10]:  # Show first 10 errors
                lines.append(f"- {error['file']}: {error['error']}")
            if len(self.results['errors']) > 10:
                lines.append(f"- ... and {len(self.results['errors']) - 10} more errors")
            lines.append("")

        lines.append("## NEXT STEPS")
        lines.append("1. Review files with markers above")
        lines.append("2. Replace all nonproduction markers with actual production implementations")
        lines.append("3. Run comprehensive testing")
        lines.append("4. Update documentation")
        lines.append("5. Deploy to production")
        lines.append("")

        lines.append("## PRODUCTION REQUIREMENTS")
        lines.append("- Security: Authentication, authorization, encryption")
        lines.append("- Error Handling: Comprehensive error management and recovery")
        lines.append("- Logging: Audit logging and monitoring")
        lines.append("- Validation: Input validation and sanitization")
        lines.append("- Caching: Performance optimization with caching")
        lines.append("- Metrics: Production monitoring and metrics collection")
        lines.append("- Testing: Unit tests, integration tests, error scenarios")
        lines.append("- Documentation: API documentation and usage guides")

        return "\n".join(lines)

    def update_instances_md(self):
        """Update INSTANCES.md with scan results"""
        instances_path = self.root_dir / 'INSTANCES.md'

        # Read current content
        current_content = ""
        if instances_path.exists():
            with open(instances_path, 'r', encoding='utf-8') as f:
                current_content = f.read()

        # Generate new content
        new_content = f"""# INSTANCES.md

This file tracks the remaining production readiness instances from `undone.txt`.

## Remaining Files

### SUMMARY
- Total files scanned: {self.results['scan_info']['total_files_scanned']}
- Files with markers: {self.results['scan_info']['files_with_markers']}
- Total markers found: {self.results['scan_info']['total_markers_found']}
- Scan timestamp: {self.scan_timestamp}
- Scan ID: {self.scan_id}

### DETAILED FINDINGS
- Scan Timestamp: {self.scan_timestamp}
- Total Files Scanned: {self.results['scan_info']['total_files_scanned']}
- Total Directories Scanned: {self.results['scan_info']['total_directories_scanned']}
- Files with Markers: {self.results['scan_info']['files_with_markers']}
- Total Markers Found: {self.results['scan_info']['total_markers_found']}

### MARKER BREAKDOWN
"""

        if self.results['marker_summary']:
            for marker, count in self.results['marker_summary'].items():
                new_content += f"- {marker}: {count}\n"
        else:
            new_content += "- No markers found - System appears production-ready!\n"

        new_content += "\n### FILES WITH MARKERS\n"

        if self.results['files_with_markers']:
            for i, file_result in enumerate(self.results['files_with_markers'][:20], 1):  # Show top 20
                new_content += f"{i}. {file_result['file_path']} ({file_result['total_markers']} markers)\n"
            if len(self.results['files_with_markers']) > 20:
                new_content += f"... and {len(self.results['files_with_markers']) - 20} more files\n"
        else:
            new_content += "No files with markers found!\n"

        new_content += "\n### NEXT STEPS\n"
        if self.results['files_with_markers']:
            new_content += "- Review undone.txt for detailed findings\n"
            new_content += "- Replace all nonproduction markers with production implementations\n"
            new_content += "- Run comprehensive testing\n"
            new_content += "- Update documentation\n"
        else:
            new_content += "- System appears fully production-ready!\n"
            new_content += "- Run final verification tests\n"
            new_content += "- Prepare for production deployment\n"

        # Write new content
        with open(instances_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Updated: {instances_path}")

def main():
    print("🚀 Starting Thorough Production Readiness Scanner...")

    scanner = ThoroughProductionScanner()

    try:
        # Perform the scan
        results = scanner.perform_thorough_scan()

        # Save results
        undone_path, json_path = scanner.save_results()

        print("\n✅ SCAN COMPLETE!")
        print(f"📄 undone.txt created: {undone_path}")
        print(f"📊 JSON report: {json_path}")
        print(f"📈 INSTANCES.md updated")

        if results['scan_info']['files_with_markers'] == 0:
            print("🎉 NO NONPRODUCTION MARKERS FOUND - SYSTEM IS PRODUCTION READY!")
        else:
            print(f"⚠️  Found {results['scan_info']['files_with_markers']} files with {results['scan_info']['total_markers_found']} markers")
            print("📋 Check undone.txt for detailed findings")

    except Exception as e:
        print(f"❌ Error during scan: {e}")
        import traceback
        traceback.print_exc()
        traceback.print_exc()

if __name__ == "__main__":
    main()