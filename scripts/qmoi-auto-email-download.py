import sys
import subprocess
import json
import os
from scripts.qmoi_activity_logger import log_activity

# Try to get links from args or from last activity log
def get_links():
    if len(sys.argv) > 1:
        return sys.argv[1:]
    # Try to read from last activity log
    log_path = 'logs/qmoi-activity-log.json'
    if os.path.exists(log_path):
        with open(log_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for event in reversed(data.get('activities', [])):
                links = event.get('metadata', {}).get('links')
                if links:
                    return links
    return []

def main():
    links = get_links()
    if not links:
        print('No download links found.')
        return
    body = 'QMOI App is ready for download!\n\nDownload links:\n' + '\n'.join(links)
    log_activity('Sending QMOI app download links via Gmail.', {'links': links})
    subprocess.run(['python', 'scripts/gmail_notify.py', '--subject', 'QMOI App Download Link', '--body', body])
    print('Download links sent via Gmail.')

if __name__ == "__main__":
    main() 