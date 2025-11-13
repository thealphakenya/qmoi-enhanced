# Verification Playbook

This repository contains many documented monetary claims (Pesapal, M-Pesa, bank balances, MEGAVAULT, etc.). This playbook explains how to treat these claims and how to verify them safely.

Goals
- Provide a repeatable, auditable verification process for every monetary claim found in the repo.
- Mark claims as VERIFIED or UNVERIFIED and record the verification artifact (API response, snapshot, signed note).

How this PR works
- This branch adds:
  - `VERIFICATION.md` (this file) — the playbook and checklist.
  - `tools/annotate_unverified.py` — safe helper that reads `reports/balance_matches.json` and writes annotated copies into `unverified_annotations/` so reviewers can inspect suggested `UNVERIFIED` annotations without modifying original source files.
  - `unverified_annotations/` — generated annotated-file copies (if you run the script).

Why annotated copies?
- Editing original files automatically is risky. Annotated copies let reviewers inspect and approve changes before applying them.

Verification steps (manual or CI)
1) Provide secrets to CI or an operator-managed vault. Required secrets (examples):
   - `PESAPAL_CONSUMER_KEY`, `PESAPAL_CONSUMER_SECRET`, `PESAPAL_ENVIRONMENT`
   - `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`
   - `BANK_API_TOKEN` (if your bank provides an API)
   - `ACCOUNTING_API_TOKEN` (QuickBooks, Xero, or equivalent)
   - `QMOI_GH_TOKEN` — for release operations

2) Run credential validation (example):

```bash
# decrypt local vault (if used)
python3 scripts/secret_store.py decrypt <passphrase>

# run validate_all_credentials.py (existing script) to detect missing placeholders
python3 scripts/validate_all_credentials.py
```

3) Run verification helper (once implemented or after you add secrets):

```bash
# (placeholder) run tools/verify_balances.py --sources reports/balance_matches.json --output reports/balance_verification.json
```

4) Produce signed verification artifacts (signed JSON, PDF, or bank statement) and store them in `reports/verifications/`.

5) Apply verified changes: replace `UNVERIFIED` annotations with `VERIFIED (source: reports/verifications/<file>)` and open a PR to merge.

Running the annotator (safe):

```bash
python3 tools/annotate_unverified.py --matches reports/balance_matches.json --out unverified_annotations
```

This will create `unverified_annotations/<path>` files that contain a short header listing the detected amounts and a recommended `UNVERIFIED` badge that maintainers can copy into the original files or accept via a follow-up patch.

Applying annotations (operator):
- Inspect `unverified_annotations/` and when ready, manually apply the suggested changes to the original files or run a curated script that applies changes only after human review.

Security
- Never paste secrets in chat. Use GitHub Actions secrets or an encrypted vault (`.qmoi/secrets.enc`) and keep keys rotated.

Contact
- The `master` persona can provide guidance or approve applying credentials. Use the `qmoi` local server to request master approvals before applying live verification.
