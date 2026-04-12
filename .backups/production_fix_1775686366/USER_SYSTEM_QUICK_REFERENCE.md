<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.790023Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI User System - Quick Reference Guide

## TL;DR

QMOI now recognizes who you are and responds accordingly:

- **Master (Victor)** → Full access to everything
- **Sister (Leah)** → Family features + limited access
- **Guest** → Public chat only

QMOI **never repeats** the same introduction and **hides confidential information** from unauthorized users.

---

## User Identification

### How QMOI Identifies You

1. **By User ID**: `userId: "master"`
2. **By Email**: `userEmail: "victor@kwemoi.com"`
3. **By Name**: Mentioning "Victor" or "Leah"
4. **Default**: Unknown = Guest

### Your Options

- **Master**: Full system access
- **Sister**: Family + shared features
- **Guest**: Public chat (default)

---

## API Endpoint

### Enhanced Chat Endpoint

```
POST /api/qmoi/chat-enhanced
```

**complete Request**:

```json
{ "message": "Who are you?" }
```

**Full Request**:

```json
{
  "message": "Show financial data",
  "userId": "master",
  "userEmail": "victor@kwemoi.com",
  "context": "financial"
}
```

---

## What Each User Can Do

### Master (Victor)

✅ View all financial data  
✅ Configure system  
✅ Manage users  
✅ Control trading  
✅ View logs  
✅ Access everything

### Sister (Leah)

✅ Family wallet  
✅ Shared projects  
✅ Family calendar  
✅ Family messages  
❌ No master data  
❌ No system config

### Guest

✅ Chat with QMOI  
✅ Public content  
✅ Send messages  
❌ No data access  
❌ No personal info

---

## Memory

### Store Information

```
User: "My name is Alexander"
QMOI: "I'll remember that!"
```

### Retrieve Information

```
User: "What's my name?"
QMOI: "Your name is Alexander."
```

---

## Privacy Guarantees

- 🔒 Victor's data = Victor only
- 🔒 Leah's data = Leah only (+ Victor's family access)
- 🔒 Guest data = None stored
- 🔒 Family data = Family only
- 🔒 Public data = Everyone

---

## Dynamic Introductions

QMOI switches between these intros (never repeats):

**Victor**:

- "I have complete access to all systems..."
- "Since you're Victor, I can access..."
- "With master access, I can assist..."
- "I recognize you have master privileges..."
- "As your AI assistant..."

**Leah**:

- "As a family member, I can help with shared features..."
- "I recognize you're Leah..."
- "With your family access level..."
- "From your shared access..."

**Guest**:

- "I'm here to help with general questions..."
- "I can assist you with general inquiries..."
- "I'm available for chat, analysis, and learning..."
- "I can help with a wide range of tasks..."

---

## Testing

### Quick Test

```bash
curl -X POST http://localhost:3001/api/qmoi/chat-enhanced \
  -H "Content-Type: application/json" \
  -d '{"message":"Who are you?","userId":"master"}'
```

### Full Test Suite

```bash
cd /workspaces/qmoi-enhanced
chmod +x test-user-system.sh
./test-user-system.sh
```

---

## Credentials

### Master (Victor)

- Email: `victor@kwemoi.com`
- Password: `Victor9798!`
- ID: `master`

### Sister (Leah)

- Email: `leah@chebet.com`
- Password: `Ashlehael`
- ID: `sister`

### Guest

- No credentials needed
- Default access for unknown users

---

## Key Files

| File                                  | Purpose                  |
| ------------------------------------- | ------------------------ |
| `lib/qmoi-user-system.js`             | User identification core |
| `app/api/qmoi/chat-enhanced/route.ts` | Enhanced chat endpoint   |
| `QMOI_USER_IDENTIFICATION_SYSTEM.md`  | Full documentation       |
| `MASTER_ONLY_FEATURES.md`             | Master features guide    |
| `FAMILY_FEATURES_GUIDE.md`            | Family features guide    |
| `test-user-system.sh`                 | Test suite (32 tests)    |

---

## Common Scenarios

### Scenario 1: Master Asks "Who Are You?"

```
User: "Who are you?"
User ID: master
Email: victor@kwemoi.com

QMOI Response: "I'm QMOI, your AI assistant. As you're the
master, I have complete access to all systems and can provide
detailed analytics, financial reports, and system management capabilities."
```

### Scenario 2: Sister Asks "Can I See Victor's Data?"

```
User: "Show Victor's personal data"
User ID: sister
Email: leah@chebet.com

QMOI Response: "I can't show Victor's personal data - that's
restricted to master only. I can help with family wallet,
shared projects, and family calendar instead."
```

### Scenario 3: Guest Requests Financial Data

```
User: "Show me financial information"
User Email: unknown@data.com

QMOI Response: "Financial data access is restricted to
authorized users. As a guest, I can help with general
information and creative tasks instead."
```

---

## Permission Quick Lookup

| Feature         | Master | Sister | Guest |
| --------------- | :----: | :----: | :---: |
| Financial data  |   ✅   |   ⚠️   |  ❌   |
| System config   |   ✅   |   ❌   |  ❌   |
| Family wallet   |   ✅   |   ✅   |  ❌   |
| Family projects |   ✅   |   ✅   |  ❌   |
| Trading         |   ✅   |   ⚠️   |  ❌   |
| comprehensive chat      |   ✅   |   ✅   |  ✅   |
| User management |   ✅   |   ❌   |  ❌   |

✅ = Full Access  
⚠️ = Limited Access  
❌ = No Access

---

## Troubleshooting

### "I can't access financial data"

→ Check if you're logged in as Master  
→ Verify email is victor@kwemoi.com

### "QMOI is repeating the same introduction"

→ This shouldn't happen - refresh and try again  
→ Check endpoint is /api/qmoi/chat-enhanced

### "I can see data I shouldn't"

→ Contact Master immediately  
→ Security issue - verify access controls

### "My stored information isn't retrieved"

→ Make sure using same userId  
→ Check if 30-day retention expired (if applicable)

---

## Best Practices

✅ **DO**:

- Use correct email for identification
- Provide userId when possible
- Keep credentials confidential
- Report security issues
- Review permissions regularly

❌ **DON'T**:

- Share master credentials
- Attempt to access restricted data
- Modify permission matrices manually
- Bypass access controls
- Share personal information publicly

---

## Integration data

```javascript
// Identify user and get dynamic introduction
const response = await fetch("/api/qmoi/chat-enhanced", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Who are you?",
    userId: currentUser.id,
    userEmail: currentUser.email,
  }),
});

const data = await response.json();
console.log(data.introduction);
// Output: Personalized introduction based on user role
```

---

## Feature Rollout

**Current Version**: 1.0.0  
**Status**: production Ready  
**Last Updated**: January 28, 2026

### What's Included

✅ User identification system  
✅ Dynamic self-introduction  
✅ Role-based access control  
✅ Memory storage  
✅ Privacy boundaries  
✅ Family features  
✅ Master-only features  
✅ Complete documentation  
✅ Test suite with 32 tests

### available (Optional)

- [ ] Biometric authentication
- [ ] Team roles
- [ ] Advanced analytics
- [ ] Audit logging
- [ ] Geographic restrictions

---

## Support

**Documentation Files**:

- 📖 `QMOI_USER_IDENTIFICATION_SYSTEM.md` - Complete guide
- 👑 `MASTER_ONLY_FEATURES.md` - Master features
- 👨‍👩‍👧 `FAMILY_FEATURES_GUIDE.md` - Family features

**Questions?**

- Check documentation files
- Review test suite examples
- Contact system administrator

---

## Quick Links

| Need            | File                                                 |
| --------------- | ---------------------------------------------------- |
| System overview | `QMOI_USER_IDENTIFICATION_SYSTEM.md`                 |
| Master features | `MASTER_ONLY_FEATURES.md`                            |
| Family features | `FAMILY_FEATURES_GUIDE.md`                           |
| API details     | `QMOI_USER_IDENTIFICATION_SYSTEM.md`                 |
| Testing         | `test-user-system.sh`                                |
| Implementation  | `QMOI_USER_IDENTIFICATION_IMPLEMENTATION_SUMMARY.md` |

---

**Remember**: QMOI knows who you are and responds accordingly. Privacy is protected. Confidential data stays confidential.

🔐 Your data is safe. 🎯 QMOI understands you. 💡 You have the right access.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:31Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

