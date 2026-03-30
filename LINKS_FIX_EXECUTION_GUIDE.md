<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.762361Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# LINKS & DOMAINS FIX EXECUTION GUIDE
## QMOI Enhanced - Session 3 Implementation

### 🚀 QUICK START

Run the comprehensive fixer in one command:

```bash
cd /workspaces/qmoi-enhanced
python3 comprehensive_link_fixer.py
```

**Expected Execution Time**: 3-5 minutes  
**Files Processed**: 3,588 markdown files  
**Expected Replacements**: 1,000+ fixes  
**Report Generated**: `comprehensive_fixes_report.json`

---

### 📋 Phases (Automated by comprehensive_link_fixer.py)

#### Phase 1: Domain References → Fixed
Replacements (12 patterns):
- `(https://qcity.qmoi.ai)` → `(https://qcity.qmoi.ai)`
- `[qcity](https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)` → `[qcity](https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)(https://qcity.qmoi.ai)`
- `(https://qmoi.ai)` → `(https://qmoi.ai)`
- `[qmoi](https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai)` → `[qmoi](https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai)`
- `(https://qvillage.com)` → `(https://qvillage.com)`
- `[qvillage](https://qvillage.com)(https://qvillage.com)(https://qvillage.com)(https://qvillage.com)` → `[qvillage](https://qvillage.com)(https://qvillage.com)(https://qvillage.com)(https://qvillage.com)(https://qvillage.com)`
- `(https://github.com/thealphakenya/qmoi-enhanced)` → `(https://github.com/thealphakenya/qmoi-enhanced)`
- `[qmoi-enhanced](https://github.com/thealphakenya/qmoi-enhanced)(https://github.com/thealphakenya/qmoi-enhanced)(https://github.com/thealphakenya/qmoi-enhanced)(https://github.com/thealphakenya/qmoi-enhanced)` → `[qmoi-enhanced](https://github.com/thealphakenya/qmoi-enhanced)(https://github.com/thealphakenya/qmoi-enhanced)(https://github.com/thealphakenya/qmoi-enhanced)(https://github.com/thealphakenya/qmoi-enhanced)(https://github.com/thealphakenya/qmoi-enhanced)`
- `(https://qmoi-space.qvillage.com)` → `(https://qmoi-space.qvillage.com)`
- `[qmoi-space](https://qmoi-space.qvillage.com)(https://qmoi-space.qvillage.com)(https://qmoi-space.qvillage.com)(https://qmoi-space.qvillage.com)` → `[qmoi-space](https://qmoi-space.qvillage.com)(https://qmoi-space.qvillage.com)(https://qmoi-space.qvillage.com)(https://qmoi-space.qvillage.com)(https://qmoi-space.qvillage.com)`
- `(https://yap.qvillage.com)` → `(https://yap.qvillage.com)`
- `[yap](https://yap.qvillage.com)(https://yap.qvillage.com)(https://yap.qvillage.com)(https://yap.qvillage.com)` → `[yap](https://yap.qvillage.com)(https://yap.qvillage.com)(https://yap.qvillage.com)(https://yap.qvillage.com)(https://yap.qvillage.com)`

#### Phase 4: Localhost URLs → Fixed
Replacements (4 patterns):
- `https://qmoi.ai` → `https://qmoi.ai`
- `https://qvillage.com` → `https://qvillage.com`
- `qmoi.ai` → `qmoi.ai`
- `qvillage.com` → `qvillage.com`

#### Phase 2: Internal References → Fixed
Replacements (2 patterns):
- `[[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)` → `[[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)`
- `[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)` → `[[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)`

#### Phase 3: App Download Links → Fixed
Replacements (4 patterns):
- `[qmoi_ai.apk](https://releases.qmoi.ai/apps/qmoi_ai.apk)(https://releases.qmoi.ai/apps/qmoi_ai.apk)(https://releases.qmoi.ai/apps/qmoi_ai.apk)(https://releases.qmoi.ai/apps/qmoi_ai.apk)` → `[qmoi_ai.apk](https://releases.qmoi.ai/apps/qmoi_ai.apk)(https://releases.qmoi.ai/apps/qmoi_ai.apk)(https://releases.qmoi.ai/apps/qmoi_ai.apk)(https://releases.qmoi.ai/apps/qmoi_ai.apk)(https://releases.qmoi.ai/apps/qmoi_ai.apk)`
- `[qmoi_ai.ipa](https://releases.qmoi.ai/apps/qmoi_ai.ipa)(https://releases.qmoi.ai/apps/qmoi_ai.ipa)(https://releases.qmoi.ai/apps/qmoi_ai.ipa)(https://releases.qmoi.ai/apps/qmoi_ai.ipa)` → `[qmoi_ai.ipa](https://releases.qmoi.ai/apps/qmoi_ai.ipa)(https://releases.qmoi.ai/apps/qmoi_ai.ipa)(https://releases.qmoi.ai/apps/qmoi_ai.ipa)(https://releases.qmoi.ai/apps/qmoi_ai.ipa)(https://releases.qmoi.ai/apps/qmoi_ai.ipa)`
- `[qmoi_ai_chromebook.zip](https://releases.qmoi.ai/apps/qmoi_ai_chromebook.zip)(https://releases.qmoi.ai/apps/qmoi_ai_chromebook.zip)(https://releases.qmoi.ai/apps/qmoi_ai_chromebook.zip)(https://releases.qmoi.ai/apps/qmoi_ai_chromebook.zip)` → `[qmoi_ai_chromebook.zip](https://releases.qmoi.ai/apps/qmoi_ai_chromebook.zip)(https://releases.qmoi.ai/apps/qmoi_ai_chromebook.zip)(https://releases.qmoi.ai/apps/qmoi_ai_chromebook.zip)(https://releases.qmoi.ai/apps/qmoi_ai_chromebook.zip)(https://releases.qmoi.ai/apps/qmoi_ai_chromebook.zip)`
- `[qmoi_ai_smarttv.apk](https://releases.qmoi.ai/apps/qmoi_ai_smarttv.apk)(https://releases.qmoi.ai/apps/qmoi_ai_smarttv.apk)(https://releases.qmoi.ai/apps/qmoi_ai_smarttv.apk)(https://releases.qmoi.ai/apps/qmoi_ai_smarttv.apk)` → `[qmoi_ai_smarttv.apk](https://releases.qmoi.ai/apps/qmoi_ai_smarttv.apk)(https://releases.qmoi.ai/apps/qmoi_ai_smarttv.apk)(https://releases.qmoi.ai/apps/qmoi_ai_smarttv.apk)(https://releases.qmoi.ai/apps/qmoi_ai_smarttv.apk)(https://releases.qmoi.ai/apps/qmoi_ai_smarttv.apk)`

#### Phase 5: Malformed URLs
- Manual review required (complex patterns)
- Will be identified and flagged in final report

---

### ✅ Verification Steps

After running the fixer:

1. **Check Report**
   ```bash
   cat comprehensive_fixes_report.json | jq '.stats'
   ```

2. **data File Check**
   ```bash
   # Look for successful replacements in a critical file
   grep -n "https://qmoi.ai" RELEASE_FINALIZATION_PLAN.md
   grep -n "https://qvillage.com" SESSION_4_SUMMARY.md
   ```

3. **Verify No Breakage**
   ```bash
   # Check that markdown links are still valid
   grep "\[.*\](.*)" QVILLAGE.md | head -10
   ```

---

### 🎯 Manual Fixes (Critical Files)

If automated fixes don't catch edge cases, manually fix these top 10 files:

```bash
# Files needing manual review
CRITICAL_FILES=(
  "QVILLAGE.md"
  "RELEASE_FINALIZATION_PLAN.md"
  "SESSION_4_SUMMARY.md"
  "PHASE_6_EXTENDED_SUMMARY.md"
  "DEPLOYMENT_HEALTH_CHECKLIST.md"
  "README_ENHANCED.md"
  "START_production_DEPLOYMENT.md"
  "SECURITY_AUDIT_CHECKLIST.md"
  "API.md"
  "DOCKER_DEPLOYMENT_GUIDE.md"
)

# Check one file for remaining issues
grep -n "localhost\|qcity\|qvillage\|qmoi" "${CRITICAL_FILES[0]}" | grep -v "https\|http"
```

---

### 📊 Expected Improvements

**Before Fixes:**
- Broken links: 12,859 / 31,185 (41.23%)
- Critical files affected: 98
- High priority files affected: 231

**After Comprehensive Fixes:**
- Broken links: ~1,000-2,000 / 31,185 (3-6%)
  - Most remaining will be DNS-dependent (.qmoi.ai domains)
  - Some may be intentional relative links or prod references

**Remaining Work:**
- DNS Recovery (.qmoi.ai zone configuration) ← Requires registrar action
- Manual cleanup of malformed URLs
- Validation of replaced links

---

### 🔧 Alternative Execution Methods

#### Method 1: Individual Phases (If needed)
```bash
# Phase 1 only (if comprehensive fixer fails)
python3 scripts/phase1_domain_link_fixer.py

# Light-weight alternative
python3 run_phase1.py
```

#### Method 2: Manual Batch Replace (sed)
```bash
# implementation: Replace qmoi.ai in all markdown files
find . -name "*.md" -type f -exec sed -i 's|https://qmoi.ai|https://qmoi.ai|g' {} +

# Check results
grep -r "https://qmoi.ai" --include="*.md" . | wc -l
```

#### Method 3: Parallel Processing (for large batches)
```bash
# Use GNU parallel if available
find . -name "*.md" | parallel 'python3 << EOF
content = open({}).read()
# Apply replacements
EOF'
```

---

### 📈 Monitoring Long-Running Executions

```bash
# Start fixer in background
nohup python3 comprehensive_link_fixer.py > fixer.log 2>&1 &

# Monitor progress
tail -f fixer.log

# Check final report
sleep 300  # Wait 5 minutes
stat comprehensive_fixes_report.json
cat comprehensive_fixes_report.json | jq '{files_modified, total_replacements, elapsed_seconds: .performance.total_time_seconds}'
```

---

### 🚨 Troubleshooting

**Issue**: Script hangs on large file sets
- **Solution**: Use `run_phase1.py` instead (simpler, faster)
- **Alternative**: Process files in chunks manually

**Issue**: Some replacements not applied
- **Cause**: Files with encoding issues or special characters
- **Solution**: Check error count in report; manually review flagged files

**Issue**: Report file not created
- **Check**: Is script still running? (`tail /tmp/*.log`)
- **Fallback**: Manually count changes in repository

---

### 📝 Next Steps After Fixes

1. **Re-run Link Audit**
   ```bash
   python3 scripts/documentation_audit_and_fix.py
   ```

2. **Generate Comparison Report**
   - Compare `documentation_audit_report.json` (before vs. after)
   - Identify remaining broken links

3. **DNS Recovery** (separate sprint)
   - Contact domain registrar for .qmoi.ai zone config
   - Validate nameservers
   - Test DNS resolution

4. **production Validation**
   - Deploy to production
   - Run link checker tool
   - Verify all critical links resolve

---

### 📞 Contact & Support

For issues with the fixer:
1. Check `comprehensive_fixes_report.json` for error details
2. Check error count and specific error files
3. Run in parts: test on small file subset first
4. Review fixer script logs

---

**Created**: 2026-03-23  
**Status**: Ready for Execution  
**Estimated Impact**: Fix 41% broken links across 1,950+ files

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:31Z

---
*This document is maintained by QMOI's autonomous evolution system*
