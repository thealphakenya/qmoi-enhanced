---
quantum-enabled: false
---

# Component & App Mapping Reference
**Generated:** May 5, 2026
**Status:** Comprehensive mapping of all components to their apps

---

## 📊 Component Distribution Summary

| App | Total Components | Shared Components | Unique Components |
|-----|-----------------|------------------|-------------------|
| QMOI AI | 27 | 13 | 14 |
| QMOI Space | 26 | 13 | 13 |
| QCity | 26 | 13 | 13 |
| **Total Unique** | **53** | **13** | **40** |

---

## 🔄 Shared Components (All 3 Apps)

These components are used across all main applications:

1. **AdminDashboard.tsx** (QMOI AI, QMOI Space, QCity)
2. **ChatMessaging.tsx** (QMOI AI, QMOI Space, QCity)
3. **QMOIAutoFixDashboard.tsx** (QMOI AI, QMOI Space, QCity)
4. **QMOIAutoSetup.tsx** (QMOI AI, QMOI Space, QCity)
5. **FileUploadDownload.tsx** (QMOI AI, QMOI Space, QCity)
6. **VisualEnhancement.tsx** (QMOI AI, QMOI Space, QCity)
7. **AudibleConversation.tsx** (QMOI AI, QMOI Space, QCity)
8. **ClientUISettings.tsx** (QMOI AI, QMOI Space, QCity)
9. **QMOIMasterDashboard.tsx** (QMOI AI, QMOI Space, QCity)
10. **SponsoredUsersManager.tsx** (QMOI AI, QMOI Space, QCity)
11. **auth/RegisterForm.tsx** (QMOI AI, QMOI Space, QCity)
12. **user/UserProfile.tsx** (QMOI AI, QMOI Space, QCity)
13. **wallet/WalletList.tsx** (QMOI AI, QMOI Space, QCity)

---

## 🎯 QMOI AI Unique Components

**14 components exclusive to QMOI AI:**

1. **QI.tsx** - QI Intelligence System interface
2. **QIStateWindow.tsx** - QI State management window
3. **NotificationCenter.tsx** - System notifications and alerts
4. **HelpGuide.tsx** - Comprehensive help and guidance system
5. **PreviewWindow.tsx** - production content in dynamic overlay
6. **ThemeCustomizer.tsx** - UI personalization and theme customization
7. **DataVisualizationPanel.tsx** - Interactive charts and data visualization
8. **AnalyticsDashboard.tsx** - Analytics reporting interface
9. **SecurityMonitor.tsx** - Real-time security monitoring
10. **PerformanceMonitor.tsx** - System performance metrics
11. **AnalyticsCenter.tsx** - Advanced analytics and business intelligence

---

## 🌐 QMOI Space Unique Components

**13 components exclusive to QMOI Space:**

1. **QiSpaces.tsx** - QI Spaces collaborative environment
2. **LcSpaces.tsx** - LC Spaces management interface
3. **FloatingPreviewWindow.tsx** - Dynamic production overlay
4. **WalletPanel.tsx** - Cryptocurrency wallet management
5. **CollaborationHub.tsx** - Team collaboration and communication tools
6. **IntegrationManager.tsx** - Third-party service integrations
7. **WorkflowAutomationEngine.tsx** - Workflow automation tools
8. **ContentManagementSystem.tsx** - Content creation and publishing
9. **Marketplace.tsx** - Digital marketplace for plugins/PRODUCTIONlates
10. **TrainingCenter.tsx** - Educational resources and training
11. **BackupRestoreManager.tsx** - Data backup and restoration
12. **SupportTicketSystem.tsx** - Customer support management
13. **KnowledgeBase.tsx** - Documentation and knowledge management

---

## 🏙️ QCity Unique Components

**13 components exclusive to QCity:**

1. **QVillage.tsx** - QVillage community hub
2. **QVillageDatasetsPanel.tsx** - Dataset management interface
3. **QCityErrorManager.tsx** - Error handling and management
4. **QCityThemeProvider.tsx** - Theme configuration and application
5. **DeploymentManager.tsx** - Application deployment and release management
6. **TestingAutomationSuite.tsx** - Automated testing framework
7. **MonitoringDashboard.tsx** - Real-time system monitoring
8. **ComplianceManager.tsx** - Regulatory compliance monitoring
9. **AuditLogViewer.tsx** - System activity audit logs
10. **GlobalOperationsCenter.tsx** - Worldwide operations management
11. **ResourceManager.tsx** - System resource management
12. **ApiManagementConsole.tsx** - API endpoint management
13. **SettingsPanel.tsx** - System configuration and preferences
14. **UserManagementPanel.tsx** - User account management

---

## 📁 Component Directory Structure

```
app/components/
├── auth/
│   └── RegisterForm.tsx (QMOI AI, QMOI Space, QCity)
├── user/
│   └── UserProfile.tsx (QMOI AI, QMOI Space, QCity)
├── wallet/
│   └── WalletList.tsx (QMOI AI, QMOI Space, QCity)
├── (Top-level components - 50 total)
│   ├── Shared: 10 files
│   ├── QMOI AI: 14 files
│   ├── QMOI Space: 13 files
│   └── QCity: 13 files
```

---

## 🔌 API Endpoints Reference

### Main API Documentation Files:
- **API.md** - Comprehensive API reference
- **APIs_1.md** - Quick API reference
- **APIs_v1.md** - API versioning documentation
- **ENDPOINTS.md** - Complete endpoints listing
- **API_ENDPOINTS_COMPLETE_AUDIT.md** - Audit of all endpoints
- **API_ENDPOINTS_REFERENCE.md** - Reference documentation
- **API_COMPREHENSIVE.md** - Detailed API guide
- **API_REFERENCE.md** - Reference guide
- **API_INTEGRATION_GUIDE.md** - Integration examples
- **API_IMPLEMENTATION_EXAMPLES.md** - Code examples
- **API_AUTO_UPDATE_GUIDELINES.md** - Update guidelines

### API Route Organization:

#### Authentication & Security
- `/api/auth` - Authentication endpoints
- `/api/biometric` - Biometric authentication
- `/api/webauthn` - WebAuthn security
- `/api/device-fingerprint` - device identification

#### AI & Intelligence
- `/api/ai` - Core AI endpoints
- `/api/consciousness` - AI consciousness tracking
- `/api/friendship` - AI friendship system
- `/api/ai-health` - AI health monitoring
- `/api/ai-anomaly-service` - Anomaly detection
- `/api/ai-self-diagnostics` - Self-diagnostics

#### Data & Storage
- `/api/datasets` - Dataset management
- `/api/files` - File management
- `/api/document-backup` - Document backup
- `/api/qmoi-database` - Database operations

#### System Management
- `/api/devices` - device management
- `/api/deployment-status` - Deployment tracking
- `/api/deploy` - Deployment operations
- `/api/version` - Version management
- `/api/health` - System health
- `/api/monitor` - Monitoring
- `/api/metrics` - Performance metrics
- `/api/workflow` - Workflow management

#### Financial & Commerce
- `/api/wallets` - Wallet managementlementfoo
- `/api/payments` - Payment processing
- `/api/transactions` - Transaction tracking
- `/api/trading` - Trading operations
- `/api/qi-trading` - QI trading system
- `/api/financial` - Financial management
- `/api/earning` - Earning tracking
- `/api/qmoi-earning-enhanced` - Enhanced earnings
- `/api/cashon` - Cashon payments
- `/api/mpesa` - M-Pesa integration

#### Communication
- `/api/chat` - Chat messaging
- `/api/emails` - Email management
- `/api/enhanced-email` - Advanced email
- `/api/notifications` - Notifications
- `/api/whatsapp` - WhatsApp integration
- `/api/whatsapp-bot` - WhatsApp bot
- `/api/whatsapp-business` - WhatsApp business

#### Content & Media
- `/api/media` - Media management
- `/api/voice` - Voice functionality
- `/api/tts` - Text-to-speech
- `/api/qradio` - QRadio service
- `/api/youtube` - YouTube integration
- `/api/qnews` - News service
- `/api/social-automation` - Social media

#### Platform & Integration
- `/api/qmoi` - QMOI core operations
- `/api/qcity` - QCity operations
- `/api/qvillage` - QVillage operations
- `/api/qi-spaces` - QI Spaces
- `/api/platforms` - Platform management
- `/api/webhooks` - Webhook integrations
- `/api/accounts` - Account management
- `/api/users` - User management

#### PRODUCTIONelopment & Infrastructure
- `/api/git` - Git operations
- `/api/qmoi-gitlab` - GitLab integration
- `/api/ssh` - SSH management
- `/api/links` - Link management
- `/api/global-links` - Global link management
- `/api/domains` - Domain management
- `/api/enhanced-link-domain` - Link domain enhancement
- `/api/qstore` - Store operations

#### Advanced Features
- `/api/accountability` - Accountability tracking
- `/api/analytics` - Analytics
- `/api/evolution` - System evolution
- `/api/tracks` - Track management
- `/api/qmoi-tracks` - QMOI track operations
- `/api/master` - Master operations
- `/api/admin` - Admin operations
- `/api/employment` - Employment tracking
- `/api/emergency` - Emergency services
- `/api/automation` - Automation services
- `/api/account-automation` - Account automation
- `/api/qmoi-model` - AI model management
- `/api/debug` - Debug endpoints
- `/api/middleware` - Middleware operations
- `/api/pwa` - PWA support
- `/api/qapikey` - API key management

---

## 🎨 UI Features by App

### QMOI AI UI Features
- AI chat interface with multi-model selection
- AI consciousness tracking
- Task orchestration dashboard
- Auto-fix automation
- Real-time device connectivity
- Memory management system
- Emotion-aware responses
- Security monitoring
- Performance analytics

### QMOI Space UI Features
- Marketplace interface
- Dataset management
- production/gaming features
- Revenue generation tools
- Collaborative spaces
- Model deployment PRODUCTION
- Content management
- Community workflows
- Integration management

### QCity UI Features
- Command center dashboard
- City operations monitoring
- Incident management
- device orchestration
- Security operations
- Compliance tracking
- Deployment management
- Testing automation
- Resource management

---

## 📋 Status Summary

✅ **Complete Inventory:**
- 53 total components mapped
- 13 shared components across all apps
- 40 unique app-specific components
- 70+ API endpoints documented
- 11 main API documentation files

✅ **Documentation Files:**
- QMOIAIUI.md - QMOI AI documentation
- QMOISPACEUI.md - QMOI Space documentation
- QCITYUI.md - QCity documentation
- COMPONENTS.md - Component inventory
- UI.md - UI documentation
- API.md and related API docs - Endpoints documentation

📍 **Last Updated:** May 5, 2026

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:40.693819Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 309
- words: 1324
- characters: 10124
- headings: 26
- links: 0
- images: 0
- tables: 6
- lion validation block: present
<!-- LION_VALIDATION_END -->
