#!/usr/bin/env python3
"""
update_readme_cli_usage.py
--------------------------------
This script dynamically updates the CLI usage section in README.md
based on the latest output of:
    python scripts/qmoi-unified-push.py --help

Failsafe features:
- Verifies CLI output is non-empty
- Ensures START/END markers exist in README
- Validates injected block is properly formed
"""

import subprocess
import re
from datetime import datetime
import sys
from pathlib import Path

README_FILE = Path(__file__).resolve().parents[1] / "README.md"
SCRIPT_FILE = Path(__file__).resolve().parents[0] / "qmoi-unified-push.py"

START_MARKER = "<!-- AUTO-CLI-USAGE:START -->"
END_MARKER = "<!-- AUTO-CLI-USAGE:END -->"

def get_cli_help():
    """Run the CLI script and capture --help output"""
    try:
        result = subprocess.run(
            ["python", str(SCRIPT_FILE), "--help"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            check=True
        )
        output = result.stdout.strip()
        if not output:
            print("❌ ERROR: CLI output is empty, aborting update.")
            sys.exit(1)
        return output
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to run CLI help: {e.stdout}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"❌ Script not found: {SCRIPT_FILE}")
        sys.exit(1)

def update_readme(cli_output):
    """Inject CLI usage block into README.md with validation"""
    if not README_FILE.exists():
        print(f"❌ README file not found: {README_FILE}")
        sys.exit(1)

    content = README_FILE.read_text(encoding="utf-8")

    if START_MARKER not in content or END_MARKER not in content:
        print("❌ README markers not found, aborting. Ensure README contains:")
        print(f"   {START_MARKER}\n   {END_MARKER}")
        sys.exit(1)

    usage_block = (
        f"{START_MARKER}\n"
        f"```bash\n{cli_output}\n```\n"
        f"{END_MARKER}"
    )

    new_content = re.sub(
        f"{START_MARKER}.*?{END_MARKER}",
        usage_block,
        content,
        flags=re.DOTALL
    )

    # Validation: ensure new block exists & not empty
    if cli_output not in new_content:
        print("❌ Validation failed: Injected usage block missing.")
        sys.exit(1)

    # Add a "last updated" badge
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    badge = f"![README updated](https://img.shields.io/badge/CLI%20usage%20updated-{timestamp.replace(' ', '%20')}-blue)"
    if "![README updated]" not in new_content:
        new_content = badge + "\n\n" + new_content

    README_FILE.write_text(new_content, encoding="utf-8")
    print(f"✅ README.md updated successfully at {timestamp}")

def main():
    cli_output = get_cli_help()
    update_readme(cli_output)

if __name__ == "__main__":
    main()
