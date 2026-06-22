# ALLSERVE.md - Service & Application Hosting Overview

## Live Applications

- `/qalpha` → `app/qalpha/page.tsx`
- `/qcity` → `app/qcity/page.tsx`
- `/qmoi-ai` → `app/qmoi-ai/page.tsx`
- `/qmoi-space` → `app/qmoi-space/page.tsx`
- `/qvillage` → `app/qvillage/page.tsx`

## Static Shells and Launchers

- `/index.html` → `public/index.html`
- `/pwa_apps/qmoi-ai/index.html` → `public/pwa_apps/qmoi-ai/index.html`
- `/pwa_apps/qmoi-ai/preview.html` → `public/pwa_apps/qmoi-ai/preview.html`
- `/pwa_apps/qmoi-space/index.html` → `public/pwa_apps/qmoi-space/index.html`
- `/q-alpha.html` → `public/q-alpha.html`
- `/qcity/index.html` → `public/qcity/index.html`
- `/qmoi-ai.html` → `public/qmoi-ai.html`
- `/qmoi-space.html` → `public/qmoi-space.html`

## Production Service Notes

- The repository serves primary UI shells through Next.js app routes under `app/` and `src/app/`.
- Static HTML shells under `public/` are compatibility launchers and fallbacks, not the canonical production UI source.
- The current live application shell routes are listed above and should be updated when app entrypoints or shell pages change.

## Current Service Boundaries

- Core production apps are served from the Next.js application routes in `app/`.
- Shared UI and theme state is managed through `app/components/` and `src/components/`.
- The service inventory here is intended to capture the current routing surface and live UI entrypoints.

## Notes
This file is generated from the current set of app and public entrypoint files in the repository.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T22:55:24.393910Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 35
- words: 190
- characters: 1537
- headings: 6
- links: 0
- images: 0
- tables: 0
- lion validation block: inserted
<!-- LION_VALIDATION_END -->
