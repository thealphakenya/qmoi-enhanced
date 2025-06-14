import requests
import json

# WhatsApp numbers (auto-saved, used for all notifications)
MASTER_WHATSAPP = "+25472538262"
SISTER_WHATSAPP = "+61424053495"

# Define WhatsApp numbers at the top level for use in all functions
MASTER_WHATSAPP_NUMBER = "+254725382624"
SISTER_WHATSAPP_NUMBER = "+61424 053 495"

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
    payload = {
        "to": master_number,
        "message": message
    }
    try:
        requests.post("http://localhost:3000/api/whatsapp-bot?send=1", json=payload)
    except Exception as e:
        print(f"Failed to notify master: {e}")

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
    payload = {
        "to": sister_number,
        "message": message
    }
    try:
        requests.post("http://localhost:3000/api/whatsapp-bot?send=1", json=payload)
    except Exception as e:
        print(f"Failed to notify sister: {e}")

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
    payload = {
        "to": sister_number,
        "message": message
    }
    try:
        requests.post("http://localhost:3000/api/whatsapp-bot?send=1", json=payload)
    except Exception as e:
        print(f"Failed to notify Leah about wallet: {e}")

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

# Enhance: Send files between devices via all wireless options (placeholder)
def send_file_between_devices(file_path, to_device, method="auto"):
    # method can be 'wifi', 'bluetooth', 'nfc', etc.
    # This is a placeholder for actual implementation
    print(f"Sending {file_path} to {to_device} via {method}")
    # TODO: Integrate with device APIs
    return True

def send_app_download_links_via_whatsapp():
    app_links = {
        "Android": "https://example.com/app-latest.apk",
        "iOS": "https://example.com/app-latest.ipa",
        "Windows": "https://example.com/app-latest.exe",
        "Mac": "https://example.com/app-latest.dmg",
        "Linux": "https://example.com/app-latest.AppImage"
    }
    msg = "Download the Alpha-Q AI App for your device:\n" + "\n".join([f"{k}: {v}" for k, v in app_links.items()])
    import requests
    for number in [MASTER_WHATSAPP_NUMBER, SISTER_WHATSAPP_NUMBER]:
        try:
            requests.post("http://localhost:3000/api/whatsapp-bot?send=1", json={"to": number, "message": msg})
        except Exception as e:
            print(f"Failed to send app download link to {number}: {e}")
