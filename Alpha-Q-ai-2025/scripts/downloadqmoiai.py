import requests
import time
import os
import json

LOG_DIR = 'Qmoi_downloaded_apps/logs/'
os.makedirs(LOG_DIR, exist_ok=True)

MAX_RETRIES = 3
RETRY_DELAY = 3

def log_download_event(event, data=None):
    log_path = os.path.join(LOG_DIR, 'download_log.json')
    entry = {'event': event, 'data': data, 'time': time.strftime('%Y-%m-%d %H:%M:%S')}
    with open(log_path, 'a', encoding='utf-8') as f:
        f.write(json.dumps(entry) + '\n')

def notify_qteam(issue):
    # Placeholder: integrate with QMOI notification system
    print(f'Notifying Qteam Customer Care: {issue}')
    log_download_event('notify_qteam', {'issue': issue})

def download_with_retry(url, dest):
    for attempt in range(1, MAX_RETRIES+1):
        try:
            r = requests.get(url, stream=True, timeout=60)
            if r.status_code == 200:
                with open(dest, 'wb') as f:
                    for chunk in r.iter_content(8192):
                        f.write(chunk)
                log_download_event('download_success', {'url': url, 'dest': dest})
                return True
            else:
                raise Exception(f'Status {r.status_code}')
        except Exception as e:
            log_download_event('download_error', {'url': url, 'error': str(e), 'attempt': attempt})
            print(f'Attempt {attempt} failed: {e}')
            time.sleep(RETRY_DELAY * attempt)
    # All attempts failed
    log_download_event('download_failed', {'url': url, 'dest': dest})
    notify_qteam(f'Download failed for {url}')
    # Trigger QMOI error handler (placeholder)
    print('Triggering QMOI error handler...')
    return False 