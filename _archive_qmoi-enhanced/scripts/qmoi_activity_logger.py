import datetime
import os

def log_activity(message, details=None):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_line = f"[{timestamp}] {message}"
    if details:
        log_line += f" | {details}"
    print(log_line)
    # Optionally, write to a log file
    log_dir = os.path.join(os.path.dirname(__file__), '../logs')
    os.makedirs(log_dir, exist_ok=True)
    with open(os.path.join(log_dir, 'qmoi_activity.log'), 'a') as f:
        f.write(log_line + '\n') 