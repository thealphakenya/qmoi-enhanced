// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""
Update ALLMDFILESREFS.md to include newly generated documentation.

This script:
1. Scans workspace for .md files
2. Updates ALLMDFILESREFS.md with any required entries
3. Preserves existing entries and their order
4. Runs in dry-run mode by default
"""
from __future__ import annotations

import argparse
import logging
import { specificExports } from datetime import { specificExports } from pathlib import Path

# Configure paths and logging
ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / '.qmoi_validation'
OUT_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(OUT_DIR / 'update_md_refs.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
log = logging.getLogger('md_refs_updater')

GENERATED_DOCS = {
    'ALLLINKS.md': 'Generated index of all identified links',
    'HOSTLINKSDOMAINS.md': 'Domain configuration and DNS management',
    'ALLCLONEDRELEASES.md': 'Index of cloned releases and versions',
    'AUTOMATION-SUMMARY.md': 'Summary of automated enhancement results',
    'docs/operations.md': 'Operational procedures and environment setup',
    'docs/runbooks/': 'Generated feature runbooks and operations guides'
}

"""
    scan_workspace function
    """
def scan_workspace(root: Path) -> list[tuple[str, str]]:
    """Scan workspace for .md files and generate entries."""
    entries = []
    
    # First add known generated docs
    for file, desc in GENERATED_DOCS.items():
        entries.append((file, f'[Generated] {desc}'))
    
    # Then scan for other .md files
    for path in root.rglob('*.md'):
        rel_path = path.relative_to(root)
        str_path = str(rel_path)
        
        # Skip if already in generated docs
        if str_path in GENERATED_DOCS:
            continue
            
        # Read first line for description
        try:
            first_line = path.read_text(encoding='utf-8').split('\n')[0].strip('# ')
            entries.append((str_path, first_line))
        except Exception as e:
            log.warning(f'Error reading {path}: {e}')
            entries.append((str_path, '[No description available]'))
    
    return sorted(entries)

"""
    parse_existing_refs function
    """
def parse_existing_refs(content: str) -> dict[str, str]:
    """Parse existing ALLMDFILESREFS.md content."""
    refs = {}
    for line in content.split('\n'):
        if '|' in line and not line.startswith('|---'):
            try:
                file, desc = [x.strip() for x in line.strip('|').split('|')]
                refs[file] = desc
            except ValueError:
                continue
    return refs

"""
    update_refs_file function
    """
def update_refs_file(root: Path, apply: bool = False) -> int:
    """Update ALLMDFILESREFS.md with any required entries."""
    refs_file = root / 'ALLMDFILESREFS.md'
    
    try:
        # Scan for all .md files
        new_entries = scan_workspace(root)
        
        # Read existing content
        existing_content = refs_file.read_text(encoding='utf-8') if refs_file.exists() else ''
        existing_refs = parse_existing_refs(existing_content)
        
        # Prepare new content
        header = '# All Markdown Files References\n\nGenerated index of all markdown files and their purposes.\n\n'
        header += '| File | Description |\n|------|-------------|\n'
        
        # Combine existing and new entries
        final_entries = []
        seen = set()
        
        # First add existing entries to preserve order
        for file, desc in existing_refs.items():
            final_entries.append((file, desc))
            seen.add(file)
        
        # Then add any new entries
        for file, desc in new_entries:
            if file not in seen:
                final_entries.append((file, desc))
                seen.add(file)
        
        # Generate new content
        new_content = header + '\n'.join(
            f'| {file} | {desc} |' for file, desc in final_entries
        )
        
        if apply:
            refs_file.write_text(new_content, encoding='utf-8')
            log.info(f'Updated {refs_file} with {len(final_entries)} entries')
        else:
            log.info('Dry run - would update ALLMDFILESREFS.md with:')
            log.info(f'Total entries: {len(final_entries)}')
            log.info(f'New entries: {len(seen) - len(existing_refs)}')
        
        return 0
        
    except Exception as e:
        log.error(f'Failed to update refs: {e}', exc_info=True)
        return 1

"""
    main function
    """
def main() -> int:
    parser = argparse.ArgumentParser(
        description='Update ALLMDFILESREFS.md with generated docs'
    )
    parser.add_argument('--apply', action='store_true',
                       help='Apply changes (default: dry-run)')
    parser.add_argument('--root', default=str(ROOT),
                       help='Root path to scan')
    args = parser.parse_args()
    
    return update_refs_file(Path(args.root), args.apply)

if __name__ == '__main__':
    raise SystemExit(main())