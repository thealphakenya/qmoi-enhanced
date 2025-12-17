# Link check CI

This repo includes a lightweight link/DNS checker that runs in CI and writes reports to `tools/`.

What runs

- `tools/check_links.py` — small stdlib-only script that scans Markdown files, resolves hostnames, performs HEAD/GET checks, and writes three outputs:
  - `tools/dns_docs_inventory.json`
  - `tools/dns_links_report.json`
  - `tools/dns_links_report.md`

How CI works

- A GitHub Actions workflow `.github/workflows/link-check.yml` runs the checker on pushes and pull requests that touch Markdown or `tools/` files. The artifacts are attached to the workflow run for inspection.

## Run locally

Use the workspace venv or system Python 3.10+ and run:

```bash
python tools/check_links.py --max-workers 8 --timeout 3
```

Notes

- The checker is intentionally conservative: short timeouts and a link cap to keep runs fast.
- The checker does not auto-modify files. Safe auto-fixes can be proposed in a later step and applied only after review.
