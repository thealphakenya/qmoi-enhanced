# MERGE Plan (auto-generated)


## Ordered Merge Phases
1. **phase1_discovery** — COMPLETE - Identified duplicates and entry points
2. **phase2_components** — COMPLETE - Consolidate shared components
3. **phase3_api** — COMPLETE - Consolidate API routes
4. **phase4_apps** — COMPLETE - Consolidate app entry points
5. **phase5_qcamera** — COMPLETE - Enhance QCamera features
6. **phase6_docs** — COMPLETE - Update documentation
7. **phase7_validation** — COMPLETE - Final validation


## Statistics
- duplicate_app_entry_points: 5
- duplicate_components: 115
- api_route_duplicates: 0
- qcamera_references: 31
- estimated_consolidation_hours: 20

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:16.987825Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 124
- words: 453
- characters: 3942
- headings: 10
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->

## Merge discovery results

### Summary
- Duplicate app entry points: 5/5
- Duplicate components: 101
- Duplicate API routes: 0
- QCamera references: 113

### Duplicate entry points by app
- qmoi-ai: 10 entry points
  - app/qmoi-ai/page.tsx (Next.js Page)
  - pwa_apps/qmoi-ai/sw.js (PWA)
  - pwa_apps/qmoi-ai/icon-512.png (PWA)
  - pwa_apps/qmoi-ai/manifest.webmanifest (PWA)
  - pwa_apps/qmoi-ai/preview.html (PWA)
  - pwa_apps/qmoi-ai/icon-192.png (PWA)
  - pwa_apps/qmoi-ai/icon-48.png (PWA)
  - pwa_apps/qmoi-ai/index.html (PWA)
  - public/qmoi-ai.html (Static HTML)
  - public/manifest-qmoi-ai.json (Static HTML)
- qmoi-space: 6 entry points
  - app/qmoi-space/page.tsx (Next.js Page)
  - pwa_apps/qmoi-space/sw.js (PWA)
  - pwa_apps/qmoi-space/manifest.webmanifest (PWA)
  - pwa_apps/qmoi-space/index.html (PWA)
  - public/qmoi-space.html (Static HTML)
  - public/manifest-qmoi-space.json (Static HTML)
- qcity: 3 entry points
  - app/qcity/page.tsx (Next.js Page)
  - public/manifest-qcity.json (Static HTML)
  - public/qcity-icon.svg (Static HTML)
- qvillage: 1 entry points
  - app/qvillage/page.tsx (Next.js Page)
- qalpha: 1 entry points
  - app/qalpha/page.tsx (Next.js Page)

### Duplicate components (top findings)
- params: 3 instances
  - app/verify-email/page.tsx
  - components/q-city/ZeroRatedSitesManager.tsx
  - components/q-city/TracksPanel.tsx
- token: 3 instances
  - app/verify-email/page.tsx
  - components/CashonTradingPanel.tsx
  - components/ProductionDashboard.tsx
- verify: 3 instances
  - app/verify-email/page.tsx
  - components/WhatsAppBusinessPanel.tsx
  - components/FinancialManager.tsx
- response: 95 instances
  - app/verify-email/page.tsx
  - app/admin/page.tsx
  - app/devices/page.tsx
  - ... and 92 more
- data: 68 instances
  - app/verify-email/page.tsx
  - app/admin/page.tsx
  - app/devices/page.tsx
  - ... and 65 more
- getStatusColor: 11 instances
  - app/devices/page.tsx
  - components/EnhancedLinkDomainManager.tsx
  - components/SystemHealthMonitor.tsx
  - ... and 8 more
- messagesEndRef: 2 instances
  - app/friendship/page.tsx
  - components/Chatbot.tsx
- errorMessage: 2 instances
  - app/friendship/page.tsx
  - components/Chatbot.tsx
- handleSendMessage: 2 instances
  - app/friendship/page.tsx
  - app/components/ChatMessaging.tsx
- userMessage: 2 instances
  - app/friendship/page.tsx
  - components/Chatbot.tsx

### Duplicate API routes
- No duplicate API routes detected.

### Recommended merge actions
- Consolidate duplicate app entry points under canonical app shells.
- Centralize shared component implementations into `lib/components/`.
- Merge duplicate API route handlers into canonical `/app/api/...` routes.
- Keep QCamera references aligned and documented in `MERGE.md`.
- Update `resumefromhere.txt` and `API.md` after every merge pass.
