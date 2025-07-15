import os
import subprocess
import sys

# Robust import for log_activity
try:
    from scripts.qmoi_activity_logger import log_activity
except ImportError:
    import importlib.util
    spec = importlib.util.spec_from_file_location('qmoi_activity_logger', os.path.join(os.path.dirname(__file__), 'qmoi-activity-logger.py'))
    qmoi_activity_logger = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(qmoi_activity_logger)
    log_activity = qmoi_activity_logger.log_activity

# Ensure logs directory exists
os.makedirs(os.path.join(os.path.dirname(__file__), '../logs'), exist_ok=True)

def is_qmoi_running():
    # Check for a running QMOI process (simple check for demo; can be enhanced)
    try:
        result = subprocess.check_output('tasklist' if os.name == 'nt' else 'ps aux', shell=True).decode()
        return 'qmoi-qcity-automatic.py' in result or 'qmoi-qcity-automatic' in result
    except Exception:
        return False

def show_status():
    print('QMOI Status:')
    try:
        subprocess.run([sys.executable, os.path.join('scripts', 'qmoi-info.py')])
    except Exception as e:
        print('Could not show QMOI info:', e)

def start_qmoi():
    print('Starting QMOI automation system...')
    log_activity('Starting QMOI automation system (all clouds, QCity, error fixing, notifications, always-on).')
    # Start QMOI main automation (non-blocking)
    subprocess.Popen([sys.executable, os.path.join('scripts', 'qmoi-qcity-automatic.py')])
    print('QMOI started. It will now run in the background and in the cloud.')
    show_status()

def main():
    print('--- QMOI Start/Resume ---')
    if is_qmoi_running():
        print('QMOI is already running.')
        log_activity('QMOI start script run: already running.')
        show_status()
    else:
        start_qmoi()

if __name__ == "__main__":
    main() 