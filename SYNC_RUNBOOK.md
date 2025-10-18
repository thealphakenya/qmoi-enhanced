Sync runbook
==============

Required secret: UPSTREAM_PAT

- The `UPSTREAM_PAT` secret must be a PAT that belongs to an account with write access to the upstream repository `thealphakenya/qmoi-enhanced`.
- Classic PAT: must include `repo` scope (full). Fine-grained PAT: must include Repository access -> Code -> Read & write (or Write) for the upstream repo.
- If the upstream repo belongs to an organization, ensure the token owner has SSO access enabled and approved for that org.

How the workflow works (summary)
- The workflow creates a sync branch in the public repo and pushes it to `origin`.
- It then attempts to create a PR on the upstream with head set to `<public-owner>:<branch>`.
- If PR creation fails, logs and API responses are uploaded as an artifact `sync-debug-<sha>`.

Rotation and emergency steps
- Rotate exposed tokens immediately if any PAT was leaked. Use the GitHub UI to revoke the token and create a new one.
- Update the secret in repository Settings -> Secrets & variables -> Actions with the new PAT name `UPSTREAM_PAT`.

Debugging tips
- Check Actions run summary and artifacts named `sync-debug-<sha>` for HTTP responses and curl outputs.
- Verify the token via: curl -H "Authorization: token <PAT>" https://api.github.com/repos/thealphakenya/qmoi-enhanced
