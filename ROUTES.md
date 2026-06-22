# 🗺️ App Routes

## Canonical App Entry Points

After Phase 1 consolidation, all apps have single canonical entry point:

### QMOI-AI
- **Primary Route:** `/app/qmoi-ai`
- **File:** `app/qmoi-ai/page.tsx`
- **Features:** AI assistance, ML models, intelligent automation

### QMOI-Space
- **Primary Route:** `/app/qmoi-space`
- **File:** `app/qmoi-space/page.tsx`
- **Features:** Collaborative workspace, real-time sync

### QCity
- **Primary Route:** `/app/qcity`
- **File:** `app/qcity/page.tsx`
- **Features:** City/location services, local data

### QVillage
- **Primary Route:** `/app/qvillage`
- **File:** `app/qvillage/page.tsx`
- **Features:** Community interaction, social features

### QAlpha
- **Primary Route:** `/app/qalpha`
- **File:** `app/qalpha/page.tsx`
- **Features:** Alpha/testing features, experimental

## API Routes

All API routes consolidated in: `app/api/`

### Structure
```
app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── refresh/route.ts
├── apps/
│   ├── [appId]/route.ts
│   └── manifest/route.ts
├── components/
│   └── [componentId]/route.ts
└── health/
    └── route.ts
```

## Route Parameter Patterns

- `[appId]`: App identifier (qmoi-ai, qmoi-space, qcity, qvillage, qalpha)
- `[componentId]`: Component identifier
- `[userId]`: User identifier

## Status: ✅ COMPLETE
All routes consolidated to single canonical entry points.
No duplicate route handlers.
All apps accessible via /app/[appId] pattern.
