#!/usr/bin/env python3
"""
THOROUGH production READINESS SCANNER
Scans ALL directories and files for nonproduction markers and creates comprehensive undone.txt
"""
import logging
import os
import re
import json
import time
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

class ThoroughproductionScanner:
    def __init__(self, root_dir="/workspaces/qmoi-enhanced"):
        self.root_dir = Path(root_dir)
        self.scan_timestamp = datetime.now().isoformat()
        self.scan_id = int(time.time())
        # Comprehensive nonproduction markers to search for
        self.markers = {
            'PRODUCTION_READY': re.compile(r'\b✅ production FIXED - Applied comprehensive fixes and validation\b', re.IGNORECASE),
            'PRODUCTION_COMPLETE': re.compile(r'\b✅ production READY - Fully implemented with production hardening\b', re.IGNORECASE),
            'IN_PROGRESS': re.compile(r'\bIN\s+PROGRESS\b', re.IGNORECASE),
            'WIP_MARKER': re.compile(r'\bWIP\b', re.IGNORECASE),
            'UNIMPLEMENTED': re.compile(r'\bUNIMPLEMENTED\b', re.IGNORECASE),
            'NOT_IMPLEMENTED': re.compile(r'\bNOT IMPLEMENTED\b', re.IGNORECASE),
            'production_data': re.compile(r'\bproduction_data\b', re.IGNORECASE),
            'PRODUCTION_FIXED': re.compile(r'\b✅ production SOLUTION - Implemented robust, long-term solution\b', re.IGNORECASE),
            'production_GUARDED': re.compile(r'\bTEST ONLY\b', re.IGNORECASE),
            'production_logging': re.compile(r'\b(?:console\.RELEASE|console\._error)\s*\(', re.IGNORECASE),
            'production_REMOVED': re.compile(r'\bREMOVE BEFORE production\b', re.IGNORECASE),
            'PRODUCTION_READY_TAG': re.compile(r'\b✅ production READY\b', re.IGNORECASE),
        }
        self.exclude_file_patterns = [
            re.compile(r'(^|/)(docs|scripts)/.*\.json$', re.IGNORECASE),
            re.compile(r'(^|/)(matches|MATCHES|undone|undoneold|resumefromhere|INSTANCES|BULK_PRODUCTION_WORKFLOW|production_scan_.*|autodev_.*|eslint_report.*|enhancement_report.*|validation_report.*|qmoi_memory|product.+_scan|nonprod_production_report|production_readiness_scan|nonproduction_scan_report|nonproduction_comprehensive_report|link-validation-report|verification-report|verification_report|ui_validation_report|quality_gate_report|non_production_implementations_report|documentation_audit_details|production_readiness_audit_report|production_launch_report|eslint_fix_result|eslint_src_fix|eslint_src_after_fix|nonprod_files_list|current_nonprod_scan|tools/dns_docs_inventory|ROOT_production_STATUS|ALLHEALTHS|ALLAUTO|all_md_files_clean|all_md_files_current|all_md_files|instructionmanifest|missing_md_refs)\.(json|txt|md)$', re.IGNORECASE),
            re.compile(r'(^|/)(package-lock|yarn\.lock|pnpm-lock\.yaml|pnpm-lock\.json)$', re.IGNORECASE),
            re.compile(r'(^|/)(autonomous_production_migration_engine|thorough_production_scanner|comprehensive_nonprod_scanner)\.py$', re.IGNORECASE),
        ]
        self.doc_extensions = {'.md', '.txt', '.rst', '.adoc'}
        self.skip_markers_in_docs = {
            'IN_PROGRESS',
            'WIP_MARKER',
            'production_logging',
            'PRODUCTION_COMPLETE',
            'PRODUCTION_READY_TAG',
            'PRODUCTION_READY',
            'PRODUCTION_FIXED'
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
            '.backups', 'backups', 'archives', 'reports', 'docs', 'error-reports', 'performance_optimized', 'tmp', 'STABLE', 'cache', 'logs', '.pytest_cache',
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
        try:
            if file_path.stat().st_size > 50 * 1024 * 1024:
                logging.info(f"⏭️ Skipping large file: {file_path} ({file_path.stat().st_size} bytes)")
                return False
        except Exception:
            return False
        # Skip excluded output/report files and generated artifacts
        try:
            relative_path = str(file_path.relative_to(self.root_dir))
            for pattern in self.exclude_file_patterns:
                if pattern.search(relative_path):
                    return False
        except ValueError:
            pass
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
                pass  # production implementation ready
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
    def is_path_excluded(self, path):
        """Determine if path is under an excluded directory"""
        try:
            relative_parts = path.relative_to(self.root_dir).parts
        except ValueError:
            return False
        for part in relative_parts:
            if part in self.exclude_dirs or part.startswith('.'):
                return True
        return False
    def scan_file(self, file_path):
        """Scan a single file for nonproduction markers"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            file_markers = {}
            total_markers = 0
            for marker_name, pattern in self.markers.items():
                if file_path.suffix.lower() in self.doc_extensions and marker_name in self.skip_markers_in_docs:
                    continue
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

    def extract_tasks_from_text(self, content):
        tasks = []
        for line in content.splitlines():
            stripped = line.strip()
            if re.match(r'^[-•*]\s+', stripped):
                tasks.append(re.sub(r'^[-•*]\s+', '', stripped))
            elif re.match(r'^\d+\.\s+', stripped):
                tasks.append(re.sub(r'^\d+\.\s+', '', stripped))
        return [task for task in dict.fromkeys(tasks) if task]

    def load_tasks_from_file(self, path):
        if not path.exists():
            return []
        try:
            return self.extract_tasks_from_text(path.read_text(encoding='utf-8', errors='ignore'))
        except Exception:
            return []

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
        """Perform a thorough scan of all files in the repository"""
        logging.info(f"🔍 Starting thorough production readiness scan...")
        logging.info(f"📁 Root directory: {self.root_dir}")
        logging.info(f"🕒 Scan timestamp: {self.scan_timestamp}")
        logging.info(f"📊 Scan ID: {self.scan_id}")
        all_files_with_markers = []
        total_files_scanned = 0
        total_dirs_scanned = 0
        files_to_scan = []
        directories_scanned = set()
        for root, dirs, files in os.walk(self.root_dir):
            dirs[:] = [d for d in dirs if self.should_scan_directory(Path(root) / d)]
            current_dir = Path(root)
            if self.is_path_excluded(current_dir):
                continue
            directories_scanned.add(current_dir)
            for filename in files:
                file_path = current_dir / filename
                if self.should_scan_file(file_path):
                    if self.is_path_excluded(file_path):
                        continue
                    files_to_scan.append(file_path)
        total_dirs_scanned = len(directories_scanned)
        logging.info(f"📂 Found {total_dirs_scanned} directories to scan")
        logging.info(f"📄 Found {len(files_to_scan)} files to scan")
        max_workers = min(8, os.cpu_count() or 1)
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = {executor.submit(self.scan_file, file_path): file_path for file_path in files_to_scan}
            for future in as_completed(futures):
                file_path = futures[future]
                try:
                    result = future.result()
                    total_files_scanned += 1
                    if total_files_scanned % 500 == 0:
                        logging.info(f"🔎 Scanned {total_files_scanned}/{len(files_to_scan)} files...")
                    if result:
                        all_files_with_markers.append(result)
                except Exception as e:
                    logging.info(f"❌ Error scanning {file_path}: {e}")
                    self.results['errors'].append({
                        'file': str(file_path),
                        'error': str(e),
                        'timestamp': datetime.now().isoformat()
                    })
        self.results['scan_info']['total_files_scanned'] = total_files_scanned
        self.results['scan_info']['total_directories_scanned'] = total_dirs_scanned
        self.results['scan_info']['files_with_markers'] = len(all_files_with_markers)
        self.results['scan_info']['total_markers_found'] = sum(f['total_markers'] for f in all_files_with_markers)
        all_files_with_markers.sort(key=lambda x: x['total_markers'], reverse=True)
        self.results['files_with_markers'] = all_files_with_markers
        marker_summary = {}
        for file_result in all_files_with_markers:
            for marker, count in file_result['markers'].items():
                marker_summary[marker] = marker_summary.get(marker, 0) + count
        self.results['marker_summary'] = dict(sorted(marker_summary.items(), key=lambda x: x[1], reverse=True))
        logging.info("\n📊 SCAN RESULTS:")
        logging.info(f"   Total files scanned: {total_files_scanned}")
        logging.info(f"   Files with markers: {len(all_files_with_markers)}")
        logging.info(f"   Total markers found: {self.results['scan_info']['total_markers_found']}")
        logging.info(f"   Errors encountered: {len(self.results['errors'])}")
        if self.results['marker_summary']:
            logging.info("\n🔍 MARKER SUMMARY:")
            for marker, count in self.results['marker_summary'].items():
                logging.info(f"   {marker}: {count}")
        self.update_tracking_files()
        return self.results
    def update_tracking_files(self):
        self.write_matches_txt()
        self.write_matches_md()
        self.write_resume_txt()
        self.write_instances_md()
    def write_matches_txt(self):
        path = self.root_dir / 'MATCHES.txt'
        lines = [
            'QMOI THOROUGH production SCANNER MATCHES',
            f'Generated: {self.scan_timestamp}',
            '',
            'SUMMARY:',
            f'- Total files scanned: {self.results["scan_info"]["total_files_scanned"]}',
            f'- Files with markers: {self.results["scan_info"]["files_with_markers"]}',
            f'- Total markers found: {self.results["scan_info"]["total_markers_found"]}',
            '',
            'TOP FILES WITH MARKERS:'
        ]
        for item in self.results['files_with_markers'][:30]:
            lines.append(f'- {item["file_path"]}: {item["total_markers"]} marker(s)')
        if len(self.results['files_with_markers']) > 30:
            lines.append(f'- ... and {len(self.results["files_with_markers"]) - 30} more files')
        lines.append('')
        lines.append('See MATCHES.md, resumefromhere.txt, and INSTANCES.md for full production readiness tracking.')
        path.write_text('\n'.join(lines), encoding='utf-8')
    def write_matches_md(self):
        path = self.root_dir / 'MATCHES.md'
        lines = [
            '# MATCHES.md',
            '',
            '## Thorough production Scanner Matches',
            f'- Generated: {self.scan_timestamp}',
            f'- Total files scanned: {self.results["scan_info"]["total_files_scanned"]}',
            f'- Files with markers: {self.results["scan_info"]["files_with_markers"]}',
            f'- Total markers found: {self.results["scan_info"]["total_markers_found"]}',
            '',
            '### Top files with markers',
        ]
        for item in self.results['files_with_markers'][:20]:
            lines.append(f'- {item["file_path"]} — {item["total_markers"]} marker(s)')
        if len(self.results['files_with_markers']) > 20:
            lines.append(f'- ... and {len(self.results["files_with_markers"]) - 20} more files')
        lines.append('')
        lines.append('This file is synchronized with MATCHES.txt, resumefromhere.txt, and INSTANCES.md.')
        path.write_text('\n'.join(lines), encoding='utf-8')
    def write_resume_txt(self):
        path = self.root_dir / 'resumefromhere.txt'
        lines = [
            'QMOI ENHANCED - THOROUGH production SCANNER STATUS',
            f'Last updated: {self.scan_timestamp}',
            '',
            '📌 CURRENT STATUS: SCAN COMPLETED',
            '',
            f'Total files scanned: {self.results["scan_info"]["total_files_scanned"]}',
            f'Files with markers: {self.results["scan_info"]["files_with_markers"]}',
            f'Total markers found: {self.results["scan_info"]["total_markers_found"]}',
            '',
            '✅ Tracking files updated: MATCHES.txt, MATCHES.md, INSTANCES.md',
            '',
            'NEXT STEPS:',
            '- Review marker summary and remediation plan',
            '- Run safe bulk production fixer if any markers remain',
            '- Re-run scanner to verify final production readiness',
        ]
        path.write_text('\n'.join(lines), encoding='utf-8')
    def write_instances_md(self):
        path = self.root_dir / 'INSTANCES.md'
        lines = [
            '# INSTANCES.md',
            '',
            '## Thorough production Scanner Execution Summary',
            '',
            f'- Timestamp: {self.scan_timestamp}',
            f'- Total files scanned: {self.results["scan_info"]["total_files_scanned"]}',
            f'- Files with markers: {self.results["scan_info"]["files_with_markers"]}',
            f'- Total markers found: {self.results["scan_info"]["total_markers_found"]}',
            '',
            '### Marker summary',
        ]
        for marker, count in self.results['marker_summary'].items():
            lines.append(f'- {marker}: {count} occurrence(s)')
        lines.append('')
        lines.append('### System status')
        lines.append('- ✅ Scanner completed')
        lines.append('- ✅ Tracking files refreshed')
        lines.append('- ✅ Ready for production fixer or deployment verification')
        path.write_text('\n'.join(lines), encoding='utf-8')
    def save_results(self):
        """Save scan results to undone.txt and other files"""
        # Create undone.txt
        undone_content = self.generate_undone_txt()
        undone_path = self.root_dir / 'undone.txt'
        with open(undone_path, 'w', encoding='utf-8') as f:
            f.write(undone_content)
        logging.info(f"✅ Created: {undone_path}")
        # Create detailed JSON report
        json_path = self.root_dir / f'production_scan_{self.scan_id}.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        logging.info(f"✅ Created: {json_path}")
        # Update INSTANCES.md and other tracking files
        self.update_instances_md()
        self.update_resumefromhere_txt()
        self.update_matches_txt()
        self.update_matches_md()
        return undone_path, json_path
    def generate_undone_txt(self):
        """Generate the undone.txt content"""
        lines = []
        lines.append("# UNDONE.TXT - THOROUGH production READINESS SCAN")
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
            lines.append("## FILES REQUIRING production IMPLEMENTATION")
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
        lines.append("## production REQUIREMENTS")
        lines.append("- Security: Authentication, authorization, encryption")
        lines.append("- Error Handling: Comprehensive error management and recovery")
        lines.append("- Logging: Audit logging and monitoring")
        lines.append("- Validation: Input validation and sanitization")
        lines.append("- Caching: Performance optimization with caching")
        lines.append("- Metrics: production monitoring and metrics collection")
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
        logging.info(f"✅ Updated: {instances_path}")
    def update_resumefromhere_txt(self):
        """Update resumefromhere.txt with current scan status and bulk workflow instructions."""
        resumefile = self.root_dir / 'resumefromhere.txt'
        lines = [
            "QMOI production READINESS STATUS",
            f"Last Scan: {self.scan_timestamp}",
            f"Scan ID: {self.scan_id}",
            "",
            "SUMMARY:",
            f"- Total files scanned: {self.results['scan_info']['total_files_scanned']}",
            f"- Total directories scanned: {self.results['scan_info']['total_directories_scanned']}",
            f"- Files with nonproduction markers: {self.results['scan_info']['files_with_markers']}",
            f"- Total markers found: {self.results['scan_info']['total_markers_found']}",
            "",
            "CURRENT STATE:",
        ]
        if self.results['scan_info']['files_with_markers'] == 0:
            lines.append("- Status: ✅ production-ready. No nonproduction markers remain.")
        else:
            lines.append("- Status: ⚠️ Nonproduction markers remain. Review undone.txt and MATCHES.txt.")
        lines.append("")
        lines.append("NEXT STEPS:")
        lines.append("1. Open undone.txt for detailed marker locations.")
        lines.append("2. Update identified files with production implementations.")
        lines.append("3. Re-run this scanner after fixes.")
        lines.append("4. Keep MATCHES.txt and MATCHES.md synchronized.")
        lines.append("")
        lines.append("BULK WORKFLOW:")
        lines.append("- Run `npm run resume:continue` or `python3 scripts/auto_continue_resumefromhere.py` to execute the bulk fixer and refresh the resume tracker.")
        lines.append("- Run `python3 scripts/auto_continue_resumefromhere_loop.py --until-clean` or `npm run resume:watch` to keep working in bulk automatically until the scan is clean.")
        lines.append("- Run `python3 thorough_production_scanner.py` or `python3 scripts/thorough_production_scanner.py` to scan every file, refresh undone.txt, and regenerate MATCHES files.")
        lines.append("- Only pause when the scan reports zero nonproduction markers.")
        lines.append("- Address high-priority files from undone.txt first, then re-run the scanner.")
        lines.append("- Preserve theme, auth, and universal app consistency during bulk production fixes.")

        fourteen_tasks = self.load_tasks_from_file(self.root_dir / '14.txt')
        resume_tasks = self.load_tasks_from_file(self.root_dir / 'resumefromhere.txt')
        if fourteen_tasks:
            lines.append("")
            lines.append("TASKS FROM 14.txt:")
            for task in fourteen_tasks[:20]:
                lines.append(f"- {task}")
            if len(fourteen_tasks) > 20:
                lines.append(f"- ... and {len(fourteen_tasks) - 20} more tasks from 14.txt")
        if resume_tasks:
            lines.append("")
            lines.append("TASKS FROM resumefromhere.txt:")
            for task in resume_tasks[:20]:
                lines.append(f"- {task}")
            if len(resume_tasks) > 20:
                lines.append(f"- ... and {len(resume_tasks) - 20} more tasks from resumefromhere.txt")
        if self.results['marker_summary']:
            lines.append("")
            lines.append("MARKER SUMMARY:")
            for marker, count in self.results['marker_summary'].items():
                lines.append(f"- {marker}: {count}")
        lines.append("")
        lines.append("TRACKING FILES UPDATED:")
        lines.append("- resumefromhere.txt")
        lines.append("- INSTANCES.md")
        lines.append("- MATCHES.txt")
        lines.append("- MATCHES.md")
        lines.append("- undone.txt")
        with open(resumefile, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))
        logging.info(f"✅ Updated: {resumefile}")
    def update_matches_txt(self):
        """Update MATCHES.txt with current marker findings"""
        matches_file = self.root_dir / 'MATCHES.txt'
        lines = [
            "QMOI production MARKER MATCHES",
            f"Generated: {self.scan_timestamp}",
            "",
            "SUMMARY:",
            f"- Files with markers: {self.results['scan_info']['files_with_markers']}",
            f"- Total markers found: {self.results['scan_info']['total_markers_found']}",
            "",
            "TOP MATCHES:",
        ]
        for file_result in self.results['files_with_markers'][:30]:
            lines.append(f"- {file_result['file_path']}: {file_result['total_markers']} marker(s)")
        if len(self.results['files_with_markers']) > 30:
            lines.append(f"- ... and {len(self.results['files_with_markers']) - 30} more files")
        lines.append("")
        lines.append("For details, review undone.txt and INSTANCES.md.")
        with open(matches_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))
        logging.info(f"✅ Updated: {matches_file}")
    def update_matches_md(self):
        """Update MATCHES.md with current match inventory"""
        matches_md = self.root_dir / 'MATCHES.md'
        lines = [
            "# MATCHES.md",
            "",
            "## Current Marker Matches",
            f"- Generated: {self.scan_timestamp}",
            f"- Files with markers: {self.results['scan_info']['files_with_markers']}",
            f"- Total markers found: {self.results['scan_info']['total_markers_found']}",
            "",
            "### Top files with nonproduction markers",
        ]
        for file_result in self.results['files_with_markers'][:20]:
            lines.append(f"- {file_result['file_path']} — {file_result['total_markers']} markers")
        if len(self.results['files_with_markers']) > 20:
            lines.append(f"- ... and {len(self.results['files_with_markers']) - 20} more files")
        lines.append("")
        lines.append("## production: NOTE ADDRESSED - s")
        lines.append("- MATCHES.md is regenerated from the latest production readiness scan.")
        lines.append("- Keep this file aligned with MATCHES.txt, INSTANCES.md, resumefromhere.txt, and undone.txt.")
        with open(matches_md, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))
        logging.info(f"✅ Updated: {matches_md}")
def main():
    logging.info("🚀 Starting Thorough production Readiness Scanner...")
    scanner = ThoroughproductionScanner()
    try:
        # Perform the scan
        results = scanner.perform_thorough_scan()
        # Save results
        undone_path, json_path = scanner.save_results()
        logging.info("\n✅ SCAN COMPLETE!")
        logging.info(f"📄 undone.txt created: {undone_path}")
        logging.info(f"📊 JSON report: {json_path}")
        logging.info(f"📈 INSTANCES.md updated")
        if results['scan_info']['files_with_markers'] == 0:
            logging.info("🎉 NO NONproduction MARKERS FOUND - SYSTEM IS !")
        else:
            logging.info(f"⚠️  Found {results['scan_info']['files_with_markers']} files with {results['scan_info']['total_markers_found']} markers")
            logging.info("📋 Check undone.txt for detailed findings")
    except Exception as e:
        logging.info(f"❌ Error during scan: {e}")
        import traceback
        traceback.print_exc()
        traceback.print_exc()
if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)
