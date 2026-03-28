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

Write-Info "Found $($report.local_artifacts_found.Count) artifacts, total size: $([math]::Round($report.total_size/1MB, 2)) MB"

if ($report.missing.Count -gt 0) {
    Write-Warn "Missing artifacts: $($report.missing.Count)"
    $report.missing | ForEach-Object { Write-Warn "  - $($_.platform): $($_.pattern)" }
} else {
    Write-Ok "All expected artifacts found locally!"
}

Write-Info "Report saved to: $Out"
exit 0
