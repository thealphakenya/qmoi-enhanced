import requests
import os
import json
import time
from datetime import datetime

APPS_MD = 'ALLQMOIAIAPPSREALEASESVERSIONS.md'
LATEST_JSON = 'Qmoi_apps/latest.json'
LOG_FILE = 'Qmoi_apps/logs/qserver_download_tester.log'
MAX_RETRIES = 5
RETRY_DELAY = 10  # seconds

# Helper: parse the .md table for app info and links
def parse_apps_md():
    apps = []
    with open(APPS_MD, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    in_table = False
    for line in lines:
        if line.strip().startswith('| App Name'):
            in_table = True
            continue
        if in_table and line.strip().startswith('|'):
            parts = [x.strip() for x in line.strip().split('|')[1:-1]]
            if len(parts) >= 5:
                apps.append({
                    'name': parts[0],
                    'platform': parts[1],
                    'version': parts[2],
                    'download_link': parts[3],
                    'status': parts[4],
                })
        elif in_table and not line.strip().startswith('|'):
            break
    return apps

def log_event(event, data=None):
    entry = {'event': event, 'data': data, 'time': datetime.now().isoformat()}
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(json.dumps(entry) + '\n')

def get_file_size(url):
    try:
        r = requests.head(url, allow_redirects=True, timeout=30)
        if r.status_code == 200 and 'Content-Length' in r.headers:
            return int(r.headers['Content-Length'])
        # fallback to GET if HEAD fails
        r = requests.get(url, stream=True, timeout=30)
        if r.status_code == 200 and 'Content-Length' in r.headers:
            return int(r.headers['Content-Length'])
    except Exception as e:
        log_event('size_check_error', {'url': url, 'error': str(e)})
    return None

def check_and_fix_download(app):
    url = app['download_link']
    for attempt in range(1, MAX_RETRIES+1):
        try:
            r = requests.head(url, allow_redirects=True, timeout=30)
            if r.status_code == 200:
                size = get_file_size(url)
                log_event('download_ok', {'app': app, 'size': size})
                return {'ok': True, 'size': size, 'last_checked': datetime.now().isoformat()}
            else:
                raise Exception(f'Status {r.status_code}')
        except Exception as e:
            log_event('download_error', {'app': app, 'error': str(e), 'attempt': attempt})
            time.sleep(RETRY_DELAY * attempt)
            # Trigger auto-fix ([PRODUCTION IMPLEMENTATION REQUIRED]: notify Qteam, re-upload, etc.)
            if attempt == MAX_RETRIES:
                log_event('autofix_triggered', {'app': app, 'error': str(e)})
    return {'ok': False, 'size': None, 'last_checked': datetime.now().isoformat()}

def main():
    apps = parse_apps_md()
    results = []
    for app in apps:
        result = check_and_fix_download(app)
        app.update(result)
        results.append(app)
    # Write to central JSON for UI/docs
    os.makedirs(os.path.dirname(LATEST_JSON), exist_ok=True)
    with open(LATEST_JSON, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    log_event('all_apps_checked', {'count': len(results)})

if __name__ == '__main__':
    main() 