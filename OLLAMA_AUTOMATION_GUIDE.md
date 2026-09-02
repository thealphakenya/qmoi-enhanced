# QMOI Ollama Autonomous Agent - Complete Enhancement Guide

**Last Updated:** 2026-08-13  
**Status:** Full Multi-Platform Implementation  
**Scope:** Comprehensive automated testing, validation, and deployment

---

## Overview

The QMOI Ollama Autonomous Agent is a sophisticated system that automates all aspects of build, test, validation, and deployment across 6 platforms (Windows, macOS, Linux, iOS, Android, Web) for 4 apps (QMOIAIUI, QCity, QMOI Space, QALPHA).

## GitHub-hosted setup and production contract

The autonomous agent is designed to run as a GitHub-hosted production system and must not be treated as a local terminal-only utility. The authoritative execution environment is GitHub Actions.

Required setup flow:

1. Run the workflow in a GitHub-hosted Ubuntu runner.
2. Require `GITHUB_ACTIONS=true` before the workflow may declare success.
3. Set `QMOI_RUNTIME_MODE=github-hosted` and `QMOI_GITHUB_HOSTED=true` in the job environment.
4. Treat local Codespaces, dev containers, and ad hoc local terminals as non-authoritative and never production proof.
5. Install or reuse Ollama on the runner, then start the local server at `http://127.0.0.1:11434`.
6. Verify Ollama health through `/api/version` and `/api/tags`.
7. Use the default model `qwen2.5-coder:3b` unless a workflow input or environment override is supplied.
8. Pull the model when missing and wait until it is available.
9. Run a real inference prompt and require a verified response such as `OLLAMA_QMOI_HEALTH_OK`.
10. Write the proof data to `ollamatracks/OLLAMA_HEALTH.json`, `ollamatracks/OLLAMA_SUCCESS.json`, and `ollamatracks/checkpoint.json`.
11. Keep the agent bounded by `MAX_ITERATIONS`, `MAX_TASKS_PER_ITERATION`, and `MAX_RECOVERY_ATTEMPTS`.
12. Preserve resumable state in `resumefromhere.txt` and `ollamatracks/checkpoint.json`.
13. Monitor repo-wide GitHub run state in real time and record queued, active, failed, and successful runs.
14. Only print success messages when the runtime proof, model proof, inference proof, validation proof, and checkpoint proof all pass.

This setup contract is the official source for GitHub-hosted execution and must be preserved in every run, CI workflow, and documentation update.

### Key Responsibilities

**Before Each PR Merge:**
1. ✓ Validate code compiles on all platforms
2. ✓ Run comprehensive test suites (unit, integration, e2e)
3. ✓ Test all features for all apps on all platforms
4. ✓ Verify file handler functionality (50+ file types)
5. ✓ Check accessibility compliance (WCAG 2.1 AA)
6. ✓ Run security scanning (no secrets, no vulnerabilities)
7. ✓ Verify platform-specific requirements
8. ✓ Generate signed packages for distribution
9. ✓ Maintain memory index and model card
10. ✓ Auto-repair common issues

**During Each Release:**
1. ✓ Build for all platforms simultaneously
2. ✓ Sign and notarize packages
3. ✓ Generate checksums and signatures
4. ✓ Submit to app stores (Microsoft, Apple, Google, etc.)
5. ✓ Deploy web PWA to CDN
6. ✓ Create GitHub release with artifacts
7. ✓ Monitor initial user feedback

**Continuously:**
1. ✓ Sync memory across all instances (every 5 seconds)
2. ✓ Update activity feed
3. ✓ Track file changes by SHA256
4. ✓ Maintain real-time memory index
5. ✓ Generate model cards for QVillage integration

---

## Part 1: Platform-Specific Requirements

### All Supported Platforms

**Desktop:** Windows, macOS, Linux  
**Mobile:** iOS, Android  
**Web:** Progressive Web App (PWA)

### Platform Requirements Files

Complete platform-specific information documented in:
- **[PLATFORM_REQUIREMENTS.md](PLATFORM_REQUIREMENTS.md)** - Full specifications for all platforms
  - Windows: Registry, shortcuts, signing certificates
  - macOS: Notarization, app bundle structure, signing
  - Linux: Desktop files, AppStream metadata, D-Bus integration
  - iOS: Provisioning profiles, App Store submission
  - Android: Keystore, Gradle signing, Google Play Console
  - Web PWA: Manifest, Service Worker, Lighthouse compliance

### Feature Coverage Per App

**QMOIAIUI (Conversational AI):**
- ✓ Conversation management (create, load, save, export)
- ✓ Model selector (multiple LLM support)
- ✓ Parameter tuning (temperature, top_p, frequency_penalty, etc.)
- ✓ Export conversations (markdown, JSON, PDF)
- ✓ Voice input/output (speech-to-text, text-to-speech)
- ✓ Memory persistence (IndexedDB, local storage, cloud sync)
- ✓ Accessibility (screen readers, keyboard navigation, high contrast)
- ✓ Platform-specific styling (Fluent Design, HI, freedesktop)
- ✓ Handsfree controls (voice, gestures, eye tracking)

**QCity (File Manager):**
- ✓ Folder tree navigation (drill-down, breadcrumb, shortcuts)
- ✓ Multiple view modes (grid, list, detailed, preview)
- ✓ Advanced search (by name, size, date, content)
- ✓ Batch operations (copy, move, delete, rename, compress)
- ✓ Duplicate finder (identify similar/identical files)
- ✓ Smart tags (auto-categorize by file type, size, date)
- ✓ Auto-organization (move files by tag, date, type)
- ✓ Cloud storage integration (OneDrive, Google Drive, iCloud)
- ✓ Voice commands (open, delete, move, organize)
- ✓ Gesture controls (swipe, pinch, long-press)
- ✓ File preview (images, documents, videos)

**QMOI Space (Media Player):**
- ✓ Playback controls (play, pause, stop, seek)
- ✓ Volume & quality selection (dynamic bitrate, codec support)
- ✓ Subtitle switching (multiple formats, auto-sync)
- ✓ Audio track switching (multi-language, commentary)
- ✓ Playlist management (add, remove, reorder, save)
- ✓ Picture-in-Picture mode (resize, move window)
- ✓ Media library (organize by album, artist, playlist)
- ✓ Voice control (play, pause, next, previous)
- ✓ Gesture control (swipe scrub, pinch zoom)
- ✓ Keyboard shortcuts (media keys, custom bindings)
- ✓ Eye tracking (gaze-based playback control)
- ✓ Accessibility (audio descriptions, high contrast)

**QALPHA (IDE):**
- ✓ Code editing (syntax highlighting, smart indent, auto-format)
- ✓ Code completion (autocomplete, function signatures, parameter hints)
- ✓ Debugger integration (breakpoints, step through, watch variables)
- ✓ Terminal integration (embedded terminal, command execution)
- ✓ Git version control (status, commit, push, pull, merge)
- ✓ File explorer (folder tree, search, create/rename/delete)
- ✓ Theme support (light, dark, custom color schemes)
- ✓ Keyboard shortcuts (configurable, cross-platform)
- ✓ Extensions (install, enable/disable, manage)
- ✓ Multi-language support (Python, JavaScript, TypeScript, etc.)

---

## Part 2: File Type Handler System

### Master Toggle: "QMOI AS DEFAULT FOR ALL"
- Red (inactive) = QMOI apps not handling file types
- Green (active) = QMOI apps set as default for all file types

### Supported File Types & Default Handlers

**Documents:**
- .pdf → QCity (file manager/viewer)
- .docx, .doc → QCity
- .txt → QCity / QALPHA (code editor if .txt contains code)
- .md → QALPHA (IDE with markdown preview)
- .odt → QCity
- .rtf → QCity

**Audio:**
- .mp3, .m4a, .flac, .wav, .aac, .opus → QMOI Space (media player)

**Video:**
- .mp4, .mkv, .avi, .mov, .webm → QMOI Space

**Archives:**
- .zip, .tar, .gz, .rar, .7z → QCity (file manager)

**Code:**
- .py, .js, .ts, .tsx, .jsx → QALPHA (IDE)
- .java, .cpp, .cs, .go, .rs → QALPHA
- .html, .css, .json, .xml, .yaml → QALPHA

**Spreadsheets:**
- .xlsx, .csv, .ods → QCity (preview and export)

**Presentations:**
- .pptx, .odp → QCity (preview)

**Images:**
- .jpg, .png, .gif, .webp, .svg → QCity (preview)

### Handler Registration

**Windows:**
- Registry entries in HKEY_CLASSES_ROOT
- Shell context menu "Open With QMOI"
- File association via .reg files
- Auto-registration during installation (Administrator required)

**macOS:**
- UTType (Universal Type Identifier) registration
- Launch Services database update
- Info.plist document type declarations
- `duti` utility for querying

**Linux:**
- MIME type registration via /usr/share/mime/packages/
- Desktop file associations
- `xdg-mime` for querying defaults
- `update-desktop-database` for indexing

**iOS/Android:**
- URI scheme handling (qmoi://open?file=...)
- MIME type declarations
- File intent filters
- Document picker integration

**Web PWA:**
- File drag-and-drop handling
- File input element with accept filters
- IndexedDB for local file references

---

## Part 3: Comprehensive Testing Framework

### Test Matrix: 4 Apps × 6 Platforms

```
┌─────────────────────────────────────────────────────┐
│         Feature Test Coverage Matrix               │
├──────────────────┬──────────────────────────────────┤
│ App    │ W │ M │ L │ I │ A │ W                     │
├────────┼───┼───┼───┼───┼───┼───┤
│ QMOIAIUI  │✓  │✓  │✓  │✓  │✓  │✓ │
│ QCity     │✓  │✓  │✓  │✓  │✓  │✓ │
│ QMOI Space│✓  │✓  │✓  │✓  │✓  │✓ │
│ QALPHA    │✓  │✓  │✓  │✓  │✓  │✓ │ (read-only)
└────────────────────────────────────────────────────┘

W=Windows, M=macOS, L=Linux, I=iOS, A=Android, W=Web
```

### Test Coverage by Level

**Unit Tests:**
- Individual function/method testing
- Isolated components
- Fast execution (<100ms each)
- Run on every commit

**Integration Tests:**
- Cross-component interaction
- App feature workflows
- Database/storage integration
- Run on every PR

**End-to-End (E2E) Tests:**
- Complete user workflows
- Multi-app collaboration
- Network operations
- Run pre-release

**Platform-Specific Tests:**
- Windows Registry queries
- macOS notarization verification
- Linux D-Bus communication
- iOS FileProvider API
- Android DocumentsProvider API
- Web Service Worker functionality

**Accessibility Tests:**
- Screen reader compatibility (VoiceOver, NVDA, TalkBack)
- Keyboard-only navigation
- Color contrast verification (WCAG 2.1 AA: >4.5:1)
- Dynamic text scaling
- High contrast mode support
- Eye tracking calibration

**Performance Tests:**
- Startup time (<3 seconds target)
- Memory usage stability
- Memory leak detection
- Battery drain measurement (mobile)
- Frame rate consistency (media playback)
- Network request optimization

**Security Tests:**
- Hardcoded secret scanning
- Dependency vulnerability scanning (npm audit, pip audit)
- Code injection prevention
- HTTPS/TLS verification
- User data encryption
- Privacy compliance

---

## Part 4: Ollama Autonomous Agent Architecture

### Agent Components

**PlatformValidator**
- Validates code compilation
- Checks dependency resolution
- Verifies manifest files present
- Validates code signatures
- One instance per platform (6 total)

**FeatureTester**
- Tests all features for each app
- Runs on each platform
- Returns pass/fail for each feature
- 4 apps × 6 platforms = 24 test configurations

**FileHandlerValidator**
- Validates 50+ file type registrations
- Platform-specific registry/database checks
- Verifies file open associations work
- One instance (used per platform in validation)

**MemoryIndexGenerator**
- Generates QMOI_REALTIME_MEMORY_INDEX.md
- Tracks file changes by SHA256
- Creates JSON index for programmatic access
- Updates every 5 seconds (async)
- Reuses unchanged digests for efficiency

**ModelCardGenerator**
- Generates QMOI_MODEL_CARD.md
- Documents build and test results
- Lists all apps and features
- Supports QVillage integration
- Generated on each release

**WorkflowNormalizer**
- Repairs YAML indentation drift
- Converts to consistent 2-space indentation
- Prevents workflow failures
- Used during workflow template generation

**OllamaAutonomousAgent (Main Orchestrator)**
- Coordinates all validation
- Runs full PR validation contract
- Generates reports and artifacts
- Maintains activity feed
- Implements auto-repair logic

### Execution Flow (Per PR)

```
PR Created
  ↓
[GitHub Actions Trigger: ollamatrigger.yml or ollama-autonomous-agent.yml]
  ↓
Checkout Code + Set up Environment
  ↓
Run Ollama Autonomous Agent
  ├─ PlatformValidator.validate_all_platforms()
  │  ├─ Windows: npm run build:windows, check registry
  │  ├─ macOS: xcodebuild, check codesign, verify notarization
  │  ├─ Linux: npm run build:linux, check .desktop files
  │  ├─ iOS: xcodebuild -scheme, validate provisioning
  │  ├─ Android: ./gradlew build, check signing config
  │  └─ Web: npm run build, lighthouse audit
  ├─ FeatureTester.test_all_features()
  │  ├─ QMOIAIUI: 10 features × 6 platforms = 60 tests
  │  ├─ QCity: 11 features × 6 platforms = 66 tests
  │  ├─ QMOI Space: 12 features × 6 platforms = 72 tests
  │  └─ QALPHA: 10 features × 6 platforms = 60 tests
  ├─ FileHandlerValidator.validate_file_handlers()
  │  └─ 50 file types × 6 platforms = 300 handler checks
  ├─ MemoryIndexGenerator.generate_index()
  │  └─ Track all project files by SHA256
  ├─ ModelCardGenerator.generate_card()
  │  └─ Document all apps and features
  └─ Overall Result: ✓ PASS or ✗ FAIL
  ↓
Post Comment to PR
  ├─ If PASS: "✓ Ready for human review"
  ├─ If FAIL: "✗ Auto-repair attempted, manual fix needed"
  └─ Include metrics (build times, test counts, coverage %)
  ↓
If PASS: Await Human Code Review
  ↓
After Approval: Merge to main
  ↓
[GitHub Actions Trigger: Run full build + release]
  ├─ Build for all platforms (parallel)
  ├─ Sign and notarize
  ├─ Generate checksums
  └─ Create GitHub release
```

---

## Part 5: Documentation & Reference Files

### Complete Documentation Set

**Installation & Deployment:**
- [DOWNLOAD.md](DOWNLOAD.md) - Download instructions for all platforms/apps
- [INSTALL.md](INSTALL.md) - Step-by-step installation guides
- [BUILD.md](BUILD.md) - Build procedures for developers
- [PLATFORM_REQUIREMENTS.md](PLATFORM_REQUIREMENTS.md) - Platform specifications

**Team & Process:**
- [QTEAM.md](QTEAM.md) - Development team workflows and QA processes
- [QMOI_UI_ARCHITECTURE.md](QMOI_UI_ARCHITECTURE.md) - Unified UI design
- [UNIVERSALS.md](UNIVERSALS.md) - Universal patterns and standards
- [STYLES.md](STYLES.md) - Comprehensive styling system

**Code & Implementation:**
- [QMOIAIUI.md](QMOIAIUI.md) - QMOIAIUI app documentation
- [QCITYUI.md](QCITYUI.md) - QCity app documentation
- [QMOISPACEUI.md](QMOISPACEUI.md) - QMOI Space app documentation
- [QALPHAUI.md](QALPHAUI.md) - QALPHA app documentation
- [ALLUI.md](ALLUI.md) - Master UI features reference
- [ALLFRONTEND.md](ALLFRONTEND.md) - Frontend architecture
- [ALLBACKEND.md](ALLBACKEND.md) - Backend architecture
- [ALLSERVE.md](ALLSERVE.md) - Server infrastructure

**Agent & Automation:**
- [scripts/ollama_autonomous_agent.py](scripts/ollama_autonomous_agent.py) - Main agent script
- [tests/test_ollama_autonomous_agent.py](tests/test_ollama_autonomous_agent.py) - Comprehensive tests
- [.github/workflows/ollamatrigger.yml](.github/workflows/ollamatrigger.yml) - Manual trigger workflow
- [.github/workflows/ollama-autonomous-agent.yml](.github/workflows/ollama-autonomous-agent.yml) - Scheduled workflow

### Memory & State Files

**Automatically Generated:**
- `QMOI_REALTIME_MEMORY_INDEX.md` - File tracking index
- `.qmoi_memory_index.json` - Machine-readable memory
- `QMOI_MODEL_CARD.md` - Build and feature documentation
- `OLLAMA_ACTIVITY_FEED.md` - Agent activity log
- `resumefromhere.txt` - Resumable state checkpoint

---

## Part 6: Running the Agent

### Local Testing (Developer Machine)

```bash
# Navigate to project root
cd /workspaces/qmoi-enhanced

# Run full validation suite
python scripts/ollama_autonomous_agent.py validate-all

# Run specific validation
python scripts/ollama_autonomous_agent.py validate-all-platforms
python scripts/ollama_autonomous_agent.py validate-all-features
python scripts/ollama_autonomous_agent.py validate-file-handlers

# Generate memory artifacts
python scripts/ollama_autonomous_agent.py generate-memory-index
python scripts/ollama_autonomous_agent.py generate-model-card
```

### GitHub Actions (Automatic on PR/Push)

**Trigger 1: Manual Dispatch (ollamatrigger.yml)**
```
GitHub Actions → Workflows → "Run Ollama Autonomous Agent" → Run workflow
```

**Trigger 2: Scheduled (ollama-autonomous-agent.yml)**
```
Runs automatically on:
- Push to main branch
- Pull requests
- Scheduled: Daily at 2:00 AM UTC
```

**Trigger 3: Tag/Release**
```
Push tag: git tag v1.2.3 && git push origin v1.2.3
→ Automatically builds all platforms and creates release
```

### Output Artifacts

All agent runs produce:
1. `QMOI_REALTIME_MEMORY_INDEX.md` - File tracking
2. `.qmoi_memory_index.json` - Memory index JSON
3. `QMOI_MODEL_CARD.md` - Build documentation
4. `OLLAMA_ACTIVITY_FEED.md` - Activity log
5. `resumefromhere.txt` - Resumable state
6. Platform-specific build outputs
7. Signed packages (if release build)

---

## Part 7: PR Validation Contract

### Required Checks (All Must Pass)

✓ **Builds on All Platforms:**
- Windows (x64, ARM64)
- macOS (Intel, Apple Silicon)
- Linux (Ubuntu, Fedora, Debian, Arch)
- iOS 14+
- Android 11+
- Web PWA

✓ **All Features Tested:**
- QMOIAIUI: 10 features
- QCity: 11 features
- QMOI Space: 12 features
- QALPHA: 10 features

✓ **File Handlers Validated:**
- 50+ file types
- All 6 platforms

✓ **Code Quality:**
- Linting passes (ESLint, Pylint, SwiftLint)
- No compiler warnings
- Code coverage maintained (>80%)

✓ **Tests Pass:**
- Unit: 1,250+ tests
- Integration: 350+ tests
- E2E: 85+ tests

✓ **Accessibility Compliant:**
- WCAG 2.1 AA
- Screen readers supported
- Keyboard navigation complete
- High contrast verified

✓ **Performance Met:**
- Startup <3 seconds
- No memory leaks
- Frame rate stable (60 FPS for media)
- Battery drain acceptable (mobile)

✓ **Security Clean:**
- No hardcoded secrets
- No vulnerable dependencies
- HTTPS/TLS everywhere
- Privacy compliant

✓ **Documentation Updated:**
- CHANGELOG.md entries
- Feature documentation
- Platform requirements if changed

### Auto-Repair Attempts

When validation fails, agent automatically:
1. ✓ Adds missing dependencies
2. ✓ Removes hardcoded secrets
3. ✓ Repairs YAML indentation
4. ✓ Updates outdated version references
5. ✓ Fixes file association registry entries
6. ✓ Normalizes code formatting
7. ✓ Regenerates manifests

Human action required if:
- Compilation fails (architectural issue)
- Tests fail (logic error)
- Performance regression (optimization needed)
- Security vulnerability (manual review needed)

---

## Part 8: Expected Results

### Successful PR Validation

```
✅ PR Validation Success

Build Status:
  ✓ Windows (2m 15s)
  ✓ macOS (3m 42s)
  ✓ Linux (1m 58s)
  ✓ iOS (4m 12s)
  ✓ Android (5m 33s)
  ✓ Web (45s)

Test Results:
  ✓ Unit Tests: 1,250 passed
  ✓ Integration Tests: 350 passed
  ✓ E2E Tests: 85 passed
  ✓ Code Coverage: 87%

Features Validated:
  ✓ QMOIAIUI: 10/10 features
  ✓ QCity: 11/11 features
  ✓ QMOI Space: 12/12 features
  ✓ QALPHA: 10/10 features

Platform Validation:
  ✓ File Handlers: 300/300 checked (50 types × 6 platforms)
  ✓ Accessibility: WCAG 2.1 AA compliant
  ✓ Performance: All benchmarks met
  ✓ Security: No vulnerabilities detected

Artifacts Generated:
  ✓ Memory Index: 1,250 files tracked
  ✓ Model Card: Generated
  ✓ Checksums: Created

Ready for human review and merge ✓
```

### Failed PR Validation

```
❌ PR Validation Failed

Issues Found:
  ✗ macOS build: Missing dependency (libadwaita-dev)
  ✗ Android tests: 3 tests failed
  ✗ Security scan: Hardcoded API key in auth.js:42

Auto-Repair Attempted:
  ✓ Added missing dependency
  ✗ Android test failures (manual investigation needed)
  ✓ Removed hardcoded key

Next Steps:
  1. Review Android test failures
  2. Push fixes to feature branch
  3. Agent will re-run validation
```

---

## Part 9: Integration with External Services

### App Store Submission

**Windows Store (Microsoft):**
- Builds generated automatically
- Submit .MSIXBUNDLE via Partner Center
- Review time: 2-4 hours

**Mac App Store (Apple):**
- Notarization automatic
- Submit .ipa via App Store Connect
- Review time: 24-48 hours

**iOS App Store (Apple):**
- .ipa built and signed automatically
- Submit via App Store Connect
- Review time: 24-48 hours

**Google Play Store (Android):**
- .AAB built and signed automatically
- Submit via Google Play Console
- Review time: 24-48 hours

**Linux (Multiple Channels):**
- Ubuntu PPA: Auto-upload via dput
- Fedora COPR: Auto-upload via copr-cli
- Snap Store: Auto-upload via snapcraft
- Flathub: Automated via GitHub PR

**Web PWA:**
- Deployed to CDN automatically (Netlify/Vercel/AWS)
- Service Worker updated automatically
- No review process needed

### QVillage Integration

The generated QMOI_MODEL_CARD.md enables:
- Integration with QVillage ecosystem
- Cross-app awareness
- Resource sharing
- Performance metrics pooling
- Error reporting aggregation

---

## Part 10: Success Metrics

### Automated Metrics Tracked

**Build Metrics:**
- Build time per platform (target: <10m total)
- Success rate (target: 100%)
- Artifact size (target: reasonable for platform)

**Test Metrics:**
- Test pass rate (target: >99%)
- Test execution time (target: <15m total)
- Code coverage (target: >85%)

**Quality Metrics:**
- Lint warnings (target: 0)
- Security vulnerabilities (target: 0)
- Performance regressions (target: 0)

**Release Metrics:**
- Time to market (target: <1 week from feature to production)
- Post-release incidents (target: 0 critical)
- User satisfaction (target: >4.5/5 stars)

---

## Summary

The QMOI Ollama Autonomous Agent provides:

1. **Complete Automation:** Build, test, and validate all apps on all platforms
2. **Comprehensive Coverage:** 4 apps × 6 platforms = 24 configuration tests
3. **High Quality:** 1,250+ unit tests, 350+ integration tests, 85+ E2E tests
4. **Platform Compliance:** All platform-specific requirements verified
5. **Accessibility First:** WCAG 2.1 AA on all platforms
6. **Security Focus:** Automatic scanning and secret detection
7. **Memory-Aware:** Real-time index of all files and changes
8. **Auto-Repair:** Fixes common issues automatically
9. **Continuous Delivery:** Ready for release at any time
10. **Team Enabling:** Humans focus on code quality, agent handles validation

**Result:** Every PR can be merged with confidence that it meets all requirements and is ready for immediate production release.

---

**Maintained by:** QMOI Development Team  
**Last Updated:** 2026-08-13  
**Status:** Production Ready
