#!/usr/bin/env python3
import sys
import subprocess
from pathlib import Path
import time

ROOT = Path.cwd()
OUT = ROOT.joinpath("Qmoi_apps")
LOG = ROOT.joinpath("scripts", "qmoi-install-autotest.log")

def log(msg):
    ts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def run(cmd):
    log(f"RUN: {cmd}")
    return subprocess.run(cmd, shell=True).returncode == 0

def main():
    log("Starting safe install + autotest")
    if not run("npm run safe-install"):
        log("safe-install failed")
        sys.exit(2)
    win_dir = OUT.joinpath("windows")
    exe_files = list(win_dir.glob("*.exe"))
    if exe_files:
        exe = exe_files[-1]
        log(f"Found Windows exe: {exe}")
    else:
        log("No Windows exe found (warning).")
    apk_dir = OUT.joinpath("android")
    apks = list(apk_dir.glob("*.apk"))
    if apks:
        apk = apks[-1]
        log(f"Found APK: {apk}")
    else:
        log("No APK found (warning).")
    if exe_files:
        exe = exe_files[-1]
        try:
            ok = run(f'"{exe}" --version')
            log("Exe --version check " + ("OK" if ok else "FAILED (non-fatal)"))
        except Exception as e:
            log(f"Exe smoke-check exception: {e}")
    log("Autotest finished.")
    sys.exit(0)

if __name__ == "__main__":
    main()
