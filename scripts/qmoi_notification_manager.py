import os
import subprocess
import requests

# Robust import for log_activity
try:
    from scripts.qmoi_activity_logger import log_activity
except ImportError:
    import importlib.util
    import sys
    spec = importlib.util.spec_from_file_location('qmoi_activity_logger', os.path.join(os.path.dirname(__file__), 'qmoi-activity-logger.py'))
    qmoi_activity_logger = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(qmoi_activity_logger)
    log_activity = qmoi_activity_logger.log_activity

def send_gmail(message, subject='QMOI Notification'):
    log_activity(f'Sending Gmail notification: {subject}', {'message': message})
    subprocess.run(['python', 'scripts/gmail_notify.py', '--subject', subject, '--body', message])

def send_whatsapp(message):
    try:
        from twilio.rest import Client
    except ImportError:
        print('Twilio not installed. Skipping WhatsApp notification.')
        return
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    from_whatsapp = os.environ.get('TWILIO_WHATSAPP_FROM')
    to_whatsapp = os.environ.get('WHATSAPP_RECIPIENT')
    if not (account_sid and auth_token and from_whatsapp and to_whatsapp):
        print('Missing WhatsApp/Twilio credentials.')
        return
    client = Client(account_sid, auth_token)
    client.messages.create(
        body=message,
        from_=f'whatsapp:{from_whatsapp}',
        to=f'whatsapp:{to_whatsapp}'
    )
    log_activity('Sent WhatsApp notification.', {'message': message})
    print('WhatsApp message sent.')

def send_slack(message):
    webhook_url = os.environ.get('SLACK_WEBHOOK_URL')
    if not webhook_url:
        print('Missing Slack webhook URL.')
        return
    requests.post(webhook_url, json={"text": message})
    log_activity('Sent Slack notification.', {'message': message})
    print('Slack message sent.')

def send_telegram(message):
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not (token and chat_id):
        print('Missing Telegram credentials.')
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    requests.post(url, data={"chat_id": chat_id, "text": message})
    log_activity('Sent Telegram notification.', {'message': message})
    print('Telegram message sent.')

def send_discord(message):
    webhook_url = os.environ.get('DISCORD_WEBHOOK_URL')
    if not webhook_url:
        print('Missing Discord webhook URL.')
        return
    requests.post(webhook_url, json={"content": message})
    log_activity('Sent Discord notification.', {'message': message})
    print('Discord message sent.')

def send_sms(message):
    # Placeholder for SMS integration (e.g., Twilio, Nexmo, etc.)
    log_activity('Sent SMS notification (placeholder).', {'message': message})
    print('SMS message sent (placeholder).')

def send_push(message):
    # Placeholder for push notification integration (e.g., Firebase, OneSignal, etc.)
    log_activity('Sent push notification (placeholder).', {'message': message})
    print('Push notification sent (placeholder).')

def send_notification(message, subject='QMOI Notification', channels=None):
    if channels is None:
        channels = ['gmail']
    if 'gmail' in channels:
        send_gmail(message, subject)
    if 'whatsapp' in channels:
        send_whatsapp(message)
    if 'slack' in channels:
        send_slack(message)
    if 'telegram' in channels:
        send_telegram(message)
    if 'discord' in channels:
        send_discord(message)
    if 'sms' in channels:
        send_sms(message)
    if 'push' in channels:
        send_push(message)

if __name__ == "__main__":
    import sys
    msg = sys.argv[1] if len(sys.argv) > 1 else 'QMOI notification test.'
    chs = sys.argv[2:] if len(sys.argv) > 2 else ['gmail']
    send_notification(msg, 'QMOI Notification', chs) 