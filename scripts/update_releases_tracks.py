import os
import json
from datetime import datetime, timezone

RELEASES_TRACKS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'RELEASESTRACKS.md'))
APPS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'Qmoi_apps'))

# List of platforms and extensions to scan for
PLATFORMS = [
    ('android', '.apk'),
    ('windows', '.exe'),
    ('mac', '.dmg'),
    ('linux', '.AppImage'),
    ('ios', '.ipa'),
    ('chromebook', '.deb'),
    ('raspberrypi', '.img'),
    ('qcity', '.qcapp'),
    ('smarttv', '.tvapp'),
]

def scan_apps():
    releases = []
    for platform, ext in PLATFORMS:
        plat_dir = os.path.join(APPS_DIR, platform)
        if not os.path.isdir(plat_dir):
            continue
        for fname in os.listdir(plat_dir):
            if fname.endswith(ext):
                fpath = os.path.join('scripts', 'Qmoi_apps', platform, fname)
                releases.append((platform, fname, fpath))
    return releases

def update_releases_tracks():
    releases = scan_apps()
    timestamp = datetime.now(timezone.utc).isoformat() + ' UTC'
    lines = [
        f"# RELEASESTRACKS.md\n",
        f"\n_Last updated: {timestamp}_\n",
        "\n| Platform | File | Path |",
        "|----------|------|------|",
    ]
    for platform, fname, fpath in releases:
        lines.append(f"| {platform} | {fname} | {fpath} |")
    with open(RELEASES_TRACKS_PATH, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"✅ RELEASESTRACKS.md updated with {len(releases)} releases.")

if __name__ == "__main__":
    update_releases_tracks()
