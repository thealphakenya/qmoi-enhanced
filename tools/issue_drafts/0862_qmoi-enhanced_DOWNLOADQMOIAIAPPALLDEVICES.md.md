---
title: "Issue draft for qmoi-enhanced/DOWNLOADQMOIAIAPPALLDEVICES.md"
generated: 2025-11-08T16:06:38.736350Z
---

# Review needed: qmoi-enhanced/DOWNLOADQMOIAIAPPALLDEVICES.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:41.986397Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:41.986397Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:41.986397Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

````
---
title: "QMOI AI App Downloads (All Devices)"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI AI App Downloads (All Devices)

## Unified Auto-Detect Download Script

You can use the unified script to auto-detect your platform and download the correct binary:

```bash
python downloadqmoiai.py
````

- The script will detect your OS and download the correct app to:
  - `Qmoi_downloaded_apps/<platform>/latest/`
  - `Qmoi_downloaded_apps/<platform>/v<version>/`
- You can also specify a platform manually:
  - `python downloadqmoiai.py windows`
  - `python downloadqmoiai.py mac`
  - `python downloadqmoiai.py linux` (choose deb or appimage)
  - etc.

## Per-Platform Download Scripts

You can also use the dedicated script for your platform:

- `python downloadqmoiaiapk.py` (Android)
- `python downloadqmoiaiexe.py` (Windows)
- `python downloadqmoiaidmg.py` (Mac)
- `python downloadqmoiaideb.py` (Linux DEB)
- `python downloadqmoiaiappimage.py` (Linux AppImage)
- `python downloadqmoiaiipa.py` (iOS)
- `python downloadqmoiaismarttvapk.py` (Smart TV)
- `python downloadqmoiaiimg.py` (Raspberry Pi)
- `python downloadqmoiaizip.py` (Chromebook)

All downloads are saved in:

```
Qmoi_downloaded_apps/<platform>/latest/
Qmoi_downloaded_apps/<platform>/v<version>/
```

## Direct Download Links (QMOI Official)

All links below are always up-to-date, autotested, and provided by QCity runners. If a download ever fails, it is automatically fixed and re-uploaded.

Every app can be downloaded, transferred (e.g. via USB), and installed offline on any device, without requiring a download or internet connection. All download links are autotested and auto-fixed by QCity runners, with fallback to ngrok or Freenom if needed (see QMOINGROK.md). Billing safety is ensured: no paid GitHub Actions or ru

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
```
