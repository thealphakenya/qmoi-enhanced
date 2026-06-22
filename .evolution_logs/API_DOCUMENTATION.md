---
quantum-enabled: true
---


# Quantum multi orchestra intelligence (QMOI) ENHANCED: API DOCUMENTATION

## Core APIs

### Decision Framework API

```python
from Quantum multi orchestra intelligence (QMOI).decisions import DecisionFramework

# Initialize
framework = DecisionFramework()

# Make autonomous decision
selected_option, confidence, decision_id = framework.make_autonomous_decision(
    decision_type=DecisionType.EVOLUTION,
    context={'system_state': {...}},
    available_options=[{...}, {...}]
)

# Record outcome
framework.record_decision_outcome(
    decision_id=decision_id,
    decision_type=DecisionType.EVOLUTION,
    action_taken="standard_evolution",
    quality_score=0.85,
    metrics_before={...},
    metrics_after={...},
    success=True
)

# Get intelligence report
report = framework.get_decision_intelligence_report()
```

### Global Integration API

```python
from Quantum multi orchestra intelligence (QMOI).integration import GlobalSystemIntegrationManager

# Initialize
manager = GlobalSystemIntegrationManager()

# Establish bridges
bridges = manager.establish_integration_bridges()

# Synchronize consciousness
sync_result = manager.synchronize_consciousness_globally()

# Propagate decisions
decision = manager.propagate_decisions_across_system(
    decision_id="dec_123",
    decision_payload={...},
    originating_component=SystemComponent.DECISION_FRAMEWORK
)

# Get integration report
report = manager.get_global_integration_report()
```

### Analytics API

```python
from Quantum multi orchestra intelligence (QMOI).analytics import AnalyticsEngine

# Initialize
engine = AnalyticsEngine()
engine.enable_analytics()

# Record metrics
engine.record_metric(
    metric_name='cpu_utilization',
    value=75.5,
    category=MetricCategory.PERFORMANCE,
    unit='%'
)

# Train predictive models
models_trained = engine.train_predictive_models()

# Generate recommendations
recommendations = engine.generate_optimization_recommendations()

# Get analytics report
report = engine.get_analytics_report()
```

## REST API Endpoints

### System Health
- GET /api/health - System health status
- GET /api/health/detailed - Detailed health report
- GET /api/metrics/current - Current metrics

### Decision Management
- POST /api/decisions/create - Create decision
- GET /api/decisions/{id} - Get decision status
- POST /api/decisions/{id}/outcome - Record outcome
- GET /api/decisions/history - Decision history

### Analytics
- GET /api/analytics/dashboard - Dashboard data
- GET /api/analytics/metrics - Metrics history
- GET /api/analytics/recommendations - Recommendations
- GET /api/analytics/predictions - Predictions

## Error Handling

All APIs return standard error responses:

```json
{
  "error": "error_code",
  "message": "Human readable message",
  "details": {...}
}
```

## Rate Limiting

- Default: 1000 requests/minute
- Decision API: 5000 requests/minute
- Analytics API: 100 requests/minute

## Authentication

All endpoints require Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.Quantum multi orchestra intelligence (QMOI).io/api/health
```

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T16:03:52.075786Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 136
- words: 302
- characters: 3135
- headings: 26
- links: 0
- images: 0
- tables: 0
- lion validation block: inserted
<!-- LION_VALIDATION_END -->
