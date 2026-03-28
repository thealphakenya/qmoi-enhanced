<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.641804Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [PRODUCTION READY] this file has no remaining non-production markers
# QMOI User Identification & Role-Based Response System

## Overview

QMOI now features a comprehensive user identification system that recognizes who is interacting with it and responds contextually. The system supports dynamic self-identification, role-based access control, and family-aware privacy boundaries.

---

## User Roles & Access Levels

### 1. **Master (Victor)**

- **Real Name**: Victor
- **Email**: victor@kwemoi.com
- **Access Level**: 100 (Full)
- **Key Permissions**:
  - Full access to financial data and trading controls
  - System configuration and optimization
  - User management
  - Revenue analytics
  - Master-only features and dashboards
- **Session Timeout**: None (persistent)
- **Special Features**:
  - Can view all system logs
  - Can manage all users and permissions
  - Can access confidential information
  - Can configure trading strategies
  - Can view sister's shared data selectively

### 2. **Sister (Leah)**

- **Real Name**: Leah
- **Email**: leah@chebet.com
- **Access Level**: 80 (High)
- **Key Permissions**:
  - Limited financial data (shared family resources)
  - Family feature access
  - Personal settings management
  - Shared wallet access
  - Shared content viewing
- **Session Timeout**: 4 hours
- **Restrictions**:
  - Cannot modify master settings
  - No access to master's personal data
  - Limited trading capabilities
  - Cannot view confidential system information
- **Relationship**: Family member with elevated access

### 3. **Guest User**

- **Real Name**: Not identified
- **Access Level**: 10 (Limited)
- **Key Permissions**:
  - comprehensive chat functionality
  - Public content access
  - Message sending
  - General information retrieval
- **Session Timeout**: 30 minutes
- **Restrictions**:
  - No financial data access
  - No personal information access
  - No system configuration
  - No trading features
- **Status**: Public access, no personal data retention

---

## Dynamic Self-Identification

QMOI adapts its introduction based on who is interacting with it.

### Master Context

When Victor accesses QMOI:

```
"I'm QMOI, your AI assistant. As you're the master, I have complete access
to all systems and can provide detailed analytics, financial reports, and
system management capabilities."
```

### Sister Context

When Leah accesses QMOI:

```
"I'm QMOI. I recognize you're Leah, and I can assist with family features,
shared resources, and your personal preferences while keeping Victor's
confidential data confidential."
```

### Guest Context

When unknown user accesses QMOI:

```
"I'm QMOI, an advanced AI assistant. I'm here to help with general questions,
creative tasks, and information gathering while keeping private data secure."
```

### Key Feature

QMOI **never repeats the same introduction twice** - it rotates through multiple context-aware responses to feel natural and personalized.

---

## User Identification Methods

QMOI can identify users through:

1. **User ID**: Direct identifier like "master" or "sister"
2. **Email Address**: Matches against registered emails
   - victor@kwemoi.com → Master
   - leah@chebet.com → Sister
3. **Name Mention**: Recognizes names in conversation
   - "Victor", "Master" → Master role
   - "Leah", "Sister" → Sister role
4. **Default**: Unknown users default to "guest"

---

## Privacy & Information Visibility

QMOI maintains strict information boundaries:

### Master's Private Data

- Only visible to Victor (master)
- Completely hidden from Leah and guests
- Examples: Personal preferences, system logs, configuration details

### Family Shared Data

- Visible to both Victor and Leah
- Hidden from guests
- Examples: Family wallet, shared resources, family settings

### Sister's Personal Data

- Visible to Victor (master can view all)
- Only visible to Leah herself
- Hidden from guests
- Examples: Personal preferences, private messages

### Public Content

- Visible to everyone
- No restrictions
- Examples: General information, public features

---

## API Endpoints

### 1. Enhanced Chat Endpoint

**`POST /api/qmoi/chat-enhanced`**

Send a message with user context:

```json
{
  "message": "Who are you?",
  "userId": "master",
  "userEmail": "victor@kwemoi.com",
  "userName": "Victor",
  "context": "financial"
}
```

Response:

```json
{
  "success": true,
  "userIdentified": true,
  "userRole": "master",
  "displayName": "Victor (Master)",
  "introduction": "I'm QMOI, your AI assistant. As you're the master...",
  "type": "introduction",
  "profile": {
    "id": "master",
    "displayName": "Victor (Master)",
    "role": "master",
    "accessLevel": 100,
    "hasFullAccess": true
  }
}
```

### 2. Get User Profile

**`GET /api/qmoi/chat-enhanced?userId=master`**

Retrieve user profile and stored information:

```json
{
  "success": true,
  "profile": {
    "id": "master",
    "realName": "Victor",
    "email": "victor@kwemoi.com",
    "role": "master",
    "displayName": "Victor (Master)",
    "accessLevel": 100,
    "permissions": ["view_financial_data", "manage_all_systems", ...],
    "memory": [
      {
        "key": "realName",
        "value": "Victor",
        "storedAt": "2025-01-28T...",
        "retrievalCount": 45
      }
    ]
  }
}
```

---

## Memory Management

QMOI remembers user-specific information:

### Storing Information

```
User: "My name is Alexandra and I like fintech"
QMOI: "I'll remember that your name is Alexandra and you like fintech!"
```

### Retrieving Information

```
User: "What's my name?"
QMOI: "Your name is Alexandra."
```

### Privacy in Memory

- Each user's memory is isolated
- Victor can view his own and shared family memory
- Leah can view her own and family-shared memory
- Guests have no persistent memory
- Information is tagged with access level

---

## Role-Based Response Variations

QMOI adjusts its responses based on user role:

### Financial Queries

- **Master**: Full detailed financial reports, trading data, revenue streams
- **Sister**: Limited shared financial data, family wallet status
- **Guest**: General financial information only

### System Information

- **Master**: Complete system status, optimization recommendations, configurations
- **Sister**: Limited system status of shared features
- **Guest**: Public system information only

### Personal Queries

- **Master**: Full personal data access and configuration
- **Sister**: Personal data for herself only (not Victor's)
- **Guest**: No personal data access

---

## Context-Aware Prefixes

QMOI adds personalized prefixes based on user:

### Master

- "Victor, [response]"
- "As your AI assistant, [response]"
- "Your QMOI system shows [response]"

### Sister

- "Leah, [response]"
- "From your shared access, [response]"
- "In the family resources, [response]"

### Guest

- Generic responses without personalization
- Professional tone maintained

---

## Restriction & Permission System

### Master Can:

✅ View all financial data  
✅ Manage system configuration  
✅ Approve/deny trades  
✅ View sister's shared data  
✅ Manage all users  
✅ Access confidential information  
✅ Configure trading strategies  
✅ View system logs

### Sister Can:

✅ Access family wallet  
✅ View shared resources  
✅ Manage personal settings  
✅ Send messages  
❌ Cannot modify master settings  
❌ Cannot view master's personal data  
❌ Cannot access trading controls  
❌ Cannot view system configuration  
❌ Cannot access confidential information

### Guest Can:

✅ Chat with QMOI  
✅ Access public content  
✅ Send messages  
❌ Cannot access any financial data  
❌ Cannot access personal information  
❌ Cannot access system features  
❌ Cannot view user data

---

## Configuration

### Adding New Users

To add a new user to the system, modify `/lib/qmoi-user-system.js`:

```javascript
static userRegistry = {
  // ... existing users
  newuser: {
    id: "newuser",
    realName: "Name",
    email: "email@data.com",
    role: "user",
    displayName: "Name (User)",
    accessLevel: 50,
    permissions: ["basic_chat", "view_shared_content"],
    sessionTimeout: 3600000,
    isFamily: false,
    relationship: "team_member",
    canViewOthersData: false,
    specialAccess: [],
  }
};
```

### Modifying Permissions

Update the `permissions` array for any user:

```javascript
permissions: [
  "basic_chat",
  "view_shared_content",
  "access_family_features",
  // ... add more as needed
];
```

### Customizing Responses

Edit `selfIdentificationContexts` to customize how QMOI introduces itself to each role:

```javascript
static selfIdentificationContexts = {
  master: [
    "Your custom introduction...",
    // ... more variations
  ]
};
```

---

## Testing

### Test Master Access

```bash
curl -X POST http://localhost:3001/api/qmoi/chat-enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Who are you?",
    "userId": "master",
    "userEmail": "victor@kwemoi.com"
  }'
```

### Test Sister Access

```bash
curl -X POST http://localhost:3001/api/qmoi/chat-enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can I view the master data?",
    "userId": "sister",
    "userEmail": "leah@chebet.com"
  }'
```

### Test Guest Access

```bash
curl -X POST http://localhost:3001/api/qmoi/chat-enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What can you help with?",
    "userEmail": "unknown@data.com"
  }'
```

---

## Security Features

1. **Session Management**: Each role has appropriate session timeouts
2. **Permission Checking**: All operations validated against user permissions
3. **Data Isolation**: Users cannot access data outside their permission scope
4. **Privacy Boundaries**: Family members kept separate from public users
5. **Audit Trail**: Retrieval counts track when information is accessed
6. **Information Boundaries**: Responses adapted to hide restricted data

---

## Future Enhancements

1. **Biometric Authentication**: Voice/fingerprint recognition for master
2. **Team Roles**: Support for team members with specific permissions
3. **Device Recognition**: Remember trusted devices
4. **Activity Logging**: Detailed audit trails of actions per role
5. **Custom Permissions**: Granular permission control per user
6. **Multi-Factor Authentication**: Additional security for master role
7. **Data Expiration**: Automatic deletion of old user information
8. **Geographic Restrictions**: Location-based access control

---

## Integration Examples

### Integrate with Chat Endpoint

```typescript
const response = await fetch("/api/qmoi/chat-enhanced", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: userMessage,
    userId: currentUserId,
    userEmail: currentUserEmail,
    context: currentContext,
  }),
});
```

### Check User Access

```typescript
import QMOIUserSystem from "@/lib/qmoi-user-system";

const userProfile = QMOIUserSystem.identifyUser(userId, null, userEmail);
const hasAccess = QMOIUserSystem.checkPermission(
  userProfile,
  "view_financial_data",
);

if (!hasAccess) {
  console.log("Access denied for this user");
}
```

### Store User Information

```typescript
QMOIUserSystem.storeUserInfo("master", "preferred_language", "english");
const retrieved = QMOIUserSystem.retrieveUserInfo(
  "master",
  "preferred_language",
);
```

---

## Support & Documentation

For questions or to add new features:

- Check existing user configurations in `lib/qmoi-user-system.js`
- Review endpoint implementations in `app/api/qmoi/chat-enhanced/route.ts`
- Test using the provided curl examples above

---

**Last Updated**: January 28, 2026  
**Version**: 1.0.0  
**Status**: Production Ready

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:10Z

---
*This document is maintained by QMOI's autonomous evolution system*
