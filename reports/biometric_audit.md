Biometric Auth Audit

Scanned references to `BiometricAuth` (quick pass).

Found locations:
- components/auth/BiometricAuth.tsx
- components/BiometricAuth.tsx
- COMPONENT_SERVING_TECHNICAL_DETAILED_MAP.md
- DUPLICATE_COMPONENTS.txt
- production_scan_1779555694.json (index entries)
- eslint_report_after_fix2_post.json (pages importing and using BiometricAuth)
- eslint_report.json (archived copies)
- resumefromhere.txt (planned integration note)

Immediate recommendations:
- Consolidate duplicate components: remove/merge `components/BiometricAuth.tsx` vs `components/auth/BiometricAuth.tsx`.
- Fix syntax and placeholder corruption in `components/auth/BiometricAuth.tsx` (logger, stray text like "fully implemented").
- Normalize and export a single `BiometricAuth` API with clear props: `onAuthSuccess`, `onAuthFailure`, `onEnroll`, `onLogout`, `userContext`.
- Add server-side endpoints for session creation and audit logging: `/api/auth/biometric`, `/api/qmoi/session`, `/api/audit/log`.
- Instrument centralized logging to include `userId`, `sessionId`, `interface`, `biometric_method`, and `confidence`.
- Update top-level pages (login, admin, master) to import consolidated `BiometricAuth` and hook into login/logout flows.
- Add unit/integration tests for biometric enrollment, authentication, and logout flows.

Next steps I'll take if you confirm:
1. Fix and normalize `components/auth/BiometricAuth.tsx` (syntax/logic cleanup).
2. Replace duplicates and update importing pages.
3. Add audit logging integration and session APIs (stubs + docs).
4. Update docs: sister, master, user .md files describing usage, privacy, and production logging.

Would you like me to start with step 1 (repairing `components/auth/BiometricAuth.tsx`)?
