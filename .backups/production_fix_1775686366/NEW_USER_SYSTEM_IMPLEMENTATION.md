<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.751725Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI New User Identification & Personalization System

## Complete Implementation Guide

---

## System Overview

This document describes the complete system for:

1. Identifying users (authentication, recognition, context inference)
2. Onboarding new users (signup, verification, profiling)
3. Personalizing responses based on user context
4. Building progressive context over time

### Core Principle

Every user gets the right response at the right depth at the right time - from day one.

---

## Part 1: User Identification System

### Identification Pipeline (7 Methods)

```
User Request
    ↓
[1. Check Auth Token] → 99% confidence → Known user
    ↓ (if no token)
[2. Check User ID] → 98% confidence → Known user
    ↓ (if no match)
[3. Check Email] → 95% confidence → Registered user
    ↓ (if no match)
[4. Check Conversation History] → 80-90% confidence → Returning user
    ↓ (if no match)
[5. Analyze Behavior] → 70-85% confidence → Inferred user
    ↓ (if no match)
[6. Extract Context Clues] → 60-75% confidence → Guessed user
    ↓ (if no match)
[7. Default to Guest] → 0% confidence → Guest user
```

### Method 1: Authentication Token (99% confidence)

- **When**: User has logged in
- **How**: Verify JWT token in request header
- **Data**: Full user profile, complete context available
- **Use Case**: Returning logged-in users
- **Speed**: Instant

```typescript
const user = await verifyToken(request.headers.authorization);
// Returns: { id, email, name, level, preferences, profile, ... }
```

### Method 2: User ID Match (98% confidence)

- **When**: User ID provided in request
- **How**: Direct lookup in database
- **Data**: Full profile available
- **Use Case**: API calls with user ID
- **Speed**: Database lookup (milliseconds)

```typescript
const user = database.findById(userId);
// Returns: Complete user record
```

### Method 3: Email Recognition (95% confidence)

- **When**: Email provided in request
- **How**: Lookup user by email address
- **Data**: Full profile available
- **Use Case**: Email-based requests, password recovery
- **Speed**: Database index lookup (milliseconds)

```typescript
const user = database.findByEmail(email);
// Returns: Complete user record
```

### Method 4: Conversation History (80-90% confidence)

- **When**: Conversation ID provided
- **How**: Load conversation and extract user ID
- **Data**: Full profile + conversation context
- **Use Case**: Continuing previous conversations
- **Speed**: Load conversation history (hundreds of milliseconds)

```typescript
const conversation = database.loadConversation(conversationId);
const userId = conversation.messages[0].userId;
const user = database.findById(userId);
// Returns: User + conversation context
```

### Method 5: Behavioral Analysis (70-85% confidence)

- **When**: Message characteristics match known user patterns
- **How**: ML model analyzes writing style, topics, patterns
- **Data**: Profile with confidence percentage
- **Use Case**: Recurring guests with distinctive patterns
- **Speed**: Inference (milliseconds)

```typescript
const patterns = analyzeMessage(message);
// Returns patterns like: vocabulary_level, formality, topic_domains, urgency_level
const matchedUser = findUserByPatterns(patterns);
// Returns: User with confidence score 0.70-0.85
```

### Method 6: Contextual Clues (60-75% confidence)

- **When**: Message contains identifiable references
- **How**: Extract family mentions, project references, etc.
- **Data**: full profile with guesses
- **Use Case**: Family members mentioned in messages
- **Speed**: Pattern matching (milliseconds)

```typescript
const clues = extractClues(message);
// Returns: { familyMention: 'Leah', projectMention: 'stable', ... }
if (clues.familyMention === "Leah") {
  return loadProfile("sister");
}
```

### Method 7: Default to Guest (0% confidence - fallback)

- **When**: No other method matches
- **How**: Create permanent guest profile
- **Data**: complete profile, generic responses
- **Use Case**: First-time visitors, anonymous users
- **Speed**: Instant

```typescript
const guestUser = {
  id: `guest_${timestamp}`,
  type: 'guest',
  profile: { name: 'Guest', accessLevel: 10, ... }
};
```

---

## Part 2: New User Sign-Up Flow

### Phase 1: Registration (0-5 minutes)

**What Happens:**

1. User provides: email, name, password
2. System validates inputs
3. User record created in database
4. Verification code generated and emailed
5. Welcome message shown

**Database Schema:**

```json
{
  "id": "user_1234567890_abc123",
  "email": "leah@data.com",
  "name": "Leah",
  "passwordHash": "sha256...",
  "createdAt": "2024-01-15T10:30:00Z",
  "status": "pending_verification",
  "source": "web",
  "referrer": null,
  "profile": {
    "avatarUrl": null,
    "knowledgeLevel": "unknown",
    "expertise": [],
    "goals": [],
    "interests": []
  },
  "profiling": {
    "phase": "registration",
    "completionPercentage": 10,
    "questionsAnswered": [],
    "insights": {}
  },
  "onboarding": {
    "step": "verify_email",
    "completedSteps": ["signup"],
    "skippedTips": []
  },
  "preferences": {
    "emailNotifications": true,
    "pushNotifications": true,
    "weeklyDigest": false
  }
}
```

**API Endpoint:**

```
POST /api/auth/register
{
  "email": "leah@data.com",
  "name": "Leah",
  "password": "securePassword123",
  "source": "web"
}

Response:
{
  "success": true,
  "userId": "user_1234567890_abc123",
  "message": "Welcome Leah! Verification code sent to leah@data.com",
  "welcomeResponse": "Welcome to QMOI...",
  "nextStep": "verify_email"
}
```

**Welcome Message:**

```
Welcome to QMOI, Leah! 👋

I'm QMOI - your personal intelligence assistant. I'm here to help you think more clearly, learn faster, and make better decisions.

To get started, please verify your email address using the code we just sent you. Then we'll begin learning about you, so I can provide responses that are perfectly tailored to who you are and what you need.

I'm excited to meet you.
```

### Phase 2: Email Verification & Initial Profiling (0-24 hours)

**What Happens:**

1. User enters 6-digit verification code
2. System verifies code and email
3. User status changed to "email_verified"
4. First profiling question shown
5. Progressive profiling begins

**API Endpoint:**

```
POST /api/auth/verify-email
{
  "userId": "user_1234567890_abc123",
  "code": "123456"
}

Response:
{
  "success": true,
  "message": "Email verified successfully!",
  "user": { ... },
  "nextQuestion": {
    "id": "goal_primary",
    "text": "What brings you to QMOI? What's your main goal?",
    "learn": "primary_goal"
  },
  "nextStep": "initial_profiling"
}
```

**Initial Profiling Questions (Phase 1):**

1. **Goal Discovery**
   - Question: "What brings you to QMOI? What's your main goal?"
   - Learns: primary_goal
   - Timing: Immediately after verification

2. **Expertise Assessment**
   - Question: "What's your experience level? (Beginner, Intermediate, Advanced)"
   - Learns: knowledgeLevel, expertise_level
   - Timing: Within 5 minutes of Question 1

3. **Learning Style**
   - Question: "How do you prefer to learn? (Examples, Details, Stories, Visual, Interactive)"
   - Learns: learningStyle, preferences.depth
   - Timing: Within 10 minutes of Question 2

**Progressive Profiling Schedule:**

```
Timeline          Phase           Questions              Duration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0-30 min          Initial         Goal, Expertise, Style 3 questions
30 min - 24 hrs   Deeper          Challenge, Success     3 questions
Day 2-7           Relationship    Values, Style, Growth  3 questions
Week 2-4          Advanced        Custom based on use    Variable
```

### Phase 3: Context Building (Days 1-4)

**What Happens:**

1. Questions distributed across interactions
2. Insights extracted from each response
3. Profile built progressively
4. Learning algorithms start pattern analysis
5. Context becomes richer with each interaction

**Deeper Profiling Questions (Phase 2):**

1. **Pain Points Discovery**
   - Question: "What's the main challenge you're trying to solve?"
   - Learns: pain_points, primary_problem
   - Timing: After initial 3 questions

2. **Success Definition**
   - Question: "What would success look like for you?"
   - Learns: success_definition, goals.detailed
   - Timing: 1-2 interactions after Question 1

3. **Timeline & Urgency**
   - Question: "What's your timeline for solving this?"
   - Learns: urgency, timeline, priority_level
   - Timing: Following Question 2

**Relationship-Building Questions (Phase 3):**

1. **Values Clarification**
   - Question: "What values matter most to you?"
   - Learns: values, principles, ethics
   - Timing: Day 3-4

2. **Communication Preferences**
   - Question: "How do you prefer I communicate with you?"
   - Learns: tone_preference, communication_style, depth_preference
   - Timing: Day 4-5

3. **Growth Areas**
   - Question: "What areas do you want to grow in?"
   - Learns: growth_areas, aspirations, learning_goals
   - Timing: Day 5-7

**Context Inference During Phase 3:**

- Topics the user asks about (interests, expertise)
- Patterns in questions (analytical vs. emotional vs. tactical)
- Vocabulary and knowledge level
- Emotional tone and stress indicators
- Time patterns (early bird, night owl, weekend warrior)
- Communication preferences through observation

### Phase 4: Full Personalization (Day 8+)

**What Happens:**

1. All profiling questions answered
2. Complete context available
3. Behavioral patterns established
4. Response stage set to "C" or "D" (advanced personalization)
5. Continuous learning ongoing

**Personalization Readiness:**

- ✅ User identity fully known
- ✅ Primary goals documented
- ✅ Knowledge level assessed
- ✅ Learning style understood
- ✅ Communication preferences known
- ✅ Values and priorities clear
- ✅ At least 7-10 interactions completed
- ✅ Behavior patterns established

**Transition to Personalized Responses:**

```
New User Progression:
├─ Stage A (1st interaction): Generic responses (2/10)
├─ Stage B (after email verification): Identity recognized (7/10)
├─ Stage C (after initial profiling): Context-aware (8.7/10)
├─ Stage D (after deeper profiling): Proactive help (9/10)
└─ Stage E+ (full profiling + 7+ interactions): Deep personalization (9.5-9.9/10)
```

---

## Part 3: Response Customization

### Response Selection Logic

```
Request Arrives
    ↓
[Identify User] → (7-method pipeline)
    ↓
[Build Context] → (6-dimension model)
    ↓
[Determine Stage] → (A-H progression)
    ↓
[Select Response standard] → (personalized version)
    ↓
[Customize Content] → (tone, depth, references)
    ↓
[Return Response] → (delivered with greeting, body, personalization)
```

### Context Dimensions

**1. User Identity Context**

```json
{
  "userId": "user_123",
  "name": "Leah",
  "email": "leah@data.com",
  "role": "sister",
  "accessLevel": 80,
  "status": "active",
  "verificationStatus": "verified"
}
```

**2. User Goals Context**

```json
{
  "primaryGoal": "Creative projects",
  "secondaryGoals": ["Personal growth", "Financial stability"],
  "painPoints": ["Self-doubt", "Time management"],
  "constraints": ["Limited budget", "Family commitments"],
  "motivations": ["Impact", "Expression", "Learning"]
}
```

**3. User Knowledge Context**

```json
{
  "knowledgeLevel": "intermediate",
  "expertise": ["Marketing", "Social media"],
  "learningStyle": "data-based",
  "languagePreference": "English",
  "technicalProficiency": "high"
}
```

**4. User Relationship Context**

```json
{
  "familyRole": "sister",
  "trustLevel": 0.95,
  "relationshipHistory": "lifelong",
  "partnershipLevel": "collaborative",
  "familyConnections": ["Victor (Master)"]
}
```

**5. User Interaction Context**

```json
{
  "lastInteraction": "2024-01-15T14:30:00Z",
  "interactionCount": 45,
  "preferredTone": "warm_supportive",
  "preferredDepth": "moderate",
  "frequentTopics": ["Projects", "Growth", "Relationships"],
  "communicationPatterns": "thoughtful, asks follow-ups"
}
```

**6. User Emotion Context**

```json
{
  "currentMood": "hopeful",
  "energyLevel": "high",
  "stressLevel": "low",
  "emotionalNeeds": "validation, guidance",
  "sensitivities": ["Criticism", "Time pressure"]
}
```

### Response Customization Examples

#### For Master (Victor)

**Greeting:**

```
"Hello Victor,"
```

**Tone:**

- Strategic partnership
- Intellectual peer
- Direct and concise
- Big-picture focused

**Depth:**

- Advanced/sophisticated
- Assumes high knowledge
- Dives deep into systems
- Explores strategic implications

**Personalization:**

- Acknowledges his leadership role
- References his strategic thinking
- Connects to his values of mastery
- Anticipates his needs

#### For Sister (Leah)

**Greeting:**

```
"Hi Leah,"
```

**Tone:**

- Warm and supportive
- Growth-oriented
- Emotionally intelligent
- Encouraging

**Depth:**

- Moderate/accessible
- Explains concepts clearly
- Uses real-world examples
- Balances info with support

**Personalization:**

- Celebrates her creative endeavors
- Acknowledges her growth journey
- Supports her autonomy
- Reflects family dynamics appropriately

#### For New User

**Greeting:**

```
"Welcome [Name],"
```

**Tone:**

- Welcoming and patient
- Educational
- Clear boundaries
- Trustworthy

**Depth:**

- Introductory to moderate
- Defines key concepts
- Provides context
- Explains limitations

**Personalization:**

- Gradually reveals capabilities
- Builds trust through consistency
- References their stated goals
- Invites further exploration

#### For Guest

**Greeting:**

```
"Hello,"
```

**Tone:**

- Professional and helpful
- Respectful of boundaries
- Direct and clear
- Honest about limitations

**Depth:**

- Introductory to moderate
- General guidance
- Educational
- Explains what QMOI can/cannot do

**Personalization:**

- Respects privacy
- Offers without presuming
- Makes clear what's available
- Invites them to share more

---

## Part 4: Implementation Architecture

### File Structure

```
lib/
├── qmoi-user-profiler.js          # User identification & context building
├── qmoi-signup-system.js           # Sign-up, verification, profiling
├── qmoi-response-customizer.js     # Response selection & customization
├── auth-middleware.js              # Auth verification
└── auth-utils.js                   # JWT, token handling

app/
├── api/
│   ├── auth/
│   │   ├── register/
│   │   │   └── route.ts           # User registration
│   │   ├── verify-email/
│   │   │   └── route.ts           # Email verification
│   │   └── login/
│   │       └── route.ts           # User login
│   └── qmoi/
│       ├── profile-questions/
│       │   └── route.ts           # Profiling questions
│       └── chat-enhanced/
│           └── route.ts           # Enhanced chat with personalization

lib/
└── database/
    ├── users.ts                   # User record operations
    ├── profiles.ts                # Profile operations
    ├── conversations.ts           # Conversation history
    └── profiling.ts               # Profiling data
```

### Data Flow

```
User Message
    ↓
[auth-middleware] → Verify session/token
    ↓
[qmoi-user-profiler] → Identify user (7 methods)
    ↓
[Context Building] → Load user context (6 dimensions)
    ↓
[Response Generation] → Create base response
    ↓
[qmoi-response-customizer] → Customize for user
    ↓
[Return Response] → With personalization
```

### Integration Points

**1. With Existing Chat Endpoint**

```typescript
// In chat-enhanced/route.ts
import { QMOIUserProfiler } from "@/lib/qmoi-user-profiler";

const profiler = new QMOIUserProfiler();

async function enhancedChatHandler(request) {
  // Identify user
  const userResult = await profiler.identifyUser(request);
  const { user, context, profile } = userResult;

  // Generate response
  let response = await generateBaseResponse(request.message);

  // Customize for user
  response = customizeResponse(response, context);

  return response;
}
```

**2. With Signup Flow**

```typescript
import QMOISignupSystem from "@/lib/qmoi-signup-system";

async function registerNewUser(signupData) {
  const result = await signupSystem.handleSignup(signupData);
  // User created, verification sent, onboarding started
  return result;
}
```

**3. With Profile Learning**

```typescript
// After each interaction
async function updateUserProfile(userId, messageContent) {
  const insights = profiler.extractInsights(messageContent);
  await database.updateUserProfile(userId, insights);
}
```

---

## Part 5: Advanced Features

### Feature 1: Auto-Recognition

New users who are actually known people (family, partners):

- System detects through email domain, name patterns, or contextual references
- Automatically applies appropriate profile
- Welcomes them with recognized identity
- Accelerates to Stage D responses

```typescript
async function autoRecognizeUser(email, name) {
  // Check if this is a known person's alternate email
  if (email.endsWith("@chebet.com")) {
    return loadProfile("sister"); // Leah's domain
  }

  // Check if name matches known family
  if (this.isFamilyMember(name)) {
    return loadProfile("family");
  }

  // Check if bio/email signals known relationship
  if (this.isKnownPartner(email, name)) {
    return loadProfile("partner");
  }

  return null; // Not auto-recognizable
}
```

### Feature 2: Context Persistence

User's context (goals, preferences, recent topics) maintained across sessions:

- Loaded on login
- Updated with each interaction
- Available for cross-session continuity
- Enables proactive help

```typescript
async function loadPersistentContext(userId) {
  const context = await database.getUserContext(userId);

  return {
    activeGoals: context.currentGoals,
    recentTopics: context.recent10Topics,
    ongoingProjects: context.projects.active,
    lastNeedState: context.lastEmotionalState,
    preferredApproach: context.communicationPreference,
  };
}
```

### Feature 3: Proactive Identification

System learns to identify users faster over time:

- Builds behavioral profiles
- Recognizes patterns (time of day, topics, style)
- Predicts user with increasing confidence
- Reduces need for explicit authentication

```typescript
async function proactiveIdentify(message, metadata) {
  // Fast path: if behavioral confidence > 80%, skip to verification
  const behaviorMatch = await findUserByBehavior(message);
  if (behaviorMatch.confidence > 0.8) {
    return behaviorMatch.user;
  }

  // Normal identification pipeline
  return await identifyUser(message, metadata);
}
```

### Feature 4: Multi-Identity Support

Users with multiple roles (Master, professional, parent):

- System detects context switches
- Applies appropriate role profile
- Maintains separate goal threads
- Personalization aware of context

```typescript
async function detectContextSwitch(message, currentRole) {
  const clues = extractContextClues(message);

  if (clues.familyReference && currentRole === "professional") {
    // Switch to family role
    return "family";
  }

  if (clues.businessFocus && currentRole === "family") {
    // Switch to professional role
    return "professional";
  }

  return currentRole; // Stay in current role
}
```

### Feature 5: New User Acceleration

Fast-track for users who productionnstrate advanced knowledge:

- Detect indicators (vocabulary, questions, references)
- Skip beginner-level explanations
- Adjust response depth upward
- Move to Stage C/D faster

```typescript
async function assessUserAdvancementReadiness(userId) {
  const interactions = await database.getRecentInteractions(userId, 5);

  const indicators = {
    technicalVocabulary: detectTechTermUsage(interactions),
    systemicThinking: detectSecondOrderThinking(interactions),
    knowledgeLevel: inferKnowledgeLevel(interactions),
    questionDepth: assessQuestionSophistication(interactions),
  };

  // If advanced indicators detected, advance stage
  if (
    indicators.technicalVocabulary > 0.8 &&
    indicators.systemicThinking > 0.7
  ) {
    return { readyToAdvance: true, recommendedStage: "C" };
  }

  return { readyToAdvance: false };
}
```

---

## Part 6: Privacy & Security

### What's Stored

- ✅ User identity (name, email)
- ✅ User profile (goals, interests, expertise)
- ✅ Conversation history
- ✅ Profiling insights
- ✅ Interaction patterns
- ✅ Preferences and settings

### What's NOT Stored

- ❌ Raw password (only hash)
- ❌ Payment information (handled by third-party)
- ❌ Audio/video of conversations
- ❌ Metadata beyond timestamps
- ❌ Deleted conversations (hard deleted)

### User Controls

- Users can view what's stored about them
- Users can request data deletion (except legal holds)
- Users can control what learning/storage is enabled
- Users can opt-out of behavioral analysis
- Users can clear conversation history

```typescript
async function getUserPrivacySettings(userId) {
  return {
    storageEnabled: true,
    behavioralAnalysis: { enabled: true, canOptOut: true },
    profileLearning: { enabled: true, canOptOut: true },
    conversationRetention: "90 days",
    dataExportAvailable: true,
    deleteAccountOption: true,
  };
}
```

---

## Part 7: Error Handling

### Scenario 1: Identification Fails

```
User message arrives
    ↓
All 7 methods fail to identify
    ↓
Default to Guest profile
    ↓
Offer: "I notice I don't know who you are. Would you like to log in or sign up?"
    ↓
Continue as guest OR prompt auth
```

### Scenario 2: Conflicting Context

```
User identified as "Master" but asking beginner questions
    ↓
System notes discrepancy
    ↓
Adjusts to match actual knowledge level
    ↓
Logs context conflict for review
    ↓
Updates profile with new assessment
```

### Scenario 3: User Changes Identity

```
User logs out
    ↓
Session cleared
    ↓
Next message → identifies as different user OR guest
    ↓
Context switched appropriately
    ↓
Confirmation: "Welcome back [new user]"
```

---

## Part 8: Testing & Validation

### Test Scenarios

**1. New User Flow**

```
✓ User registers with email
✓ Verification email sent
✓ User enters code correctly
✓ Profile questions presented
✓ Answers recorded
✓ Personalization activated
✓ First personalized response delivered
```

**2. User Recognition**

```
✓ Returning logged-in user recognized instantly
✓ User by email recognized
✓ User from conversation history identified
✓ Behavioral patterns match known user
✓ Context switches detected
```

**3. Personalization Quality**

```
✓ Master gets strategic responses
✓ Sister gets growth-oriented responses
✓ New users get appropriate depth
✓ Guests get clear boundaries
✓ Progression through stages works correctly
```

**4. Privacy & Security**

```
✓ Passwords hashed and never logged
✓ User can view stored data
✓ User can request deletion
✓ Conversation history respects retention policy
✓ No data leakage between users
```

---

## Part 9: Metrics & Monitoring

### Key Metrics

**Identification Success Rate:**

- % of users correctly identified on first attempt
- % needing fallback methods
- Average confidence score

**Profiling Completion:**

- % of new users completing all profiling questions
- Average time to completion
- Phase-by-phase dropout rates

**Personalization Quality:**

- User satisfaction with responses
- Relevance scores
- Engagement with personalized features
- Stage progression velocity

**Retention Metrics:**

- % of new users retained after Day 1, 7, 30
- Return user frequency
- Response satisfaction by stage

---

## Conclusion

This system ensures that:

1. **Every user is recognized** through 7 identification methods
2. **Every new user is welcomed** with a structured onboarding flow
3. **Every interaction builds context** through progressive profiling
4. **Every response is personalized** based on comprehensive user understanding
5. **Privacy is protected** with transparent controls and security best practices

The result: QMOI provides perfect responses for every user type, every interaction, from day one.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:30Z

---
*This document is maintained by QMOI's autonomous evolution system*
