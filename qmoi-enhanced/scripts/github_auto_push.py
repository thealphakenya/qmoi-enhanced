import os
import subprocess
from dotenv import load_dotenv

load_dotenv()


def run(cmd):
    print(f"🔧 Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print("❌ Error:", result.stderr)
    return result.returncode == 0


def push_to_github():
    repo_url = (
        f"https://{os.getenv('GITHUB_TOKEN')}@github.com/thealphakenya/Alpha-Q-ai.git"
    )

    run("git add .")
    run('git commit -m "🔄 Auto-sync QMOI updates"')
    return run(f"git push {repo_url} HEAD:main")


if __name__ == "__main__":
    if not os.getenv("GITHUB_TOKEN"):
        print("❌ GITHUB_TOKEN is not set in .env")
    else:
        success = push_to_github()
        print("✅ GitHub Push" if success else "❌ GitHub Push Failed")
