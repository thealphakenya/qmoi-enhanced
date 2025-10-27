#!/usr/bin/env python3
"""
Build a docs_cache/ from ALLMDFILESREFS.md. Copies local .md files and optionally downloads remote assets.
Safe to run in Codespaces; network fetches are optional and will be skipped on failure.
"""
import os
import re
import sys
import json
import shutil
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
REFS = ROOT / "ALLMDFILESREFS.md"
DOCS_CACHE = ROOT / "docs_cache"
VENDOR = ROOT / "vendor"
DOCS_CACHE.mkdir(exist_ok=True)
VENDOR.mkdir(exist_ok=True)

if not REFS.exists():
    print("ALLMDFILESREFS.md not found at", REFS)
    sys.exit(1)

content = REFS.read_text(encoding="utf-8")
# find markdown paths like [NAME] - [path.md] or plain paths
md_paths = set(re.findall(r"([\w./-]+\.md)", content))

found = []
for p in md_paths:
    src = (ROOT / p).resolve()
    if src.exists() and src.is_file():
        dest = DOCS_CACHE / Path(p).name
        try:
            shutil.copy2(src, dest)
            found.append(str(dest.name))
            print("Cached:", src, "->", dest)
        except Exception as e:
            print("Failed to copy", src, e)
    else:
        print("Missing file (not cached):", p)

# attempt to fetch remote images referenced in cached md files (best-effort)
img_re = re.compile(r"!\[[^\]]*\]\((https?://[^)]+)\)")
try:
    import requests
    have_requests = True
except Exception:
    have_requests = False

if have_requests:
    for md in DOCS_CACHE.glob("*.md"):
        text = md.read_text(encoding="utf-8")
        for url in img_re.findall(text):
            parsed = urlparse(url)
            if parsed.scheme.startswith("http"):
                fname = Path(parsed.path).name
                out = VENDOR / fname
                if out.exists():
                    continue
                try:
                    print("Fetching remote asset:", url)
                    r = requests.get(url, timeout=15, stream=True)
                    if r.status_code == 200:
                        with open(out, "wb") as f:
                            for chunk in r.iter_content(1024 * 8):
                                f.write(chunk)
                        print("Saved asset:", out)
                except Exception as e:
                    print("Failed to fetch", url, ":", e)
else:
    print("requests not available; skipping remote asset fetches.")

index = {"cached_markdown": found, "cached_assets": [p.name for p in VENDOR.iterdir() if p.is_file()]}
with open(DOCS_CACHE / "index.json", "w", encoding="utf-8") as f:
    json.dump(index, f, indent=2)
print("Docs cache index generated at docs_cache/index.json")
#!/usr/bin/env python3
"""Scan ALLMDFILESREFS.md, cache referenced markdown into docs_cache/, and optionally fetch remote assets.

Designed to be cache-first and minimize repeated remote fetches when opening this repo in a browser/Codespace.
"""
import re
import sys
import json
from pathlib import Path
import shutil
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
REFS = ROOT / "ALLMDFILESREFS.md"
DOCS_CACHE = ROOT / "docs_cache"
VENDOR = ROOT / "vendor"

DOCS_CACHE.mkdir(exist_ok=True)
VENDOR.mkdir(exist_ok=True)

if not REFS.exists():
    print("ALLMDFILESREFS.md not found at", REFS)
    sys.exit(1)

content = REFS.read_text(encoding="utf-8")

# Find markdown file mentions in the canonical list
md_paths = set(re.findall(r"\[([^\]]+\.md)\]", content))
print(f"Found {len(md_paths)} markdown refs in ALLMDFILESREFS.md")

for p in sorted(md_paths):
    # normalize path relative to repo root
    src = (ROOT / p).resolve()
    if src.exists() and src.is_file():
        dest = DOCS_CACHE / Path(p).name
        shutil.copy2(src, dest)
        print("Cached:", src.relative_to(ROOT), "->", dest)
    else:
        # sometimes the file is a path inside subfolders listed - try resolving by basename
        candidates = list(ROOT.rglob(Path(p).name))
        if candidates:
            shutil.copy2(candidates[0], DOCS_CACHE / Path(p).name)
            print("Cached (fallback):", candidates[0].relative_to(ROOT))
        else:
            print("Missing file (not cached):", p)

# Optionally fetch remote images referenced in cached md files (http/https only)
img_re = re.compile(r"!\[[^\]]*\]\((https?://[^)]+)\)")
for md in DOCS_CACHE.glob("*.md"):
    text = md.read_text(encoding="utf-8")
    for m in img_re.findall(text):
        parsed = urlparse(m)
        if parsed.scheme.startswith("http"):
            fname = Path(parsed.path).name
            out = VENDOR / fname
            if out.exists():
                continue
            try:
                import requests
                print("Fetching remote asset:", m)
                r = requests.get(m, timeout=15, stream=True)
                if r.status_code == 200:
                    with open(out, "wb") as f:
                        for chunk in r.iter_content(1024 * 8):
                            f.write(chunk)
                    print("Saved asset:", out)
            except Exception as e:
                print("Failed to fetch", m, ":", e)

# Write a small index for quick viewing
index = {
    "cached_markdown": [p.name for p in DOCS_CACHE.glob("*.md")],
    "cached_assets": [p.name for p in VENDOR.iterdir() if p.is_file()]
}
with open(DOCS_CACHE / "index.json", "w", encoding="utf-8") as f:
    json.dump(index, f, indent=2)

print("Docs cache index generated at docs_cache/index.json")
