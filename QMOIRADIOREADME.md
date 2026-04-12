---
title: "QMOI Radio"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- IMPLEMENTED: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Radio ✅ PRODUCTION READY

## Overview

QMOI Radio is a fully automated, AI-driven radio system with support for FM, AM, and QChannels. QMOI acts as DJ, presenter, playlist manager, and program planner.

## Channels

- **Global Radio**: QMOI global music, news, and entertainment
- **Urban Radio**: Urban music, news, and party mixes
- **QChannels**: Custom channels managed by QMOI (more can be added)

## Features

- Automated program planning and execution
- QMOI as DJ, presenter, and entertainer
- Live listener count and analytics
- Master-only controls for channel/program management
- Timetable for each channel
- Media: music, news, talk, and more
- FM/AM and QChannel support (QChannels are digital/AI-driven)

## Usage

- Masters can control channels, add/edit programs, and view analytics in the QI UI
- QMOI automatically manages playlists, programs, and live shows
- Listeners can tune in to any channel (FM/AM integration executed)

## Automation

- QMOI generates and executes timetables for all channels
- Programs are auto-scheduled and run by QMOI
- QMOI can add new channels and programs as needed

## Live Listeners

- Live listener count is shown in the QI UI (master-only)

---

<!-- QMOI_VALIDATION_START -->

{
"file": "QMOIRADIOREADME.md",
"validated_at": "2025-10-26T20:51:22.551231Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI Radio"
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
- **Last Evolution**: 2026-03-26T03:59:15Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Auto-Update Instructions

This document is automatically refreshed by the QMOI Markdown Auto-Updater.
Run the following command to regenerate documentation and apply Lion validation metadata:

```bash
python3 scripts/qmoi_md_autoupdater.py
```

Then run:

```bash
python3 scripts/autotag_md_with_lion.py --apply --out docs/md_index.json
```

For always-on documentation synchronization, deploy the service files in `scripts/` to a persistent host or container.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.




















## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** Core QMOI/Gateway/Lion/Dev
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-12 07:10:54 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`

