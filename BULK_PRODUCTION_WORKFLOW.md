# BULK PRODUCTION WORKFLOW

Generated: 2026-06-22T15:52:23.896370

This file centralizes repository-wide production readiness work and helps you apply bulk fixes across many files at once.

## How to use
- Run `npm run resume:continue` or `python3 scripts/auto_continue_resumefromhere.py` to execute the bulk fixer and refresh the resume tracker.
- Run `python3 scripts/thorough_production_scanner.py` to scan everything, regenerate undone.txt, and refresh MATCHES files.
- Use `npm run resume:watch` to keep resumefromhere.txt auto-updated while you implement fixes.
- Open `undone.txt` and `MATCHES.txt` to identify files and markers requiring production implementation.
- Prioritize files with the highest marker counts and the most critical production markers first.
- After applying fixes, re-run the scanner and resume workflow until all markers are cleared.

## Bulk work principles
- Keep auth, theme, and universal app state consistent across QMOI shells.
- Replace nonproduction markers with actual implementation, not temporary stubs.
- Preserve documentation and synchronization across API, ROUTES, and style docs.
- Use safe, deterministic operations and avoid destructive changes without review.

## Scan summary
- Total files scanned: 4736
- Files with markers: 0
- Total markers found: 0

## Task sources
### Tasks from 14.txt
- BUILD UNIVERSAL AUTH/BIOMETRIC FEATURES
- Ensure login/logout/register work across all QMOI apps
- Implement forgot-password, forgot-email, reset-password flows
- Add email-verification functionality
- Integrate biometric authentication
- Implement session-refresh mechanism
- Make auth universal with consistent UI and naming
- UNIFIED AUTH ACROSS ALL APPS
- QMOI AI: /qmoi-ai
- QMOI Space: /qmoi-space
- QCity: /qcity
- QVillage: /qvillage
- QAlpha: /qalpha
- Universal Portal: /universal (first entry point)
- DOCUMENTATION SYNCHRONIZATION
- API.md
- APIs_1.md
- ENDPOINTS.md
- ROUTES.md
- Update all app-specific style docs (QMOIAIUI.md, QMOISPACEUI.md, QCITYUI.md, QVILLAGEUI.md, QALPHAUI.md)
- ... and 225 more tasks from 14.txt

### Tasks from resumefromhere.txt
- Total files scanned: 4736
- Total directories scanned: 809
- Files with nonproduction markers: 0
- Total markers found: 0
- Status: ✅ production-ready. No nonproduction markers remain.
- Open undone.txt for detailed marker locations.
- Update identified files with production implementations.
- Re-run this scanner after fixes.
- Keep MATCHES.txt and MATCHES.md synchronized.
- Run `npm run resume:continue` or `python3 scripts/auto_continue_resumefromhere.py` to execute the bulk fixer and refresh the resume tracker.
- Run `python3 scripts/auto_continue_resumefromhere_loop.py --until-clean` or `npm run resume:watch` to keep working in bulk automatically until the scan is clean.
- Run `python3 thorough_production_scanner.py` or `python3 scripts/thorough_production_scanner.py` to scan every file, refresh undone.txt, and regenerate MATCHES files.
- Only pause when the scan reports zero nonproduction markers.
- Address high-priority files from undone.txt first, then re-run the scanner.
- Preserve theme, auth, and universal app consistency during bulk production fixes.
- BUILD UNIVERSAL AUTH/BIOMETRIC FEATURES
- Ensure login/logout/register work across all QMOI apps
- Implement forgot-password, forgot-email, reset-password flows
- Add email-verification functionality
- Integrate biometric authentication
- ... and 24 more tasks from resumefromhere.txt

## Tracking files
- resumefromhere.txt
- undone.txt
- MATCHES.txt
- MATCHES.md
- INSTANCES.md

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T16:03:54.219899Z
- production status: ✅ production-ready
- status tags: production, production-ready
- lines: 78
- words: 483
- characters: 3575
- headings: 8
- links: 0
- images: 0
- tables: 0
- lion validation block: inserted
<!-- LION_VALIDATION_END -->
