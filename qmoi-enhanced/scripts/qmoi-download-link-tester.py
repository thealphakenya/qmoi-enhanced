import requests
import json
import os

# Load download links from a central file (customize as needed)
LINKS_FILE = "Qmoi_apps/latest.json"
REPORT_FILE = "Qmoi_apps/download_link_report.json"

# Fallback links for auto-fix (customize as needed)
FALLBACK_DOMAIN = "https://downloads.qmoi.app"


def load_links():
    if os.path.exists(LINKS_FILE):
        with open(LINKS_FILE) as f:
            return json.load(f)
    return {}


def verify_link(url):
    try:
        r = requests.head(url, timeout=10)
        return r.status_code == 200
    except Exception as e:
        return False


def autofix_link(app, platform, filename):
    # Try fallback domain
    return f"{FALLBACK_DOMAIN}/{platform}/{filename}"


def main():
    links = load_links()
    report = {}
    for platform, apps in links.items():
        for app, url in apps.items():
            ok = verify_link(url)
            if not ok:
                fixed_url = autofix_link(app, platform, os.path.basename(url))
                ok = verify_link(fixed_url)
                report.setdefault(platform, {})[app] = {
                    "original": url,
                    "fixed": fixed_url if ok else None,
                    "status": "fixed" if ok else "failed",
                }
            else:
                report.setdefault(platform, {})[app] = {
                    "original": url,
                    "fixed": None,
                    "status": "ok",
                }
    with open(REPORT_FILE, "w") as f:
        json.dump(report, f, indent=2)
    print("Download link autotest complete. Report written to", REPORT_FILE)


if __name__ == "__main__":
    main()
