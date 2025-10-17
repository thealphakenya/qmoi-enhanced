#!/usr/bin/env python3
"""Bootstrap QMOI secrets: generate master key and encrypt ngrok token.

Usage:
  python scripts/qmoi_bootstrap_secrets.py --token <NGROK_TOKEN> [--store-keyring]

If --store-keyring is provided and keyring is available, the master key will be saved
in the OS keyring under service 'qmoi_master' and username 'master-key'. Otherwise,
the script prints an export line you can set as QMOI_MASTER_KEY in your environment.
"""
import argparse
import base64
from pathlib import Path
from scripts.qmoi_secret_manager import generate_master_key, store_master_key_in_keyring, encrypt_secret


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--token", required=False, help="Ngrok auth token to encrypt")
    p.add_argument("--github-token", required=False, help="GitHub personal access token to encrypt (optional)")
    p.add_argument("--store-keyring", action="store_true", help="Store master key in OS keyring if available")
    p.add_argument("--create-git-helper", action="store_true", help="Create a git-credential helper file that uses the encrypted GitHub token")
    p.add_argument("--confirm-write", action="store_true", help="Explicitly confirm writing tokens to disk (safety flag)")
    args = p.parse_args()

    key = generate_master_key()

    if args.store_keyring:
        ok = store_master_key_in_keyring(key)
        if ok:
            print("Stored master key in OS keyring (service: qmoi_master)")
        else:
            print("Failed to store in keyring. You can set QMOI_MASTER_KEY environment variable manually.")

    # Always print the env export in case user wants to set it instead
    print("Export this to your environment if not using keyring (base64):")
    print("export QMOI_MASTER_KEY=\"{}\"".format(key.decode()))

    # Encrypt the ngrok token to .qmoi/ngrok_token.enc (if provided)
    if args.token:
        out = Path(".qmoi") / "ngrok_token.enc"
        # safety: avoid accidentally encrypting tokens provided via chat copy/paste. Require explicit confirm-write.
        if args.token.startswith('ghp_') and not args.confirm_write:
            print("Refusing to write token that looks like a GitHub PAT without --confirm-write. Use --confirm-write to override.")
        else:
            encrypt_secret(args.token, str(out))
        print(f"Encrypted ngrok token written to {out}")
    else:
        print("No ngrok token provided; skipping ngrok encryption.")

    # Encrypt GitHub token if provided
    if args.github_token:
        from scripts.qmoi_secret_manager import encrypt_named_secret

        # safety: require explicit confirm-write to persist GH tokens
        if args.github_token.startswith('ghp_') and not args.confirm_write:
            print("Refusing to write GitHub token without --confirm-write. This prevents accidental commit of secrets. Use --confirm-write to override.")
            gh_path = None
        else:
            gh_path = encrypt_named_secret(args.github_token, "github")
            print(f"Encrypted GitHub token written to {gh_path}")

        if args.create_git_helper:
            # create a simple git credential helper script that reads the decrypted token
            helper = Path(".qmoi") / "git-credential-qmoi.sh"
            helper.parent.mkdir(parents=True, exist_ok=True)
            helper.write_text("""#!/usr/bin/env bash
read -r url
# QMOI git credential helper: prints username and password for https pushes
GHTOKEN=$(python - <<'PY'
from scripts.qmoi_secret_manager import get_named_secret
print(get_named_secret('github') or '')
PY
)
if [ -n "$GHTOKEN" ]; then
  # username can be x-access-token for GitHub
  echo "username=x-access-token"
  echo "password=$GHTOKEN"
fi
""")
            helper.chmod(0o700)
            print(f"Created git credential helper at {helper}; configure git with:\n  git config --global credential.helper '{helper}'")
    else:
        print("No GitHub token provided; skipping GitHub token encryption.")


if __name__ == '__main__':
    main()
