import os
import requests
import json
from qmoi_activity_logger import log_activity

RELEASE_API = "https://api.github.com/repos/thealphakenya/Alpha-Q-ai/releases/latest"
CURRENT_VERSION = os.getenv("QMOI_VERSION", "0.0.0")

response = requests.get(RELEASE_API)
data = response.json()
tag = data["tag_name"]

if tag != CURRENT_VERSION:
    log_activity(
        "🔔 New update available", {"new_version": tag, "current": CURRENT_VERSION}
    )
    # Trigger download and relaunch here
else:
    log_activity("✅ Up to date", {"version": CURRENT_VERSION})
