---
title: "Issue draft for qmoi-enhanced/scripts/qmoi_git_wrapper.py"
generated: 2025-11-08T16:06:38.824709Z
---

# Review needed: qmoi-enhanced/scripts/qmoi_git_wrapper.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""Lightweight git wrapper that ensures the encrypted GitHub token is used for https pushes.

Usage: replace calls to 'git' with 'python scripts/qmoi_git_wrapper.py git ...' or add an alias.
It intercepts push/pull/fetch commands and sets GIT_ASKPASS to a small helper that returns the token.
"""
import os
import sys
import subprocess
from pathlib import Path


def get_github_token():
    try:
        from scripts.qmoi_secret_manager import get_named_secret
    except Exception:
        return None
    return get_named_secret('github')


def write_askpass_helper(token: str) -> str:
    p = Path('.qmoi') / 'git-askpass-qmoi.sh'
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(f"#!/usr/bin/env bash\necho '{token}'\n")
    p.chmod(0o700)
    return str(p)


def main():
    if len(sys.argv) < 2:
        print('Usage: qmoi_git_wrapper.py git <git-args...>')
        sys.exit(1)

    # pass-through for non-network commands
    args = sys.argv[1:]
    needs_credentials = any(x in ('push', 'pull', 'fetch') for x in args)

    env = os.environ.copy()
    askpass = None
    if needs_credentials:
        token = get_github_token()
        if token:
            askpass = write_askpass_helper(token)
            env['GIT_ASKPASS'] = askpass
            # set username to x-access-token for GitHub
            env['GIT_USERNAME'] = 'x-access-token'

    # Run git command with env override
    cmd = ['git'] + args
    p = subprocess.Popen(cmd, env=env)
    p.wait()
    sys.exit(p.returncode)


if __name__ == '__main__':
    main()

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
