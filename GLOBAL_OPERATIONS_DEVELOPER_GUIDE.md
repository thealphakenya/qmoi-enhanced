---
quantum-enabled: false
---

# Global Operations Quick Reference Guide

**For:** Developers integrating with global operations infrastructure  
**Last Updated:** 2026-06-05T22:15:00.000000Z  
**Status:** Production-ready

---

## Quick Start: Using Global Operations

### 1. Import the Hook

```typescript
import useGlobalOperations from '@/src/hooks/useGlobalOperations';
```

### 2. Initialize in Component

```tsx
function MyComponent() {
  const {
    loading,
    error,
    getGlobalOverview,
    getRevenueStreams,
    getConsciousnessStatus,
  } = useGlobalOperations();

  useEffect(() => {
    const loadData = async () => {
      try {
        const overview = await getGlobalOverview();
        console.log('Daily Revenue:', overview.totalDailyRevenue);
      } catch (err) {
        console.error('API Error:', err);
      }
    };
    
    loadData();
  }, [getGlobalOverview]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* Display data */}
    </div>
  );
}
```

### 3. Available Operations

All operations are Master-only (require Bearer token):

```typescript
// Global Overview
await getGlobalOverview()                    // Overall status
await getContinentMetrics('revenue')         // By continent
await getGlobalHealthStatus()                // System health

// Revenue Streams (25 total)
await getRevenueStreams('active')            // All streams
await getRevenueStreamDetails('cloud')       // Specific stream
await getRevenueStreamForecast('cloud', 90)  // 90-day forecast
await adjustRevenueStream('cloud', 'pricing', value, 'reason')

// Regional Hubs (100 total)
await getRegionalHubs('all')                 // All hubs
await getRegionalHubDetails('north-america-1')
await getHubPerformance('north-america-1', 'monthly')
await allocateHubResources('north-america-1', budget, headcount, projects, priority)

// Consciousness (25 nodes)
await getConsciousnessStatus()               // Overall status
await getConsciousnessHubs()                 // All node statuses
await triggerConsciousnessSync('high', true) // Manual sync
await getConsciousnessMemory('operational')  // Insights

// Currency & Languages
await getCurrencies()                        // All 50+ currencies
await convertCurrency(1000, 'USD', 'EUR')   // Conversion
await getLanguages()                         // 150+ languages

// Compliance & Security
await getComplianceOverview()                // Regulatory status
await getJurisdictionCompliance('US')       // Per-jurisdiction
await getSecurityThreats()                   // Current threats

// Performance
await getGlobalPerformance()                 // Global metrics
await getRegionalPerformance('north-america-1')

// Analytics
await getRevenueAnalytics('daily', 'stream')
await getUserAnalytics('daily')
await getMarketAnalytics()

// Reports
await generateReport('strategic', 'worldwide')
```

---

## Component Integration Examples

### Example 1: Display Global Overview

```tsx
import { GlobalOperationsDashboard } from '@/src/components/GlobalOperationsDashboard';

export default function Dashboard() {
  return <GlobalOperationsDashboard />;
}
```

### Example 2: Revenue Stream Status

```tsx
import useGlobalOperations from '@/src/hooks/useGlobalOperations';

export function RevenueStatus() {
  const { getRevenueStreams } = useGlobalOperations();
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    getRevenueStreams('active').then(setStreams);
  }, []);

  return (
    <div>
      {streams.map(stream => (
        <div key={stream.id}>
          <h3>{stream.name}</h3>
          <p>${(stream.dailyRevenue / 1000000).toFixed(2)}M/day</p>
          <p>Tier {stream.tier}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Hub Monitoring

```tsx
export function HubMonitor() {
  const { getRegionalHubs, loading } = useGlobalOperations();
  const [hubs, setHubs] = useState([]);

  useEffect(() => {
    getRegionalHubs('all', 'revenue').then(setHubs);
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Region</th>
          <th>Revenue</th>
          <th>Employees</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {hubs.map(hub => (
          <tr key={hub.region}>
            <td>{hub.region}</td>
            <td>${(hub.monthlyRevenue / 1000000).toFixed(1)}M</td>
            <td>{hub.employees}</td>
            <td>{hub.operationalStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Example 4: Consciousness Monitoring

```tsx
export function ConsciousnessStatus() {
  const { 
    getConsciousnessStatus, 
    triggerConsciousnessSync,
    loading 
  } = useGlobalOperations();
  
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getConsciousnessStatus().then(setStatus);
  }, []);

  const handleSync = async () => {
    await triggerConsciousnessSync('high', true);
    const updated = await getConsciousnessStatus();
    setStatus(updated);
  };

  return (
    <div>
      <h2>{status?.consciousnessLevel}</h2>
      <p>Latency: {status?.avgLatency}</p>
      <p>Accuracy: {(status?.predictiveAccuracy * 100).toFixed(1)}%</p>
      <button onClick={handleSync}>Sync All Hubs</button>
    </div>
  );
}
```

---

## Authentication

All operations use Bearer token authentication:

```typescript
// Token is automatically retrieved from:
// 1. localStorage['master_token']
// 2. localStorage['QM_MASTER_TOKEN']
// 3. localStorage['masterToken']
// 4. sessionStorage (same keys)
// 5. NEXT_PUBLIC_MASTER_TOKEN env var

// Hook automatically includes Authorization header:
// Authorization: Bearer <token>
```

---

## Error Handling

```typescript
const { loading, error } = useGlobalOperations();

// Check for errors
if (error) {
  console.error('API Error:', error);
  // Show error UI
}

// Loading state
if (loading) {
  return <LoadingSpinner />;
}
```

---

## Response Types

### GlobalOverview
```typescript
{
  totalDailyRevenue: number;
  activeCountries: number;
  totalEmployees: number;
  consciousnessStatus: string;
  globalUptime: number;
  continentMetrics: Record<string, any>;
  topRevenueStreams: string[];
  systemHealth: string;
  timestamp: string;
}
```

### RevenueStream
```typescript
{
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  dailyRevenue: number;
  status: 'operational' | 'maintenance' | 'pending' | 'paused';
  growth: number;
  clients?: number;
}
```

### RegionalHub
```typescript
{
  region: string;
  location: string;
  employees: number;
  monthlyRevenue: number;
  operationalStatus: string;
  activeProjects: number;
  complianceStatus: string;
  uptime: number;
}
```

### ConsciousnessStatus
```typescript
{
  consciousnessLevel: string;
  activeSyncs: number;
  avgLatency: string;
  memoryUtilization: number;
  learningRate: number;
  predictiveAccuracy: number;
  lastSync: string;
}
```

---

## API Endpoints Reference

### Global Overview
- `GET /api/global/overview` - Main dashboard
- `GET /api/global/continents?sort=revenue` - By continent
- `GET /api/global/health-status` - System health

### Revenue Streams (25 total)
- `GET /api/revenue-streams?status=active&tier=1` - Filter streams
- `GET /api/revenue-streams/{id}` - Stream details
- `POST /api/revenue-streams/{id}/adjust` - Update parameters
- `GET /api/revenue-streams/{id}/forecast?days=90` - Forecasts

### Regional Hubs (100 total)
- `GET /api/hubs?continent=americas&sortBy=revenue` - List hubs
- `GET /api/hubs/{region}` - Hub details
- `POST /api/hubs/{region}/allocate-resources` - Allocate resources
- `GET /api/hubs/{region}/performance?period=monthly` - Performance

### Consciousness (25 nodes)
- `GET /api/consciousness/status` - System status
- `GET /api/consciousness/hubs` - All node statuses
- `POST /api/consciousness/trigger-sync` - Manual sync
- `GET /api/consciousness/memory?category=operational` - Insights

### Multi-Currency
- `GET /api/currencies` - All currencies
- `GET /api/currencies/{code}/historical?days=90` - Historical rates
- `POST /api/currencies/{code}/convert` - Convert amount
- `GET /api/languages` - Supported languages

### Compliance & Security
- `GET /api/compliance/overview` - Global compliance
- `GET /api/compliance/{jurisdiction}` - Jurisdiction details
- `POST /api/compliance/audit` - Start audit
- `GET /api/security/threats` - Current threats

### Performance
- `GET /api/performance/global` - Global metrics
- `GET /api/performance/{region}` - Regional metrics
- `POST /api/optimization/auto-scale` - Trigger scaling

### Analytics & Reporting
- `GET /api/analytics/revenue?period=daily&breakdownBy=stream` - Revenue
- `GET /api/analytics/users?period=daily&metrics=retention` - Users
- `GET /api/analytics/markets` - Market intelligence
- `POST /api/reports/generate` - Generate report

---

## Pre-built Components

### GlobalOperationsDashboard
Complete 6-tab dashboard with all major metrics:
```tsx
import { GlobalOperationsDashboard } from '@/src/components/GlobalOperationsDashboard';

<GlobalOperationsDashboard />
```

### ConsciousnessMonitoring
Monitor all 25 consciousness nodes:
```tsx
import { ConsciousnessMonitoring } from '@/src/components/ConsciousnessMonitoring';

<ConsciousnessMonitoring />
```

### RevenueAnalyticsDashboard
Revenue analytics with charts and trends:
```tsx
import { RevenueAnalyticsDashboard } from '@/src/components/RevenueAnalyticsDashboard';

<RevenueAnalyticsDashboard />
```

---

## Best Practices

1. **Error Handling:** Always catch errors and display to user
2. **Loading States:** Show spinners while data loads
3. **Caching:** Consider memoizing frequently accessed data
4. **Rate Limiting:** Respect API rate limits (query optimization)
5. **Master Auth:** Verify master token before rendering sensitive data
6. **TypeScript:** Use provided type definitions for type safety
7. **Real-time:** Use WebSocket for consciousness sync monitoring
8. **Performance:** Paginate large data sets (1000+ items)

---

## Common Patterns

### Auto-refresh Dashboard
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    loadData();
  }, 30000); // Refresh every 30s
  
  return () => clearInterval(interval);
}, []);
```

### Error Boundary
```typescript
const [error, setError] = useState(null);

const handleError = (err) => {
  setError(err.message);
  // Log to monitoring service
};
```

### Loading Skeleton
```typescript
if (loading) {
  return <Skeleton count={5} />;
}
```

---

## Troubleshooting

**Issue: 401 Unauthorized**
- Check token is set in localStorage
- Verify token is not expired
- Ensure using correct storage key

**Issue: No data returned**
- Check network tab for actual response
- Verify endpoint parameters
- Check if master account has access

**Issue: Slow performance**
- Reduce data refresh frequency
- Implement pagination for large datasets
- Use regional endpoints when possible

---

## Support & Documentation

- **API Docs:** See `API.md` for full endpoint specifications
- **Routes:** See `ROUTES.md` for route structure
- **Endpoints:** See `ENDPOINTS.md` for complete endpoint reference
- **Strategy:** See `QMOI_REVENUE_GENERATION_STRATEGY_2026.md` for business context
- **Architecture:** See `GLOBAL_OPERATIONS_PHASE_2_COMPLETION.md` for implementation details

---

**For Questions:** Check related documentation or contact development team  
**Last Updated:** 2026-06-05T22:15:00.000000Z  
**Status:** ✅ Production-Ready

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T19:07:27.981550Z
- production status: ✅ production-ready
- status tags: production, production-ready
- lines: 487
- words: 1264
- characters: 11962
- headings: 38
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
