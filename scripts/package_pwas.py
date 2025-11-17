#!/usr/bin/env python3
"""
Package each folder under `pwa_apps/` into a zip file and place it under
`Qmoi_downloaded_apps/web/latest` and `downloads/web/latest` so PWAs are available as release assets.
"""
import os
import shutil
from pathlib import Path
import zipfile

ROOT = Path(__file__).parent.parent
PWA_DIR = ROOT / 'pwa_apps'
DST1 = ROOT / 'Qmoi_downloaded_apps' / 'web' / 'latest'
DST2 = ROOT / 'downloads' / 'web' / 'latest'


def ensure_dirs():
    DST1.mkdir(parents=True, exist_ok=True)
    DST2.mkdir(parents=True, exist_ok=True)


def zip_pwa(folder: Path, outpath: Path):
    with zipfile.ZipFile(outpath, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(folder):
            for f in files:
                fp = Path(root) / f
                rel = fp.relative_to(folder)
                z.write(fp, arcname=str(rel))


def main():
    if not PWA_DIR.exists():
        print('No pwa_apps directory found at', PWA_DIR)
        return 1
    ensure_dirs()
    created = []
    for child in PWA_DIR.iterdir():
        if not child.is_dir():
            continue
        name = child.name
        outname = f"{name}.zip"
        out1 = DST1 / outname
        out2 = DST2 / outname
        try:
            zip_pwa(child, out1)
            shutil.copy2(out1, out2)
            created.append(str(out1))
            print('Packaged', child, '->', out1)
        except Exception as e:
            print('Failed to package', child, e)
    print('Done. PWAs packaged:', len(created))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
