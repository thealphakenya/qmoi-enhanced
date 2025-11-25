---
title: "Issue draft for QMOIDOWNLOADS.md"
generated: 2025-11-08T16:06:38.307818Z
---

# Review needed: QMOIDOWNLOADS.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
---
title: "QMOIDOWNLOADS"
qmoi_validation_frontmatter: true
---

# QMOIDOWNLOADS

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

D:\applications\Alpha-Q-ai>python downloadqmoiai.py
Checking all download links for reachability...
BROKEN: Qbrowser (skv) [win] => https://github.com/thealphakenya/qmoi-enhanced/releases/qbrowser/windows.exe (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/windows.exe (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81F38C0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.523634] Broken download link | {"app": "Qbrowser (skv)", "platform": "win", "url": "https://github.com/thealphakenya/qmoi-enhanced/releases/qbrowser/windows.exe", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/windows.exe (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81F38C0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
BROKEN: Qbrowser (skv) [mac] => https://github.com/thealphakenya/qmoi-enhanced/releases/qbrowser/mac.dmg (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/mac.dmg (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8314050>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.526085] Broken download link | {"app": "Qbrowser (skv)", "platform": "mac", "url": "https://github.com/thealphakenya/qmoi-enhanced/releases/qbrowser/mac.dmg", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/mac.dmg (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8314050>: Failed to resolve 'downloads.qmoi.app' ([
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
