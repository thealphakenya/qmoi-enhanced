import os
import requests
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("GITHUB_TOKEN")
REPO = "thealphakenya/Alpha-Q-ai"
TAG = "latest"
ZIP_PATH = "Qmoi_apps/qmoi_ai_all_apps.zip"

headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json",
}


def get_release():
    url = f"https://api.github.com/repos/{REPO}/releases/tags/{TAG}"
    resp = requests.get(url, headers=headers)
    if resp.status_code == 404:
        return None
    return resp.json()


def create_release():
    url = f"https://api.github.com/repos/{REPO}/releases"
    resp = requests.post(
        url,
        headers=headers,
        json={
            "tag_name": TAG,
            "name": "QMOI Latest Build",
            "body": "Automated latest build",
            "draft": False,
            "prerelease": False,
        },
    )
    return resp.json()


def upload_asset(upload_url, filepath):
    filename = os.path.basename(filepath)
    upload_url = upload_url.split("{")[0]
    headers["Content-Type"] = "application/zip"
    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{upload_url}?name={filename}", headers=headers, data=f.read()
        )
        print("✅ Uploaded:", filename, resp.status_code)
        return resp.ok


def main():
    release = get_release()
    if not release:
        release = create_release()

    upload_url = release["upload_url"]
    upload_asset(upload_url, ZIP_PATH)


if __name__ == "__main__":
    main()
