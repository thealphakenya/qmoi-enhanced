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

class QmoiNotificationManager:
    def __init__(self):
        self.channels = ['gmail', 'slack', 'telegram', 'discord', 'sms', 'push']

    def send_gmail(self, subject, message):
        log_activity(f'Sending Gmail notification: {subject}', {'message': message})
        subprocess.run(['python', 'scripts/gmail_notify.py', '--subject', subject, '--body', message])
        log_activity(f'Gmail notification sent: {subject}')

    def send_whatsapp(self, message):
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

    def send_slack(self, subject, message):
        webhook_url = os.environ.get('SLACK_WEBHOOK_URL')
        if not webhook_url:
            print('Missing Slack webhook URL.')
            return
        requests.post(webhook_url, json={"text": message})
        log_activity('Sent Slack notification.', {'message': message})
        print('Slack message sent.')
        log_activity(f'Slack notification sent: {subject}')

    def send_telegram(self, subject, message):
        token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        if not (token and chat_id):
            print('Missing Telegram credentials.')
            return
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        requests.post(url, data={"chat_id": chat_id, "text": message})
        log_activity('Sent Telegram notification.', {'message': message})
        print('Telegram message sent.')
        log_activity(f'Telegram notification sent: {subject}')

    def send_discord(self, subject, message):
        webhook_url = os.environ.get('DISCORD_WEBHOOK_URL')
        if not webhook_url:
            print('Missing Discord webhook URL.')
            return
        requests.post(webhook_url, json={"content": message})
        log_activity('Sent Discord notification.', {'message': message})
        print('Discord message sent.')
        log_activity(f'Discord notification sent: {subject}')

    def send_sms(self, subject, message):
        # [PRODUCTION IMPLEMENTATION REQUIRED] for SMS integration (e.g., Twilio, Nexmo, etc.)
        log_activity('Sent SMS notification ([PRODUCTION IMPLEMENTATION REQUIRED]).', {'message': message})
        print('SMS message sent ([PRODUCTION IMPLEMENTATION REQUIRED]).')
        log_activity(f'SMS notification sent: {subject}')

    def send_push(self, subject, message):
        # [PRODUCTION IMPLEMENTATION REQUIRED] for push notification integration (e.g., Firebase, OneSignal, etc.)
        log_activity('Sent push notification ([PRODUCTION IMPLEMENTATION REQUIRED]).', {'message': message})
        print('Push notification sent ([PRODUCTION IMPLEMENTATION REQUIRED]).')
        log_activity(f'Push notification sent: {subject}')

    def send_notification(self, subject, message, channels=None):
        if channels is None:
            channels = self.channels
        for channel in channels:
            if channel == 'gmail':
                self.send_gmail(subject, message)
            elif channel == 'whatsapp':
                self.send_whatsapp(message)
            elif channel == 'slack':
                self.send_slack(subject, message)
            elif channel == 'telegram':
                self.send_telegram(subject, message)
            elif channel == 'discord':
                self.send_discord(subject, message)
            elif channel == 'sms':
                self.send_sms(subject, message)
            elif channel == 'push':
                self.send_push(subject, message)
            else:
                self.log(f'Unknown channel: {channel}')

    def log(self, msg):
        with open('logs/qmoi_notification_manager.log', 'a', encoding='utf-8') as f:
            f.write(f'{msg}\n')

if __name__ == "__main__":
    import sys
    msg = sys.argv[1] if len(sys.argv) > 1 else 'QMOI notification test.'
    chs = sys.argv[2:] if len(sys.argv) > 2 else ['gmail']
    notifier = QmoiNotificationManager()
    notifier.send_notification('QMOI Notification', msg, chs) 