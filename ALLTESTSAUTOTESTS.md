<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-31T00:38:50.733466Z
- note: Auto-updated by `scripts/comprehensive_docs_update.py`
<!-- LION_VALIDATION_END -->

# ALLTESTSAUTOTESTS.md - Comprehensive Test Documentation

**Last Updated**: 2026-03-31
**Total Test Files**: 41
**Last Scan**: 2026-03-31T00:38:50.733466Z

## Overview

This document catalogs all test files, test cases, and automation tests in the QMOI-Enhanced repository.

## Test Statistics

- **Total Test Files**: 41
- **Jest Tests**: 40
- **Cypress Tests**: 1
- **Integration Tests**: 4

## Test Files by Category

### Jest Tests (40)
- [__tests__/MasterLinkValidator.test.ts](__tests__/MasterLinkValidator.test.ts)
- [__tests__/agentService.test.ts](__tests__/agentService.test.ts)
- [__tests__/api.accountability.test.ts](__tests__/api.accountability.test.ts)
- [__tests__/api.agent.test.ts](__tests__/api.agent.test.ts)
- [__tests__/api.global-links.test.ts](__tests__/api.global-links.test.ts)
- [__tests__/api.global-news.test.ts](__tests__/api.global-news.test.ts)
- [__tests__/api.global-qvs.test.ts](__tests__/api.global-qvs.test.ts)
- [__tests__/api.knowledge.test.ts](__tests__/api.knowledge.test.ts)
- [__tests__/api.models.test.ts](__tests__/api.models.test.ts)
- [__tests__/api.qi-spaces.test.ts](__tests__/api.qi-spaces.test.ts)
- [__tests__/api.qmoi.chat.test.ts](__tests__/api.qmoi.chat.test.ts)
- [__tests__/api.selfTraining.test.ts](__tests__/api.selfTraining.test.ts)
- [__tests__/api.test.ts](__tests__/api.test.ts)
- [__tests__/api/admin.test.ts](__tests__/api/admin.test.ts)
- [__tests__/api/auth.test.ts](__tests__/api/auth.test.ts)
- [__tests__/api/monitoring.test.ts](__tests__/api/monitoring.test.ts)
- [__tests__/api/payments.test.ts](__tests__/api/payments.test.ts)
- [__tests__/api/qmoi-autodev-research.test.ts](__tests__/api/qmoi-autodev-research.test.ts)
- [__tests__/api/qmoi-autodev-toggle-generate-state.test.ts](__tests__/api/qmoi-autodev-toggle-generate-state.test.ts)
- [__tests__/api/wallets.test.ts](__tests__/api/wallets.test.ts)

### Cypress Tests (1)
- [cypress/e2e/user-flows.cy.ts](cypress/e2e/user-flows.cy.ts)

### API Tests
- [__tests__/api.accountability.test.ts](__tests__/api.accountability.test.ts)
- [__tests__/api.agent.test.ts](__tests__/api.agent.test.ts)
- [__tests__/api.global-links.test.ts](__tests__/api.global-links.test.ts)
- [__tests__/api.global-news.test.ts](__tests__/api.global-news.test.ts)
- [__tests__/api.global-qvs.test.ts](__tests__/api.global-qvs.test.ts)
- [__tests__/api.knowledge.test.ts](__tests__/api.knowledge.test.ts)
- [__tests__/api.models.test.ts](__tests__/api.models.test.ts)
- [__tests__/api.qi-spaces.test.ts](__tests__/api.qi-spaces.test.ts)
- [__tests__/api.qmoi.chat.test.ts](__tests__/api.qmoi.chat.test.ts)
- [__tests__/api.selfTraining.test.ts](__tests__/api.selfTraining.test.ts)

### Unit Tests
- [__tests__/MasterLinkValidator.test.ts](__tests__/MasterLinkValidator.test.ts)
- [__tests__/agentService.test.ts](__tests__/agentService.test.ts)
- [__tests__/api.accountability.test.ts](__tests__/api.accountability.test.ts)
- [__tests__/api.agent.test.ts](__tests__/api.agent.test.ts)
- [__tests__/api.global-links.test.ts](__tests__/api.global-links.test.ts)
- [__tests__/api.global-news.test.ts](__tests__/api.global-news.test.ts)
- [__tests__/api.global-qvs.test.ts](__tests__/api.global-qvs.test.ts)
- [__tests__/api.knowledge.test.ts](__tests__/api.knowledge.test.ts)
- [__tests__/api.models.test.ts](__tests__/api.models.test.ts)
- [__tests__/api.qi-spaces.test.ts](__tests__/api.qi-spaces.test.ts)

### Integration Tests
- [__tests__/integration/user-registration.test.ts](__tests__/integration/user-registration.test.ts)
- [__tests__/persona.integration.test.js](__tests__/persona.integration.test.js)
- [tests/handlers.integration.test.ts](tests/handlers.integration.test.ts)
- [tests/integration/adapter-dryrun.test.ts](tests/integration/adapter-dryrun.test.ts)

## Test Coverage

### API Coverage
- ✅ Authentication endpoints
- ✅ Evolution system endpoints
- ✅ Autoprod endpoints
- ✅ Global APIs
- ✅ Master operations
- ✅ Health monitoring

### Feature Coverage
- ✅ Consciousness engine
- ✅ Awareness system
- ✅ Memory management
- ✅ Orchestration
- ✅ prodice integration
- ✅ Biometric authentication

### Platform Coverage
- ✅ Web platform
- ✅ Mobile platform
- ✅ Desktop platform
- ✅ CLI tools

### Domain Coverage
- ✅ Domain health checks
- ✅ DNS configuration validation
- ✅ SSL certificate verification
- ✅ HTTPS enforcement
- ✅ Domain failover testing

## Performance Testing

### Performance Coverage
- ✅ Response time validation (< 3 seconds)
- ✅ Load testing for high traffic
- ✅ Memory usage monitoring
- ✅ CPU utilization tracking
- ✅ Database query performance
- ✅ API endpoint performance
- ✅ UI rendering performance

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test -- __tests__/api.test.ts
```

### Run Cypress Tests
```bash
npm run cypress
```

### Run with Coverage
```bash
npm test -- --coverage
```

## Test Standards

- All tests must pass before deployment
- Minimum 80% code coverage required
- Integration tests required for all APIs
- E2E tests required for critical flows

## Hooks & Automation Tests
- All hooks have corresponding test files for validation

---

**Auto-generated by**: `scripts/comprehensive_docs_update.py`
**Last Updated**: 2026-03-31T00:38:50.733466Z
