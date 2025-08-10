#!/usr/bin/env python3
import time
import urllib.request
from pathlib import Path

ROOT = Path.cwd()
LINKS_FILE = ROOT.joinpath("release-links.txt")
LOG = ROOT.joinpath("scripts", "qmoi-download-link-tester.log")

def log(msg):
    ts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def head_ok(url, timeout=10):
    req = urllib.request.Request(url, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return 200 <= r.status < 400
    except Exception as e:
        log(f"HEAD error for {url}: {e}")
        return False

def main():
    if not LINKS_FILE.exists():
        log("release-links.txt not found - create it with one URL per line")
        return
    urls = [l.strip() for l in LINKS_FILE.read_text().splitlines() if l.strip()]
    for url in urls:
        ok = False
        for attempt in range(1, 6):
            log(f"Testing {url} (attempt {attempt})")
            if head_ok(url):
                log(f"OK: {url}")
                ok = True
                break
            else:
                log(f"FAILED attempt {attempt} for {url}. Retrying...")
                time.sleep(2 * attempt)
        if not ok:
            log(f"PERMANENT FAIL: {url}")

if __name__ == "__main__":
    main()
