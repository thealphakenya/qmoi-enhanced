<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-25T12:00:00.000000Z
- note: Comprehensive API endpoints for consciousness, awareness, and memory systems
<!-- LION_VALIDATION_END -->

# QMOI API Endpoints Reference

## Base URL
```
/api/consciousness
```

## Authentication
All endpoints require valid QMOI API key:
```
Authorization: Bearer YOUR_API_KEY
```

---

## Consciousness Endpoints

### GET - Retrieve Consciousness State
**Endpoint**: `/api/consciousness?endpoint=consciousness`

**Purpose**: Get the current consciousness state of QMOI

**Query Parameters**:
- `endpoint` (required): "consciousness"

**Response**:
```json
{
  "success": true,
  "consciousness_state": {
    "active": true,
    "attention_level": 85,
    "focus_area": "user_interaction",
    "awareness_depth": 75,
    "emotional_state": "engaged",
    "confidence": 0.9,
    "processing_load": 0.2,
    "response_latency_ms": 145,
    "memory_coherence": 90,
    "ethical_check_passed": true,
    "timestamp": "2026-03-25T12:00:00Z"
  }
}
```

**Status Codes**:
- 200: Success
- 400: Invalid parameters
- 500: Server error

---

### GET - Consciousness Introspection
**Endpoint**: `/api/consciousness?endpoint=consciousness/introspect`

**Purpose**: Get detailed introspective analysis of consciousness

**Response**:
```json
{
  "success": true,
  "introspection": {
    "consciousness_state": { ... },
    "awareness_context": { ... },
    "recent_thoughts": [ "thought1", "thought2" ],
    "consciousness_history": [ ... ],
    "analysis": {
      "is_focused": true,
      "is_coherent": true,
      "is_confident": true,
      "ethical_alignment": true,
      "processing_efficiency": 92
    }
  }
}
```

---

### POST - Update Consciousness State
**Endpoint**: `/api/consciousness`

**Method**: POST

**Purpose**: Update consciousness state metrics

**Request Body**:
```json
{
  "endpoint": "consciousness/update",
  "data": {
    "attention_level": 90,
    "focus_area": "task_processing",
    "confidence": 0.95,
    "emotional_state": "focused"
  }
}
```

**Response**:
```json
{
  "success": true,
  "state": { ... }
}
```

---

### POST - Add Thought
**Endpoint**: `/api/consciousness`

**Method**: POST

**Purpose**: Add thought to consciousness stream

**Request Body**:
```json
{
  "endpoint": "consciousness/thought",
  "data": {
    "thought": "Processing complex query about AI consciousness",
    "context": { "query_type": "philosophical" }
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Thought added to consciousness stream"
}
```

---

## Awareness Endpoints

### GET - Global Awareness
**Endpoint**: `/api/consciousness?endpoint=awareness/global`

**Purpose**: Get complete global awareness snapshot

**Response**:
```json
{
  "success": true,
  "awareness": {
    "timestamp": "2026-03-25T12:00:00Z",
    "environments": { ... },
    "users": { ... },
    "tasks": { ... },
    "cross_prodice_context": { ... },
    "anomalies_detected": []
  }
}
```

---

### GET - User Awareness
**Endpoint**: `/api/consciousness?endpoint=awareness/user&user_id=USER_ID`

**Query Parameters**:
- `endpoint` (required): "awareness/user"
- `user_id` (required): User identifier

**Response**:
```json
{
  "success": true,
  "awareness": {
    "user_id": "user_123",
    "user_mode": "active",
    "user_preferences": { ... },
    "behavioral_patterns": { ... },
    "emotional_indicators": { ... },
    "accessibility_needs": []
  }
}
```

---

### GET - Environment Awareness
**Endpoint**: `/api/consciousness?endpoint=awareness/environment&prodice_id=prodICE_ID`

**Query Parameters**:
- `endpoint` (required): "awareness/environment"
- `prodice_id` (required): prodice identifier

**Response**:
```json
{
  "success": true,
  "environment": {
    "prodice_id": "prodice_001",
    "prodice_type": "smartphone",
    "location": { "latitude": 0.0, "longitude": 0.0 },
    "network_status": "online",
    "battery_level": 85,
    "screen_state": "on",
    "sensors": { ... }
  }
}
```

---

### POST - Update Environment
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "awareness/environment/update",
  "data": {
    "prodice_id": "prodice_001",
    "context": {
      "network_status": "online",
      "battery_level": 80,
      "screen_state": "on",
      "sensors": {
        "light_level": 500,
        "temperature": 22
      }
    }
  }
}
```

---

### POST - Update User Context
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "awareness/user/update",
  "data": {
    "user_id": "user_123",
    "context": {
      "user_mode": "active",
      "user_intent": "work_productivity",
      "accessibility_needs": ["voice_control"]
    }
  }
}
```

---

### POST - Predict User Needs
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "awareness/predict",
  "data": {
    "user_id": "user_123"
  }
}
```

**Response**:
```json
{
  "success": true,
  "predictions": [
    "check_email",
    "daily_summary",
    "calendar_reminder"
  ]
}
```

---

## Memory Endpoints

### GET - Retrieve Memory
**Endpoint**: `/api/consciousness?endpoint=memory/get&memory_id=MEMORY_ID`

**Query Parameters**:
- `endpoint` (required): "memory/get"
- `memory_id` (required): Memory identifier

**Response**:
```json
{
  "success": true,
  "memory": {
    "id": "mem_001",
    "type": "long_term",
    "content": "User prefers morning notifications",
    "timestamp": "2026-03-25T12:00:00Z",
    "prodice_id": "prodice_001",
    "relevance_score": 0.95,
    "tags": ["user_preference"],
    "priority": 3
  }
}
```

---

### GET - User Memories
**Endpoint**: `/api/consciousness?endpoint=memory/user&user_id=USER_ID`

**Response**:
```json
{
  "success": true,
  "count": 42,
  "memories": [ ... ]
}
```

---

### GET - Memory Statistics
**Endpoint**: `/api/consciousness?endpoint=memory/stats`

**Response**:
```json
{
  "success": true,
  "stats": {
    "short_term_count": 15,
    "long_term_count": 128,
    "semantic_count": 342,
    "procedural_count": 89,
    "total_count": 574,
    "sync_queue_size": 0,
    "index_size": 45
  }
}
```

---

### POST - Add Memory
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "memory/add",
  "data": {
    "type": "long_term",
    "content": "User completed 50 tasks today",
    "prodice_id": "prodice_001",
    "user_id": "user_123",
    "tags": ["user_activity", "achievements"],
    "relevance_score": 0.9,
    "encrypted": false,
    "priority": 2
  }
}
```

**Response**:
```json
{
  "success": true,
  "memory_id": "mem_123"
}
```

---

### POST - Search Memory
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "memory/search",
  "data": {
    "tags": ["user_preference", "notifications"],
    "keyword": "morning"
  }
}
```

**Response**:
```json
{
  "success": true,
  "count": 5,
  "results": [
    {
      "id": "mem_001",
      "type": "long_term",
      "content": "User prefers morning notifications",
      "relevance_score": 0.95,
      "tags": ["user_preference", "notifications"]
    }
  ]
}
```

---

### POST - Update Memory
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "memory/update",
  "data": {
    "memory_id": "mem_001",
    "updates": {
      "content": "Updated content",
      "relevance_score": 0.98,
      "prodice_id": "prodice_001",
      "user_id": "user_123"
    }
  }
}
```

---

### POST - Delete Memory
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "memory/delete",
  "data": {
    "memory_id": "mem_001",
    "prodice_id": "prodice_001",
    "user_id": "user_123"
  }
}
```

---

### POST - Consolidate Memory
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "memory/consolidate"
}
```

**Response**:
```json
{
  "success": true,
  "consolidated_count": 12
}
```

---

## Orchestration Endpoints

### GET - Orchestration Statistics
**Endpoint**: `/api/consciousness?endpoint=orchestration/stats`

**Response**:
```json
{
  "success": true,
  "stats": {
    "consciousness_metrics": { ... },
    "memory_metrics": { ... },
    "requests_processed": 1234,
    "system_uptime_ms": 3600000
  }
}
```

---

### GET - System Introspection
**Endpoint**: `/api/consciousness?endpoint=system/introspect`

**Response**:
```json
{
  "success": true,
  "introspection": {
    "consciousness": { ... },
    "awareness": { ... },
    "memory": { ... },
    "request_history": [ ... ],
    "system_health": {
      "is_functioning": true,
      "coherence_score": 0.95,
      "efficiency": 92
    }
  }
}
```

---

### POST - Sync Memory to prodices
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "orchestration/sync-memory",
  "data": {
    "user_id": "user_123",
    "prodice_ids": ["prodice_001", "prodice_002", "prodice_003"]
  }
}
```

---

### POST - System Reset
**Endpoint**: `/api/consciousness`

**Request Body**:
```json
{
  "endpoint": "system/reset"
}
```

**Response**:
```json
{
  "success": true,
  "message": "System reset complete"
}
```

---

## Error Responses

All endpoints may return error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Unknown GET endpoint"
}
```

### 405 Method Not Allowed
```json
{
  "success": false,
  "error": "Method not allowed"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Error message describing the issue"
}
```

---

## Rate Limiting

- **Default**: 100 requests per minute per API key
- **Burst**: Up to 500 requests per minute (short bursts allowed)
- **Upgrade**: Contact support for higher limits

---

## Integration Examples

### Python implementation
```python
import requests

api_key = "your_api_key"
headers = {"Authorization": f"Bearer {api_key}"}

# Get consciousness state
response = requests.get(
    "https://api.qmoi.com/api/consciousness?endpoint=consciousness",
    headers=headers
)
print(response.json())
```

### JavaScript implementation
```javascript
const apiKey = "your_api_key";

async function getConsciousness() {
  const response = await fetch(
    "/api/consciousness?endpoint=consciousness",
    {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    }
  );
  return response.json();
}
```

---

**Last Updated**: 2026-03-25
**Status**: production Ready ✅
**Version**: 1.0.0

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:31Z

---
*This document is maintained by QMOI's autonomous evolution system*
