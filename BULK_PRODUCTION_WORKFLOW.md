# BULK PRODUCTION WORKFLOW

Generated: 2026-06-10T10:20:58.792672

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
- Total files scanned: 4688
- Files with markers: 99
- Total markers found: 787

## Marker summary
- PRODUCTION_READY_TAG: 312
- PRODUCTION_COMPLETE: 189
- vercel_config: 89
- production_logging: 65
- api.qmoi-enhanced.com: 45
- vercel_deploy: 26
- PRODUCTION_FIXED: 26
- FUNCTIONAL: 14
- vercel_error_list: 5
- NOT_IMPLEMENTED: 5
- PRODUCTION_READY: 3
- production_data: 3
- UNIMPLEMENTED: 2
- IN_PROGRESS: 2
- WIP_MARKER: 1

## Top files requiring bulk production attention
- all_md_files_clean.txt: 75 marker(s)
- eslint_fix_result.json: 68 marker(s)
- non_production_implementations_report.json: 54 marker(s)
- documentation_audit_details.json: 47 marker(s)
- ROOT_production_STATUS.md: 46 marker(s)
- ALLHEALTHS.md: 36 marker(s)
- all_md_files_current.txt: 26 marker(s)
- all_md_files.txt: 26 marker(s)
- ALLAUTO.md: 24 marker(s)
- quality_gate_report.json: 24 marker(s)
- nonprod_files_list.txt: 24 marker(s)
- API.md: 23 marker(s)
- eslint_src_fix.json: 21 marker(s)
- eslint_src_after_fix.json: 21 marker(s)
- autonomous_production_migration_engine.py: 19 marker(s)
- tools/dns_docs_inventory.json: 19 marker(s)
- current_nonprod_scan.txt: 17 marker(s)
- production_readiness_audit_report.json: 10 marker(s)
- verify_production_readiness.sh: 8 marker(s)
- deploy_production.sh: 8 marker(s)

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
- Total files scanned: 4688
- Total directories scanned: 775
- Files with nonproduction markers: 99
- Total markers found: 787
- Status: ⚠️ Nonproduction markers remain. Review undone.txt and MATCHES.txt.
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
- ... and 39 more tasks from resumefromhere.txt

## Tracking files
- resumefromhere.txt
- undone.txt
- MATCHES.txt
- MATCHES.md
- INSTANCES.md