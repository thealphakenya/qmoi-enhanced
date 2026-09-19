#!/usr/bin/env python3
"""Generate docs/md-inventory.json from ALLMDFILESREFS.md or @ALLMDFILESREFS.md

This script extracts markdown file references and writes a small JSON
inventory used by the repo audit tooling.
"""

import json
import re
from datetime import datetime
from pathlib import Path
from typing import List, Tuple

ROOT = Path(__file__).resolve().parents[1]
POSSIBLE_NAMES = [ROOT / "@ALLMDFILESREFS.md", ROOT / "ALLMDFILESREFS.md"]
OUT_DIR = ROOT / "docs"
OUT_DIR.mkdir(exist_ok=True)
OUT_FILE = OUT_DIR / "md-inventory.json"


def _read_ref_file() -> str:
    for p in POSSIBLE_NAMES:
        if p.exists():
            return p.read_text(encoding='utf8')
    raise FileNotFoundError("Could not find @ALLMDFILESREFS.md or ALLMDFILESREFS.md")


def parse_refs(md_text: str) -> List[Tuple[str, str]]:
    """Return list of (path, title) pairs.

    The reference file can contain markdown links like:
      - [path/to/file.md] - **Title**
    or plain markdown links [Title](path/to/file.md).
    """
    results: List[Tuple[str, str]] = []
    for line in md_text.splitlines():
        s = line.strip()
        if not s or s.startswith('#'):
            continue
        # markdown link [Title](path)
        m = re.search(r"\[(.*?)\]\((.*?)\)", s)
        if m:
            title, path = m.groups()
            results.append((path, title))
            continue
        # pattern like - [path/to/file.md] - **Title**
        m2 = re.search(r"\[([^\]]+\.md)\].*?-\s*\*\*(.*?)\*\*", s)
        if m2:
            path, title = m2.groups()
            results.append((path, title))
            continue
        # fallback: if the line contains a bare .md path, use it
        m3 = re.search(r"([\w\-./]+\.md)", s)
        if m3:
            path = m3.group(1)
            results.append((path, Path(path).stem))
    return results


def main() -> None:
    try:
        md = _read_ref_file()
    except FileNotFoundError as e:
        print(e)
        return

    entries = []
    for path, title in parse_refs(md):
        p = (ROOT / path) if not Path(path).is_absolute() else Path(path)
        exists = p.exists()
        entries.append({
            "path": path,
            "title": title,
            "exists": exists,
            "last_verified": None,
        })

    meta = {
        "generated_by": Path(__file__).name,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "count": len(entries),
        "entries": entries,
    }
    OUT_FILE.write_text(json.dumps(meta, indent=2), encoding='utf8')
    print(f"Wrote {OUT_FILE} ({len(entries)} entries)")


if __name__ == '__main__':
    main()
