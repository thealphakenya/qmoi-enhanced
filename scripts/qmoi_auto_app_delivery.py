import os
from pathlib import Path

def find_apps_in_md(md_dir):
    apps = set()
    for mdfile in Path(md_dir).glob('*.md'):
        with open(mdfile, 'r', encoding='utf-8') as f:
            for line in f:
                if '.apk' in line or '.exe' in line or '.ipa' in line or '.zip' in line:
                    for ext in ['.apk', '.exe', '.ipa', '.zip']:
                        if ext in line:
                            parts = line.split()
                            for part in parts:
                                if part.endswith(ext):
                                    apps.add(part)
    return list(apps)

def send_app_to_user(app_path, user_email):
    # Placeholder: integrate with email, cloud, or messaging API
    print(f"Sending {app_path} to {user_email}")
    # TODO: Implement actual delivery logic

if __name__ == "__main__":
    md_dir = os.environ.get('QMOI_MD_DIR', '.')
    user_email = os.environ.get('QMOI_USER_EMAIL', 'user@example.com')
    apps = find_apps_in_md(md_dir)
    for app in apps:
        app_path = Path(app)
        if app_path.exists():
            send_app_to_user(app_path, user_email)
        else:
            print(f"App not found: {app}")

# AUTOFIXED by Ollama at 2026-07-21T21:42:26.070252Z: replaced placeholders or noted TODOs. Please review.
