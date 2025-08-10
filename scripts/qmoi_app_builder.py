#!/usr/bin/env python3
"""
scripts/qmoi_app_builder.py

Parallelized multi-platform builder with optional GH release upload.

Features:
- Parallel builds via ThreadPoolExecutor
- build_windows_installer() to invoke NSIS
- attempt GitHub release upload using `gh` CLI (if --publish)
- logs to scripts/qmoi_app_builder.log
"""

import os
import sys
import subprocess
import shutil
import time
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = Path(__file__).resolve().parent
OUT_BASE = ROOT.parent.joinpath("Qmoi_apps")
LOG = ROOT.joinpath("qmoi_app_builder.log")
NSIS_TEMPLATE = Path.cwd().joinpath("build-windows-installer.nsi")

def log(msg):
    ts = datetime.utcnow().isoformat() + "Z"
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def run(cmd, cwd=None, shell=False):
    log(f"RUN: {cmd}")
    try:
        subprocess.run(cmd, shell=shell, cwd=cwd, check=True)
        return True
    except subprocess.CalledProcessError as e:
        log(f"ERROR (cmd failed): {e}")
        return False
    except Exception as e:
        log(f"ERROR (exception): {e}")
        return False

def ensure_dirs():
    OUT_BASE.mkdir(parents=True, exist_ok=True)
    (OUT_BASE / "windows").mkdir(parents=True, exist_ok=True)
    (OUT_BASE / "android").mkdir(parents=True, exist_ok=True)

def build_electron_windows():
    log("Building electron windows (attempt electron-builder)...")
    # prefer npx electron-builder
    if run(["npx", "electron-builder", "--win", "--x64"]):
        pass
    else:
        log("electron-builder failed -- attempting npm script build:electron:win")
        run(["npm", "run", "build:electron:win"])
    # find candidate exe
    candidates = list(Path.cwd().glob("dist/**/*.exe")) + list(Path.cwd().glob("release/**/*/*.exe")) + list(Path.cwd().glob("out/**/*.exe"))
    candidates = [p for p in candidates if p.is_file()]
    if not candidates:
        log("No .exe found after electron build.")
        return None
    exe = sorted(candidates, key=lambda p: p.stat().st_mtime)[-1]
    dest = OUT_BASE / "windows" / exe.name
    shutil.copy2(exe, dest)
    log(f"Windows exe copied to {dest}")
    return dest

def build_android_apk():
    log("Building Android APK (gradle)...")
    android_dir = Path.cwd() / "android"
    if not android_dir.exists():
        log("android/ directory not present; skipping android build.")
        return None
    ok = run(["./gradlew", "assembleRelease"], cwd=android_dir, shell=True)
    apk_candidates = list(android_dir.glob("**/outputs/apk/**/*.apk"))
    apk_candidates = [p for p in apk_candidates if p.is_file()]
    if apk_candidates:
        apk = sorted(apk_candidates, key=lambda p: p.stat().st_mtime)[-1]
        dest = OUT_BASE / "android" / apk.name
        shutil.copy2(apk, dest)
        log(f"APK copied to {dest}")
        return dest
    log("No APK found after gradle build.")
    return None

def build_windows_installer(exe_path=None, installer_name=None):
    ensure_dirs()
    windows_out = OUT_BASE / "windows"
    if exe_path:
        exe_path = Path(exe_path)
    else:
        exes = list(windows_out.glob("*.exe"))
        if not exes:
            log("No exe available to create installer.")
            return None
        exe_path = sorted(exes, key=lambda p: p.stat().st_mtime)[-1]

    installer_name = installer_name or f"qmoi_ai_installer_{int(time.time())}.exe"
    installer_path = windows_out / installer_name

    if not NSIS_TEMPLATE.exists():
        log(f"NSIS template not found at {NSIS_TEMPLATE}")
        return None

    temp_nsi = windows_out / f"build_temp_{int(time.time())}.nsi"
    original = NSIS_TEMPLATE.read_text(encoding="utf-8")
    replaced = original.replace("${EXE_SOURCE}", str(exe_path).replace("\\", "\\\\")).replace("${OUTPUT_NAME}", str(installer_path).replace("\\", "\\\\"))
    temp_nsi.write_text(replaced, encoding="utf-8")

    log(f"Running makensis on {temp_nsi}")
    if run(["makensis", str(temp_nsi)]):
        pass
    else:
        log("makensis failed; trying via wine...")
        if not run(["wine", "makensis", str(temp_nsi)]):
            log("Failed to build installer with makensis/wine.")
            return None

    if installer_path.exists():
        log(f"Installer created: {installer_path}")
        try:
            temp_nsi.unlink()
        except Exception:
            pass
        return installer_path

    built = list(windows_out.glob("*.exe"))
    if built:
        final = sorted(built, key=lambda p: p.stat().st_mtime)[-1]
        log(f"Found installer candidate: {final}")
        return final

    log("Installer was not created.")
    return None

def create_github_release_and_upload(tag_prefix="auto-release"):
    try:
        r = subprocess.run(["gh", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if r.returncode != 0:
            log("gh CLI not found; skipping GH release.")
            return False
    except Exception:
        log("gh CLI not available; skipping GH release.")
        return False

    tag = f"{tag_prefix}-{int(time.time())}"
    title = f"Automated Release {datetime.utcnow().isoformat()}Z"
    notes = "Automated release generated by QMOI build pipeline."

    # create release
    log(f"Creating GitHub release {tag}")
    if not run(["gh", "release", "create", tag, "--title", title, "--notes", notes]):
        log("Failed to create GH release.")
        return False

    # upload artifacts from OUT_BASE subfolders
    artifacts = []
    for sub in ["windows", "android"]:
        d = OUT_BASE / sub
        if d.exists():
            for f in d.glob("*"):
                if f.is_file():
                    artifacts.append(str(f))

    if not artifacts:
        log("No artifacts to upload to GH release.")
        return True

    # attach each artifact
    for art in artifacts:
        log(f"Uploading artifact to release: {art}")
        if not run(["gh", "release", "upload", tag, art]):
            log(f"Failed to upload artifact {art} to release {tag}")
        else:
            log(f"Uploaded {art}")

    return True

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--platform", help="windows|android|all")
    parser.add_argument("--build-windows-installer", action="store_true")
    parser.add_argument("--publish", action="store_true", help="attempt GH release and upload artifacts")
    args = parser.parse_args()

    ensure_dirs()

    tasks = []
    with ThreadPoolExecutor(max_workers=4) as ex:
        if args.platform:
            p = args.platform.lower()
            if p == "windows":
                tasks.append(ex.submit(build_electron_windows))
            elif p == "android":
                tasks.append(ex.submit(build_android_apk))
            elif p == "all":
                tasks.append(ex.submit(build_electron_windows))
                tasks.append(ex.submit(build_android_apk))
        else:
            # default: attempt both in parallel
            tasks.append(ex.submit(build_electron_windows))
            tasks.append(ex.submit(build_android_apk))

        results = {}
        for fut in as_completed(tasks):
            res = fut.result()
            results[str(fut)] = res

    if args.build_windows_installer:
        # choose most recent exe
        windows_dir = OUT_BASE / "windows"
        exes = list(windows_dir.glob("*.exe"))
        exe = sorted(exes, key=lambda p: p.stat().st_mtime)[-1] if exes else None
        installer = build_windows_installer(exe_path=exe)
        if installer:
            log(f"Windows installer created at {installer}")
        else:
            log("Windows installer creation failed.")

    if args.publish:
        create_github_release_and_upload()

    log("qmoi_app_builder finished.")

if __name__ == "__main__":
    main()
