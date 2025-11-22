<!-- QMOI_OWNER_START -->
owner: master
role: master
updated_at: 2025-11-22T13:51:59Z
<!-- QMOI_OWNER_END -->

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

QMOI Secrets & Link tools

This folder contains small helper scripts that enable encrypted secret storage for QMOI and
updating repository links using the live ngrok tunnel.

Files:
- qmoi_secret_manager.py  - helper to generate/lookup master key, encrypt/decrypt secrets using Fernet
- qmoi_bootstrap_secrets.py - CLI to generate a master key and encrypt an ngrok token to `.qmoi/ngrok_token.enc`
- update_links_with_ngrok.py - replaces any ngrok links in files listed in `ALLMDFILESREFS.md` with the live ngrok URL found in `.qmoi/ngrok_tunnel.json` or `ngrok_tunnel.txt`.

Requirements (recommended):
- python3.10+
- Install dependencies for secrets tooling:

```bash
pip install -r scripts/requirements-secrets.txt
```

Bootstrap example (local machine):

```bash
python3 scripts/qmoi_bootstrap_secrets.py --token "<NEW_NGROK_TOKEN>" --store-keyring
# or if keyring not available:
python3 scripts/qmoi_bootstrap_secrets.py --token "<NEW_NGROK_TOKEN>"
# copy the printed export to your environment or CI secrets
```

After ngrok is running and `start_qmoi_ngrok.py` has written `.qmoi/ngrok_tunnel.json`:

Dry-run link update:

```bash
python3 scripts/update_links_with_ngrok.py --dry-run
```

Apply changes:

```bash
python3 scripts/update_links_with_ngrok.py --apply
```

Notes:
- For production use, integrate the master key into a cloud secret manager and modify `qmoi_secret_manager.py` to fetch from that service.
- Rotate the ngrok token if it had been accidentally committed.

<!-- QMOI_VALIDATION_START -->
{
  "file": "qmoi-enhanced/scripts/README_QMOI_SECRETS.md",
  "validated_at": "2025-10-26T20:51:24.871159Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": false,
      "detail": "No H1 title found"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": false,
  "summary": {
    "total_checks": 2,
    "passed": false
  }
}
<!-- QMOI_VALIDATION_END -->
