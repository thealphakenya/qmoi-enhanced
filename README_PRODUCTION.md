# QMOI Enhanced - Production-Ready Backend & API

[![CI/CD Pipeline](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/ci-cd.yml)
[![Security Audit](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/security.yml/badge.svg)](https://github.com/thealphakenya/qmoi-enhanced/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.8-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.1-2D3748)](https://www.prisma.io/)

A comprehensive, production-ready Next.js backend application with multi-provider payment processing, wallet management, and comprehensive authentication.

## Features

### 🔐 Authentication & Security

- JWT-based authentication with refresh tokens
- Two-factor authentication (2FA) with OTP/TOTP
- Password hashing with bcryptjs and validation
- Rate limiting and session management
- Email verification support

### 💳 Payment Processing

- **M-Pesa** (Safaricom) with STK Push integration
- **PayPal** payment gateway support
- **Stripe** integration (optional)
- Transaction tracking and status management
- Webhook signature verification
- Audit logging for all payments

### 👛 Wallet Management

- Multi-currency wallet support (KES, USD, EUR, GBP, UGX, TZS)
- Real-time balance updates
- Wallet-to-wallet transfers
- Transaction history and filtering
- Public key generation for security

### 📧 Communications

- **SendGrid** email with transactional templates
- **Twilio** WhatsApp and SMS integration
- **Telegram** Bot API support
- Multi-channel notifications
- Email subscription management

### 🗄️ Database & Persistence

- Prisma ORM for type-safe database access
- PostgreSQL/SQLite support
- Automated migrations
- Audit logging for compliance
- Pagination and filtering support

### ✅ Testing & Quality

- Comprehensive integration tests
- Jest unit test framework
- 70% code coverage targets
- TypeScript strict mode
- Security vulnerability scanning

## Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 12+ (or SQLite for development)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/thealphakenya/qmoi-enhanced.git
cd qmoi-enhanced

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Setup database
npx prisma migrate dev

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## API Documentation

### Authentication

#### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!@#"
}
```

**Response (201 Created):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

### Users

#### Get Profile

```bash
GET /api/users/profile
Authorization: Bearer {accessToken}
```

#### Update Profile

```bash
PUT /api/users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+254700000000",
  "bio": "Software developer"
}
```

### Wallets

#### List Wallets

```bash
GET /api/wallets?skip=0&take=10
Authorization: Bearer {accessToken}
```

#### Create Wallet

```bash
POST /api/wallets
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currency": "KES"
}
```

#### Get Wallet Details

```bash
GET /api/wallets/{walletId}
Authorization: Bearer {accessToken}
```

### Transactions

#### List Transactions

```bash
GET /api/transactions?skip=0&take=10&status=pending
Authorization: Bearer {accessToken}
```

#### Initiate Payment

```bash
POST /api/payments/initiate
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "walletId": "wallet-uuid",
  "amount": 100,
  "phoneNumber": "+254700000000",
  "paymentMethod": "mpesa"
}
```

## Configuration

### Environment Variables

See [.env.local.example](.env.local.example) for complete configuration template.

**Key Variables:**

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `SENDGRID_API_KEY` - SendGrid email API key
- `MPESA_CONSUMER_KEY` - M-Pesa OAuth credentials
- `TWILIO_ACCOUNT_SID` - Twilio account identifier
- `TELEGRAM_BOT_TOKEN` - Telegram Bot API token

## Development

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Specific test file
npm run test -- auth.test.ts
```

### TypeScript Checking

```bash
# Type check entire codebase
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Database Management

```bash
# Create migration
npx prisma migrate dev --name migration_name

# View database in GUI
npx prisma studio

# Generate Prisma client
npx prisma generate

# Reset database
npx prisma migrate reset
```

## Deployment

### Docker

```bash
# Build Docker image
docker build -t qmoi-enhanced:latest .

# Run container
docker run -e DATABASE_URL=postgresql://... \
           -e JWT_SECRET=your-secret \
           -p 3000:3000 \
           qmoi-enhanced:latest
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guides.

### GitHub Actions CI/CD

Automatic deployment on:

- Push to `main` → Production
- Push to `develop` → Staging
- Pull requests → Testing & quality checks

## Project Structure

```
qmoi-enhanced/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── users/             # User management
│   │   ├── wallets/           # Wallet operations
│   │   ├── payments/          # Payment processing
│   │   ├── transactions/      # Transaction tracking
│   │   └── webhooks/          # Webhook handlers
│   └── components/            # React components
│       ├── auth/              # Authentication UI
│       ├── wallet/            # Wallet management UI
│       └── user/              # User profile UI
├── lib/
│   ├── db/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── services.ts       # Database services
│   ├── auth/
│   │   └── service.ts        # Authentication utilities
│   ├── payments/
│   │   └── service.ts        # Payment provider integrations
│   ├── email/
│   │   └── service.ts        # Email notifications
│   └── notifications/
│       └── service.ts        # Multi-channel notifications
├── __tests__/
│   ├── api/                   # API integration tests
│   ├── integration/           # End-to-end tests
│   └── utils/                 # Test utilities
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration files
├── scripts/
│   ├── deploy-docker.sh      # Docker deployment
│   ├── deploy-prod.sh        # Production deployment
│   ├── setup-dev.sh          # Development setup
│   └── migrate-db.sh         # Database migration
└── PRODUCTION_SETUP.md        # Complete setup guide
```

## Architecture

### Service Layer Pattern

- **Database Services** - Prisma-based CRUD operations
- **Authentication Service** - JWT, password hashing, validation
- **Payment Services** - Multi-provider payment processing
- **Email Service** - Transactional email templates
- **Notification Services** - Multi-channel communication

### API Route Pattern

- Type-safe NextRequest/NextResponse handlers
- JWT authentication verification
- Request validation and error handling
- Proper HTTP status codes
- Audit logging for sensitive operations

## Security

### Best Practices

- ✅ No hardcoded secrets (all via environment variables)
- ✅ Password hashing with bcryptjs
- ✅ JWT refresh token rotation
- ✅ Webhook signature verification (HMAC-SHA256)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Rate limiting hooks
- ✅ Audit trail logging
- ✅ HTTPS enforced in production
- ✅ CORS properly configured
- ✅ Input validation on all endpoints

### Compliance

- PCI DSS for payment handling
- GDPR-ready with audit logs
- Email verification for account security
- Two-factor authentication support

## Monitoring & Logging

- Winston-based logging with log levels
- Structured error logging with context
- Database query logging in development
- Audit trail for all financial operations
- Application Health check endpoint: `GET /health`

## Performance

- TypeScript strict mode for type safety
- NextJS automatic code splitting
- Database query optimization with Prisma
- Pagination support for large datasets
- Caching headers on static assets
- Compression enabled

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request with description

### Code Standards

- TypeScript strict mode
- ESLint and Prettier formatting
- Jest test coverage 70%+
- No console.log in production code
- Proper error handling and logging

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Reset migrations
npx prisma migrate reset

# View database state
npx prisma studio
```

### Payment Integration Issues

- Verify provider credentials in `.env.local`
- Check webhook URLs are publicly accessible
- Test with provider sandbox first
- Review webhook logs for errors

### Authentication Issues

- Verify JWT_SECRET is set consistently
- Check token expiration times
- Test token refresh flow
- Verify CORS settings

## License

MIT - See [LICENSE](LICENSE) file for details

## Support

For issues, questions, or contributions:

- 📧 Email: support@qmoi.app
- 🐙 GitHub Issues: [Report a bug](https://github.com/thealphakenya/qmoi-enhanced/issues)
- 💬 Discussions: [Start a discussion](https://github.com/thealphakenya/qmoi-enhanced/discussions)

## Changelog

### v2.0.0 (Current)

- ✨ Production-ready service layer
- ✨ Multi-provider payment processing
- ✨ Comprehensive authentication system
- ✨ Integration test suite
- ✨ CI/CD pipeline with GitHub Actions
- ✨ Docker deployment support
- ✨ Frontend React components

### v1.0.0

- Initial release

---

**Built with ❤️ by the QMOI Team**
