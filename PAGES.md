# PAGES.md

## Active App Page Inventory
- app/admin/master/activity/page.tsx
- app/admin/master/login/page.tsx
- app/admin/master/page.tsx
- app/admin/master/security/page.tsx
- app/admin/master/settings/page.tsx
- app/admin/page.tsx
- app/dev/page.tsx
- app/devices/page.tsx
- app/friendship/page.tsx
- app/master/email/page.tsx
- app/master/links/page.tsx
- app/master/tracks/page.tsx
- app/page.tsx
- app/qcity/page.tsx
- app/qmoi-ai/page.tsx
- app/qmoi-space/page.tsx
- app/qalpha/page.tsx
- app/qvillage/page.tsx

## Notes
This file tracks the active page entrypoints used by the Next.js app router.

### Live App Routes
- `/qmoi-ai`
- `/qmoi-space`
- `/qcity`
- `/qalpha`
- `/qvillage`

### Production Routing
The actual production UI is served through the `app/` directory routes above. Static HTML shells under `public/` exist for compatibility, but the canonical user experience is built from the Next.js `app/` pages.
