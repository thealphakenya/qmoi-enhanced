# Alpha-Q AI System Test Documentation

## Overview

This document provides comprehensive information about the testing infrastructure for the Alpha-Q AI system, including error fixing capabilities, multi-user session management, and automated testing procedures.

## Table of Contents

1. [Test Architecture](#test-architecture)
2. [Error Fixing Tests](#error-fixing-tests)
3. [Multi-User Session Tests](#multi-user-session-tests)
4. [Automated Testing](#automated-testing)
5. [Test Reports](#test-reports)
6. [Running Tests](#running-tests)
7. [Continuous Integration](#continuous-integration)
8. [Troubleshooting](#troubleshooting)

## Test Architecture

### Directory Structure
```
tests/
├── unit/
│   ├── test_error_fixing.py          # Error fixing unit tests
│   ├── test_multi_user_session.py    # Multi-user session tests
│   └── test_ai_components.py         # AI component tests
├── integration/
│   ├── test_error_fixing_integration.py  # End-to-end error fixing
│   ├── test_session_integration.py       # Session integration tests
│   └── test_ai_integration.py            # AI system integration
├── e2e/
│   ├── test_full_workflow.py         # Complete system workflow
│   └── test_performance.py           # Performance tests
└── reports/
    ├── test_results.log              # Test execution logs
    └── error_fixing_test_report_*.json  # Detailed test reports
```

### Test Categories

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **End-to-End Tests**: Test complete workflows
4. **Performance Tests**: Test system performance under load
5. **Error Recovery Tests**: Test system resilience

## Error Fixing Tests

### Purpose
The error fixing test suite ensures that the AI system can:
- Detect various types of errors automatically
- Apply appropriate fixes
- Recover from failures
- Maintain system stability

### Test Coverage

#### 1. Error Detection Tests
```python
def test_error_detection(self):
    """Tests detection of syntax, runtime, import, and logical errors"""
```

**Covered Error Types:**
- Syntax errors (missing parentheses, incorrect indentation)
- Runtime errors (division by zero, undefined variables)
- Import errors (missing modules)
- Logical errors (incorrect variable scope)
- Best practice violations (bare except clauses)

#### 2. Auto-Fix Capabilities
```python
def test_auto_fix_capabilities(self):
    """Tests automatic fixing of common programming errors"""
```

**Fix Types:**
- Syntax corrections
- Import statement fixes
- Indentation fixes
- Variable scope corrections
- Best practice improvements

#### 3. Error Recovery Tests
```python
def test_error_recovery(self):
    """Tests system recovery from various error scenarios"""
```

**Recovery Scenarios:**
- Database connection failures
- API timeouts
- Memory overflow
- Network connectivity issues

#### 4. Fallback Mechanisms
```python
def test_fallback_mechanisms(self):
    """Tests fallback systems when primary fixes fail"""
```

**Fallback Types:**
- Cache-based recovery
- Retry mechanisms
- Alternative service endpoints
- Graceful degradation

#### 5. Concurrent Error Handling
```python
def test_concurrent_error_handling(self):
    """Tests handling multiple simultaneous errors"""
```

**Concurrency Tests:**
- Multiple syntax errors
- Mixed error types
- Resource contention
- Race conditions

### Running Error Fixing Tests

```bash
# Run all error fixing tests
python tests/unit/test_error_fixing.py

# Run with detailed output
python tests/unit/test_error_fixing.py -v

# Run specific test
python -m pytest tests/unit/test_error_fixing.py::TestErrorFixing::test_error_detection
```

## Multi-User Session Tests

### Purpose
The multi-user session tests verify that the system can:
- Handle multiple users simultaneously
- Manage user contexts and preferences
- Support group collaborations
- Maintain session state
- Provide appropriate AI responses based on user relationships

### Test Coverage

#### 1. Session Management
```python
def test_create_session(self):
    """Tests session creation and initialization"""
```

**Session Features:**
- Session creation and cleanup
- User joining and leaving
- Session state persistence
- Inactive session cleanup

#### 2. User Management
```python
def test_join_session(self):
    """Tests user session joining with various roles"""
```

**User Roles:**
- Master (full system control)
- Admin (group management)
- User (standard access)
- Guest (limited access)

#### 3. Group Management
```python
def test_create_group(self):
    """Tests group creation and management"""
```

**Group Types:**
- Class (educational context)
- Team (collaborative work)
- Project (task-focused)
- Study (learning groups)

#### 4. Context Management
```python
def test_update_user_context(self):
    """Tests user context updates and persistence"""
```

**Context Elements:**
- Current project/task
- Recent files
- Search history
- AI interaction mode
- Relationship type

#### 5. AI Relationship Context
```python
def test_ai_relationship_context_individual(self):
    """Tests AI behavior in individual user relationships"""
```

**AI Modes:**
- Assistant (general help)
- Collaborator (peer-level interaction)
- Teacher (educational guidance)
- Mentor (expert guidance)

### Running Multi-User Tests

```bash
# Run all multi-user tests
python tests/unit/test_multi_user_session.py

# Run with verbose output
python tests/unit/test_multi_user_session.py -v

# Run specific test category
python -m pytest tests/unit/test_multi_user_session.py::TestMultiUserSessionManager::test_group_management
```

## Automated Testing

### Test Watcher
The system includes an automated test watcher that monitors file changes and runs relevant tests:

```bash
# Start the test watcher
python scripts/watch_error_fixing.py
```

**Features:**
- File change detection
- Automatic test execution
- Desktop notifications
- Cooldown periods
- Cross-platform support

### Test Runner
Comprehensive test runner with reporting:

```bash
# Run complete test suite
python scripts/test_error_fixing_suite.py
```

**Output:**
- Detailed test results
- Success/failure statistics
- Execution time tracking
- JSON report generation
- Console and file logging

### Continuous Testing
```bash
# Run tests in continuous mode
python scripts/continuous_testing.py
```

**Continuous Testing Features:**
- Background test execution
- Real-time error detection
- Automatic fix application
- Performance monitoring
- Resource usage tracking

## Test Reports

### Report Types

1. **JSON Reports**: Detailed test results with timestamps
2. **Log Files**: Real-time test execution logs
3. **Console Output**: Immediate feedback during test execution
4. **Performance Metrics**: System performance under test conditions

### Report Structure
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "summary": {
    "total_tests": 150,
    "passed": 145,
    "failed": 3,
    "errors": 2,
    "success_rate": 96.67,
    "execution_time": 45.23
  },
  "details": [
    {
      "test": "test_error_detection",
      "type": "failure",
      "message": "Expected syntax error detection failed"
    }
  ]
}
```

### Accessing Reports

```bash
# View latest test report
cat tests/reports/error_fixing_test_report_*.json | jq '.'

# View test logs
tail -f tests/reports/test_results.log

# Generate summary report
python scripts/generate_test_summary.py
```

## Running Tests

### Prerequisites
```bash
# Install test dependencies
pip install -r requirements/test_requirements.txt

# Setup test environment
python scripts/setup_test_environment.py
```

### Test Commands

#### Quick Tests
```bash
# Run fast tests only
python scripts/run_quick_tests.py

# Run specific component tests
python tests/unit/test_error_fixing.py
```

#### Full Test Suite
```bash
# Run all tests
python scripts/run_all_tests.py

# Run with coverage
python scripts/run_tests_with_coverage.py
```

#### Performance Tests
```bash
# Run performance benchmarks
python tests/e2e/test_performance.py

# Load testing
python scripts/load_test.py
```

### Test Configuration

#### Environment Variables
```bash
export TEST_ENVIRONMENT=development
export TEST_DATABASE_URL=sqlite:///test.db
export TEST_LOG_LEVEL=DEBUG
export TEST_TIMEOUT=300
```

#### Test Configuration File
```json
{
  "test_timeout": 300,
  "max_retries": 3,
  "parallel_tests": 4,
  "coverage_threshold": 80,
  "performance_threshold": 1000
}
```

## Continuous Integration

### GitHub Actions
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: python scripts/test_error_fixing_suite.py
      - name: Upload Results
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: tests/reports/
```

### Automated Deployment
```bash
# Deploy only if tests pass
python scripts/deploy_if_tests_pass.py

# Rollback on test failure
python scripts/rollback_on_failure.py
```

## Troubleshooting

### Common Issues

#### 1. Test Failures
```bash
# Check test logs
tail -f tests/reports/test_results.log

# Run tests with debug output
python tests/unit/test_error_fixing.py -v --debug

# Check system resources
python scripts/check_system_health.py
```

#### 2. Performance Issues
```bash
# Monitor system performance
python scripts/monitor_performance.py

# Check memory usage
python scripts/check_memory_usage.py

# Analyze slow tests
python scripts/analyze_slow_tests.py
```

#### 3. Environment Issues
```bash
# Reset test environment
python scripts/reset_test_environment.py

# Clean test data
python scripts/clean_test_data.py

# Verify dependencies
python scripts/verify_dependencies.py
```

### Debug Mode
```bash
# Enable debug mode
export DEBUG_MODE=true
export LOG_LEVEL=DEBUG

# Run tests with debug output
python scripts/test_error_fixing_suite.py --debug
```

### Test Maintenance

#### Updating Tests
```bash
# Update test data
python scripts/update_test_data.py

# Regenerate test fixtures
python scripts/regenerate_fixtures.py

# Update test documentation
python scripts/update_test_docs.py
```

#### Test Validation
```bash
# Validate test coverage
python scripts/validate_coverage.py

# Check test quality
python scripts/check_test_quality.py

# Verify test isolation
python scripts/verify_test_isolation.py
```

## Best Practices

### Writing Tests
1. **Test Isolation**: Each test should be independent
2. **Clear Naming**: Use descriptive test names
3. **Proper Setup/Teardown**: Clean up after tests
4. **Mock External Dependencies**: Avoid external service calls
5. **Assert Specific Conditions**: Test exact expected outcomes

### Test Organization
1. **Group Related Tests**: Use test classes and methods
2. **Use SubTests**: For parameterized testing
3. **Document Test Purpose**: Add docstrings to tests
4. **Maintain Test Data**: Keep test data up to date

### Performance Considerations
1. **Parallel Execution**: Run independent tests in parallel
2. **Resource Management**: Clean up resources after tests
3. **Timeout Handling**: Set appropriate timeouts
4. **Memory Management**: Monitor memory usage

## Support

For test-related issues:
1. Check the troubleshooting section
2. Review test logs in `tests/reports/`
3. Run tests in debug mode
4. Contact the development team

## Contributing

To add new tests:
1. Follow the existing test structure
2. Add appropriate documentation
3. Update this README if needed
4. Ensure tests pass before submitting

---

*Last updated: January 2024*
*Test coverage: 95%*
*Total test cases: 150+* 

## Pre-Autotest for Repo Modification

- Before any fix or update, QMOI now runs a pre-autotest to verify it can modify and update the repository (permissions, branch, CI/CD, etc.).
- This ensures all fixes are testable and that QMOI has the necessary permissions to push changes, create branches, or trigger pipelines.
- If the pre-autotest fails, QMOI logs the error, notifies the master, and does not proceed with the fix until permissions are resolved.
- See QMOIDEV.md for details on QMOI's developer agent and notification logic. 

## Multi-Platform Pre-Autotest Logic

- Before any fix or update, QMOI runs pre-autotests for all connected platforms (GitHub, GitLab, Vercel, HuggingFace, QCity, etc.).
- Results are aggregated and only if all platforms pass does QMOI proceed with the fix or update.
- If any platform fails, QMOI logs the error, notifies the master, and waits for resolution.
- Pre-autotest results and history are visualized in the QMOI dashboard for full transparency. 