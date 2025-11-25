---
title: "Issue draft for scripts/license_checker.py"
generated: 2025-11-08T16:06:38.971805Z
---

# Review needed: scripts/license_checker.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
import subprocess
import json
import sys

# Allowed licenses
ALLOWED_LICENSES = {
    "MIT",
    "Apache-2.0",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "CC0-1.0",
    "ISC",
    "Python-2.0"
}

def get_licenses():
    try:
        result = subprocess.run(
            ["pip-licenses", "--format=json", "--with-licenses"],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error running pip-licenses: {e.stderr}", file=sys.stderr)
        sys.exit(1)

def main():
    violations = []
    licenses = get_licenses()

    for pkg in licenses:
        license = pkg["License"]
        name = pkg["Name"]

        # Handle multi-license strings like "MIT OR Apache-2.0"
        if not any(allowed in license for allowed in ALLOWED_LICENSES):
            violations.append(f"{name}: {license}")

    if violations:
        print("❌ Non-compliant licenses found:")
        for v in violations:
            print(f" - {v}")
        with open("license-violations.json", "w") as f:
            json.dump(violations, f, indent=2)
        sys.exit(1)
    else:
        print("✅ All licenses are compliant.")

if __name__ == "__main__":
    main()
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
