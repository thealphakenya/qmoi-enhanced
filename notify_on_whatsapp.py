# NOTE: 2 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import requests
import json
import os
import logging
from typing import Optional

# WhatsApp numbers (auto-saved, used for all notifications)
MASTER_WHATSAPP = "+254725382624"
SISTER_WHATSAPP = "+61424053495"

# Define WhatsApp numbers at the top level for use in all functions
MASTER_WHATSAPP_NUMBER = "+254725382624"
SISTER_WHATSAPP_NUMBER = "+61424 053 495"

# Provider configuration (choose provider via env var)
# QMOI_WHATSAPP_PROVIDER: 'local' (default) or 'twilio'
# QMOI_WHATSAPP_ENDPOINT: local endpoint to POST JSON payload { to, message }
# TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM: for Twilio provider (whatsapp:+...) 
QMOI_WHATSAPP_PROVIDER = os.environ.get("QMOI_WHATSAPP_PROVIDER", "local")
QMOI_WHATSAPP_ENDPOINT = os.environ.get("QMOI_WHATSAPP_ENDPOINT", "http://localhost:3000/api/whatsapp-bot?send=1")
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_FROM = os.environ.get("TWILIO_FROM")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_whatsapp(to: str, message: str, provider: Optional[str] = None) -> bool:
    """Send a WhatsApp message using configured provider.

    - provider override allows tests to force a provider.
    - Returns True on success, False on failure (no exception raised).
    """
    provider = provider or QMOI_WHATSAPP_PROVIDER
    payload = {"to": to, "message": message}

    try:
        if provider == "twilio":
            if not (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_FROM):
                logger.error("Twilio provider configured but missing credentials. Message not sent.")
                return False
            url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
            data = {
                "From": TWILIO_FROM,
                "To": f"whatsapp:{to}",
                "Body": message,
            }
            r = requests.post(url, data=data, auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN), timeout=10)
            if r.status_code in (200, 201):
                return True
            logger.error("Twilio send failed: %s %s", r.status_code, r.text)
            return False
        else:
            # local / custom provider: POST JSON payload to configured endpoint
            r = requests.post(QMOI_WHATSAPP_ENDPOINT, json=payload, timeout=5)
            if r.status_code in (200, 201):
                return True
            logger.error("Local WhatsApp endpoint returned %s: %s", r.status_code, r.text)
            return False
    except Exception as e:
        logger.exception("Failed to send whatsapp message: %s", e)
        return False

def notify_master_on_whatsapp(master_number, ai_status, projects_report, planned_projects, timetable):
    message = f"""
Hello Master,

AI (Alpha-Q/Qmoi) is now online and healthy!

Status: {ai_status}

Current Projects:
{projects_report}

Planned Projects:
{planned_projects}

Timetable (✓ = done):
{timetable}

- This is an automated update after WhatsApp QR scan.
"""
    # Replace with actual WhatsApp API endpoint and payload
    # Use provider-agnostic send_whatsapp wrapper
    ok = send_whatsapp(master_number, message)
    if not ok:
        logger.warning("Failed to notify master via provider: %s", QMOI_WHATSAPP_PROVIDER)

def notify_sister_on_whatsapp(sister_number, ai_features, project_suggestions, instructions):
    message = f"""
Hello Sister!

I'm your AI assistant. Here are some things I can do for you:

Features:
{ai_features}

Project Suggestions (run in Colab):
{project_suggestions}

Instructions:
{instructions}

Would you like me to start any of these projects for you? Just reply with the project name or 'yes' to proceed!
"""
    ok = send_whatsapp(sister_number, message)
    if not ok:
        logger.warning("Failed to notify sister via provider: %s", QMOI_WHATSAPP_PROVIDER)

def notify_leah_wallet_on_whatsapp(sister_number, wallet_status, instructions):
    message = f"""
Hello Leah!

Your wallet is now active in LC Hub.

Wallet Status:
{wallet_status}

Instructions:
{instructions}

You can check your balance, send/receive funds, and manage your wallet easily from the LC Hub tab!
"""
    ok = send_whatsapp(sister_number, message)
    if not ok:
        logger.warning("Failed to notify Leah about wallet via provider: %s", QMOI_WHATSAPP_PROVIDER)

# Enhance: Save user info and ask for more details if missing
def ensure_user_info(user_type, user_info):
    required_fields = ["name", "age", "career", "hobbies", "interests"]
    missing = [f for f in required_fields if f not in user_info or not user_info[f]]
    if missing:
        # AI should ask for missing info via WhatsApp
        if user_type == "master":
            notify_master_on_whatsapp(
                MASTER_WHATSAPP,
                "AI needs more info to serve you better. Please reply with: " + ", ".join(missing),
                "-",
                "-",
                "-"
            )
        elif user_type == "sister":
            notify_sister_on_whatsapp(
                SISTER_WHATSAPP,
                "AI needs more info to help you! Please reply with: " + ", ".join(missing),
                "-",
                "-"
            )
    return not missing

# Enhance: Send files between devices via all wireless options ([PRODUCTION IMPLEMENTATION REQUIRED])
def send_file_between_devices(file_path, to_device, method="auto"):
    """Stub for file transfer between devices.

    Production implementation requires platform-specific device APIs (WiFi direct, Bluetooth, NFC)
    or a cloud relay. For now this is a safe stub that logs the intent and returns False.
    """
    logger.info("send_file_between_devices: stub called for %s => %s via %s", file_path, to_device, method)
    # Not implemented in this repository; return False to indicate no-op
    return False

def send_app_download_links_via_whatsapp():
    app_links = {
        "Android": "https://example.com/app-latest.apk",
        "iOS": "https://example.com/app-latest.ipa",
        "Windows": "https://example.com/app-latest.exe",
        "Mac": "https://example.com/app-latest.dmg",
        "Linux": "https://example.com/app-latest.AppImage"
    }
    msg = "Download the Alpha-Q AI App for your device:\n" + "\n".join([f"{k}: {v}" for k, v in app_links.items()])
    for number in [MASTER_WHATSAPP_NUMBER, SISTER_WHATSAPP_NUMBER]:
        ok = send_whatsapp(number, msg)
        if not ok:
            logger.warning("Failed to send app download link to %s via provider %s", number, QMOI_WHATSAPP_PROVIDER)
