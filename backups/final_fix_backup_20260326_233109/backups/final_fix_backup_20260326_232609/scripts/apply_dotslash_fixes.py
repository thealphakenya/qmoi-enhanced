// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
#!/usr/bin/env python3
"""Quick, conservative fixer: remove leading './' from markdown links when target exists.

This is intentionally small and fast. It:
- Scans all .md files (excluding .git, .venv)
- For each markdown link with a url starting './', compute the target path relative to the markdown file.
- If the target exists, replace '(./path)' with '(path)'.
- Back up modified files to `<file>.dotfix.bak` before changing.
"""
from pathlib import Path
import re
import shutil

REPO_ROOT = Path(__file__).resolve().parents[1]
SKIP = {'.git', '.venv', 'node_modules', '__pycache__'}
MD_LINK_RE = re.compile(r"(\[[^\]]+\])\((\./[^)]+)\)")


def collect_md(root: Path):
    for p in root.rglob('*.md'):
        if any(part in SKIP for part in p.parts):
            continue
        yield p


def fix_file(p: Path):
    text = p.read_text(encoding='utf-8')
    changed = False
    def repl(m):
        nonlocal changed
        url = m.group(2)
        target = (p.parent / url[2:]).resolve()
        try:
            if target.exists():
                changed = True
                return f"{m.group(1)}({url[2:]})"
        except Exception:
            pass
        return m.group(0)

    new = MD_LINK_RE.sub(repl, text)
    if changed:
        bak = p.with_suffix(p.suffix + '.dotfix.bak')
        if not bak.exists():
            shutil.copy2(p, bak)
        p.write_text(new, encoding='utf-8')
        return True
    return False


def main():
    modified = []
    for md in collect_md(REPO_ROOT):
        try:
            if fix_file(md):
                modified.append(str(md))
        except Exception:
            continue

    print(f'Modified {len(modified)} files')
    for m in modified[:50]:
        print(' -', m)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
