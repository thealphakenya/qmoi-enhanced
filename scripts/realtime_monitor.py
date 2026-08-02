import time, sys, os

def log_activity(message):
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    formatted = f"- **[{timestamp}]** {message}\n"
    print(formatted)
    sys.stdout.flush()
    with open("OLLAMA_ACTIVITY_FEED.md", "a") as f:
        f.write(formatted)

if __name__ == "__main__":
    if not os.path.exists("OLLAMA_ACTIVITY_FEED.md"):
      with open("OLLAMA_ACTIVITY_FEED.md", "w") as f:
          f.write("# 📡 Ollama Realtime Live Activity Feed\n\n")
    log_activity("Realtime activity monitoring initialized successfully.")
