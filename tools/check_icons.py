#!/usr/bin/env python3
"""Scan repository for app manifests and platform-specific icons.

Produces a summary report to stdout and writes `tools/icon_report.json`.
"""
import os
import json
import fnmatch
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT_PATH = ROOT / 'tools' / 'icon_report.json'

def find_files(patterns):
    matches = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        for p in patterns:
            for name in fnmatch.filter(filenames, p):
                matches.append(Path(dirpath) / name)
    return matches

def load_discovered():
    dj = ROOT / 'tools' / 'discovered_assets.json'
    if dj.exists():
        try:
            return json.loads(dj.read_text())
        except Exception:
            return {}
    return {}

def collect_apps():
    apps = {}
    # Discover PWA apps under pwa_apps/
    pwa_root = ROOT / 'pwa_apps'
    if pwa_root.exists():
        for child in pwa_root.iterdir():
            if child.is_dir():
                apps[child.name] = {'type': 'pwa', 'path': str(child)}

    # Use discovered_assets.json to find other app names/ids
    d = load_discovered()
    for item in d.get('assets', []) if isinstance(d.get('assets', []), list) else []:
        path = item.get('path') or item.get('file') or ''
        # heuristic: take top-level folder or filename without ext
        p = Path(path)
        key = p.parts[0] if len(p.parts) > 1 else p.stem
        if key and key not in apps:
            apps[key] = {'type': 'discovered', 'path': str(p)}

    # fallback: look for any manifests in repo
    for m in find_files(['manifest.webmanifest', 'manifest.json']):
        parent = m.parent
        key = parent.name
        if key not in apps:
            apps[key] = {'type': 'manifest', 'path': str(parent)}

    return apps

def check_app_icons(app_name, meta):
    results = {
        'app': app_name,
        'pwa_manifest': False,
        'pwa_icons': [],
        'windows_ico': [],
        'mac_icns': [],
        'linux_png': [],
        'android_mipmap': [],
        'ios_appiconset': [],
        'notes': [],
    }

    # PWA manifest
    candidates = list(Path(meta['path']).glob('**/manifest.*')) if Path(meta['path']).exists() else []
    for c in candidates:
        if c.name.endswith(('webmanifest','json')):
            results['pwa_manifest'] = True
            try:
                m = json.loads(c.read_text())
                icons = m.get('icons', [])
                for ic in icons:
                    src = ic.get('src')
                    if src:
                        f = (c.parent / src).resolve()
                        results['pwa_icons'].append(str(f) if f.exists() else f"MISSING:{src}")
            except Exception:
                results['notes'].append(f'Could not parse manifest {c}')

    # Generic search for icon files named with app name or in the app folder
    patterns = [f"*{app_name}*.ico", f"*{app_name}*.icns", f"*{app_name}*.png", f"*{app_name}*.svg", "*icon*.png"]
    for dirpath, dirnames, filenames in os.walk(ROOT):
        for fn in filenames:
            for pat in patterns:
                if fnmatch.fnmatch(fn.lower(), pat.lower()):
                    p = Path(dirpath) / fn
                    ext = p.suffix.lower()
                    if ext == '.ico':
                        results['windows_ico'].append(str(p))
                    elif ext == '.icns':
                        results['mac_icns'].append(str(p))
                    elif ext == '.png':
                        # heuristic: android mipmap or ios assetset
                        if 'mipmap' in p.parts or 'android' in p.parts:
                            results['android_mipmap'].append(str(p))
                        elif 'AppIcon.appiconset' in str(p):
                            results['ios_appiconset'].append(str(p))
                        else:
                            results['linux_png'].append(str(p))
                    elif ext in ('.svg', '.webp'):
                        results['linux_png'].append(str(p))

    # Look specifically for iOS appiconset
    for p in find_files(['Contents.json']):
        if 'AppIcon.appiconset' in str(p.parent):
            results['ios_appiconset'].append(str(p.parent))

    # Android mipmap directories
    for dirpath, dirnames, filenames in os.walk(ROOT):
        if any('mipmap' in d for d in dirpath.split(os.sep)):
            for fn in filenames:
                if fn.lower().endswith('.png'):
                    results['android_mipmap'].append(str(Path(dirpath)/fn))

    # Add friendly checks
    if not results['pwa_manifest'] and not (results['pwa_icons']):
        results['notes'].append('No PWA manifest or icons found')
    if not results['windows_ico']:
        results['notes'].append('No Windows .ico found')
    if not results['mac_icns']:
        results['notes'].append('No macOS .icns found')
    if not results['linux_png']:
        results['notes'].append('No Linux PNG/SVG icon found')
    if not results['android_mipmap']:
        results['notes'].append('No Android mipmap PNGs found')
    if not results['ios_appiconset']:
        results['notes'].append('No iOS AppIcon.appiconset found')

    return results

def main():
    apps = collect_apps()
    report = {'scanned_at': None, 'apps': [], 'summary': {}}
    report['scanned_at'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
    total_missing = 0
    for name, meta in sorted(apps.items()):
        res = check_app_icons(name, meta)
        missing = sum(1 for n in ('windows_ico','mac_icns','linux_png','android_mipmap','ios_appiconset') if not res[n])
        res['missing_platform_icon_counts'] = missing
        total_missing += missing
        report['apps'].append(res)

    report['summary']['apps_scanned'] = len(report['apps'])
    report['summary']['total_missing'] = total_missing
    REPORT_PATH.write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))
    if total_missing > 0:
        print('\nSome apps are missing platform-specific icons. See tools/icon_report.json')
        return 1
    print('\nAll scanned apps have at least one icon per platform heuristic.')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
#!/usr/bin/env python3
"""Check presence of platform-specific icon files and basic PNG dimensions.

This script verifies that expected icon files exist for PWAs, desktop (Windows/macOS/Linux),
and mobile (Android/iOS) based on repository structure. It does a basic PNG IHDR read
to extract width/height without external deps. For .ico/.icns it checks presence and size>0.

Usage: python3 tools/check_icons.py
"""
import json
import os
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def png_size(path: Path):
    try:
        with open(path, 'rb') as f:
            data = f.read(24)
            if data[:8] != b"\x89PNG\r\n\x1a\n":
                return None
            # IHDR is in bytes 8:24
            width, height = struct.unpack('>II', data[16:24])
            return width, height
    except Exception:
        return None

def check_paths(paths):
    ok = True
    for p in paths:
        pp = ROOT / p
        if not pp.exists():
            print(f"MISSING: {p}")
            ok = False
            continue
        if pp.suffix.lower() == '.png':
            sz = png_size(pp)
            if sz:
                print(f"OK: {p} ({sz[0]}x{sz[1]})")
            else:
                print(f"WARN: {p} (not a valid PNG or unreadable IHDR)")
        else:
            # .ico/.icns/.svg/.webp -- just check non-zero size
            s = pp.stat().st_size
            if s > 0:
                print(f"OK: {p} ({s} bytes)")
            else:
                print(f"WARN: {p} (zero bytes)")
    return ok

def main():
    print("Checking PWA icons...")
    pwa_icons = [
        "pwa_apps/q-alpha/icons/icon-192.png",
        "pwa_apps/q-alpha/icons/icon-512.png",
        "pwa_apps/qmoi-ai/icon-192.png",
        "pwa_apps/qmoi-ai/icon-512.png",
        "pwa_apps/qmoi/icon-192.png",
        "pwa_apps/qmoi/icon-512.png",
        "pwa_apps/qmoi-space/icon-192.png",
        "pwa_apps/qmoi-space/icon-512.png",
    ]

    ok = True
    ok &= check_paths(pwa_icons)

    print('\nChecking desktop icons (Windows/macOS/Linux)...')
    desktop_icons = [
        "assets/icons/qmoi_icon_windows.ico",
        "assets/icons/qmoi_icon_macos.icns",
        "assets/icons/qmoi_icon_linux.png",
        "icon.ico",
        "public/icon.icns",
    ]
    ok &= check_paths(desktop_icons)

    print('\nChecking Android icons (mipmap)...')
    android_mipmap = [
        "mobile/android/app/src/main/res/mipmap-mdpi/ic_launcher.png",
        "mobile/android/app/src/main/res/mipmap-hdpi/ic_launcher.png",
        "mobile/android/app/src/main/res/mipmap-xhdpi/ic_launcher.png",
        "mobile/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png",
        "mobile/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png",
    ]
    ok &= check_paths(android_mipmap)

    print('\nChecking iOS placeholder icon...')
    ios_icon = [
        "assets/icons/qmoi_icon_ios.png",
    ]
    ok &= check_paths(ios_icon)

    print('\nSummary:')
    if ok:
        print('All expected icon files were found and look reasonable (basic checks).')
    else:
        print('Some icon files are missing or suspicious. See lines above for details.')
        raise SystemExit(2)

if __name__ == '__main__':
    main()
