# QMOI Database System

## Overview
QMOI Database is a self-enhancing, Supabase-like database system designed for the QMOI AI platform. It provides real-time, secure, and extensible data storage and management, always running in Colab or as a separate service, with full control by QMOI and master-only admin access.

## Features
- **Supabase-like API:** RESTful and real-time endpoints for CRUD, auth, storage, and triggers.
- **Auto-Enhancement:** QMOI can automatically add tables, columns, triggers, and features as needed.
- **Colab Integration:** Runs in Google Colab, isolated from the main device, and auto-starts with QMOI.
- **Admin UI:** Master-only dashboard in QCity for schema, data, and feature management.
- **Security:** Only the master can access admin features; all access is logged.
- **Performance:** Runs separately to avoid impacting device performance.

## Architecture
- **Backend:** Node.js/TypeScript API (SQLite for Colab/local, Postgres for cloud).
- **ORM:** Prisma/TypeORM/Drizzle for schema and migrations.
- **Frontend:** QCity QMOI Database Dashboard (React/Next.js, master-only access).

## API Endpoints
- `/api/qmoi-database/tables` - List, create, and manage tables
- `/api/qmoi-database/rows` - CRUD operations on table rows
- `/api/qmoi-database/schema` - Schema introspection and migration
- `/api/qmoi-database/auth` - User and role management
- `/api/qmoi-database/trigger` - Add/modify triggers and functions
- `/api/qmoi-database/realtime` - Real-time data updates (WebSocket/SSE)

## Colab Integration
- QMOI auto-starts the database service in a Colab cell.
- Uses SQLite for persistence; can sync to cloud if needed.
- Service runs in isolation, with resource limits to avoid device impact.

## Auto-Enhancement
- QMOI monitors usage and schema, auto-adding features as needed.
- Self-migrates and logs all changes for master review.

## Admin UI (QCity)
- Master-only dashboard for full DB control.
- Features: Table/row management, schema editor, logs, feature toggles.

## Security
- Only master can access admin UI and advanced features.
- All actions are logged and auditable.

## Extending
- Add new endpoints, triggers, or features by updating the backend API and UI.
- QMOI can propose and auto-apply enhancements.

## New Features

### QMOI Free Will & Autonomous Operation
- QMOI can propose and execute actions (self-updates, optimizations, project management, media downloads, etc.)
- All actions are logged and visible to master users.

### Media Downloading & Watching
- QMOI can search, download, and organize public domain or user-provided media (series, movies, animation).
- Media Manager UI for browsing, downloading, and watching.
- Copyright compliance enforced.

### Extensible Project Management
- QMOI can join/manage new project types via plugins/modules.
- Master dashboard for project management.

### Master Log Visibility in QI
- All QMOI actions are logged.
- Master-only Activity Log panel in QI, filterable by type/time/severity.

### General Settings & Controls
- Master can configure QMOI autonomy, allowed actions, media/project permissions, etc.

---

## TODO
- [ ] Implement backend endpoints for media, logging, and project management
- [ ] Implement QMOI Media Manager, Project Dashboard, Settings Panel UIs
- [ ] Connect Activity Log panel to backend
- [ ] Add master controls for autonomy and permissions

For implementation details, see the backend API and QCity UI source code. 