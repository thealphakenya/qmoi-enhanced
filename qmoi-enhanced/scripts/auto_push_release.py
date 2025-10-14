import os
from github import Github
from github import InputGitAuthor
from datetime import datetime

REPO_NAME = "thealphakenya/Alpha-Q-ai"
ZIP_PATH = "QMOI_AI_All_Platforms.zip"
TAG_NAME = f"release-{datetime.now().strftime('%Y%m%d%H%M%S')}"
RELEASE_TITLE = "QMOI AI Auto Release"
TOKEN = os.getenv("GITHUB_TOKEN")

assert TOKEN, "❌ Missing GITHUB_TOKEN in environment"

g = Github(TOKEN)
repo = g.get_repo(REPO_NAME)

# Create release
release = repo.create_git_release(
    tag=TAG_NAME,
    name=RELEASE_TITLE,
    message="🚀 Auto release for QMOI AI (All Platforms)",
    draft=False,
    prerelease=False,
)

# Upload zip
with open(ZIP_PATH, "rb") as zip_file:
    release.upload_asset(
        path=ZIP_PATH,
        label="QMOI AI All Platforms.zip",
        name=os.path.basename(ZIP_PATH),
        content_type="application/zip",
    )

print(f"✅ Uploaded release {RELEASE_TITLE} at: {release.html_url}")
