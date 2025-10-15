"""tools/generate_api_md.py

Scan the repository for common web route patterns and produce a starter API.md.
This is a heuristic, not perfect — review results and adjust.

Usage:
    python tools/generate_api_md.py --out API.md
"""

import re
import argparse
from pathlib import Path

ROUTE_PATTERNS = [
    r"@app\.route\(['\"](.*?)['\"]",
    r"@router\.get\(['\"](.*?)['\"]",
    r"app\.get\(['\"](.*?)['\"]",
    r"app\.post\(['\"](.*?)['\"]",
]


def find_routes(root: Path):
    routes = []
    for p in root.rglob("*.py"):
        try:
            txt = p.read_text()
        except Exception:
            continue
        for pat in ROUTE_PATTERNS:
            for m in re.finditer(pat, txt):
                routes.append({"file": str(p), "path": m.group(1)})
    return routes


def generate(routes, out: Path):
    content = "# API (auto-generated)\n\n"
    groups = {}
    for r in routes:
        groups.setdefault(r["file"], []).append(r["path"])
    for f, paths in groups.items():
        content += f"## {f}\n"
        for p in sorted(set(paths)):
            content += f"- {p}\n"
        content += "\n"
    out.write_text(content)
    print(f"Wrote {out} with {len(routes)} routes")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--out", default="API.md")
    args = p.parse_args()
    routes = find_routes(Path("."))
    generate(routes, Path(args.out))
