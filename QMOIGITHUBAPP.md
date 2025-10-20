## Required secrets and how to obtain them (QMOI & GitHub App)

QMOI and the GitHub App require a few secrets for production operation. Below are the names QMOI expects, why they are needed, and how to obtain them.
- `GITHUB_TOKEN` (Personal Access Token or fine-grained token)
	- Purpose: used by CI and QMOI automation to push commits, create releases, and manage repo-level resources.
	- How to get: Sign in to GitHub as the account that will perform automation (the account that owns or has write access to `thealphakenya/qmoi-enhanced`) → Settings → Developer settings → Personal access tokens → Generate new token. Give it at least repo:contents and repo:status (or Code: read & write in fine-grained tokens). Copy the token value immediately. Store it in `GITHUB_TOKEN` repository secret or in your local `.env` for Codespaces.
- `QMOI_TOKEN`
	- Purpose: an internal automation token used by QMOI workflows and orchestrator services to authenticate calls between QMOI components. It is used in place of the user's PAT for internal operations in some scripts.
	- How to get: QMOI can generate this token for you locally; it's a long random secret. You can also create a dedicated machine/service token in your secrets manager and add it as `QMOI_TOKEN` in repository secrets. For local development, QMOI writes a generated `QMOI_TOKEN` into `.env` if not present.
- `QMOI_WEBHOOK_SECRET`
	- Purpose: the secret used to validate GitHub webhook payloads (`X-Hub-Signature-256`).
	- How to get: generate a random 32+ character secret (openssl rand -hex 32) and add it as a repository secret named `QMOI_WEBHOOK_SECRET` and also put it in your App configuration when creating the GitHub App webhook URL.
- GitHub App private key (`QMOI_APP_PRIVATE_KEY` or App PEM)
	- Purpose: required if you create a GitHub App (recommended for least-privilege automation). QMOI uses the private key to create a JWT and trade it for installation tokens.
	- How to get: when you create the GitHub App in Developer Settings, download the private key (PEM) and store the PEM contents as a repository or organization secret named `QMOI_APP_PRIVATE_KEY` (or store it in your KMS and provide access to QMOI runtime).
Notes and security
- Prefer storing these secrets in GitHub repository or organization secrets (Settings → Secrets & variables → Actions) or in a dedicated KMS (AWS Secrets Manager, Azure Key Vault) rather than in repository files. Local `.env` storage is fine for Codespaces/dev but avoid committing `.env` to git.
- QMOI will refuse to log secret values; it only reports presence, last-checked timestamps, and hashes for verification.

If you want me to write the `GITHUB_TOKEN` you supplied into a local `.env` now and push the repository changes, confirm and I'll do that (I will not display the token in the chat). I can also auto-generate a `QMOI_TOKEN` and write it into `.env`.
# QMOI GitHub App design

This file outlines the GitHub App used to integrate QMOI with repository events. It describes required permissions, installation steps, webhook URL templates, and security considerations. The guidance below assumes you may not yet have the App created — follow the steps and then install the App into the `qmoi-enhanced` repository.

## Recommended webhook URL

Use a stable HTTPS endpoint so QMOI can receive events. The production webhook should be a publicly routable URL under your domain and protected by a verification secret. Examples:

- Production (recommend):

	https://qmoigateway.example.com/api/github/webhook

- Development (temporary, use ngrok or QMOI-managed tunnel):

	https://<your-ngrok-subdomain>.ngrok.io/api/github/webhook

When you create the GitHub App, enter the webhook URL above (replace example.com/ngrok id) and set the webhook secret; store that secret in the repository secret `QMOI_WEBHOOK_SECRET`.

## Permissions required (minimum)

- Repository contents: read & write (for pushing automated changes)
- Actions: read & write (to manage workflow runs where needed)
- Pull requests: read & write (if QMOI will create PRs)
- Issues: read & write (optional, for auto-issues)
- Secrets: read & write (if the App will manage secrets via its installation tokens)

Grant the least privilege required. If QMOI only needs to create PRs and comment, limit to those permissions.

## Installation steps (detailed)

1. In GitHub (thealphakenya account) go to Settings → Developer settings → GitHub Apps → New GitHub App.
2. Choose a name like `QMOI Automation` and provide the homepage and callback URL (if using App OAuth flows).
3. Set the Webhook URL to the value above and set a Webhook Secret (random 32+ chars). Record the secret; store it as `QMOI_WEBHOOK_SECRET` in repo secrets.
4. Under Permissions & events, select the minimum permissions listed earlier and subscribe to the events QMOI needs (e.g., push, pull_request, workflow_run, issue_comment).
5. Create the App. Download the private key — store it in your secure secrets manager (e.g., GitHub Actions secrets, AWS Secrets Manager). For GitHub Actions, you can store the App's PEM in a repository or organization secret called `QMOI_APP_PRIVATE_KEY` (encrypted).
6. Install the App on the `qmoi-enhanced` repository (or org if you need organization-wide access).

## Authenticate using the App

1. Use the private key to generate a short-lived JWT. Use that JWT to call the App API to obtain an installation access token for the repository installation. The installation token is what QMOI will use to call REST APIs on behalf of the App installation.
2. Installation tokens expire (usually 1 hour) — QMOI must refresh them automatically.

## Webhook verification

- GitHub sends the header `X-Hub-Signature-256`. Verify this using your webhook secret. Reject requests with invalid signatures.
- Acknowledge events quickly (HTTP 200) and enqueue them for processing. Use idempotent handlers keyed by `X-GitHub-Delivery`.

## Security and operations

- Store private keys and webhook secrets in your organization's secrets manager. If you must store keys in repo secrets, use organization-level secrets with strict access control.
- Rotate private keys periodically and revoke old keys.
- Log all actions the App performs and make logs auditable.

## Example webhook endpoint (Flask/Python minimal)

```py
from flask import Flask, request, abort
import hmac, hashlib, os

app = Flask(__name__)
WEBHOOK_SECRET = os.environ.get('QMOI_WEBHOOK_SECRET', '')

def verify_signature(data, signature):
		mac = hmac.new(WEBHOOK_SECRET.encode('utf-8'), msg=data, digestmod=hashlib.sha256)
		expected = 'sha256=' + mac.hexdigest()
		return hmac.compare_digest(expected, signature)

@app.route('/api/github/webhook', methods=['POST'])
def webhook():
		sig = request.headers.get('X-Hub-Signature-256', '')
		if not verify_signature(request.data, sig):
				abort(401)
		# enqueue payload for processing
		return '', 200
```

## Webhook URL to use

Use the following webhook URL templates depending on environment. Replace `thealphakenya.com` with your production DNS when ready.

- Production (recommended):

	https://qmoigateway.thealphakenya.com/api/github/webhook

- Staging / Codespace (internal):

	https://codespaces.<your-username>.github.dev/api/github/webhook

- Development (ngrok):

	https://<your-ngrok-id>.ngrok.io/api/github/webhook

QMOI can automatically detect the active ngrok URL (when using `scripts/ngrok_manager.py`) and update dev docs or create PRs to replace placeholders. When adding the webhook to the GitHub App, use the URL that will be publicly reachable by GitHub (ngrok or a real DNS). Store the webhook secret in `QMOI_WEBHOOK_SECRET` repository secret.

## Link validation and autoupdate guidance

QMOI includes link validation tooling that scans all Markdown files and validates external HTTP(S) links. The recommended production webhook URL above is the canonical endpoint QMOI will use; if the endpoint is not yet live, QMOI will place a placeholder message in the Markdown where the link will appear and surface the validation status in `ALLERRORS.md`.

How validation works (high level):
- QMOI runs `scripts/validate_links.py` to find all `http://` and `https://` links in the repo's Markdown files.
- For each link QMOI performs a HEAD request (falls back to GET if HEAD not allowed) with a short timeout and records HTTP status codes.
- Links returning 200-399 are marked OK. 4xx/5xx or network errors are recorded in `ALLERRORS.*` and pushed to the master dashboard for review.

Autoupdate behavior:
- Where possible QMOI attempts to repair stale internal links by searching the repo for likely targets and updating relative paths. This is best-effort and will create a pull request when an automated safe fix is found.
- For external links that are missing, QMOI will (optionally) query the Wayback Machine or package registry redirects to attempt to locate the replacement URL and propose a PR with the updated link.

Security note: link validation performs outbound HTTP(S) requests. In secure or air-gapped environments, disable automatic validation and run it only in trusted networks.

## Notes about secrets and env management

QMOI needs to safely manage several secrets (App private key, webhook secret, installation tokens). Prefer using a centralized KMS (AWS Secrets Manager, Azure Key Vault, or GitHub Secrets) over storing secrets in repo files. The repository workflows created by QMOI will expect `QMOI_TOKEN` and `QMOI_WEBHOOK_SECRET` to be present as repository secrets.

---

If you want, I can also add example scripts to generate JWTs and exchange them for installation tokens and wire those into CI. Let me know and I will add `scripts/github_app_auth.py` and a CI step to refresh tokens automatically.
