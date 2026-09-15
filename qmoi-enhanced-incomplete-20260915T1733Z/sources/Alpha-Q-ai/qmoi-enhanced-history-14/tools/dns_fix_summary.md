# DNS Fix Summary

Generated: 2025-11-20 (automated)

This file is an automated summary produced from `tools/dns_links_report.json`.

Key points:

- Total links checked: see `tools/dns_links_report.json` (`total` field).
- Failures: entries with empty `resolved_ips` or non-2xx HTTP status; see the JSON for details.

Top recommended actions:

- Verify DNS/A/AAAA/CNAME records for hosts that do not resolve (empty `resolved_ips`).
- Replace [AUTOFIXED by Ollama at 2026-07-26T18:54:41.404932Z] domains (e.g., `qmoigateway.example.com`, `your-app.vercel.app`, `codespaces`) with correct production hostnames or remove them from public docs.
- For `http://` links, prefer `https://`; use `tools/apply_link_fixes.py` to run a conservative dry-run and proposals.
- After fixes, re-run `python3 tools/check_links_clean.py` to regenerate the reports and validate.

Files for review:

- `tools/dns_links_report.json` — full details per-URL.
- `tools/dns_links_report.md` — human-readable failures list.
- `tools/dns_docs_inventory.json` — inventory of docs and links found.

If you want, I can apply conservative fixes automatically (create branch + commit). Ask me to apply fixes and push or to open a PR.
