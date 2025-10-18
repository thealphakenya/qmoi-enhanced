Auto-sync instructions

This repository contains a GitHub Actions workflow that will push changes made to `main` here to the private repository `thealphakenya/qmoi-enhanced`.

Setup steps (owner of this repo must do these in repo settings):


1. Add the secret `UPSTREAM_PAT` to this repository (prefer using the web UI or the GitHub CLI):

	Web UI:
	- Settings -> Secrets & variables -> Actions -> New repository secret
	- Name: UPSTREAM_PAT
	- Paste the new PAT (with `repo` scope) and save.

	GitHub CLI (example):

	```bash
	# create a file containing your new token, e.g. ~/new_upstream_pat.txt
	./scripts/set_upstream_secret.sh thevictorofkenya qmoi-enhanced-new-thevictorofkenya UPSTREAM_PAT ~/new_upstream_pat.txt
	```

2. After adding the secret, the workflow will run when a PR is merged into `main` or when manually dispatched from the Actions UI.

Security notes:
- The workflow uses the secret and will not surface the token in logs. The token is used only to create a temporary remote for the push.
- Prefer using a fine-scoped PAT and rotate the token periodically.

If you'd like, I can open a PR or commit a change to adjust the workflow to only run on tags or PR merges instead of every push.
