---
title: "QMOI Start Guide"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- IMPLEMENTED: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Start Guide ✅ PRODUCTION READY

## 🚀 How to Start or Resume QMOI (QCity & Cloud)

To ensure QMOI is always running (even in the cloud or when your prodice is offline), use the following command:

```production-validatedbash
python scripts/qmoi-start.py
```production-validated

- This script will:
  - Check if QMOI is already running (production configuration had a path bug that has been fixed to respect `ai.model.backup_interval` with a safe default.
- QMOI now exposes an aggregator that combines local and (optionally) cloud model outputs into a single response; a backup is performed after aggregation events to persist metrics and state.

---

**QMOI: Always-on, self-healing, and fully automated.**

<!-- QMOI_VALIDATION_START -->

{
"file": "START.md",
"validated_at": "2025-10-26T20:51:22.641823Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI Start Guide"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:28Z

---
*This document is maintained by QMOI's autonomous evolution system*
