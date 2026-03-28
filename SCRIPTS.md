<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-26T05:23:10.083167Z
- note: Auto-updated by `scripts/update_percentage_scripts.py`
<!-- LION_VALIDATION_END -->

# SCRIPTS.md - Automation & Scripting Documentation

**Last Updated**: 2026-03-26
**Scan Date**: 2026-03-26T05:23:10.083167Z
**Total Scripts**: 50+
**Active Scripts**: 48

## 📋 Overview

This document catalogs all automation scripts, build scripts, and utility scripts in the QMOI-Enhanced repository.

## 🏗️ Build Scripts

### Master Build Script
- **File**: `scripts/build/build-all.sh`
- **Purpose**: Orchestrate builds for all platforms
- **Platforms**: Web, Android, iOS, Windows, Linux
- **Status**: ✅ Production Ready
- **Last Run**: 2026-03-26

### Platform-Specific Build Scripts
- `build-qmoi.sh` - Legacy wrapper (delegates to build-all.sh)
- `scripts/build/validate_installations.py` - Validate build artifacts
- `bootstrap-dev.sh` - Development environment setup

### Build Validation
- `scripts/build/validate_installations.py` - Safety checks for installations
- `ensure_build_files.py` - Verify build file completeness
- `test-qmoi-comprehensive.sh` - Comprehensive test suite

## 📡 API Documentation Scripts

### Documentation Generation
- **File**: `scripts/comprehensive_docs_update.py`
- **Purpose**: Auto-generate API, endpoint, and hook documentation
- **Generates**: API.md, ENDPOINTS.md, HOOKS.md
- **Status**: ✅ Production Ready
- **Frequency**: Run before each release

## 📡 API Documentation Scripts

### Documentation Generation
- **File**: `scripts/comprehensive_docs_update.py`
- **Purpose**: Auto-generate API, endpoint, and hook documentation
- **Generates**: API.md, ENDPOINTS.md, HOOKS.md
- **Status**: ✅ Production Ready
- **Frequency**: Run before each release

### API Validation
- **File**: `scripts/validate_api_documentation.py`
- **Purpose**: Validate API documentation completeness
- **Status**: ✅ Production Ready

## 🔧 Automation Scripts

### Build Automation
- `scripts/build-all-platforms.sh` - Cross-platform build orchestration
- `scripts/build-all.sh` - Master build script
- `scripts/build-android-production.sh` - Android APK builds
- `scripts/build-apple-production.sh` - iOS IPA builds
- `scripts/build-pwa-production.sh` - PWA builds
- `scripts/build-windows-production.sh` - Windows EXE builds

### Deployment Automation
- `scripts/deploy-production.sh` - Production deployment
- `scripts/deploy-docker.sh` - Docker container deployment
- `scripts/deploy_huggingface.js` - HuggingFace Spaces deployment
- `scripts/vercel_deploy.sh` - Vercel deployment

### Testing Automation
- `scripts/run_all_tests.py` - Comprehensive test runner
- `scripts/run_unit_tests.py` - Unit test execution
- `scripts/test-qmoi-comprehensive.sh` - Full system tests
- `scripts/production_full_validation.py` - Production readiness validation

### Domain & Health Scripts
- `scripts/100percent_domain_health_checker.py` - Domain health validation
- `scripts/content_ui_validator.py` - UI content validation
- `scripts/domain_health_100percent_achiever.py` - Domain health achievement
- `scripts/health_check_simple.py` - Basic health checks

### AI & Evolution Scripts
- `scripts/ai_automation.py` - AI automation tasks
- `scripts/auto_evolution.py` - Model evolution
- `scripts/enhance_ai.py` - AI enhancement
- `scripts/qmoi_auto_evolution.py` - QMOI evolution

### Validation & Monitoring Scripts
- `scripts/validate_all_credentials.py` - Credential validation
- `scripts/validate_links.py` - Link validation
- `scripts/validate_md.py` - Markdown validation
- `scripts/monitor_performance.py` - Performance monitoring

### Utility Scripts
- `scripts/auto_update_allmdfilesrefs.py` - Documentation updates
- `scripts/generate_all_links.py` - Link generation
- `scripts/update_tree_and_percentages.py` - Structure updates
- `scripts/comprehensive_md_validator.py` - MD validation
- **Purpose**: Validate API endpoint documentation
- **Checks**: Endpoint completeness, documentation accuracy
- **Status**: ✅ Production Ready

## 🌍 Domain & Link Management

### Domain Health Monitoring
- **File**: `scripts/domain_health_check.py`
- **Purpose**: Monitor domain health and uptime
- **Frequency**: Every 5 minutes
- **Checks**: DNS, HTTP, SSL, Regional availability
- **Status**: ✅ Running continuously

### Link Validation & Sync
- **File**: `scripts/validate_and_sync_links.py`
- **Purpose**: Validate and fix broken links across repository
- **Features**: Auto-fix, CDN integration, failover setup
- **Status**: ✅ Production Ready

### Domain Registry Management
- **File**: `scripts/domain_registry_manager.py`
- **Purpose**: Manage domain lifecycles and registrations
- **Features**: Registration, renewal, failover coordination
- **Status**: ✅ Production Ready

## 🧪 Testing Scripts

### Test Runners
- `test-qmoi.sh` - Quick test suite
- `test-qmoi-comprehensive.sh` - Full test suite
- `test-auto-setup.sh` - Test auto-setup process
- `test-qmoi-master.js` - Master test coordinator

### Specific Test Suites
- `test-api-connectivity.ts` - API connectivity validation
- `test-pesapal-verification.ts` - Payment verification
- `test-real-money-transfer.ts` - Real transaction testing
- `test-user-system.sh` - User system testing
- `test-roles.sh` - Role-based access testing

## 🔧 Automation Scripts

### Production Deployment
- `deploy-prod.sh` - Production deployment
- `deploy-production-complete.sh` - Complete production setup
- `deploy-production-dns.sh` - DNS-based deployment
- `start-production-deployment.sh` - Start deployment process

### Auto-Fix & Recovery
- `aggressive_production_fixer.py` - Aggressive production fixes
- `ultimate_aggressive_fixer.py` - Ultimate fix engine
- `master-error-fix.js` - Master error correction
- `auto_recover_system.sh` - System auto-recovery

### Monitoring & Health
- `qmoi_health_check.log` - Health check logs
- `qmoi_disk_monitor.sh` - Disk space monitoring
- `monitoring_commands.sh` - Monitoring utilities
- `qmoi_activity_logger.py` - Activity logging

## 📦 Download & Distribution

### Download Generators
- `downloadqmoiai.py` - Download QMOI AI (main)
- `downloadqmoiaiapk.py` - Download Android APK
- `downloadqmoiaideb.py` - Download Debian package
- `downloadqmoiaidmg.py` - Download macOS DMG
- `downloadqmoiaiexe.py` - Download Windows EXE
- `downloadqmoiaiimg.py` - Download IMG file
- `downloadqmoiaiipa.py` - Download iOS IPA
- `downloadqmoiaismarttvapk.py` - Smart TV APK
- `downloadqmoiaizip.py` - Download ZIP archive

## 🚀 Release & Version Management

### Release Distribution
- `publish-releases-realtime.sh` - Publish releases in real-time
- `publish-releases-realtime.py` - Python release publisher
- `publish-github-releases.sh` - GitHub release publishing
- `verify-all-releases.sh` - Verify release integrity

### Version Control
- `ai_self_update.py` - Self-update mechanism
- `ai_self_update_cli.py` - CLI self-update
- `RELEASE_v1.2.5_VERIFY_AND_PUBLISH.ps1` - PowerShell release script
- `local-release-verify.ps1` - Local release verification

## 🔄 Synchronization & Git

### Git Automation
- `git-smart-sync.ps1` - Smart git sync
- `git-depsfix.ps1` - Dependency fixes
- `setup-git-hooks.sh` - Git hooks setup
- `continuous-release-monitor.py` - Monitor releases

### Repository Management
- `push.ps1` / `push.bat` - Repository push
- `push-simple.ps1` - Simple push operation
- `SYNCREPOS.md` - Repository sync guide
- `git.txt` - Git configuration

## 🎯 Automation Workflows

### Email System Automation
- `email_automation.py` - Email automation engine
- `email_system_tests.py` - Email system tests
- `realtime_email_system.py` - Real-time email
- `user_email_creation.py` - Email creation

### WhatsApp Automation
- `notify_on_whatsapp.py` - WhatsApp notifications
- `whatsapp-qmoi-bot/` - WhatsApp bot directory

### Trading & Finance
- `bitget-trader.py` - Bitget trading automation
- `query-revenue.js` - Revenue queries
- `transfer-money.js` - Money transfer automation

## 📊 Reporting & Analytics

### Performance Analysis
- `run_phase1.py` - Phase 1 analysis
- `iterative-improvement-test.js` - Improvement tracking
- `comprehensive_fixes_report.json` - Fix reports

### Audit & Compliance
- `audit-report.json` - Audit reports
- `security_proxy.py` - Security proxy monitoring
- `billing_report.py` - Billing analysis

## 🛠️ Development Tools

### Code Quality
- `bulk_replace_markers.py` - Bulk marker replacement
- `enhanced-error-fix.js` - Enhanced error fixing
- `compare_components.cjs` - Component comparison
- `eslint_fix_result.json` - ESLint results

### Component Management  
- `component_paths.txt` - Component paths
- `components_tree.txt` - Component tree
- `lib_tree.txt` - Library tree
- `missing_components.txt` - Missing components detection

## 📝 Documentation Automation

### Documentation Generation
- `scripts/comprehensive_docs_update.py` - Master doc generator
- `scripts/update_tree_and_percentages.py` - Tree & metrics update
- `autoupdate_docs.sh` - Auto-update docs script
- `documentation_audit_and_fix.py` - Doc audit & fix

### Reference Maintenance
- `ALLMDFILESREFS.md` - Master markdown index
- `ALLTESTSAUTOTESTS.md` - Test documentation
- `TREE.md` - Developer tree
- `ALL PERCENTAGES.md` - Metrics dashboard

## 🔐 Security & Backup

### Backup & Recovery
- `backup_system.sh` - Backup operations
- `auto_full_recovery.py` - Full system recovery
- `revoked_tokens.json` - Token management
- `required_secrets.json` - Secrets management

### Security Validation
- `scan_nonproduction_endpoints.py` - Security scan
- `production_readiness_scan.sh` - Readiness check
- `security_audit_checklist.md` - Security checklist

## 🌐 Integration Scripts

### Platform Integration
- `qmoi_control_server.py` - QMOI control server
- `mock_server.py` - Mock server for testing
- `start_qmoi_ngrok.py` - NGrok tunneling setup
- `ngrok_tunnel.txt` - NGrok configuration

### CI/CD Integration
- `.github/` - GitHub Actions workflows
- `gitlab-ci.yml` - GitLab CI configuration
- Vercel deployment configuration
- Hugging Face integration

## 📋 Script Usage

### Running Build Scripts
```bash
# Master build
bash scripts/build/build-all.sh

# Validate installations
python3 scripts/build/validate_installations.py
```

### Running Documentation Scripts
```bash
# Generate all documentation
python3 scripts/comprehensive_docs_update.py

# Validate API documentation
python3 scripts/validate_api_documentation.py

# Update tree and percentages
python3 scripts/update_tree_and_percentages.py
```

### Running Monitoring Scripts
```bash
# Check domain health
python3 scripts/domain_health_check.py

# Validate links
python3 scripts/validate_and_sync_links.py
```

### Running Tests
```bash
# Quick tests
bash test-qmoi.sh

# Comprehensive tests
bash test-qmoi-comprehensive.sh

# Jest/Cypress tests
npm test
npm run cypress
```

## 🎯 Automation Best Practices

1. **Always validate** before running automation scripts
2. **Back up data** before running fix scripts
3. **Monitor logs** during automation execution
4. **Verify results** after automation completes
5. **Document changes** made by scripts
6. **Schedule maintenance** during low-usage periods
7. **Test in staging** before production deployment
8. **Enable alerts** for critical operations

## 📊 Script Performance Metrics

| Script | Runtime | Frequency | Status |
|--------|---------|-----------|--------|
| comprehensive_docs_update.py | 2-3 sec | Before release | ✅ |
| validate_api_documentation.py | 1-2 sec | Per commit | ✅ |
| domain_health_check.py | 3-5 sec | Every 5 min | ✅ |
| validate_and_sync_links.py | 5-10 sec | Hourly | ✅ |
| build-all.sh | 15-30 min | Per release | ✅ |
| test-qmoi-comprehensive.sh | 10-20 min | Per commit | ✅ |

## 🔄 Maintenance Schedule

- **Daily**: Domain health check, link validation
- **Weekly**: Full test suite, documentation sync
- **Bi-weekly**: Build validation, artifact check
- **Monthly**: Security audit, performance analysis
- **Quarterly**: Release verification, system audit

---

**Generated by**: `scripts/update_percentage_scripts.py`
**Last Updated**: 2026-03-26T05:23:10.083167Z
**Status**: ✅ COMPLETE & CURRENT
**Next Update**: 2026-03-26
