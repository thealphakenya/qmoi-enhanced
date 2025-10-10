import os
import sys
import requests
import psutil
from datetime import datetime

LOG_FILE = 'logs/qmoi_simple_autotest.log'

# Optionally set these for email notifications
SMTP_SERVER = os.environ.get('QMOI_SMTP_SERVER')
SMTP_PORT = int(os.environ.get('QMOI_SMTP_PORT', 587))
SMTP_USER = os.environ.get('QMOI_SMTP_USER')
SMTP_PASS = os.environ.get('QMOI_SMTP_PASS')
NOTIFY_EMAIL = os.environ.get('QMOI_NOTIFY_EMAIL')
SLACK_WEBHOOK = os.environ.get('QMOI_SLACK_WEBHOOK')
DISCORD_WEBHOOK = os.environ.get('QMOI_DISCORD_WEBHOOK')


def log_result(msg):
    print(msg)
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(f"[{datetime.now().isoformat()}] {msg}\n")

def check_system_health():
    cpu = psutil.cpu_percent(interval=1)
    mem = psutil.virtual_memory().percent
    msg = f"System Health: CPU={cpu}%, MEM={mem}%"
    log_result(msg)
    if cpu > 90 or mem > 90:
        log_result("❌ High resource usage!")
        return False
    return True

def test_url(url):
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            log_result(f"✅ {url} OK")
            return True
        else:
            log_result(f"❌ {url} BAD STATUS: {resp.status_code}")
            return False
    except Exception as e:
        log_result(f"❌ {url} ERROR: {e}")
        return False

def send_email(subject, body):
    if not (SMTP_SERVER and SMTP_USER and SMTP_PASS and NOTIFY_EMAIL):
        log_result("(Email notification skipped: SMTP credentials not set)")
        return
    try:
        import smtplib
        from email.mime.text import MIMEText
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = SMTP_USER
        msg['To'] = NOTIFY_EMAIL
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, [NOTIFY_EMAIL], msg.as_string())
        log_result("(Email notification sent)")
    except Exception as e:
        log_result(f"(Email notification failed: {e})")

def send_slack_notification(message):
    if not SLACK_WEBHOOK:
        log_result("(Slack notification skipped: webhook not set)")
        return
    try:
        resp = requests.post(SLACK_WEBHOOK, json={"text": message}, timeout=10)
        if resp.status_code == 200:
            log_result("(Slack notification sent)")
        else:
            log_result(f"(Slack notification failed: {resp.status_code})")
    except Exception as e:
        log_result(f"(Slack notification failed: {e})")

def send_discord_notification(message):
    if not DISCORD_WEBHOOK:
        log_result("(Discord notification skipped: webhook not set)")
        return
    try:
        resp = requests.post(DISCORD_WEBHOOK, json={"content": message}, timeout=10)
        if resp.status_code == 204:
            log_result("(Discord notification sent)")
        else:
            log_result(f"(Discord notification failed: {resp.status_code})")
    except Exception as e:
        log_result(f"(Discord notification failed: {e})")

def main():
    all_ok = True
    failed = []
    # 1. System health
    if not check_system_health():
        all_ok = False
        failed.append("System health check failed")

    # 2. Critical download links (add more as needed)
    urls = [
        "https://downloads.qmoi.app/qmoi/windows.exe",
        "https://downloads.qmoi.app/qmoi/mac.dmg",
        "https://downloads.qmoi.app/qmoi/linux.deb",
        "https://downloads.qmoi.app/qmoi/linux.appimage",
        "https://downloads.qmoi.app/qmoi/android.apk",
        "https://downloads.qmoi.app/qmoi/ios.ipa",
        "https://downloads.qmoi.app/qcity/windows.exe",
        "https://downloads.qmoi.app/qcity/mac.dmg",
        "https://downloads.qmoi.app/qcity/linux.appimage",
        "https://downloads.qmoi.app/qcity/android.apk",
        "https://downloads.qmoi.app/qcity/ios.ipa",
        "https://downloads.qmoi.app/qstore/qstore-universal.apk"
    ]
    for url in urls:
        if not test_url(url):
            all_ok = False
            failed.append(url)

    # 3. API endpoints (add your real endpoints here)
    api_endpoints = [
        # "https://api.qmoi.app/health",
        # "https://api.qmoi.app/v1/status"
    ]
    for api in api_endpoints:
        if not test_url(api):
            all_ok = False
            failed.append(api)

    # 4. Dashboard (if running)
    dashboard_url = "http://localhost:3010"
    try:
        requests.get(dashboard_url, timeout=5)
        log_result(f"✅ Dashboard reachable at {dashboard_url}")
    except Exception:
        log_result(f"⚠️ Dashboard not reachable at {dashboard_url} (may be expected if not running)")

    if all_ok:
        log_result("✅ All autotests passed!")
        sys.exit(0)
    else:
        log_result("❌ Some autotests failed!")
        summary = f"QMOI Autotest Failure: {len(failed)} checks failed. See log for details."
        send_email(
            subject="QMOI Autotest Failure",
            body=summary
        )
        send_slack_notification(summary)
        send_discord_notification(summary)
        sys.exit(1)

if __name__ == "__main__":
    main() 