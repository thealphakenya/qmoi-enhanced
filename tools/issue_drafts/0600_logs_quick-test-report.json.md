---
title: "Issue draft for logs/quick-test-report.json"
generated: 2025-11-08T16:06:38.390099Z
---

# Review needed: logs/quick-test-report.json

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
{
  "timestamp": "2025-11-07T22:21:01.924041",
  "summary": {
    "total_tests": 9,
    "passed_tests": 9,
    "failed_tests": 0,
    "success_rate": 100.0
  },
  "detailed_results": {
    "System Check": {
      "status": "PASSED",
      "duration": "0:00:00.002187",
      "result": {
        "python_version": "3.12.12",
        "node_version": "Not found",
        "npm_version": "Not found",
        "git_version": "git version 2.51.1",
        "directories": {
          "scripts": true,
          "logs": true,
          "config": true,
          "components": true
        }
      }
    },
    "Dependencies": {
      "status": "PASSED",
      "duration": "0:00:00.001163",
      "result": {
        "python_dependencies": {
          "requests": false,
          "psutil": false,
          "websockets": false,
          "aiohttp": false
        },
        "node_dependencies": {}
      }
    },
    "Configuration": {
      "status": "PASSED",
      "duration": "0:00:00.000355",
      "result": {
        "config_files": {
          "config/ai_automation_config.json": true,
          "config/auto_fix.json": true,
          "config/qmoi_enhanced_config.json": false,
          "config/qmoi_monitor_config.json": false,
          "config/qmoi_notifications_config.json": false
        },
        "main_files": {
          "package.json": true,
          "tsconfig.json": true,
          ".gitlab-ci.yml": true
        }
      }
    },
    "Real-Time Monitor": {
      "status": "PASSED",
      "duration": "0:00:00.000563",
      "result": {
        "monitor_script_exists": true,
        "dashboard_generated": true,
        "websocket_simulation": true
      }
    },
    "Notifications": {
      "status": "PASSED",
      "duration": "0:00:00.000311",
      "result": {
        "notification_script_exists": true,
        "notification_types": {
          "info": true,
          "success": true,
          "warning": true,
          "error": true,
          "debug": true
        }
      }
    },
    "Error Handling": {
      "statu
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
