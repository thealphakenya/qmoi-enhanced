Auto-sync instructions

This repository contains a GitHub Actions workflow that will push changes made to `main` here to the private repository `thealphakenya/qmoi-enhanced`.

Setup steps (owner of this repo must do these in repo settings):

1. Go to this repository's Settings -> Secrets -> Actions and add a new secret named `UPSTREAM_PAT` with a Personal Access Token that has `repo` scope for the `thealphakenya` account.

2. After adding the secret, any push to `main` will trigger the `Sync to private upstream` workflow which will push the commit to `thealphakenya/qmoi-enhanced`.

Security notes:
- The workflow uses the secret and will not surface the token in logs. The token is used only to create a temporary remote for the push.
- Prefer using a fine-scoped PAT and rotate the token periodically.

If you'd like, I can open a PR or commit a change to adjust the workflow to only run on tags or PR merges instead of every push.
