Codemod scripts

- `convert-any-unused.js` — a small codemod that:
  - replaces `: any` with `: unknown` across TypeScript/JS files
  - prefixes declared or parameter identifiers starting with `unused` with an underscore (`_unused`)

Usage:

```bash
# Dry run (prints affected files, does not write):
npm run fix:types:dry

# Apply changes (writes files):
npm run fix:types
```

Review changes (git diff) before committing.

# Trading Automation Scripts

Utilities to manage local trading setup checks.

Commands (npm/yarn):

- `yarn trading:genkey` — generate Bitget RSA keypair and write to `secrets/` with secure perms.
- `yarn trading:publicip` — fetch and print your public IP using Node `fetch` or a Python fallback.
- `yarn trading:check` — run both checks and auto-generate keys if missing; exits non-zero on failure.
- `yarn trading:start` — same as `trading:check` (placeholder to start automation logic).

Notes:

- Keys are written to `secrets/bitget_public.pem` and `secrets/bitget_private.pem` with 0600 permissions.
- The public IP fetch prefers the built-in `fetch` (Node 18+) but falls back to `python scripts/get_public_ip.py` if needed.
- Tests are provided under `tests/scripts/auto_trading.test.js` and can be run with your normal test runner.
