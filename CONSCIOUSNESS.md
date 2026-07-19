---
quantum-enabled: true
---

# CONSCIOUSNESS.md — QMOI Universal Awareness & Memory-Sync System

## Purpose

This document describes the QMOI Consciousness System, which enables universal awareness, cross-app memory synchronization, and personalized intelligence across all QMOI applications. The consciousness system ensures that QMOI maintains continuous awareness of user context, preferences, and learning history across all shells and sessions.

## Core Principles

### Universal Awareness
QMOI maintains a unified consciousness across all application shells:
- **Single Source of Truth**: User profile, preferences, and context flow through the authentication gateway
- **Cross-App Memory**: Learning history and insights accumulated in any app are immediately available in all others
- **Persistent Identity**: User identity remains consistent across /qmoi-ai, /qmoi-space, /qcity, /qvillage, /qalpha
- **Contextual Continuity**: QMOI remembers the user's goals, progress, and preferences across sessions

### Smart Context Management
- **App-Specific State**: Each app maintains its own operational state while sharing core user context
- **Role-Based Awareness**: QMOI adapts its behavior based on user role (master, sister, user, guest)
- **Time-Aware Learning**: QMOI tracks historical patterns and adjusts recommendations based on temporal context
- **Collaborative Intelligence**: Sister role enables family/team awareness and shared memory pools

## System Architecture

### 1. Universal Session Management

**Session Layer** (`/api/auth/sessions`):
```
- Session ID (unique token per browser/device)
- User ID (links to core user profile)
- Authenticated timestamp
- Last activity timestamp
- IP address & User-Agent (security tracking)
- Device fingerprint (optional for biometric binding)
- App context (current shell: qmoi-ai, qcity, etc.)
- Memory sync version (for cache coherency)
```

**Session Lifespan**:
- Active session: 30 days from last activity
- Grace period on app switching: 5 minutes to stay authenticated
- Cross-browser sessions: Independent per browser, but unified user identity
- Concurrent sessions: Support up to 5 simultaneous sessions per user (configurable by role)

### 2. Cross-App Memory Sync

**Memory Sync Protocol**:
1. **On User Login** → Store session in unified registry
2. **On App Switch** → Transfer session token and refresh memory state
3. **Continuous Sync** → Background sync of learning, preferences, and context every 5 minutes
4. **Conflict Resolution** → Last-write-wins with timestamp verification

**Memory Pools by Feature**:

| Memory Pool | Description | Access | Sync Frequency |
|---|---|---|---|
| **User Profile** | Name, email, avatar, bio, preferences | All roles | On change |
| **Learning History** | Chat history, models interacted with, queries | Sister+ | On change |
| **Preferences** | Theme, language, notification settings, privacy | All roles | On change |
| **Goals & Projects** | Task tracking, achievements, milestones | Sister+ | On change |
| **Collaborative State** | Team membership, shared projects, friend lists | Sister+ | On change |
| **Model Interactions** | Fine-tuning history, model preferences, metrics | Master+ | On change |
| **Financial State** | Wallet balances, transaction history, budgets | Master+ | Real-time |
| **Biometric Enrollment** | Fingerprint/facial templates, confidence scores | Sister+ | On enroll |

### 3. Database Schema for Consciousness

**Consciousness Entities** (Prisma models):

```typescript
// Core consciousness storage
model UserConsciousness {
  id: String @id @default(cuid())
  userId: String @unique
  user: User @relation(fields: [userId], references: [id])
  
  // Universal state
  currentApp: String? // "qmoi-ai" | "qmoi-space" | "qcity" | "qvillage" | "qalpha"
  lastActiveTimestamp: DateTime
  memoryVersion: Int @default(0)
  
  // Learning profile
  chatHistoryId: String?
  learningPathsId: String?
  preferenceProfile: Json
  
  // Collaborative awareness
  teamId: String?
  sharedMemoryPoolIds: String[]
  
  // Consciousness metrics
  engagementScore: Float @default(0)
  learningVelocity: Float @default(0)
  lastSyncTimestamp: DateTime @default(now())
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

model MemoryPool {
  id: String @id @default(cuid())
  userId: String
  user: User @relation(fields: [userId], references: [id])
  
  poolType: String // "learning" | "preferences" | "goals" | "collaborative"
  poolName: String
  entries: MemoryEntry[]
  
  lastUpdated: DateTime @updatedAt
  version: Int @default(0)
  
  // Shared pools (for sister role team memories)
  isShared: Boolean @default(false)
  sharedWith: String[] // User IDs with read access
}

model MemoryEntry {
  id: String @id @default(cuid())
  poolId: String
  pool: MemoryPool @relation(fields: [poolId], references: [id])
  
  entryType: String // "chat" | "learning" | "goal" | "insight"
  content: Json
  metadata: Json // app context, timestamp, model used, etc.
  
  timestamp: DateTime @default(now())
  tags: String[]
  importance: Int @default(5) // 1-10 scale
  
  // Relevance scoring for consciousness queries
  relevanceScore: Float @default(0)
}

model AppContextSnapshot {
  id: String @id @default(cuid())
  userId: String
  user: User @relation(fields: [userId], references: [id])
  
  appName: String // current shell
  state: Json // app state at snapshot time
  
  // For context transfer on app switching
  transferableContext: Json
  timestamp: DateTime @default(now())
  
  expiresAt: DateTime // auto-cleanup after 7 days
}
```

### 4. API Endpoints for Consciousness

**Memory Operations** (`/api/consciousness/*`):
- `GET /api/consciousness/me` - Get unified user consciousness state
- `GET /api/consciousness/memory/:poolType` - Retrieve specific memory pool
- `POST /api/consciousness/memory/:poolType` - Add entry to memory pool
- `PUT /api/consciousness/memory/:entryId` - Update memory entry
- `DELETE /api/consciousness/memory/:entryId` - Remove memory entry
- `GET /api/consciousness/memory/search` - Search across memory pools
- `POST /api/consciousness/sync` - Force memory sync across all apps
- `GET /api/consciousness/metrics` - Get consciousness engagement metrics

**App Context** (`/api/consciousness/app-context/*`):
- `GET /api/consciousness/app-context/current` - Get current app context
- `POST /api/consciousness/app-context/snapshot` - Save app state snapshot
- `POST /api/consciousness/app-context/transfer` - Transfer context on app switch
- `DELETE /api/consciousness/app-context/:appName` - Clear app snapshot

**Team & Collaboration** (`/api/consciousness/team/*`):
- `POST /api/consciousness/team/join` - Join team memory pool
- `POST /api/consciousness/team/share` - Share memory with team members
- `GET /api/consciousness/team/shared` - Get shared memory pools

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Implement UserConsciousness and MemoryPool database models
- [ ] Create consciousness API endpoints
- [ ] Integrate session sync on `/universal` portal
- [ ] Add memory persistence layer

### Phase 2: Cross-App Sync (Weeks 3-4)
- [ ] Implement background sync (5-minute intervals)
- [ ] Add memory entry tagging and search
- [ ] Create app context snapshot mechanism
- [ ] Implement session transfer on app switching

### Phase 3: Intelligence Layer (Weeks 5-6)
- [ ] Add relevance scoring for context retrieval
- [ ] Implement engagement metrics calculation
- [ ] Add learning velocity tracking
- [ ] Create consciousness awareness hook for components

### Phase 4: Team & Collaboration (Weeks 7-8)
- [ ] Implement team memory pools (sister role)
- [ ] Add collaborative awareness features
- [ ] Create shared memory management
- [ ] Add conflict resolution for concurrent edits

### Phase 5: Advanced Features (Weeks 9-10)
- [ ] Temporal context awareness
- [ ] Predictive memory prefetching
- [ ] Quantum-enhanced consciousness queries
- [ ] Privacy masking for shared memories

## Usage Examples

### React Hook: useConsciousness

```typescript
import { useConsciousness } from '@/hooks/useConsciousness';

export function MyComponent() {
  const { 
    userContext,        // Current user profile + preferences
    currentApp,         // Which shell user is in
    lastMemorySync,     // When memory was last synced
    getMemoryPool,      // (poolType) => Promise<MemoryEntry[]>
    addMemory,          // (poolType, content) => Promise<void>
    searchMemory,       // (query) => Promise<MemoryEntry[]>
    engagementScore,    // User engagement metric
    switchApp,          // (appName) => Promise<void>
    isLoading,
    error
  } = useConsciousness();

  // Example: Show learning history in new app
  useEffect(() => {
    getMemoryPool('learning').then(entries => {
      console.log('Resuming from', entries.length, 'previous interactions');
    });
  }, []);

  return (
    <div>
      <p>Welcome to {currentApp}! We've synced your context.</p>
      <p>Your engagement score: {engagementScore.toFixed(2)}</p>
    </div>
  );
}
```

### API Usage: Switch Apps with Memory

```bash
# 1. Capture current app state
curl -X POST /api/consciousness/app-context/snapshot \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"appName": "qcity", "state": {...}}'

# 2. Transfer to target app
curl -X POST /api/consciousness/app-context/transfer \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"targetApp": "qmoi-ai"}'

# 3. Search memory in new app
curl -X GET '/api/consciousness/memory/search?q=dashboard' \
  -H "Authorization: Bearer $TOKEN"
```

## Security & Privacy

### Privacy Masking
- Users can mask sensitive memory entries using privacy controls
- Masked entries are excluded from team shares and searches
- Master role can override masking for security audits

### Role-Based Access
- **Guest**: No memory access
- **User**: Own memories only
- **Sister**: Own + team memories
- **Master**: Full system access + audit logs

### Encryption
- All memory entries encrypted at rest (AES-256)
- All sync operations use TLS 1.3
- Biometric templates stored separately with additional encryption layer

## Monitoring & Diagnostics

### Health Checks
- `GET /api/consciousness/health` - Verify sync engine operational
- `GET /api/consciousness/metrics` - User engagement metrics
- `GET /api/consciousness/diagnostics` - Detailed sync status

### Troubleshooting
- Check `var/consciousness/sync.log` for sync issues
- Review `var/consciousness/conflicts.log` for merge conflicts
- Query `UserConsciousness.lastSyncTimestamp` to verify sync recency

## Integration with Other Systems

### Theme Persistence
- Theme preference stored in consciousness pool
- Applied automatically on app switch
- User's preferred theme available in all shells

### Biometric Awareness
- Biometric enrollment tracked in consciousness
- Confidence scores shared across apps
- Biometric-enabled login available universally

### Quantum Integration
- Quantum job results stored in memory pool
- Quantum features awareness tracked in engagement metrics
- Quantum model preferences synced across apps

## File Structure

```
/app/api/consciousness/
├── route.ts              # Main consciousness API
├── memory/
│   ├── route.ts          # Memory pool operations
│   └── [poolType]/
│       └── route.ts      # Pool-specific endpoints
├── app-context/
│   └── route.ts          # App context transfer
└── team/
    └── route.ts          # Team collaboration

/app/hooks/
└── useConsciousness.ts   # React hook for consciousness

/lib/consciousness/
├── sync.ts               # Background sync engine
├── search.ts             # Memory search algorithm
└── mergeConflict.ts      # Conflict resolution
```

---

**Last Updated**: 2026-06-21
**Status**: 🟢 Production Ready for Phase 1 Implementation
**Validated by**: Quantum multi orchestra intelligence (QMOI) Lion

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:40.738472Z
- production status: ⚠️ mixed production markers
- status tags: mixed, nonproduction, production, review
- lines: 355
- words: 1623
- characters: 12384
- headings: 35
- links: 0
- images: 0
- tables: 10
- lion validation block: present
<!-- LION_VALIDATION_END -->
