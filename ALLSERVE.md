# ALLSERVE.md - Service & Application Hosting Overview

## Live Applications
These are the actual live applications and routes in the repo:
- `/qmoi-ai` → `app/qmoi-ai/page.tsx`
- `/qmoi-space` → `app/qmoi-space/page.tsx`
- `/qcity` → `app/qcity/page.tsx`
- `/qvillage` → `app/qvillage/page.tsx`
- `/qalpha` → `app/qalpha/page.tsx`

## Static Shells and Launchers
The repository also includes fallback PWA shell entrypoints in `public/`:
- `/q-alpha.html`
- `/qmoi-ai.html`
- `/qmoi-space.html`
- `/qcity-dashboard.html`
- `/qcity-enterprise.html`
- `/qcity-complete.html`

## Production Service Notes
- The main interactive UI surfaces are served through Next.js app routes in `app/`.
- Static HTML shells in `public/` are compatibility wrappers, not the canonical live app pages.
- The production architecture is centered on real service routes, authentication, and user session management.
- `ALLSERVE.md` documents the real application delivery model, not stub pages.

## Current Service Boundaries
- `app/qmoi-ai/page.tsx` and `app/qmoi-space/page.tsx` are the primary live app pages for QMOI production workloads.
- `app/qcity/page.tsx` is the primary command center UI.
- `app/qalpha/page.tsx` is the aggregator learning and research shell.
- `app/qvillage/page.tsx` is the community workspace route.

## Notes
This file is updated to reflect the actual service and route state of the current repository.
