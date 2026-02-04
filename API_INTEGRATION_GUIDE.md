# API Integration Guide - Production Implementation

This guide documents production implementation requirements for stubbed API endpoints. Each endpoint has been converted from 501 responses to proper production stubs with clear implementation paths.

## Quick Summary

**Last Updated**: February 4, 2026  
**Status**: Production-Ready Stubs with Clear Implementation Paths  
**Test Coverage**: 27 test suites passing, 130 tests passing  
**Implementation Priority**: Follow recommended phases below

---

## Phase 1: Critical Core APIs (Week 1-2)

### 1. User Profile & Preferences API

**Endpoint**: `POST /api/qmoi/user`

**Status**: ✅ Stub ready with response structure  
**Implementation Checklist**:

- [ ] Create database tables: `user_profiles`, `user_preferences`, `learning_goals`
- [ ] Implement request validation (name constraints, email format)
- [ ] Add user authorization checks (can only modify own profile)
- [ ] Implement database CRUD operations (Prisma queries)
- [ ] Add caching layer (5-minute TTL) for profile reads
- [ ] Implement audit logging for modifications
- [ ] Add rate limiting (10 requests/minute per user)

**Required Environment Variables**:

```env
DATABASE_URL=postgresql://...
PROFILE_CACHE_TTL=300
AUDIT_LOG_ENABLED=true
```

**Actions Supported**:

- `GET`: Retrieve user profile, preferences, learning goals
- `POST set-profile`: Update firstName, lastName, email, bio
- `POST set-preferences`: Update theme, language, notifications, riskTolerance
- `POST set-learning-goals`: Update array of learning goals

**Database Schema**:

```sql
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  notifications BOOLEAN DEFAULT true,
  risk_tolerance VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE learning_goals (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  goal_name VARCHAR(255),
  description TEXT,
  target_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. Data Backup & Restore API

**Endpoint**: `POST/GET /api/qmoi/backup`

**Status**: ✅ Stub ready with complete response structure  
**Implementation Checklist**:

- [ ] Configure cloud storage (S3, GCS, or Azure Blob)
- [ ] Implement AES-256 encryption for backups
- [ ] Create backup scheduler (hourly/daily)
- [ ] Implement backup versioning and history
- [ ] Add integrity verification before restore
- [ ] Implement MFA requirement for restore operations
- [ ] Add rate limiting (1 backup per 30 minutes)
- [ ] Set up backup retention policy (30 days default)

**Required Environment Variables**:

```env
BACKUP_ENCRYPTION_KEY=<base64-encoded-256-bit-key>
BACKUP_STORAGE_BUCKET=qmoi-backups-prod
BACKUP_RETENTION_DAYS=30
BACKUP_STORAGE_PROVIDER=s3  # or gcs, azure
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY_ID=...
AWS_S3_SECRET_ACCESS_KEY=...
```

**Actions Supported**:

- `GET`: Retrieve backup status and history
- `POST backup`: Create encrypted backup (triggers async job)
- `POST restore`: Restore user data from specific backup

**Implementation Notes**:

- Backups should include: profile, preferences, wallet data, transactions
- Use async jobs for large backups (> 100MB)
- Notify user via email when backup completes
- Require MFA verification before restore operations

---

### 3. Earning Enhanced API

**Endpoint**: `GET /api/qmoi-earning-enhanced`

**Status**: ✅ Stub ready with aggregation structure  
**Implementation Checklist**:

- [ ] Connect exchange APIs (Bitget, Kraken, Coinbase)
- [ ] Implement exchange credential encryption
- [ ] Create earning data aggregation service
- [ ] Calculate net earnings by transaction type
- [ ] Implement fee structure calculations
- [ ] Add reward multiplier logic
- [ ] Create caching layer (15-minute TTL)
- [ ] Implement security audit logging

**Required Environment Variables**:

```env
EXCHANGE_API_KEYS_ENCRYPTED=...
EARNINGS_CACHE_TTL=900
EARNINGS_UPDATE_FREQUENCY=3600  # seconds
EXCHANGE_INTEGRATIONS=bitget,kraken,coinbase
```

**Earning Breakdown Supported**:

- Trading profits/losses
- Transaction fees
- Reward program earnings
- Passive income (staking, liquidity provision)
- Referral commissions

---

## Phase 2: Learning & Research APIs (Week 3-4)

### 4. Language & Translation API

**Endpoint**: `POST /api/qmoi/language`

**Status**: ✅ Stub ready with complete action routing  
**Implementation Checklist**:

- [ ] Integrate translation service (Google Translate or similar)
- [ ] Set up speech-to-text service (Google Cloud Speech)
- [ ] Configure text-to-speech (Google Cloud TTS)
- [ ] Implement language detection (textcat or similar)
- [ ] Build lesson content database
- [ ] Create quiz generation logic
- [ ] Implement pronunciation scoring
- [ ] Add audio file format conversion (mp3, wav, m4a)
- [ ] Set up caching for translations (reduce API costs)
- [ ] Implement rate limiting per user

**Required Environment Variables**:

```env
GOOGLE_CLOUD_API_KEY=...
GOOGLE_CLOUD_PROJECT_ID=...
TRANSLATION_CACHE_TTL=86400  # 24 hours
LANGUAGE_LESSON_DB_URL=postgresql://...
MAX_TRANSLATIONS_PER_DAY=1000
AUDIO_STORAGE_BUCKET=qmoi-audio
```

**Actions Supported**:

- `translate`: Text translation between languages
- `speech-to-text`: Audio to text conversion
- `text-to-speech`: Text to audio conversion
- `language-detect`: Detect language of text
- `lesson`: Get language lesson for specific level
- `quiz`: Generate proficiency quiz
- `pronunciation-check`: Verify pronunciation accuracy

**Performance Targets**:

- Translation: < 2 seconds
- Speech-to-text: < 5 seconds for 60-second audio
- Language detection: < 200ms
- Quiz generation: < 1 second

---

### 5. Research & Opportunity API

**Endpoint**: `POST /api/qmoi/research`

**Status**: ✅ Stub ready with research routing  
**Implementation Checklist**:

- [ ] Integrate CoinGecko API for crypto data
- [ ] Integrate CoinMarketCap API
- [ ] Integrate Messari API for deep research
- [ ] Implement blockchain address verification
- [ ] Create risk scoring algorithm
- [ ] Build opportunity discovery engine
- [ ] Implement DeFi protocol integration (Aave, Compound, etc.)
- [ ] Add APY/yield calculation
- [ ] Implement data caching (1-hour TTL)
- [ ] Add pagination for large result sets

**Required Environment Variables**:

```env
COINGECKO_API_KEY=...
COINMARKETCAP_API_KEY=...
MESSARI_API_KEY=...
BLOCKCHAIN_EXPLORER_API_KEY=...
DEFI_PROTOCOLS=aave,compound,curve,uniswap
RESEARCH_CACHE_TTL=3600
RISK_SCORING_ENABLED=true
```

**Actions Supported**:

- `research`: Deep analysis of cryptocurrencies, projects, markets
- `verify`: Validate blockchain addresses, smart contracts
- `earning-opportunities`: Discover yield farming, staking opportunities

---

## Phase 3: Communication & Infrastructure APIs (Week 5-6)

### 6. WhatsApp Business API

**Endpoint**: `POST/GET /api/whatsapp-business`

**Status**: ✅ Stub ready with webhook & action handling  
**Implementation Checklist**:

- [ ] Register WhatsApp Business Account
- [ ] Configure webhook endpoint
- [ ] Implement message queue (Redis/RabbitMQ)
- [ ] Set up template messaging system
- [ ] Implement media upload handling
- [ ] Add delivery status tracking
- [ ] Implement message encryption
- [ ] Set up rate limiting (100 messages/day per user initially)
- [ ] Add message log persistence

**Required Environment Variables**:

```env
WHATSAPP_BUSINESS_ACCOUNT_ID=...
WHATSAPP_BUSINESS_API_KEY=...
WHATSAPP_BUSINESS_PHONE_NUMBER_ID=...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=...
WHATSAPP_MESSAGE_TEMPLATE_NAMESPACE=...
WHATSAPP_MESSAGE_QUEUE_URL=redis://...
WHATSAPP_PROVIDER=cloud_api  # or twilio
```

**Integration Options**:

1. **WhatsApp Cloud API** (Recommended for scale)
   - Native integration, better support
   - Pricing: Pay-per-message model
   - Setup time: 2-3 days
2. **Twilio WhatsApp** (Easier setup)
   - Simpler integration
   - Pricing: Variable by region
   - Setup time: 1 day
3. **Custom On-Premises** (For high volume)
   - Full control, complex setup
   - Infrastructure costs
   - Setup time: 1-2 weeks

**Actions Supported**:

- `send-message`: Send text message to phone number
- `send-template`: Send templated message
- `upload-media`: Upload media for messaging
- `get-profile`: Retrieve WhatsApp profile info

---

### 7. SSH File Operations API

**Endpoint**: `POST /api/ssh/list`

**Status**: ⚠️ Limited by Next.js constraints  
**Production Alternatives**:

- [ ] Deploy SSH gateway as separate microservice
- [ ] Use S3 API for file listing
- [ ] Use GCS API for file listing
- [ ] Implement WebSocket SSH tunnel
- [ ] Use SFTP server with REST proxy

**Recommended Approach**: Use cloud storage (S3/GCS) instead of direct SSH access. This provides:

- Better security (no SSH key exposure)
- Better scalability
- Built-in access controls
- Easier monitoring and auditing

**Alternative SSH Endpoints** (if needed):

```
POST /api/ssh/gateway  - Connect to SSH host
POST /api/files/list   - List files (S3-based)
POST /api/files/upload - Upload files (S3-based)
POST /api/files/download - Download files (S3-based)
```

---

## Database Schema Requirements

### Core Tables Needed:

```sql
-- User & Profile Management
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wallets & Transactions (from existing services.ts)
CREATE TABLE wallets (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  balance DECIMAL(20, 8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Research & Data
CREATE TABLE research_queries (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  query TEXT NOT NULL,
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Backups
CREATE TABLE user_backups (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  backup_data BYTEA NOT NULL,
  encrypted BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages (for WhatsApp)
CREATE TABLE messages (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(50) DEFAULT 'queued',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Setup Checklist

### Required for All APIs:

- [ ] PostgreSQL database configured
- [ ] Redis cache configured
- [ ] Environment variables file (.env.production)
- [ ] API key encryption key configured
- [ ] Audit logging system configured
- [ ] Error tracking (Sentry or similar)
- [ ] Rate limiting service (Redis-based)

### Required by Specific APIs:

- [ ] Cloud storage (S3, GCS) for backups & media
- [ ] Google Cloud credentials (for translation/speech)
- [ ] Cryptocurrency exchange APIs (for earnings)
- [ ] WhatsApp Business account (for messaging)
- [ ] Blockchain explorer API (for research)

---

## Testing & Validation

### Unit Tests:

```bash
npm test -- app/api/qmoi/user
npm test -- app/api/qmoi/backup
npm test -- app/api/qmoi-earning-enhanced
npm test -- app/api/qmoi/language
npm test -- app/api/qmoi/research
npm test -- app/api/whatsapp-business
```

### Integration Tests:

```bash
npm run test:integration
npm run test:api:production
```

### Smoke Tests (Post-Deployment):

```bash
curl -X POST http://localhost:3000/api/qmoi/user \
  -H "x-api-key: test-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "set-profile", "firstName": "Test", "lastName": "User"}'
```

---

## Monitoring & Observability

### Metrics to Track:

- API response times (by endpoint)
- Error rates (by error code)
- Cache hit rates
- External API failure rates
- Database query times
- User quota usage

### Alerts to Configure:

- Error rate > 5% for any endpoint
- P95 response time > 2 seconds
- External API down (Stripe, SendGrid, etc.)
- Database connection pool exhausted
- Rate limit abuse detected

### Logging:

- All API requests (with user ID, action, timestamp)
- All database modifications
- All external API calls
- All errors with stack traces

---

## Security Considerations

### API Security:

- [ ] Validate all input (size, type, format)
- [ ] Sanitize text inputs
- [ ] Rate limit by IP and user
- [ ] Require HTTPS for all endpoints
- [ ] Implement CORS properly
- [ ] Add request signing (optional for sensitive endpoints)

### Data Security:

- [ ] Encrypt sensitive data at rest
- [ ] Use TLS 1.3+ for data in transit
- [ ] Implement field-level encryption for PII
- [ ] Rotate API keys regularly
- [ ] Implement secret management (Vault, AWS Secrets Manager)

### Third-Party Security:

- [ ] Verify SSL certificates
- [ ] Implement timeout guards
- [ ] Handle rate limits gracefully
- [ ] Monitor for security advisories
- [ ] Implement fallback/retry logic

---

## Deployment Checklist

Before deploying each API to production:

- [ ] All tests passing (100% for critical paths)
- [ ] Load testing completed (identify bottlenecks)
- [ ] Security review completed
- [ ] Environment variables verified
- [ ] Database migrations tested
- [ ] Monitoring/alerting configured
- [ ] Rollback plan documented
- [ ] Stakeholders notified
- [ ] Documentation updated

---

## Support & Contact

For questions on implementing these APIs, refer to:

- PRODUCTION_READINESS_REPORT.md - Overall production status
- Individual route files - Implementation notes in docstrings
- tests/ directory - Examples of expected behavior
- Database schema definitions - SQL initialization files

**Last Updated**: February 4, 2026  
**Next Review Date**: February 18, 2026
