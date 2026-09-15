---
title: "Issue draft for git-smart-sync.ps1"
generated: 2025-11-08T16:06:38.382255Z
---

# Review needed: git-smart-sync.ps1

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
﻿<#
git-smart-sync.ps1
FINAL unified script:
 - Detects Git Bash vs PowerShell
 - Path normalization
 - Log rotation
 - Notifications (Slack, Email, GitHub branch)
 - Scheduled Task installer
 - Backup branches
 - Fetch + rebase + auto-merge fallback
 - Large file detection (>50MB), optional LFS migration, optional GitHub Issue
 - Full push with retries & exponential backoff
 - Adaptive chunked push with resume
 - Optional dependency auto-fix across npm/pnpm/yarn
 - Ends with notification
#>

param (
    [string]$RepoPath = "D:\applications\Alpha-Q-ai",
    [string]$Branch = "main",
    [int]$MaxFullPushRetries = 20,
    [int]$InitialDelaySeconds = 15,
    [int]$MaxChunkStart = 1000,
    [string]$StateFile = ".git-smart-sync.state",
    [string]$LogFile = "git-smart-sync.log",
    [switch]$InstallScheduledTask,
    [switch]$AutoMigrateToLFS,
    [switch]$OpenIssueOnLargeFiles,
    [string]$SlackWebhook = "",
    [string]$EmailTo = "",
    [switch]$RunDepsFix,        # NEW: run dependency auto-fix step
    [switch]$DepsForce         # NEW: run force/aggressive fixes where supported
)

# -------------------- Helpers --------------------
function Rotate-Log {
    try {
        if (Test-Path -LiteralPath $LogFile) {
            $dateStr = (Get-Date).ToString("yyyyMMdd")
            $archive = "$($LogFile -replace '\.log$', '')-$dateStr.log"
            if (-not (Test-Path -LiteralPath $archive)) {
                Move-Item -LiteralPath $LogFile -Destination $archive -Force -ErrorAction SilentlyContinue
            }
        } else {
            New-Item -Path $LogFile -ItemType File -Force | Out-Null
        }
    } catch {}
}
Rotate-Log

function Log {
    param([string]$Message, [string]$Color = "Gray")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $line = "[$ts] $Message"
    try { Add-Content -LiteralPath $LogFile -Value $line -ErrorAction SilentlyContinue } catch {}
    try { Write-Host $Message -ForegroundColor $Color } catch { Write-Host $Message }
}

function Convert-PosixToWindowsPath($p) {
    if
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
