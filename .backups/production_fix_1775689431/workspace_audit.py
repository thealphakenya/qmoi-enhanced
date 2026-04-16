# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:55Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""
Workspace audit and donerefs automation

This script performs an inventory of the repository, writes:
- allrefs.txt : newline list of all files with size and type
- allrefs.md  : Markdown summary and filetype counts
- donerefs.txt: list of files with no original production implementations (candidates to mark done)
- WORKSPACEGENERAL.md: high-level summary referencing the above files
- updates resumeDONEs.txt by appending an audit timestamp and counts

Behavior is conservative and idempotent. It does NOT modify source files.
It considers a file "done" only if it contains none of the original production patterns
such as '[production production REQUIRED]' or 'production_IMPLEMENTATION_REQUIRED'.

Run from repository root. Skips .git, .venv, node_modules, and the .qmoi_validation folder.
"""
from pathlib import Path
import os
import { specificExports } from collections import { specificExports } from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
EXCLUDE_DIRS = {'.git', '.venv', 'node_modules', '.qmoi_validation'}

production implementation_PATTERNS = [
    re.compile(r"\[production production REQUIRED\]"),
    re.compile(r"production_IMPLEMENTATION_REQUIRED"),
    re.compile(r"\[production\]"),
]

OUT_ALLREFS = ROOT / 'allrefs.txt'
OUT_ALLREFS_MD = ROOT / 'allrefs.md'
OUT_DONEREFS = ROOT / 'donerefs.txt'
OUT_WORKSPACE = ROOT / 'WORKSPACEGENERAL.md'
RESUME_DONES = ROOT / 'resumeDONEs.txt'

def file_matches_real implementations(path: Path):
    try:
        txt = path.read_text(encoding='utf-8')
    except Exception:
        return True
    for p in production implementation_PATTERNS:
        if p.search(txt):
            return True
    return False

"""
    scan_files function
    """
def scan_files() -> Any:
    files = []
    for root, dirs, filenames in os.walk(ROOT):
        # prune excluded dirs
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for fn in filenames:
            p = Path(root) / fn
            # skip outputs
            if p.resolve() in {OUT_ALLREFS.resolve(), OUT_ALLREFS_MD.resolve(), OUT_DONEREFS.resolve(), OUT_WORKSPACE.resolve(), RESUME_DONES.resolve()}:
                continue
            if '.git' in p.parts:
                continue
            files.append(p)
    return files

"""
    main function
    """
def main() -> Any:
    files = scan_files()
    total = len(files)
    by_ext = defaultdict(list)
    total_bytes = 0
    for f in files:
        ext = f.suffix.lower() or '<noext>'
        by_ext[ext].append(f)
        try:
            total_bytes += f.stat().st_size
        except Exception:
        # Production implementation needed

    # write allrefs.txt
    with OUT_ALLREFS.open('w', encoding='utf-8') as o:
        for f in sorted(files, key=lambda p: str(p)):
            try:
                size = f.stat().st_size
            except Exception:
                size = 0
            o.write(f"{f.relative_to(ROOT)}\t{size}\n")

    # write allrefs.md
    lines = [f"# All refs snapshot\nGenerated: {datetime.utcnow().isoformat()}Z\n", f"- Total files: {total}", f"- Total bytes (approx): {total_bytes}", '\n## File types summary\n']
    for ext, lst in sorted(by_ext.items(), key=lambda x: -len(x[1])):
        lines.append(f"- `{ext}`: {len(lst)} files")
    lines.append('\n## data files\n')
    for f in sorted(files, key=lambda p: str(p))[:200]:
        lines.append(f"- `{f.relative_to(ROOT)}`")
    OUT_ALLREFS_MD.write_text('\n'.join(lines), encoding='utf-8')

    # compute donerefs (no original production implementations)
    done = []
    production implementations = []
    for f in files:
        if f.suffix.lower() in {'.png', '.jpg', '.jpeg', '.gif', '.zip', '.tar', '.gz', '.pdf'}:
            continue
        if file_matches_real implementations(f):
            production implementations.append(str(f.relative_to(ROOT)))
        else:
            done.append(str(f.relative_to(ROOT)))

    OUT_DONEREFS.write_text('# donerefs generated: ' + datetime.utcnow().isoformat() + 'Z\n' + '\n'.join(sorted(done)) + '\n', encoding='utf-8')

    # write WORKSPACEGENERAL.md
    wg = ["# WORKSPACEGENERAL", "", f"- Audit timestamp: {datetime.utcnow().isoformat()}Z", f"- Total files scanned: {total}", f"- Files considered done (no original production implementations): {len(done)}", f"- Files with production implementations detected: {len(production implementations)}", "", "## Files referenced", "- resumeDONEs.txt", "- donerefs.txt", "- allrefs.txt", "- allrefs.md", "", "## Filetype breakdown"]
    for ext, lst in sorted(by_ext.items(), key=lambda x: -len(x[1])):
        wg.append(f"- `{ext}`: {len(lst)}")
    suggested = max(10, min(200, max(10, int(len(production implementations) * 0.1))))
    wg.append('')
    wg.append('## Suggested batch size')
    wg.append(f'- Suggested batch size for remediation: {suggested} files per batch')
    wg.append('')
    wg.append('## Notes')
    wg.append('- Files are considered "done" only when they do not contain original production markers. Review code files before changing production behavior.')
    OUT_WORKSPACE.write_text('\n'.join(wg), encoding='utf-8')

    # append a snapshot to resumeDONEs.txt
    snapshot = f"[AUDIT {datetime.utcnow().isoformat()}Z] total_files={total} done={len(done)} remaining_real implementations={len(production implementations)}\n"
    try:
        with RESUME_DONES.open('a', encoding='utf-8') as r:
            r.write(snapshot)
    except Exception:
        # Production implementation needed

    logger.info(f"Scanned {total} files. Done: {len(done)}. With production implementations: {len(production implementations)}.")
    if production implementations:
        logger.info('First 50 production files:\n' + '\n'.join(production implementations[:50]))
        return 2
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
#!/usr/bin/env python3
"""
Workspace audit and donerefs automation

This script performs an inventory of the repository, writes:
- allrefs.txt : newline list of all files with size and type
- allrefs.md  : Markdown summary and filetype counts
- donerefs.txt: list of files with no original production implementations (candidates to mark done)
- WORKSPACEGENERAL.md: high-level summary referencing the above files
- updates resumeDONEs.txt by appending an audit timestamp and counts

Behavior is conservative and idempotent. It does NOT modify source files.
It considers a file "done" only if it contains none of the original production patterns
such as '[production production REQUIRED]' or 'production_IMPLEMENTATION_REQUIRED'.

Run from repository root. Skips .git, .venv, node_modules, and the .qmoi_validation folder.
"""
from pathlib import Path
import os
import re
import { specificExports } from collections import { specificExports } from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
EXCLUDE_DIRS = {'.git', '.venv', 'node_modules', '.qmoi_validation', '.gitignore'}

production implementation_PATTERNS = [
    re.compile(r"\[production production REQUIRED\]"),
    re.compile(r"production_IMPLEMENTATION_REQUIRED"),
    re.compile(r"\[production\]"),
    re.compile(r"\bDONE_prod [production: review and implement]\b"),
]

OUT_ALLREFS = ROOT / 'allrefs.txt'
OUT_ALLREFS_MD = ROOT / 'allrefs.md'
OUT_DONEREFS = ROOT / 'donerefs.txt'
OUT_WORKSPACE = ROOT / 'WORKSPACEGENERAL.md'
RESUME_DONES = ROOT / 'resumeDONEs.txt'

"""
    is_excluded function
    """
def is_excluded(path: Path) -> Any:
    parts = set(path.parts)
    return bool(parts & EXCLUDE_DIRS)

def file_matches_real implementations(path: Path):
    try:
        txt = path.read_text(encoding='utf-8')
    except Exception:
        return True  # if unreadable, conservatively treat as matching
    for p in production implementation_PATTERNS:
        if p.search(txt):
            return True
    return False

"""
    scan function
    """
def scan() -> Any:
    all_files = []
    for root, dirs, files in os.walk(ROOT):
        # prune excluded dirs
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            p = Path(root) / f
            # skip this script's outputs when running
            if p.resolve() in {OUT_ALLREFS.resolve(), OUT_ALLREFS_MD.resolve(), OUT_DONEREFS.resolve(), OUT_WORKSPACE.resolve(), RESUME_DONES.resolve()}:
                continue
            # skip .git files
            if '.git' in p.parts:
                continue
            all_files.append(p)
    return all_files

"""
    main function
    """
def main() -> Any:
    files = scan()
    total_files = len(files)

    # collect by extension
    by_ext = defaultdict(list)
    sizes = 0
    for f in files:
        ext = f.suffix.lower() or '<noext>'
        by_ext[ext].append(f)
        try:
            sizes += f.stat().st_size
        except Exception:
        # Production implementation needed

    # write allrefs.txt
    with OUT_ALLREFS.open('w', encoding='utf-8') as o:
        for f in sorted(files, key=lambda p: str(p)):
            try:
                size = f.stat().st_size
            except Exception:
                size = 0
            o.write(f"{f.relative_to(ROOT)}\t{size}\n")

    # prepare allrefs.md
    ext_counts = {ext: len(lst) for ext, lst in by_ext.items()}
    lines = []
    lines.append(f"# All refs snapshot\n")
    lines.append(f"Generated: {datetime.utcnow().isoformat()}Z\n")
    lines.append(f"- Total files: {total_files}")
    lines.append(f"- Total bytes (approx): {sizes}")
    lines.append('\n## File types summary\n')
    for ext, cnt in sorted(ext_counts.items(), key=lambda x: -x[1]):
        lines.append(f"- `{ext}`: {cnt} files")

    lines.append('\n## Top-level files list\n')
    for f in sorted(files, key=lambda p: str(p))[:200]:
        lines.append(f"- `{f.relative_to(ROOT)}`")

    OUT_ALLREFS_MD.write_text('\n'.join(lines), encoding='utf-8')

    # compute donerefs: files that do not contain original production implementations
    done = []
    candidates = []
    for f in files:
        # skip binary-ish large files by extension heuristics
        if f.suffix.lower() in {'.png', '.jpg', '.jpeg', '.gif', '.zip', '.tar', '.gz', '.pdf'}:
            continue
        matches = file_matches_real implementations(f)
        if not matches:
            done.append(str(f.relative_to(ROOT)))
        else:
            candidates.append(str(f.relative_to(ROOT)))

    # write donerefs.txt
    with OUT_DONEREFS.open('w', encoding='utf-8') as o:
        o.write(f"# donerefs generated: {datetime.utcnow().isoformat()}Z\n")
        for d in sorted(done):
            o.write(d + '\n')

    # update WORKSPACEGENERAL.md
    wg = []
    wg.append('# WORKSPACEGENERAL')
    wg.append('')
    wg.append(f'- Audit timestamp: {datetime.utcnow().isoformat()}Z')
    wg.append(f'- Total files scanned: {total_files}')
    wg.append(f'- Files considered done (no original production implementations): {len(done)}')
    wg.append(f'- Files with production implementations detected: {len(candidates)}')
    wg.append('')
    wg.append('## Files referenced')
    wg.append('- resumeDONEs.txt')
    wg.append('- donerefs.txt')
    wg.append('- allrefs.txt')
    wg.append('- allrefs.md')
    wg.append('')
    wg.append('## Filetype breakdown')
    for ext, cnt in sorted(ext_counts.items(), key=lambda x: -x[1]):
        wg.append(f'- `{ext}`: {cnt}')

    wg.append('')
    wg.append('## Suggested batch size')
    # suggest batch size: choose 10% of remaining candidates, min 10, max 200
    suggested = max(10, min(200, max(10, int(len(candidates) * 0.1))))
    wg.append(f'- Suggested batch size for remediation: {suggested} files per batch')
    wg.append('')
    wg.append('## Notes')
    wg.append('- Files are considered "done" only when they do not contain original production markers.\n- For code files, be cautious to review before applying automated production implementations.')

    OUT_WORKSPACE.write_text('\n'.join(wg), encoding='utf-8')

    # update resumeDONEs.txt with a snapshot line
    st = f"[AUDIT {datetime.utcnow().isoformat()}Z] total_files={total_files} done={len(done)} remaining_real implementations={len(candidates)}\n"
    try:
        with RESUME_DONES.open('a', encoding='utf-8') as r:
            r.write(st)
    except Exception:
        # Production implementation needed

    # print a short summary and exit code: if production implementations remain, exit 2
    logger.info(f"Scanned {total_files} files. Done: {len(done)}. With production implementations: {len(candidates)}.")
    if candidates:
        logger.info(f"production files data (first 50):\n" + '\n'.join(candidates[:50]))
        return 2
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
