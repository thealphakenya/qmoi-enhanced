# Low-bandwidth / Offline-first Usage

This document explains how to open and use the repository in a Codespace or browser with minimal bandwidth usage.

1. Apply Lion settings:

```bash
bash scripts/apply_lion_settings.sh
```

2. Build docs cache:

```bash
python3 scripts/lion_scan_and_cache.py
```

3. Open cached docs from `docs_cache/` in the editor. Remote assets are stored in `vendor/` when available.

4. To fully avoid network activity, run `scripts/vendor_plan.sh` on a trusted CI/QCity runner and upload the `vendor/` directory as artifacts for Codespace consumption.

Notes:
- Aggressive offline: set `.lion/config.json` offline_mode=true and run vendor steps on CI.
- Conservative (cache-first): offline_mode=false and allow on-demand fetches.
