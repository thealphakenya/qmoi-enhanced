<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:01.054710Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [production READY] this file has no remaining production markers
# Link check CI

This repo includes a robust link/DNS checker that runs in CI and writes reports to `tools/`.

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

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:51Z

---
*This document is maintained by QMOI's autonomous evolution system*
