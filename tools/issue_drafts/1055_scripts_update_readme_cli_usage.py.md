---
title: "Issue draft for scripts/update_readme_cli_usage.py"
generated: 2025-11-08T16:06:38.996019Z
---

# Review needed: scripts/update_readme_cli_usage.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:42.150300Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:42.150300Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.150300Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

````
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
        f"{START
````

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
