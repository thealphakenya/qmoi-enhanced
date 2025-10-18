Sync helper

This repository is a public copy used to edit and test before pushing to the private `qmoi-enhanced` repository owned by `thealphakenya`.

1. Copy `.env.example` to `.env` and add your personal access token (PAT) with repo permissions:

   GITHUB_TOKEN=ghp_xxx

2. Never commit `.env` or tokens. The root `.gitignore` prevents `.env` from being added.

3. To push local changes to the private upstream (uses token from `.env`):

   source .env && ./scripts/push_to_upstream.sh "your commit message"

The script will create or update a remote named `upstream` that points to `https://<token>@github.com/thealphakenya/qmoi-enhanced.git` and push the current branch to `main` by default.

Security note: Using token-embedded remote URLs stores the token only in Git's remote URL (visible via `git remote -v`). Consider using a credential helper or GitHub CLI for more secure workflows.
