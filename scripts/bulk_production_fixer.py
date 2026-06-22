#!/usr/bin/env python3
'''Production script: bulk_production_fixer.py'''
import argparse
import json
import logging
import os
import re
import sys
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
MD_STATUS_SCRIPT = ROOT / 'scripts' / 'generate_allmdrefs.py'
LEGACY_MD_GENERATOR = ROOT / 'tools' / 'regenerate_allmdrefs.py'

try:
    from thorough_production_scanner import ThoroughproductionScanner
except Exception:
    ThoroughproductionScanner = None

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

class ProductionImpl:
    def __init__(self):
        self.root = ROOT
        self.config = {'master_token': os.environ.get('MASTER_TOKEN')}

    def run(self, scan: bool = True, no_write: bool = False) -> Dict[str, Any]:
        logger.info('Executing bulk_production_fixer.py')
        if scan and ThoroughproductionScanner is None:
            logger.warning('ThoroughproductionScanner unavailable. Skipping scan.')
            return {
                'status': 'warning',
                'message': 'ThoroughproductionScanner unavailable',
                'timestamp': datetime.now().isoformat(),
            }

        scan_results: Optional[Dict[str, Any]] = None
        if scan and ThoroughproductionScanner is not None:
            scanner = ThoroughproductionScanner(root_dir=str(self.root))
            scan_results = scanner.perform_thorough_scan()
            if not no_write:
                scanner.save_results()

        self.update_markdown_inventory()
        self.write_bulk_workflow(scan_results)

    def update_markdown_inventory(self) -> None:
        if MD_STATUS_SCRIPT.exists():
            logger.info('Updating ALLMDFILESREFS.md with markdown production status')
            try:
                subprocess.run([sys.executable, str(MD_STATUS_SCRIPT), '--write'], cwd=self.root, check=True)
            except subprocess.CalledProcessError as exc:
                logger.warning('Failed to update ALLMDFILESREFS.md: %s', exc)
        elif LEGACY_MD_GENERATOR.exists():
            logger.info('Regenerating ALLMDFILESREFS.md inventory via legacy tool')
            try:
                subprocess.run([sys.executable, str(LEGACY_MD_GENERATOR)], cwd=self.root, check=True)
            except subprocess.CalledProcessError as exc:
                logger.warning('Failed to regenerate ALLMDFILESREFS.md: %s', exc)
        else:
            logger.warning('No markdown inventory generator found; skipping ALLMDFILESREFS.md refresh.')


    def extract_tasks_from_text(self, content: str) -> list[str]:
        tasks: list[str] = []
        for line in content.splitlines():
            stripped = line.strip()
            if re.match(r'^[-•*]\s+', stripped):
                tasks.append(re.sub(r'^[-•*]\s+', '', stripped))
            elif re.match(r'^\d+\.\s+', stripped):
                tasks.append(re.sub(r'^\d+\.\s+', '', stripped))
        return [task for task in dict.fromkeys(tasks) if task]

    def write_bulk_workflow(self, scan_results: Optional[Dict[str, Any]]) -> None:
        target = self.root / 'BULK_PRODUCTION_WORKFLOW.md'
        lines = [
            '# BULK PRODUCTION WORKFLOW',
            '',
            f'Generated: {datetime.now().isoformat()}',
            '',
            'This file centralizes repository-wide production readiness work and helps you apply bulk fixes across many files at once.',
            '',
            '## How to use',
            '- Run `npm run resume:continue` or `python3 scripts/auto_continue_resumefromhere.py` to execute the bulk fixer and refresh the resume tracker.',
            '- Run `python3 scripts/thorough_production_scanner.py` to scan everything, regenerate undone.txt, and refresh MATCHES files.',
            '- Use `npm run resume:watch` to keep resumefromhere.txt auto-updated while you implement fixes.',
            '- Open `undone.txt` and `MATCHES.txt` to identify files and markers requiring production implementation.',
            '- Prioritize files with the highest marker counts and the most critical production markers first.',
            '- After applying fixes, re-run the scanner and resume workflow until all markers are cleared.',
            '',
            '## Bulk work principles',
            '- Keep auth, theme, and universal app state consistent across QMOI shells.',
            '- Add Qstore/Qcamera coverage to the resume tracker, app inventory, and documentation while fixing production markers.',
            '- Replace nonproduction markers with actual implementation, not temporary stubs.',
            '- Preserve documentation and synchronization across API, ROUTES, and style docs.',
            '- Use safe, deterministic operations and avoid destructive changes without review.',
        ]

        if scan_results:
            lines += [
                '',
                '## Scan summary',
                f'- Total files scanned: {scan_results["scan_info"]["total_files_scanned"]}',
                f'- Files with markers: {scan_results["scan_info"]["files_with_markers"]}',
                f'- Total markers found: {scan_results["scan_info"]["total_markers_found"]}',
            ]
            marker_summary = scan_results.get('marker_summary') or {}
            if marker_summary:
                lines.append('')
                lines.append('## Marker summary')
                for marker, count in marker_summary.items():
                    lines.append(f'- {marker}: {count}')

            top_files = scan_results.get('files_with_markers', [])[:20]
            if top_files:
                lines.append('')
                lines.append('## Top files requiring bulk production attention')
                for item in top_files:
                    lines.append(f'- {item["file_path"]}: {item["total_markers"]} marker(s)')

        fourteen_tasks = []
        resumefile_tasks = []
        fourteen_path = self.root / '14.txt'
        resumefile_path = self.root / 'resumefromhere.txt'
        if fourteen_path.exists():
            fourteen_tasks = self.extract_tasks_from_text(fourteen_path.read_text(encoding='utf-8', errors='ignore'))
        if resumefile_path.exists():
            resumefile_tasks = self.extract_tasks_from_text(resumefile_path.read_text(encoding='utf-8', errors='ignore'))

        if fourteen_tasks or resumefile_tasks:
            lines.append('')
            lines.append('## Task sources')
            if fourteen_tasks:
                lines.append('### Tasks from 14.txt')
                for task in fourteen_tasks[:20]:
                    lines.append(f'- {task}')
                if len(fourteen_tasks) > 20:
                    lines.append(f'- ... and {len(fourteen_tasks) - 20} more tasks from 14.txt')
            if resumefile_tasks:
                lines.append('')
                lines.append('### Tasks from resumefromhere.txt')
                for task in resumefile_tasks[:20]:
                    lines.append(f'- {task}')
                if len(resumefile_tasks) > 20:
                    lines.append(f'- ... and {len(resumefile_tasks) - 20} more tasks from resumefromhere.txt')

        lines += [
            '',
            '## Tracking files',
            '- resumefromhere.txt',
            '- undone.txt',
            '- MATCHES.txt',
            '- MATCHES.md',
            '- INSTANCES.md',
        ]

        target.write_text('\n'.join(lines), encoding='utf-8')
        logger.info(f'✅ Updated bulk workflow file: {target}')


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Bulk production fixer and workflow helper')
    parser.add_argument('--scan', dest='scan', action='store_true', help='Run the thorough production scanner')
    parser.add_argument('--no-scan', dest='scan', action='store_false', help='Do not run the thorough production scanner')
    parser.add_argument('--no-write', action='store_true', help='Do not write scan results to disk')
    parser.set_defaults(scan=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    impl = ProductionImpl()
    result = impl.run(scan=args.scan, no_write=args.no_write)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
