import os
from huggingface_hub import HfApi, HfFolder
import subprocess
import requests
import smtplib
from email.mime.text import MIMEText

# Configuration
REPO_ID = "alphaqmoi/qmoi"
LOCAL_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
TOKEN = os.environ.get("HF_TOKEN")
S3_BUCKET = os.environ.get("S3_BUCKET")
GOOGLE_DRIVE_FOLDER_ID = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")
SLACK_WEBHOOK_URL = os.environ.get("SLACK_WEBHOOK_URL")
EMAIL_SMTP = os.environ.get("EMAIL_SMTP")
EMAIL_TO = os.environ.get("EMAIL_TO")
EMAIL_FROM = os.environ.get("EMAIL_FROM", "noreply@alpha-q.ai")
EMAIL_PASS = os.environ.get("EMAIL_PASS")
WHATSAPP_API_URL = os.environ.get("WHATSAPP_API_URL")
WHATSAPP_TO = os.environ.get("WHATSAPP_TO")

assert TOKEN, "HF_TOKEN environment variable must be set."

api = HfApi()

# Notification helpers
def notify_slack(msg):
    if SLACK_WEBHOOK_URL:
        try:
            requests.post(SLACK_WEBHOOK_URL, json={"text": msg})
            print("[Notify] Slack notification sent.")
        except Exception as e:
            print(f"[Notify] Slack notification failed: {e}")

def notify_email(subject, msg):
    if EMAIL_SMTP and EMAIL_TO and EMAIL_PASS:
        try:
            server = smtplib.SMTP_SSL(EMAIL_SMTP)
            server.login(EMAIL_FROM, EMAIL_PASS)
            message = MIMEText(msg)
            message['Subject'] = subject
            message['From'] = EMAIL_FROM
            message['To'] = EMAIL_TO
            server.sendmail(EMAIL_FROM, EMAIL_TO, message.as_string())
            server.quit()
            print("[Notify] Email notification sent.")
        except Exception as e:
            print(f"[Notify] Email notification failed: {e}")

def notify_whatsapp(msg):
    if WHATSAPP_API_URL and WHATSAPP_TO:
        try:
            requests.post(WHATSAPP_API_URL, json={"to": WHATSAPP_TO, "message": msg})
            print("[Notify] WhatsApp notification sent.")
        except Exception as e:
            print(f"[Notify] WhatsApp notification failed: {e}")

def notify_all(subject, msg):
    notify_slack(f"[QMOI BACKUP] {subject}: {msg}")
    notify_email(subject, msg)
    notify_whatsapp(f"[QMOI BACKUP] {subject}: {msg}")

# Track large files with Git LFS
lfs_patterns = ["*.pt", "*.bin", "*.ckpt", "*.onnx"]
for pattern in lfs_patterns:
    subprocess.run(["git", "lfs", "track", pattern], cwd=LOCAL_DIR)
subprocess.run(["git", "add", ".gitattributes"], cwd=LOCAL_DIR)

# Add and commit any new files
subprocess.run(["git", "add", "-A"], cwd=LOCAL_DIR)
subprocess.run(["git", "commit", "-m", "QMOI: Automated backup to HuggingFace"], cwd=LOCAL_DIR)

# Push to HuggingFace
try:
    api.upload_folder(
        folder_path=LOCAL_DIR,
        repo_id=REPO_ID,
        repo_type="model",
        token=TOKEN,
        commit_message="Automated QMOI backup"
    )
    print(f"Backup to HuggingFace {REPO_ID} successful.")
except Exception as e:
    print(f"Backup to HuggingFace failed: {e}")
    notify_all("HuggingFace Backup Failed", str(e))

# Optional: Mirror to S3
if S3_BUCKET:
    try:
        import boto3
        s3 = boto3.client('s3')
        for root, dirs, files in os.walk(LOCAL_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                s3_key = os.path.relpath(file_path, LOCAL_DIR)
                s3.upload_file(file_path, S3_BUCKET, s3_key)
        print(f"Backup mirrored to S3 bucket: {S3_BUCKET}")
    except Exception as e:
        print(f"S3 backup failed: {e}")
        notify_all("S3 Backup Failed", str(e))

# Optional: Mirror to Google Drive
if GOOGLE_DRIVE_FOLDER_ID:
    try:
        from pydrive2.auth import GoogleAuth
        from pydrive2.drive import GoogleDrive
        gauth = GoogleAuth()
        gauth.LocalWebserverAuth()
        drive = GoogleDrive(gauth)
        for root, dirs, files in os.walk(LOCAL_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                gfile = drive.CreateFile({'parents': [{'id': GOOGLE_DRIVE_FOLDER_ID}], 'title': file})
                gfile.SetContentFile(file_path)
                gfile.Upload()
        print(f"Backup mirrored to Google Drive folder: {GOOGLE_DRIVE_FOLDER_ID}")
    except Exception as e:
        print(f"Google Drive backup failed: {e}")
        notify_all("Google Drive Backup Failed", str(e)) 