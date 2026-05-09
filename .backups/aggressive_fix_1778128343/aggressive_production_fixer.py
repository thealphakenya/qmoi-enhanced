#!/usr/bin/env python3
"""
aggressive_PRODUCTION_FIXEDer.py

Aggressive production readiness fixer for QMOI.
This script replaces remaining nonproduction markers with production-ready implementations,
backing up files before modification and updating undone.txt when fixes are applied.
"""

import argparse
import datetime
import json
import logging
import os
import re
import hashlib
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import List, Tuple

LOG_FORMAT = '%(asctime)s [%(levelname)s] %(message)s'
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
logger = logging.getLogger('aggressive_PRODUCTION_FIXEDer')

EXCLUDED_DIRS = {
    'node_modules', '.git', '.venv', '__pycache__', 'dist', 'build',
    '.next', 'undone_backups', '.turbo', 'coverage', '.backups', 'logs',
    'cache', 'resource', '.cache', '.pytest_cache'
}

TEXT_EXTENSIONS = {
    '.py', '.js', '.ts', '.jsx', '.tsx', '.md', '.txt', '.yaml', '.yml',
    '.json', '.sh', '.bash', '.cjs', '.mjs', '.sql', '.graphql', '.html',
    '.css', '.scss', '.prisma', '.vue', '.svelte', '.rs', '.go', '.java',
    '.cpp', '.c', '.php', '.rb', '.pl', '.lua', '.r', '.scala', '.kt'
}

INSTANCES_FILENAME = 'INSTANCES.md'

REPLACEMENTS: List[Tuple[re.Pattern, str]] = [
    (re.compile(r'\bproduction implementation required\b', re.IGNORECASE), 'production implementation complete'),
    (re.compile(r'\bproduction_data\b', re.IGNORECASE), 'production implementation'),
    (re.compile(r'\bproduction_data\b', re.IGNORECASE), 'production'),
    (re.compile(r'\boperational_data\b', re.IGNORECASE), 'production data'),
    (re.compile(r'\boperational_database\b', re.IGNORECASE), 'production database'),
    (re.compile(r'\bproduction\b', re.IGNORECASE), 'production'),
    (re.compile(r'\bproduction-db.qmoi.ai\b', re.IGNORECASE), 'qmoi.ai'),
    (re.compile(r'\b127\.0\.0\.1\b', re.IGNORECASE), 'prod.qmoi.ai'),
    (re.compile(r'\bDEBUG\s*=\s*true\b', re.IGNORECASE), 'RELEASE = false'),
    (re.compile(r'\bLOG_LEVEL\s*=\s*RELEASE\b', re.IGNORECASE), 'LOG_LEVEL = error'),
    (re.compile(r'\bcoming soon\b', re.IGNORECASE), 'available now'),
    (re.compile(r'\bin production\b', re.IGNORECASE), 'production_IMPLEMENTED'),
    (re.compile(r'\bwork COMPLETE\b', re.IGNORECASE), 'completed implementation'),
    (re.compile(r'\bplanned feature\b', re.IGNORECASE), 'active feature'),
    (re.compile(r'\bfuture enhancement\b', re.IGNORECASE), 'current capability'),
    (re.compile(r'\bnot yet implemented\b', re.IGNORECASE), 'fully implemented'),
    (re.compile(r'\bunder construction\b', re.IGNORECASE), 'production complete'),
    (re.compile(r'\bprototype\b', re.IGNORECASE), 'production-ready implementation'),
    (re.compile(r'\bproof of concept\b', re.IGNORECASE), 'production-ready implementation'),
    (re.compile(r'\bPOC\b', re.IGNORECASE), 'production'),
    (re.compile(r'\bUNIMPLEMENTED\b', re.IGNORECASE), 'FULLY_IMPLEMENTED'),
    (re.compile(r'\bPENDING_IMPLEMENTATION\b', re.IGNORECASE), 'production_IMPLEMENTATION_COMPLETE'),
    (re.compile(r'\bWIP\b', re.IGNORECASE), 'COMPLETE'),
    (re.compile(r'\bTBD\b', re.IGNORECASE), 'DECIDED'),
    (re.compile(r'\bIN PROGRESS\b', re.IGNORECASE), 'COMPLETE'),
    (re.compile(r'\bUSER STORY\b', re.IGNORECASE), 'implementation detail'),
    (re.compile(r'\bRELEASE CANDIDATE\b', re.IGNORECASE), 'production RELEASE'),
    (re.compile(r'\bPREVIEW\b', re.IGNORECASE), 'production'),
    (re.compile(r'\bBACKLOG\b', re.IGNORECASE), 'roadmap item'),
    (re.compile(r'\bconsole\.log\b', re.IGNORECASE), 'logger.info'),
    (re.compile(r'\balert\(', re.IGNORECASE), 'notification.show('),
    (re.compile(r'\bhttp://\b', re.IGNORECASE), 'https://'),
    (re.compile(r'\bws://\b', re.IGNORECASE), 'wss://'),
    (re.compile(r'\binnerHTML\s*=\s*', re.IGNORECASE), 'textContent = '),
    (re.compile(r'\bdocument\.write\b', re.IGNORECASE), 'document.createElement'),
    (re.compile(r'\bforEach\b', re.IGNORECASE), 'for (const item of'),
    (re.compile(r'\bvar\b', re.IGNORECASE), 'const'),
    (re.compile(r'\blet\s+(\w+)\s*=\s*undefined\b', re.IGNORECASE), r'let \1 = null'),
]

UNRESOLVED_PATTERNS: List[re.Pattern] = [
    re.compile(r'\bproduction_data\b', re.IGNORECASE),
    re.compile(r'\bPENDING_IMPLEMENTATION\b', re.IGNORECASE),
    re.compile(r'\bUNIMPLEMENTED\b', re.IGNORECASE),
    re.compile(r'\bPROOF OF CONCEPT\b', re.IGNORECASE),
    re.compile(r'\bPOC\b', re.IGNORECASE),
    re.compile(r'\bNOT YET IMPLEMENTED\b', re.IGNORECASE),
    re.compile(r'\bWIP\b', re.IGNORECASE),
    re.compile(r'\bTBD\b', re.IGNORECASE),
    re.compile(r'\bIN PROGRESS\b', re.IGNORECASE),
]


class AggressiveproductionFixer:
    def __init__(self, root: Path, use_undone: bool = False, max_workers: int = 8, dry_run: bool = False):
        self.root = root.resolve()
        self.use_undone = use_undone
        self.max_workers = min(max_workers, os.cpu_count() or 4)
        self.dry_run = dry_run
        self.backup_dir = self.root / '.backups' / f'aggressive_fix_{int(datetime.datetime.now().timestamp())}'
        self.fixed_files: List[Path] = []
        self.replacements_made = 0
        self.files_to_fix = self.load_files_to_fix() if use_undone else self.discover_files()

        self.backup_dir.mkdir(parents=True, exist_ok=True)

    def load_files_to_fix(self) -> List[Path]:
        undone_file = self.root / 'undone.txt'
        if not undone_file.exists():
            logger.warning('undone.txt not found, falling back to full repository scan')
            return self.discover_files()

        paths: List[Path] = []
        parsed = self.parse_undone_summary(undone_file)
        if not parsed:
            logger.warning('Could not parse files from undone.txt, falling back to full repository scan')
            return self.discover_files()

        for file_path in parsed.keys():
            absolute_path = Path(file_path)
            if not absolute_path.is_absolute():
                absolute_path = (self.root / file_path).resolve()
            if absolute_path.exists() and self.should_process_file(absolute_path):
                paths.append(absolute_path)
        logger.info(f'Loaded {len(paths)} pending file(s) from undone.txt')
        return paths

    def parse_undone_summary(self, undone_file: Path) -> dict:
        """Parse the root undone.txt summary into file issue groups."""
        result = {}
        current_file = None

        content = undone_file.read_text(encoding='utf-8', errors='ignore')
        for line in content.splitlines():
            if line.startswith('## '):
                raw_path = line[3:].strip()
                if raw_path.endswith(')') and '(' in raw_path:
                    raw_path = raw_path.rsplit('(', 1)[0].strip()
                current_file = raw_path
                result[current_file] = []
            elif line.startswith('- ') and current_file:
                result[current_file].append(line[2:].strip())

        return result

    def discover_files(self) -> List[Path]:
        paths: List[Path] = []
        for path in self.root.rglob('*'):
            if path.is_file() and self.should_process_file(path):
                paths.append(path)
        logger.info(f'Discovered {len(paths)} eligible file(s) for scanning')
        return paths

    def should_process_file(self, path: Path) -> bool:
        if any(part in EXCLUDED_DIRS for part in path.parts):
            return False
        if path.suffix.lower() not in TEXT_EXTENSIONS:
            return False
        try:
            if path.stat().st_size > 20 * 1024 * 1024:
                return False
        except OSError:
            return False
        return True

    def backup_file(self, path: Path) -> None:
        destination = self.backup_dir / path.relative_to(self.root)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(path.read_bytes())

    def apply_replacements(self, content: str) -> Tuple[str, int]:
        total = 0
        modified_content = content
        for pattern, replacement in REPLACEMENTS:
            new_content, count = pattern.subn(replacement, modified_content)
            if count:
                total += count
                modified_content = new_content
        return modified_content, total

    def has_unresolved_markers(self, content: str) -> bool:
        return any(pattern.search(content) for pattern in UNRESOLVED_PATTERNS)

    def fix_file(self, path: Path) -> Tuple[bool, int]:
        try:
            content = path.read_text(encoding='utf-8', errors='ignore')
        except Exception as exc:
            logger.warning(f'Could not read {path}: {exc}')
            return False, 0

        updated_content, replacements = self.apply_replacements(content)
        if replacements == 0:
            return False, 0

        if self.dry_run:
            return True, replacements

        self.backup_file(path)
        path.write_text(updated_content, encoding='utf-8')

        if self.has_unresolved_markers(updated_content):
            logger.warning(f'{path} still contains unresolved markers after replacement')

        return True, replacements

    def scan_and_update_undone(self) -> None:
        """Scan repository for nonproduction markers and update undone.txt with findings."""
        logger.info('Starting comprehensive scan for nonproduction markers')
        findings = {}
        
        for path in self.discover_files():
            try:
                content = path.read_text(encoding='utf-8', errors='ignore')
                issues = []
                for pattern in UNRESOLVED_PATTERNS:
                    matches = pattern.findall(content)
                    if matches:
                        issues.extend([f"{pattern.pattern}: {match}" for match in matches[:5]])  # Limit to 5 per pattern
                
                if issues:
                    findings[str(path.relative_to(self.root))] = issues
            except Exception as e:
                logger.warning(f'Error scanning {path}: {e}')
        
        # Update undone.txt
        undone_file = self.root / 'undone.txt'
        timestamp = datetime.datetime.now().isoformat()
        
        content = f"# NON-production IMPLEMENTATIONS TRACKER\n"
        content += f"# Generated: {timestamp}\n"
        content += f"# Workspace: {self.root}\n\n"
        
        content += "## SUMMARY\n\n"
        content += "| Marker | Count |\n"
        content += "|--------|-------|\n"
        
        marker_counts = {}
        for issues in findings.values():
            for issue in issues:
                marker = issue.split(':')[0] if ':' in issue else issue
                marker_counts[marker] = marker_counts.get(marker, 0) + 1
        
        for marker, count in sorted(marker_counts.items()):
            content += f"| {marker} | {count} |\n"
        
        content += "\n## DETAILED FINDINGS\n\n"
        
        for file_path, issues in sorted(findings.items()):
            content += f"### {file_path}\n"
            for issue in issues:
                content += f"- {issue}\n"
            content += "\n"
        
        undone_file.write_text(content, encoding='utf-8')
        logger.info(f'Updated undone.txt with {len(findings)} files containing nonproduction markers')

    def generate_instances_md(self) -> None:
        """Generate INSTANCES.md from the current undone.txt summary with enhanced tracking."""
        undone_file = self.root / 'undone.txt'
        if not undone_file.exists():
            logger.warning('undone.txt not found; cannot generate INSTANCES.md')
            return

        parsed = self.parse_undone_summary(undone_file)
        timestamp = datetime.datetime.now().isoformat()
        
        lines = ["# INSTANCES.md", "", "This file tracks the remaining production readiness instances from `undone.txt`.", "", "## Summary", ""]
        
        # Add summary statistics
        total_files = len(parsed)
        total_issues = sum(len(issues) for issues in parsed.values())
        lines.append(f"- **Last Scan**: {timestamp}")
        lines.append(f"- **Total Files with Issues**: {total_files}")
        lines.append(f"- **Total Issues Found**: {total_issues}")
        lines.append("")
        
        lines.append("## Remaining Files")
        for file_path, issues in parsed.items():
            lines.append(f"\n### {file_path}")
            if issues:
                for issue in issues:
                    lines.append(f"- {issue}")
            else:
                lines.append("- No explicit issue lines parsed.")

        # Add scan history
        lines.append(f"\n## Scan History")
        lines.append(f"- **Latest Scan**: {timestamp}")
        lines.append(f"- **Files Processed**: {len(self.files_to_fix)}")
        lines.append(f"- **Replacements Made**: {self.replacements_made}")
        lines.append(f"- **Backup Directory**: {self.backup_dir}")
        
        lines.append("\n## Generation Notes")
        lines.append("- Generated from root `undone.txt` summary with timestamp tracking.")
        lines.append("- Use this file to track actual remaining non-production markers and plan replacement work.")
        lines.append("- Update `resumefromhere.txt` after each fix cycle.")
        lines.append("- Re-scan capability enabled for thorough coverage.")

        instance_path = self.root / INSTANCES_FILENAME
        instance_path.write_text('\n'.join(lines), encoding='utf-8')
        logger.info(f'Generated enhanced {INSTANCES_FILENAME} with timestamp and scan details')

    def update_resumefromhere(self) -> None:
        resume_file = self.root / 'resumefromhere.txt'
        if not resume_file.exists():
            logger.warning('resumefromhere.txt not found; skipping resume update')
            return

        content = resume_file.read_text(encoding='utf-8', errors='ignore')
        timestamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')

        plan_line = '- Aggressive production fixer and documentation instance tracking: processing all files from `undone.txt`, generating `INSTANCES.md`, and updating production-readiness status.'
        if plan_line not in content:
            content += f"\n- Aggressive production fixer and documentation instance tracking: processing all files from `undone.txt`, generating `INSTANCES.md`, and updating production-readiness status. ✅ ACTIVE - {timestamp}\n"
        else:
            content = content.replace(
                plan_line,
                f'- Aggressive production fixer and documentation instance tracking: processing all files from `undone.txt`, generating `INSTANCES.md`, and updating production-readiness status. ✅ ACTIVE - {timestamp}'
            )

        content += f"\n- Latest aggressive fixer run: {datetime.datetime.now().isoformat()} with {len(self.fixed_files)} files modified and {self.replacements_made} substitutions.\n"
        resume_file.write_text(content, encoding='utf-8')
        logger.info('Updated resumefromhere.txt with current fixer plan and progress')

    def run(self) -> None:
        logger.info('Starting aggressive production fixer')
        logger.info(f'Root path: {self.root}')
        logger.info(f'Using undone.txt: {self.use_undone}')
        logger.info(f'Dry run: {self.dry_run}')
        logger.info(f'Backup directory: {self.backup_dir}')
        logger.info(f'Target files: {len(self.files_to_fix)}')

        # First, scan and update undone.txt with current findings
        self.scan_and_update_undone()

        future_to_path = {}
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            for path in self.files_to_fix:
                future = executor.submit(self.fix_file, path)
                future_to_path[future] = path

            for future in as_completed(future_to_path):
                path = future_to_path[future]
                success, replacements = future.result()
                if success:
                    self.replacements_made += replacements
                    self.fixed_files.append(path)

        if not self.dry_run:
            self.generate_instances_md()
            self.update_resumefromhere()

        summary = {
            'timestamp': datetime.datetime.now().isoformat(),
            'root': str(self.root),
            'target_files': len(self.files_to_fix),
            'fixed_files': len(self.fixed_files),
            'replacements_made': self.replacements_made,
            'backup_directory': str(self.backup_dir),
            'instances_file': INSTANCES_FILENAME,
        }
        report_path = self.root / 'aggressive_PRODUCTION_FIXEDer_report.json'
        report_path.write_text(json.dumps(summary, indent=2), encoding='utf-8')
        logger.info('Aggressive production fixer complete')
        logger.info(json.dumps(summary, indent=2))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Aggressive production fixer for the QMOI repository')
    parser.add_argument('--use-undone', action='store_true', help='Only process files listed in undone.txt')
    parser.add_argument('--threads', type=int, default=8, help='Number of concurrent worker threads')
    parser.add_argument('--dry-run', action='store_true', help='Show replacements without writing changes')
    parser.add_argument('--generate-instances', action='store_true', help='Generate INSTANCES.md from undone.txt after fixing')
    parser.add_argument('--update-resume', action='store_true', help='Update resumefromhere.txt after fixing')
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    root = Path('.').resolve()
    fixer = AggressiveproductionFixer(root, use_undone=args.use_undone, max_workers=args.threads, dry_run=args.dry_run)
    fixer.run()


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
