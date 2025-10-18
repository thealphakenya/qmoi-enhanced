Rotate exposed PAT (urgent)

Because a PAT was temporarily present in local files, rotate it immediately for the `thealphakenya` account.

Steps:

1. Go to https://github.com/settings/tokens (sign in as `thealphakenya`).
2. Revoke the old token `ghp_...` (if visible) or click the token you want to revoke and delete it.
3. Create a new token with the minimal `repo` scope required.
4. In this repository (https://github.com/thevictorofkenya/qmoi-enhanced-new-thevictorofkenya), go to Settings -> Secrets -> Actions and add `UPSTREAM_PAT` with the new token value.
5. Locally, remove any `.env` files and avoid committing tokens.

If you want, I can generate an annotated checklist or a script to validate the secret is present in the repo settings using the GitHub API (requires a token with appropriate scopes).
