import json
import os
from datetime import datetime

LOG_PATH = "logs/qmoi-activity-log.json"


def log_activity(description, metadata=None):
    event = {
        "timestamp": datetime.now().isoformat(),
        "description": description,
    }
    if metadata:
        event["metadata"] = metadata
    # Load existing log
    if os.path.exists(LOG_PATH):
        try:
            with open(LOG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            data = {"activities": []}
    else:
        data = {"activities": []}
    data["activities"].append(event)
    # Save log
    with open(LOG_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    import sys

    desc = sys.argv[1] if len(sys.argv) > 1 else "Manual activity log entry."
    log_activity(desc)
    print(f"Logged activity: {desc}")
