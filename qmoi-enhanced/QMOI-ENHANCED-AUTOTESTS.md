<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Enhanced Automation Autotests

## Overview

The QMOI Enhanced Automation Autotests system provides comprehensive testing capabilities for all QMOI features and components. This system includes unit tests, integration tests, E2E tests, performance tests, security tests, accessibility tests, and many more specialized test types.

## Features

### 🧪 Comprehensive Test Coverage
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user journey testing
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability and security scanning
- **Accessibility Tests**: WCAG compliance testing
- **Compatibility Tests**: Cross-browser and device testing
- **Visual Tests**: UI regression testing
- **API Tests**: Backend endpoint testing
- **Database Tests**: Data integrity testing
- **Network Tests**: Connectivity and API testing
- **Mobile Tests**: Mobile device testing
- **Localization Tests**: Multi-language support testing

### 📊 Advanced Reporting
- HTML test reports
- JSON test results
- JUnit XML reports
- Coverage reports (HTML, JSON, LCOV)
- Performance metrics
- Screenshots for failed tests
- Video recordings
- Test artifacts

### 🔔 Smart Notifications
- Email notifications
- Slack integration
- Discord integration
- Telegram integration
- Pushover notifications
- Custom webhook support

### ⚡ Performance Features
- Parallel test execution
- Retry mechanisms
- Timeout handling
- Resource optimization
- Memory management
- Disk space monitoring

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/q-city/qmoi-enhanced.git
cd qmoi-enhanced

# Install dependencies
npm install

# Run all tests
npm run test:all

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Basic Usage

```bash
# Run all automation tests
npm run autotest:all

# Run quick tests (smoke + sanity)
npm run autotest:quick

# Run tests with coverage
npm run autotest:coverage

# Run tests in CI mode
npm run autotest:ci

# Run tests in watch mode
npm run autotest:watch
```

## Test Suites

### Unit Tests
```bash
npm run test:unit
```
- Tests individual functions and components
- Fast execution
- High coverage requirements
- [PRODUCTION IMPLEMENTATION REQUIRED] external dependencies

### Integration Tests
```bash
npm run test:integration
```
- Tests component interactions
- Database integration
- API integration
- External service integration

### E2E Tests
```bash
npm run test:e2e
```
- Full user journey testing
- Browser automation
- Real user scenarios
- Cross-browser testing

### Performance Tests
```bash
npm run test:performance
```
- Load testing
- Stress testing
- Response time measurement
- Throughput analysis

### Security Tests
```bash
npm run test:security
```
- Vulnerability scanning
- Dependency auditing
- Security best practices
- Penetration testing

### Accessibility Tests
```bash
npm run test:accessibility
```
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast testing

## Configuration

### Test Configuration (`config/test-config.json`)

```json
{
  "parallel": true,
  "timeout": 30000,
  "retries": 3,
  "enableNotifications": true,
  "generateReports": true,
  "coverage": true,
  "testSuites": {
    "unit": {
      "enabled": true,
      "pattern": "**/*.test.js",
      "coverage": true,
      "timeout": 5000
    },
    "integration": {
      "enabled": true,
      "pattern": "**/*.integration.test.js",
      "coverage": true,
      "timeout": 15000
    }
  }
}
```

### Environment Configuration

```json
{
  "environments": {
    "development": {
      "baseUrl": "http://localhost:3000",
      "apiUrl": "http://localhost:3001",
      "database": "qmoi_dev"
    },
    "staging": {
      "baseUrl": "https://staging.q-city.ai",
      "apiUrl": "https://api-staging.q-city.ai",
      "database": "qmoi_staging"
    },
    "production": {
      "baseUrl": "https://q-city.ai",
      "apiUrl": "https://api.q-city.ai",
      "database": "qmoi_prod"
    }
  }
}
```

## Test Scripts

### Available Scripts

```bash
# Core test commands
npm run test:all              # Run all tests
npm run test:unit             # Unit tests only
npm run test:integration      # Integration tests only
npm run test:e2e              # E2E tests only
npm run test:performance      # Performance tests only
npm run test:security         # Security tests only
npm run test:accessibility    # Accessibility tests only

# Automation test commands
npm run autotest:all          # Run all automation tests
npm run autotest:quick        # Quick tests (smoke + sanity)
npm run autotest:parallel     # Parallel test execution
npm run autotest:coverage     # Tests with coverage
npm run autotest:report       # Generate test reports
npm run autotest:ci           # CI/CD mode
npm run autotest:watch        # Watch mode
npm run autotest:debug        # Debug mode

# Test utilities
npm run test:coverage         # Generate coverage report
npm run test:report           # Generate HTML report
npm run test:junit            # Generate JUnit XML
npm run test:screenshots      # Capture screenshots
npm run test:video            # Record test videos
npm run test:metrics          # Generate performance metrics

# Test management
npm run test:setup            # Setup test environment
npm run test:teardown         # Cleanup test environment
npm run test:clean            # Clean test artifacts
npm run test:validate         # Validate test configuration
npm run test:prepare          # Prepare for testing
npm run test:complete         # Complete test cycle
```

## Test Structure

### Directory Structure

```
tests/
├── unit/                     # Unit tests
│   ├── components/           # Component tests
│   ├── services/             # Service tests
│   ├── utils/                # Utility tests
│   └── models/               # Model tests
├── integration/              # Integration tests
│   ├── api/                  # API integration tests
│   ├── database/             # Database integration tests
│   └── external/             # External service tests
├── e2e/                      # E2E tests
│   ├── user-flows/           # User journey tests
│   ├── scenarios/            # Test scenarios
│   └── workflows/            # Workflow tests
├── performance/              # Performance tests
│   ├── load/                 # Load tests
│   ├── stress/               # Stress tests
│   └── benchmarks/           # Benchmark tests
├── security/                 # Security tests
│   ├── vulnerabilities/      # Vulnerability tests
│   ├── authentication/       # Auth tests
│   └── authorization/        # Authorization tests
├── accessibility/            # Accessibility tests
│   ├── wcag/                 # WCAG compliance tests
│   ├── screen-readers/       # Screen reader tests
│   └── keyboard/             # Keyboard navigation tests
├── compatibility/            # Compatibility tests
│   ├── browsers/             # Browser compatibility
│   ├── devices/              # Device compatibility
│   └── platforms/            # Platform compatibility
├── visual/                   # Visual tests
│   ├── screenshots/          # Screenshot tests
│   ├── regression/           # Visual regression tests
│   └── baseline/             # Baseline images
├── api/                      # API tests
│   ├── endpoints/            # Endpoint tests
│   ├── contracts/            # Contract tests
│   └── integration/          # API integration tests
├── database/                 # Database tests
│   ├── queries/              # Query tests
│   ├── migrations/           # Migration tests
│   └── integrity/            # Data integrity tests
├── network/                  # Network tests
│   ├── connectivity/         # Connectivity tests
│   ├── latency/              # Latency tests
│   └── bandwidth/            # Bandwidth tests
├── mobile/                   # Mobile tests
│   ├── ios/                  # iOS tests
│   ├── android/              # Android tests
│   └── responsive/           # Responsive design tests
├── cross-browser/            # Cross-browser tests
│   ├── chrome/               # Chrome tests
│   ├── firefox/              # Firefox tests
│   ├── safari/               # Safari tests
│   └── edge/                 # Edge tests
└── localization/             # Localization tests
    ├── languages/            # Language tests
    ├── regions/              # Regional tests
    └── formats/              # Format tests
```

### Test File Naming Convention

```
ComponentName.test.js              # Unit tests
ComponentName.integration.test.js  # Integration tests
ComponentName.e2e.test.js          # E2E tests
ComponentName.perf.test.js         # Performance tests
ComponentName.security.test.js     # Security tests
ComponentName.a11y.test.js         # Accessibility tests
ComponentName.visual.test.js       # Visual tests
ComponentName.api.test.js          # API tests
ComponentName.database.test.js     # Database tests
ComponentName.network.test.js      # Network tests
ComponentName.mobile.test.js       # Mobile tests
ComponentName.cross-browser.test.js # Cross-browser tests
ComponentName.localization.test.js # Localization tests
```

## Writing Tests

### Unit Test Example

```javascript
// tests/unit/components/Button.test.js
import { render, fireEvent } from '@testing-library/react';
import Button from '../../../components/Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies disabled state correctly', () => {
    const { getByText } = render(<Button disabled>Click me</Button>);
    expect(getByText('Click me')).toBeDisabled();
  });
});
```

### Integration Test Example

```javascript
// tests/integration/api/user.integration.test.js
import request from 'supertest';
import app from '../../../app';
import { setupTestDatabase, teardownTestDatabase } from '../../utils/database';

describe('User API Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  test('creates a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
  });

  test('validates required fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({})
      .expect(400);

    expect(response.body.errors).toHaveLength(3);
  });
});
```

### E2E Test Example

```javascript
// tests/e2e/user-flows/registration.e2e.test.js
describe('User Registration Flow', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('completes user registration successfully', () => {
    // Fill registration form
    cy.get('[data-testid="name-input"]').type('John Doe');
    cy.get('[data-testid="email-input"]').type('john@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="confirm-password-input"]').type('password123');

    // Submit form
    cy.get('[data-testid="register-button"]').click();

    // Verify success
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome, John');
  });

  it('shows validation errors for invalid input', () => {
    // Submit empty form
    cy.get('[data-testid="register-button"]').click();

    // Verify validation errors
    cy.get('[data-testid="name-error"]').should('be.visible');
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
  });
});
```

## Test Reports

### HTML Report
```bash
npm run test:report
```
Generates an interactive HTML report with:
- Test results summary
- Failed test details
- Screenshots and videos
- Performance metrics
- Coverage information

### Coverage Report
```bash
npm run test:coverage
```
Generates coverage reports showing:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage
- Uncovered code highlighting

### Performance Report
```bash
npm run test:metrics
```
Generates performance reports including:
- Response times
- Throughput metrics
- Resource usage
- Load test results
- Stress test results

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: QMOI Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - run: npm ci
    
    - run: npm run test:ci
    
    - run: npm run autotest:ci
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
    
    - name: Upload test results
      uses: actions/upload-artifact@v4
      with:
        name: test-results
        path: test-results/
```

> **Note:** All workflows are now automatically updated to use the latest supported version of `actions/upload-artifact` (currently v4). This is automated for future-proofing and compliance with GitHub Actions deprecation policies.

### Jenkins Pipeline Example

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    stages {
        stage('Setup') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'npm run test:unit'
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'npm run test:integration'
            }
        }
        
        stage('E2E Tests') {
            steps {
                sh 'npm run test:e2e'
            }
        }
        
        stage('Performance Tests') {
            steps {
                sh 'npm run test:performance'
            }
        }
        
        stage('Security Tests') {
            steps {
                sh 'npm run test:security'
            }
        }
        
        stage('Generate Reports') {
            steps {
                sh 'npm run test:report'
                sh 'npm run test:coverage'
                sh 'npm run test:metrics'
            }
        }
    }
    
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'test-results',
                reportFiles: 'report.html',
                reportName: 'Test Report'
            ])
            
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
    }
}
```

## Best Practices

### Test Organization
1. **Group related tests** in describe blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Follow the AAA pattern**: Arrange, Act, Assert
4. **Keep tests independent** and isolated
5. **Use meaningful assertions** with clear error messages

### Test Data Management
1. **Use factories** for creating test data
2. **Clean up test data** after each test
3. **Use fixtures** for complex test data
4. **[PRODUCTION IMPLEMENTATION REQUIRED] external dependencies** appropriately
5. **Use test databases** for integration tests

### Performance Testing
1. **Set realistic thresholds** for performance metrics
2. **Test under realistic conditions** with production-like data
3. **Monitor resource usage** during tests
4. **Use appropriate load patterns** for different scenarios
5. **Analyze performance trends** over time

### Security Testing
1. **Test authentication** thoroughly
2. **Validate authorization** for all endpoints
3. **Check for common vulnerabilities** (SQL injection, XSS, etc.)
4. **Test input validation** and sanitization
5. **Verify secure communication** (HTTPS, encryption)

### Accessibility Testing
1. **Test with screen readers** and assistive technologies
2. **Verify keyboard navigation** works correctly
3. **Check color contrast** meets WCAG guidelines
4. **Test with different zoom levels** and font sizes
5. **Validate semantic HTML** structure

## Troubleshooting

### Common Issues

#### Tests Failing Intermittently
```bash
# Increase timeout
npm run test:timeout

# Run with retries
npm run test:retry

# Run sequentially
npm run test:sequential
```

#### Memory Issues
```bash
# Clear cache
npm run test:clear

# Run with memory optimization
NODE_OPTIONS="--max-old-space-size=4096" npm run test:all
```

#### Coverage Issues
```bash
# Check coverage thresholds
npm run test:coverage:threshold

# Generate detailed coverage report
npm run test:coverage -- --coverageReporters=html,json,lcov
```

#### Performance Issues
```bash
# Run performance tests only
npm run test:performance

# Check system resources
npm run health:check

# Optimize system
npm run optimize:all
```

### Debug Mode
```bash
# Run tests in debug mode
npm run test:debug

# Run specific test in debug mode
npm run test:debug -- --testNamePattern="Button Component"
```

## Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/q-city/qmoi-enhanced/issues)
- **Discussions**: [GitHub Discussions](https://github.com/q-city/qmoi-enhanced/discussions)
- **Documentation**: [Wiki](https://github.com/q-city/qmoi-enhanced/wiki)
- **Email**: team@q-city.ai

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- QMOI_VALIDATION_START -->
{
  "file": "qmoi-enhanced/QMOI-ENHANCED-AUTOTESTS.md",
  "validated_at": "2025-10-26T20:51:24.673521Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Enhanced Automation Autotests"
    },
    {
      "name": "links",
      "ok": true,
      "detail": [
        {
          "label": "LICENSE",
          "target": "LICENSE",
          "ok": true
        }
      ]
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->
