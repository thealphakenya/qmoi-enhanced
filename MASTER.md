---
quantum-enabled: false
---

# MASTER.md - Master Role and Access Reference

## Overview
The `master` role has full QMOI ecosystem privileges, including system control, deployment, user management, and enterprise-grade PWA sync.
This document describes master-level access, feature gating, and production workflows.

## Master Role Capabilities
- Full access to all dashboards and admin tools
- Manage user permissions and role assignments
- Control QCity infrastructure and automation
- Publish and deploy QMOI AI and QMOI Space updates
- Authorize PWA installs, sync policies, and memory access
- Audit system health, logs, and security

## Permissions
Master permissions available in `app/hooks/useAuth.ts`:
- `general_chat`
- `system_control`
- `financial_management`
- `user_management`
- `qcity_access`
- `qvillage_access`
- `qmoi_space_access`
- `pwa_install`
- `memory_access`
- `build_control`

## production UI Behavior
- Access QCity dashboard at `/qcity`
- Access QVillage at `/qvillage`
- Access QMOI AI shell at `/qmoi-ai.html`
- Access QMOI Space shell at `/qmoi-space.html`
- Use the PWA install prompt and update manager for offline and install support

## Master Workflows
### System Control
1. Open QCity dashboard
2. Review live service and incident metrics
3. Execute role-specific actions for infrastructure control

### Deployment
1. Open QMOI AI or QMOI Space
2. Validate PWA install and update status
3. Push changes through production manifests and service worker updates

### User Management
1. Inspect user roles and access levels
2. Promote/demote between `master`, `sister`, `user`, and `guest`
3. Enforce permission restrictions

---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T22:55:27.285131Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 73
- words: 309
- characters: 2133
- headings: 10
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
