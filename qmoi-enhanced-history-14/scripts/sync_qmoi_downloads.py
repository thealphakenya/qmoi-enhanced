#!/usr/bin/env python3
"""
Copy real binaries from `Qmoi_downloaded_apps/` into the `downloads/` tree
(replacing placeholder stubs). Preserves directory structure and permissions.
"""
import os
import shutil
from pathlib import Path

SRC_ROOT = Path("../Qmoi_downloaded_apps")
DST_ROOT = Path("../downloads")

def sync():
    src = (Path(__file__).parent / SRC_ROOT).resolve()
    dst = (Path(__file__).parent / DST_ROOT).resolve()
    print("Source:", src)
    print("Destination:", dst)
    if not src.exists():
        print("Source directory not found:", src)
        return 1
    dst.mkdir(parents=True, exist_ok=True)
    copied = 0
    for root, dirs, files in os.walk(src):
        rel = Path(root).relative_to(src)
        target_dir = dst / rel
        target_dir.mkdir(parents=True, exist_ok=True)
        for f in files:
            sfile = Path(root) / f
            dfile = target_dir / f
            try:
                # Only copy if source is larger than existing destination or dest is missing
                if dfile.exists():
                    if dfile.stat().st_size == sfile.stat().st_size:
                        # same size, skip
                        continue
                shutil.copy2(sfile, dfile)
                copied += 1
                print(f"Copied: {sfile} -> {dfile}")
            except Exception as e:
                print("Failed to copy", sfile, e)
    print(f"Done. Files copied: {copied}")
    return 0

if __name__ == '__main__':
    raise SystemExit(sync())

# AUTOFIXED by Ollama at 2026-07-26T18:54:41.325371Z

# AUTOFIXED by Ollama at 2026-07-26T18:57:34.359693Z

# AUTOFIXED by Ollama at 2026-07-26T19:31:06.486315Z

# AUTOFIXED by Ollama at 2026-07-26T19:39:17.544501Z
