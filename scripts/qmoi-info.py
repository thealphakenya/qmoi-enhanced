import json
import os
from datetime import datetime


# Helper to load JSON logs if they exist
def load_json_log(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except Exception:
                return None
    return None


def print_section(title):
    print(f"\n=== {title} ===")


def print_event_list(events, title):
    print_section(title)
    if not events:
        print("No events recorded.")
        return
    for event in events:
        ts = event.get("timestamp", "N/A")
        desc = event.get("description", event.get("event", ""))
        print(f"[{ts}] {desc}")
    print(f"Total: {len(events)}")


def main():
    print("QMOI Real-Time Info\n===================")
    # Activity log (comprehensive)
    activity = load_json_log("logs/qmoi-activity-log.json")
    if activity and "activities" in activity:
        print_event_list(activity["activities"], "All QMOI Activities (Real-Time)")
        # Show first event time
        if activity["activities"]:
            first_event = activity["activities"][0]
            print(
                f"\nFirst QMOI Activity: {first_event.get('timestamp', 'N/A')} - {first_event.get('description', first_event.get('event', ''))}"
            )
    # Errors fixed
    fixes = load_json_log("logs/fixes-log.json")
    if fixes and "fixes" in fixes:
        print_event_list(fixes["fixes"], "Errors Fixed")
    # Enhancements
    enhancements = load_json_log("logs/evolution-suggestions.json")
    if enhancements and "enhancements" in enhancements:
        print_event_list(enhancements["enhancements"], "Enhancements & Evolution")
    # File/code changes
    changes = load_json_log("logs/comprehensive-report.json")
    if changes and "changes" in changes:
        print_event_list(changes["changes"], "File & Code Changes")
    # Last health check
    stats = load_json_log("logs/real-time-stats.json")
    if stats:
        print_section("Last Health Check")
        print(f"Timestamp: {stats.get('timestamp', 'N/A')}")
        for k, v in stats.items():
            if k != "timestamp":
                print(f"{k}: {v}")
    # Other stats
    perf = load_json_log("logs/performance-analysis.json")
    if perf:
        print_section("Performance Analysis")
        for k, v in perf.items():
            print(f"{k}: {v}")
    print("\n---\nQMOI info generated at", datetime.now().isoformat())


if __name__ == "__main__":
    main()
