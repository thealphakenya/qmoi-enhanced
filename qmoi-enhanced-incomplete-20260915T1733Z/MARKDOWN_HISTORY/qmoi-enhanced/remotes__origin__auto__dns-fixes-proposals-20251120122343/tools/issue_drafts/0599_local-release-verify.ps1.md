---
title: "Issue draft for local-release-verify.ps1"
generated: 2025-11-08T16:06:38.389810Z
---

# Review needed: local-release-verify.ps1

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
# Verify local platform artifacts

param(
    [string]$Out = "local_release_verification.json"
)

$ErrorActionPreference = 'Stop'

function Write-Info($m){ Write-Host $m -ForegroundColor Cyan }
function Write-Warn($m){ Write-Host $m -ForegroundColor Yellow }
function Write-Ok($m){ Write-Host $m -ForegroundColor Green }
function Write-Err($m){ Write-Host $m -ForegroundColor Red }

Write-Info "Checking local platform artifacts..."

$expected = @(
    @{ namePattern = "qmoi ai.exe"; platform = "windows"; path = "Qmoi_apps" },
    @{ namePattern = "qmoi ai.apk"; platform = "android"; path = "Qmoi_apps" },
    @{ namePattern = "qmoi ai.deb"; platform = "linux/chromebook"; path = "Qmoi_apps" },
    @{ namePattern = "qmoi_ai_all_apps.zip"; platform = "all"; path = "Qmoi_apps" },
    @{ namePattern = "qmoiexe.exe"; platform = "windows"; path = "dist" }
)

$report = [ordered]@{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    local_artifacts_found = @()
    missing = @()
    total_size = 0
}

foreach ($exp in $expected) {
    $searchPath = if ($exp.path) { $exp.path } else { "." }
    $found = Get-ChildItem -Path $searchPath -Recurse -Name | Where-Object { $_ -like "*$($exp.namePattern)*" -or $_ -like "*$($exp.namePattern.Replace(' ', '*'))*" }
    
    if ($found) {
        $fullPath = Join-Path $searchPath $found[0]
        if (Test-Path $fullPath) {
            $fileInfo = Get-Item $fullPath
            $report.local_artifacts_found += @{ 
                platform = $exp.platform
                name = $found[0]
                path = $fullPath
                size = $fileInfo.Length
                lastModified = $fileInfo.LastWriteTime
            }
            $report.total_size += $fileInfo.Length
        }
    } else {
        $report.missing += @{ platform = $exp.platform; pattern = $exp.namePattern; searchPath = $searchPath }
    }
}

$json = $report | ConvertTo-Json -Depth 5
Set-Content -LiteralPath $Out -Value $json -Encoding UTF8

Write-Info "Found $($report.local_artifacts_found.Count) artifacts, t
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
