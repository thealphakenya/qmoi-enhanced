import os
import glob
import hashlib
import json
from pathlib import Path

MIN_SIZES = {
    'exe': 5_000_000,
    'dmg': 8_000_000,
    'deb': 4_000_000,
    'AppImage': 6_000_000,
    'apk': 3_000_000,
    'aab': 3_000_000,
    'ipa': 4_000_000,
    'zip': 1_000,  # PWAs zips can be small depending on content
}

SEARCH_PATHS = [
    'Qmoi_apps',
    'release_assets',
    'pwa_apps',
    'dist',
    'build',
    'mobile/android',
    'mobile/ios'
]

# Read optional validation targets from environment to allow CI matrix to
# control what platforms are required per runner (e.g. macos runner should
# validate macOS/iOS; ubuntu should validate Linux/Android).
VALIDATION_TARGETS_ENV = os.environ.get('VALIDATION_TARGETS', '')
if VALIDATION_TARGETS_ENV:
    VALIDATION_TARGETS = [t.strip().lower() for t in VALIDATION_TARGETS_ENV.split(',') if t.strip()]
else:
    # default to a conservative set
    VALIDATION_TARGETS = ['windows', 'macos', 'linux', 'android', 'pwa']

def find_files(patterns):
    found = []
    for base in SEARCH_PATHS:
        for p in patterns:
            glob_path = os.path.join(base, p)
            for f in glob.glob(glob_path, recursive=True):
                if os.path.isfile(f):
                    found.append(f)
    return sorted(set(found))

def any_for_ext(exts):
    patterns = [f'**/*.{e}' for e in exts]
    return find_files(patterns)

def validate():
    print('[🧪] Validating release artifacts for multiple platforms...')
    errors = 0
    allow_fallback = os.environ.get('ALLOW_FALLBACK', '').lower() in ('1','true','yes')
    assets = []

    # Windows
    if 'windows' in VALIDATION_TARGETS:
        win = any_for_ext(['exe', 'msi'])
        if not win:
            print('[❌] No Windows installer (.exe/.msi) found')
            if allow_fallback:
                print('[⚠️] ALLOW_FALLBACK set — recording placeholder for Windows')
                assets.append({'path': 'Qmoi_downloaded_apps/windows/latest/qmoi_ai.exe', 'size': 0, 'sha256': '', 'type': 'windows', 'fallback': True})
            else:
                errors += 1
        else:
            for f in win:
                size = os.path.getsize(f)
                if size < MIN_SIZES['exe']:
                    print(f'[⚠️] Windows artifact too small: {f} ({size} bytes)')
                    errors += 1
                else:
                    print(f'[✅] Windows artifact OK: {f}')
                # record asset
                with open(f, 'rb') as fh:
                    sha256 = hashlib.sha256(fh.read()).hexdigest()
                assets.append({'path': f, 'size': size, 'sha256': sha256, 'type': 'windows'})

    # macOS
    if 'macos' in VALIDATION_TARGETS:
        mac = any_for_ext(['dmg', 'pkg'])
        if not mac:
            print('[❌] No macOS artifact (.dmg/.pkg) found')
            if allow_fallback:
                print('[⚠️] ALLOW_FALLBACK set — recording placeholder for macOS')
                assets.append({'path': 'Qmoi_downloaded_apps/mac/latest/qmoi_ai.dmg', 'size': 0, 'sha256': '', 'type': 'macos', 'fallback': True})
            else:
                errors += 1
        else:
            for f in mac:
                size = os.path.getsize(f)
                if size < MIN_SIZES['dmg']:
                    print(f'[⚠️] macOS artifact too small: {f} ({size} bytes)')
                    errors += 1
                else:
                    print(f'[✅] macOS artifact OK: {f}')
                with open(f, 'rb') as fh:
                    sha256 = hashlib.sha256(fh.read()).hexdigest()
                assets.append({'path': f, 'size': size, 'sha256': sha256, 'type': 'macos'})

    # Linux
    if 'linux' in VALIDATION_TARGETS:
        linux = any_for_ext(['deb', 'AppImage', 'rpm'])
        if not linux:
            print('[❌] No Linux artifact (.deb/.AppImage/.rpm) found')
            if allow_fallback:
                print('[⚠️] ALLOW_FALLBACK set — recording placeholder for Linux')
                assets.append({'path': 'Qmoi_downloaded_apps/linux/latest/qmoi_ai.AppImage', 'size': 0, 'sha256': '', 'type': 'linux', 'fallback': True})
            else:
                errors += 1
        else:
            for f in linux:
                ext = os.path.splitext(f)[1].lstrip('.')
                min_size = MIN_SIZES.get(ext, 1_000)
                size = os.path.getsize(f)
                if size < min_size:
                    print(f'[⚠️] Linux artifact too small: {f} ({size} bytes)')
                    errors += 1
                else:
                    print(f'[✅] Linux artifact OK: {f}')
                with open(f, 'rb') as fh:
                    sha256 = hashlib.sha256(fh.read()).hexdigest()
                assets.append({'path': f, 'size': size, 'sha256': sha256, 'type': 'linux'})

    # Android
    if 'android' in VALIDATION_TARGETS:
        android = any_for_ext(['apk', 'aab'])
        if not android:
            print('[❌] No Android artifact (.apk/.aab) found')
            if allow_fallback:
                print('[⚠️] ALLOW_FALLBACK set — recording placeholder for Android')
                assets.append({'path': 'Qmoi_downloaded_apps/android/latest/qmoi_ai.apk', 'size': 0, 'sha256': '', 'type': 'android', 'fallback': True})
            else:
                errors += 1
        else:
            for f in android:
                size = os.path.getsize(f)
                if size < MIN_SIZES['apk']:
                    print(f'[⚠️] Android artifact too small: {f} ({size} bytes)')
                    errors += 1
                else:
                    print(f'[✅] Android artifact OK: {f}')
                with open(f, 'rb') as fh:
                    sha256 = hashlib.sha256(fh.read()).hexdigest()
                assets.append({'path': f, 'size': size, 'sha256': sha256, 'type': 'android'})

    # iOS (optional unless explicitly requested)
    if 'ios' in VALIDATION_TARGETS:
        ios = any_for_ext(['ipa'])
        if not ios:
            print('[❌] No iOS artifact (.ipa) found — ensure macOS runner and signing configured')
            errors += 1
        else:
            for f in ios:
                size = os.path.getsize(f)
                if size < MIN_SIZES['ipa']:
                    print(f'[⚠️] iOS artifact too small: {f} ({size} bytes)')
                    errors += 1
                else:
                    print(f'[✅] iOS artifact OK: {f}')
                with open(f, 'rb') as fh:
                    sha256 = hashlib.sha256(fh.read()).hexdigest()
                assets.append({'path': f, 'size': size, 'sha256': sha256, 'type': 'ios'})

    # PWAs (zipped packages or app manifests)
    if 'pwa' in VALIDATION_TARGETS:
        pwas = find_files(['**/*.zip', '**/manifest.webmanifest', '**/manifest.json'])
        pwa_found = [p for p in pwas if '/pwa' in p or 'pwa_apps' in p or 'release_assets' in p]
        if not pwa_found:
            print('[❌] No PWAs found (zips or manifests). Expecting packages under `pwa_apps` or `release_assets/pwa`')
            errors += 1
        else:
            for f in pwa_found:
                size = os.path.getsize(f)
                if f.endswith('.zip') and size < MIN_SIZES['zip']:
                    print(f'[⚠️] PWA zip unexpectedly small: {f} ({size} bytes)')
                    errors += 1
                else:
                    print(f'[✅] PWA asset OK: {f}')
                with open(f, 'rb') as fh:
                    sha256 = hashlib.sha256(fh.read()).hexdigest()
                assets.append({'path': f, 'size': size, 'sha256': sha256, 'type': 'pwa'})

    # Ensure output directory exists and write discovered assets JSON for CI
    out_dir = Path('tools')
    out_dir.mkdir(parents=True, exist_ok=True)
    discovered = {
        'assets': assets,
        'errors': errors,
        'validation_targets': VALIDATION_TARGETS
    }
    with open(out_dir / 'discovered_assets.json', 'w', encoding='utf-8') as of:
        json.dump(discovered, of, indent=2)
    print(f"[💾] Wrote {out_dir / 'discovered_assets.json'} with {len(assets)} assets and {errors} errors")

    if errors > 0:
        print(f'[❌] Validation failed with {errors} issues.')
        raise SystemExit(1)

    print('[🎉] All detected artifacts passed validation or were accounted for (see logs).')

if __name__ == '__main__':
    validate()
