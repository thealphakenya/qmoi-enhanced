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

2. After adding the secret, the workflow will run when a PR is merged into `main` or when manually dispatched from the Actions UI. By default the workflow now creates a sync branch on the upstream repo and opens a Pull Request instead of pushing directly to `main`.

Using the helper script locally (advanced):

	- To directly create a PR on the upstream using the token in the environment, you can run (requires `jq`):

		```bash
		export UPSTREAM_PAT=$(cat ~/new_upstream_pat.txt)
		./scripts/create_upstream_pr.sh thealphakenya qmoi-enhanced "sync-branch-name" "Sync from public" "Automated sync"
		```

	The Action will also attempt to create a branch and PR automatically when run.

Security notes:
- The workflow uses the secret and will not surface the token in logs. The token is used only to create a temporary remote for the push.
- Prefer using a fine-scoped PAT and rotate the token periodically.

If you'd like, I can open a PR or commit a change to adjust the workflow to only run on tags or PR merges instead of every push.
