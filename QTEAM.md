# QTEAM: Development & QA Workflow

**Last Updated:** 2026-08-13  
**Status:** Comprehensive Team Collaboration Guide  
**Scope:** Development, Testing, QA, Release Management

---

## Overview

The QMOI development team operates with an automated-first approach where the Ollama autonomous agent handles most validation, building, and testing. Human team members focus on code review, architectural decisions, and user feedback incorporation.

---

## Team Roles & Responsibilities

### Ollama Autonomous Agent (Primary Builder & Tester)
- **Responsibilities:**
  - ✓ Automatic code compilation for all platforms
  - ✓ Run comprehensive test suites (unit, integration, e2e)
  - ✓ Validate file handlers and feature completeness
  - ✓ Check accessibility compliance
  - ✓ Verify platform-specific requirements
  - ✓ Generate signed packages for all platforms
  - ✓ Run performance benchmarks
  - ✓ Monitor code quality metrics
  - ✓ Auto-repair common issues
  - ✓ Maintain memory index and activity feed
  - ✓ Validate the active QMOI avatar identity in real time
  - ✓ Confirm the selected avatar is actually QMOI before rendering
  - ✓ Monitor the live window and animation state for QMOI presence
  - ✓ Ensure avatar quality, motion continuity, and realtime synchronization across all branches and repos

### Code Reviewers (Human)
- **Responsibilities:**
  - ✓ Review PR code changes
  - ✓ Verify architectural decisions
  - ✓ Check for security vulnerabilities
  - ✓ Approve PRs before merge
  - ✓ Maintain code quality standards

### QA & Testing Team (Specialized Roles)
- **Platform Specialists:**
  - Windows QA
  - macOS QA
  - Linux QA
  - iOS QA
  - Android QA
  - Web PWA QA

### DevOps & Infrastructure
- **Responsibilities:**
  - ✓ Maintain CI/CD infrastructure
  - ✓ Manage signing certificates and keys
  - ✓ Monitor build server health
  - ✓ Handle app store submissions
  - ✓ Monitor production deployments

---

## Development Workflow

### Phase 1: Feature Development

**Developer:**
1. Create feature branch from `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/new-feature-name
   ```

2. Write code
   ```bash
   # Make changes, commit frequently
   git add .
   git commit -m "Add feature: description"
   ```

3. Push to GitHub
   ```bash
   git push origin feature/new-feature-name
   ```

**Ollama Agent (Automatic):**
- Watches for new commits on feature branches
- Runs unit tests on each commit
- Checks code quality (linting, complexity)
- Flags any compilation errors

### Phase 2: Create Pull Request

**Developer:**
1. Create PR on GitHub
   ```
   Title: Add feature: description
   Description:
   - What: Brief description of changes
   - Why: Business/technical reason
   - How: Implementation approach
   - Related Issues: #123
   
   Checklist:
   - [ ] Tests pass locally
   - [ ] Code follows style guide
   - [ ] Documentation updated
   - [ ] No hardcoded secrets
   ```

2. Link related issues
   ```
   Closes #123
   Relates to #456
   ```

**Ollama Agent (Automatic - PR Validation):**
1. Runs "PR Success Contract" validation:
   ```
   ✓ All unit tests pass
   ✓ Integration tests pass
   ✓ Code coverage maintained (>80%)
   ✓ No new security vulnerabilities
   ✓ No breaking changes to public APIs
   ✓ Builds on all platforms (Windows, macOS, Linux)
   ✓ All file handlers work
   ✓ Accessibility features functional
   ✓ Performance benchmarks met (no regression >5%)
   ✓ Documentation updated
   ✓ Version number incremented (if release)
   ✓ Changelog updated
   ```

2. Posts validation results as PR comment
   ```
   ✅ PR Validation Success
   - ✓ Build: Windows, macOS, Linux, iOS, Android, Web
   - ✓ Tests: 1,250 tests passed
   - ✓ Coverage: 87% (maintained)
   - ✓ Performance: No regression detected
   - ✓ Security: No vulnerabilities found
   - ✓ Accessibility: WCAG 2.1 AA compliant
   
   Ready for human review
   ```

3. If validation fails:
   ```
   ❌ PR Validation Failed
   
   Issues:
   - ✗ Build failed on macOS: Missing dependency
   - ✗ Test suite: 3 tests failed
   - ✗ Security: Hardcoded API key in string
   
   Auto-repair attempted:
   - ✓ Added missing dependency
   - ✗ Test failures require manual investigation
   - ✓ Removed hardcoded key
   
   Awaiting developer action
   ```

### Phase 3: Code Review

**Code Reviewers (Human):**
1. Review PR changes
   - Check code quality and style
   - Verify architectural decisions
   - Look for potential bugs
   - Check for security issues

2. Provide feedback
   ```
   "Looks good! Minor suggestion: consider using Map 
   instead of object literal for better performance"
   ```

3. Approve or request changes
   ```
   Approve: Ready to merge
   Request Changes: Please address comments
   ```

**Ollama Agent:**
- Monitors for review approval
- Re-runs tests if changes made
- Updates review status in PR

### Phase 4: Merge to Main

**Code Reviewer:**
1. After approval, click "Squash and merge"
   - Combines all commits into one
   - Cleaner git history

2. PR is automatically merged to `main`

**Ollama Agent (Automatic - Merge Validation):**
1. Triggers full test suite on `main`
2. Builds all platform releases
3. Generates checksums and signatures
4. Creates release artifacts
5. Updates QMOI_REALTIME_MEMORY_INDEX.md
6. Tags commit with version if release

---

## Testing Strategy

### Test Coverage Matrix

```
┌─────────────────────────────────────────────────────┐
│           Test Level & Responsibility               │
├──────────────────────┬─────────┬──────────────────────┤
│ Test Type            │ Created │ Runs                 │
├──────────────────────┼─────────┼──────────────────────┤
│ Unit Tests           │ Dev     │ Per commit (fast)    │
│ Integration Tests    │ Dev     │ Per PR (moderate)    │
│ E2E Tests            │ QA/Dev  │ Per PR (slow)        │
│ Platform Tests       │ QA      │ Pre-release only     │
│ Performance Tests    │ DevOps  │ Weekly + per release │
│ Security Tests       │ DevOps  │ Per PR + nightly     │
│ Accessibility Tests  │ QA      │ Per release          │
└──────────────────────┴─────────┴──────────────────────┘
```

### Unit Tests (Developer Responsibility)

**Test Each App Feature:**

```javascript
// Example: QMOIAIUI Conversation Feature
describe('Conversation Manager', () => {
  test('Creates new conversation', () => {
    const convo = new Conversation();
    expect(convo.id).toBeDefined();
    expect(convo.messages).toEqual([]);
  });

  test('Adds message to conversation', () => {
    const convo = new Conversation();
    const msg = new Message({ role: 'user', content: 'Hello' });
    convo.addMessage(msg);
    expect(convo.messages.length).toBe(1);
  });

  test('Saves conversation to IndexedDB', async () => {
    const convo = new Conversation();
    await convo.save();
    const loaded = await Conversation.load(convo.id);
    expect(loaded.id).toBe(convo.id);
  });
});
```

### Integration Tests (Cross-Feature)

```javascript
// Example: QMOIAIUI + QCity Integration
describe('QMOIAIUI ↔ QCity File Integration', () => {
  test('Shares file from QCity to QMOIAIUI for analysis', async () => {
    const file = await qcity.selectFile('document.pdf');
    const result = await qmoiaiui.analyze(file);
    expect(result.summary).toBeDefined();
  });

  test('Saves QMOIAIUI conversation notes as QCity document', async () => {
    const convo = await qmoiaiui.getConversation(convoId);
    const file = await qcity.saveFile(convo.export(), 'notes.md');
    expect(file.path).toBeDefined();
  });
});
```

### End-to-End Tests (User Workflows)

```javascript
// Example: QMOIAIUI Workflow
describe('E2E: Ask AI about music file', () => {
  test('User opens QCity, plays file, asks AI about it in QMOIAIUI', async () => {
    // 1. Open QCity
    await qcity.open();
    const musicFile = await qcity.navigate('/Music/song.mp3');

    // 2. Open QMOI Space and play
    await space.open();
    await space.play(musicFile);

    // 3. Ask QMOIAIUI about the music
    await qmoiaiui.open();
    const response = await qmoiaiui.ask('Tell me about the music theory in this song');

    // 4. Verify response is relevant
    expect(response).toMatch(/tempo|pitch|chord|scale/i);
  });
});
```

### Platform-Specific Tests (QA Team)

**Windows Platform Tests:**
```
✓ App appears in Windows Start Menu
✓ File associations work (right-click → Open With QMOIAIUI)
✓ Taskbar integration (pinning, thumbnail preview)
✓ Notifications use Windows API
✓ Media key capture (⏯ button) works
✓ Runs on both x64 and ARM64 Windows
✓ Uninstall removes all registry entries
```

**macOS Platform Tests:**
```
✓ App appears in Spotlight search
✓ Appears in Finder Applications folder
✓ Notarization verified (spctl -a -v)
✓ Works on both Intel and Apple Silicon
✓ Dark mode toggle switches theme
✓ Menu bar integration works
✓ Handoff to other devices works
✓ Universal app signature valid
```

**Linux Platform Tests:**
```
✓ AppImage runs on clean system
✓ Snap installs with proper confinement
✓ Flatpak sandbox allows necessary access
✓ .DEB installs via apt
✓ .RPM installs via dnf
✓ Desktop entry file appears in menu
✓ Works on both X11 and Wayland
✓ D-Bus integration functional
```

**iOS Platform Tests:**
```
✓ Installs from App Store
✓ File picker integrates with Files app
✓ iCloud Drive access works
✓ Photo library access works (with permission)
✓ Audio playback with hardware acceleration
✓ VoiceOver screen reader works
✓ Dynamic type scaling works
✓ Responds to orientation changes
✓ TestFlight beta updates correctly
```

**Android Platform Tests:**
```
✓ Installs from Google Play Store
✓ Storage access (scoped storage) works
✓ MediaStore integration for music
✓ Notifications appear correctly
✓ Adaptive icon displays properly
✓ TalkBack screen reader works
✓ Material You theming works
✓ Responds to orientation changes
✓ Battery usage is acceptable
```

**Web PWA Tests:**
```
✓ Works offline via Service Worker
✓ Lighthouse scores >90 (all categories)
✓ Installs as app on desktop/mobile
✓ Periodic sync works
✓ IndexedDB quota management
✓ Push notifications functional
✓ Keyboard navigation complete
✓ Screen reader accessible
```

---

## QA Process

### Pre-Release QA Checklist (1 week before release)

**Functional Testing (QA Team):**
- [ ] All new features work as designed
- [ ] All existing features still work (regression)
- [ ] Cross-app features work (QCity ↔ QMOIAIUI, etc.)
- [ ] File handlers work for all supported types

**Platform Testing (Platform Specialists):**
- [ ] Windows: Test on Windows 10, 11, x64, ARM64
- [ ] macOS: Test on Intel, Apple Silicon, 2+ OS versions
- [ ] Linux: Test on Ubuntu, Fedora, Debian (latest)
- [ ] iOS: Test on iPhone, iPad, latest iOS
- [ ] Android: Test on multiple devices (emulator + real)
- [ ] Web: Test on Chrome, Firefox, Safari, Edge

**Accessibility Testing (Dedicated QA):**
- [ ] VoiceOver (macOS/iOS) works
- [ ] NVDA/JAWS (Windows) works
- [ ] Magnification at 200% readable
- [ ] Color contrast >4.5:1
- [ ] Keyboard-only navigation possible
- [ ] All controls labeled
- [ ] Handsfree controls functional

**Performance Testing (DevOps):**
- [ ] App startup <3 seconds
- [ ] Media playback smooth (60 FPS)
- [ ] Memory usage stable (no leaks)
- [ ] Battery drain acceptable (mobile)
- [ ] Network requests optimized

**Security Audits (DevOps):**
- [ ] No hardcoded secrets
- [ ] Dependency vulnerabilities scanned
- [ ] HTTPS/TLS everywhere
- [ ] User data encrypted
- [ ] No sensitive data in logs
- [ ] Code signed/notarized

### Bug Tracking & Triage

**Ollama Agent Automatic Bug Detection:**
```
When tests fail during PR validation:
1. Auto-creates GitHub issue with:
   - Stack trace
   - Test name and line number
   - Platform/environment affected
   - Steps to reproduce
   - Suggested fix (if available)

2. Labels issue:
   - 🐛 bug
   - 🏃 runner: (platform)
   - 🔴 priority: critical/high/medium/low

3. Assigns to relevant team
4. Re-checks after developer fix
```

**QA Team Manual Bug Finding:**
```
1. Reproduce issue
2. File GitHub issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Environment (OS, device, app version)

3. Label:
   - 🐛 bug
   - 🏃 platform
   - 🔴 priority

4. Assign to developer
```

---

## Release Process

### Version Numbering

```
Version Format: MAJOR.MINOR.PATCH-PRERELEASE

Examples:
- 1.0.0       : First production release
- 1.2.3       : Current stable (1 major, 2 minor updates, 3 patches)
- 2.0.0-beta1 : Beta for next major release
- 2.0.0-rc1   : Release candidate
```

### Release Timeline (Each Month)

```
Week 1: Feature development
  - Dev teams create features
  - Ollama agent validates each PR
  - PRs merged to main continuously

Week 2-3: Stabilization
  - QA tests on staging
  - Bugfixes and refinements
  - Performance optimization
  - Security audits
  
Week 4: Release
  Monday: QA sign-off for release
  Tuesday: Build all platforms (Ollama agent)
  Wednesday: Submit to app stores
  Thursday-Friday: Wait for app store review
  
Next Week: Monitor production
  - Fix any critical issues (hotfixes)
  - Collect user feedback
  - Plan next release
```

### Release Checklist

**Code Freeze (Tuesday):**
- [ ] All PRs merged to main
- [ ] Version number incremented (BUILD.md)
- [ ] Changelog updated (CHANGELOG.md)
- [ ] All platform builds succeed
- [ ] All tests pass (unit, integration, e2e)
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Signed/notarized for all platforms

**App Store Submission (Wednesday):**
- [ ] Windows Store (Microsoft)
- [ ] Mac App Store (Apple)
- [ ] iOS App Store (Apple)
- [ ] Google Play Store (Android)
- [ ] Snap Store (Linux)
- [ ] Flathub (Linux)
- [ ] Web PWA (deploy to CDN)
- [ ] GitHub Release (with artifacts)

**Post-Release (Weekend):**
- [ ] Monitor crash reports
- [ ] Monitor user reviews
- [ ] Respond to critical issues
- [ ] Plan hotfixes if needed
- [ ] Prepare for next release

---

## Tools & Infrastructure

### CI/CD Platform
- **GitHub Actions** for PR validation and builds
- **Ollama Autonomous Agent** orchestrates all automation
- **Runners:** GitHub-hosted (Windows, macOS, Linux) + self-hosted for signing

### Testing Tools
- **Unit Testing:** Jest (JavaScript), pytest (Python), XCTest (iOS)
- **E2E Testing:** Cypress, Selenium
- **Performance:** Lighthouse, WebPageTest, Instruments (macOS), Android Profiler
- **Security:** OWASP ZAP, Dependabot, Snyk
- **Accessibility:** Axe DevTools, WAVE, Lighthouse

### Code Quality
- **Linting:** ESLint, Pylint, SwiftLint
- **Formatting:** Prettier, Black
- **Coverage:** Code Climate, Codecov
- **Dependency Management:** Dependabot, npm audit

### Monitoring & Analytics
- **Crash Reporting:** Sentry, Firebase Crashlytics
- **Analytics:** Google Analytics, Mixpanel
- **Performance Monitoring:** New Relic, DataDog
- **User Feedback:** UserTesting, Amplitude

---

## Communication

### Channels
- **Decisions:** GitHub Issues & PRs
- **Quick Chats:** Slack #qmoi-dev
- **Planning:** Weekly standups (Mon 9am)
- **Status Updates:** Weekly sync (Wed 2pm)
- **Release Meetings:** Month-end review (Fri 3pm)

### Standups (Weekly Monday 9am)

**Each person shares:**
- What accomplished last week
- What working on this week
- Any blockers

**Example:**
```
Frontend Team Lead: "Completed new handsfree UI 
component. This week: integrating voice recognition. 
Blocker: Need accessibility review from QA."

QA Lead: "Tested 50+ edge cases for file handlers. 
This week: Performance testing. No blockers."

DevOps: "Fixed macOS notarization issue. 
This week: Setting up Android emulator farm. 
Blocker: Need signing certificate renewal approval."
```

### Documentation

**Keep Current:**
- Architecture decisions (in ARCHITECTURE.md)
- API documentation (in API_REFERENCE.md)
- Platform requirements (in PLATFORM_REQUIREMENTS.md)
- Build procedures (in BUILD.md)
- Installation guide (in INSTALL.md)
- Release notes (in CHANGELOG.md & RELEASE_NOTES.md)

---

## Escalation Path

For urgent issues during development:

```
Issue → Developer Working On It (immediately)
      → Team Lead (if can't fix same day)
      → Architecture Review (if affects multiple teams)
      → CTO (if release at risk)
      → Executive (if customer impact)
```

For production issues:

```
Crash/Data Loss → Page on-call engineer immediately
                → Rollback or hotfix
                → Post-mortem within 24 hours
```

---

## Success Metrics

**Team Tracks:**
- PR merge time (target: <24 hours from creation)
- Test pass rate (target: >99%)
- Code coverage (target: >85%)
- Bug density (target: <1 per 1000 LOC)
- Release cadence (target: monthly)
- Production incidents (target: <1 per release)
- User satisfaction (target: >4.5/5 stars)

---

**Last Updated:** 2026-08-13  
**Team Size:** 15-20 people  
**Contact:** team@qmoi.com
