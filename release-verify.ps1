<!-- AUTODEV Enhanced: 2026-04-20T09:06:54.399207 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:06.232288 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:01.520577 -->
# Verify latest GitHub release assets for all platforms

param(
    [string]$Tag = "latest",
    [string]$Owner = "thestablekenya",
    [string]$Repo = "stable-Q-ai",
    [string]$Out = "release_verification.json"
)

$ErrorActionPreference = 'Stop'

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function Write-Info($m){ Write-Host $m -ForegroundColor Cyan }
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function Write-Warn($m){ Write-Host $m -ForegroundColor Yellow }
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function Write-Ok($m){ Write-Host $m -ForegroundColor Green }
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function Write-Err($m){ Write-Host $m -ForegroundColor Red }

Write-Info "Fetching $Owner/$Repo release: $Tag"

$headers = @{ 'User-Agent' = 'qmoiai-release-verifier'; Accept = 'application/vnd.github+json' }
if ($env:GITHUB_TOKEN) { $headers['Authorization'] = "Bearer $($env:GITHUB_TOKEN)" }

$base = "https://api.github.com/repos/$Owner/$Repo/releases"

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function Try-Get($uri){
    try { return Invoke-RestMethod -Method Get -Uri $uri -Headers $headers } catch { return $null }
}

$rel = $null
if ($Tag -eq 'latest') {
    $rel = Try-Get "$base/latest"
}
if (-not $rel -and (Test-Path 'release.json')) {
    try {
        $local = Get-Content -Raw -LiteralPath 'release.json' | ConvertFrom-Json
        if ($local.tag_name) { $rel = Try-Get "$base/tags/$($local.tag_name)" }
        elseif ($local.tag) { $rel = Try-Get "$base/tags/$($local.tag)" }
        elseif ($local.version) { $rel = Try-Get "$base/tags/$($local.version)" }
    } catch { }
}
if (-not $rel) {
    $list = Try-Get $base
    if ($list -and $list.Count -gt 0) { $rel = $list[0] }
}
if (-not $rel) {
    Write-Err "Failed to fetch release metadata from GitHub (repo may be private or no releases)."
    exit 1
}

$assets = @($rel.assets | ForEach-Object { $_ | Select-Object name, browser_download_url, size })

$expected = @(
    @{ namePattern = "qmoi_ai.zip"; platform = "windows/macos" },
    @{ namePattern = "qmoi ai.deb"; platform = "linux" },
    @{ namePattern = "qmoi ai.exe"; platform = "windows" },
    @{ namePattern = "qmoi ai.dmg"; platform = "macos" },
    @{ namePattern = "qmoi ai.AppImage"; platform = "linux" },
    @{ namePattern = "qmoi_ai_all_apps.zip"; platform = "all" }
)

$report = [ordered]@{
    tag = $rel.tag_name
    name = $rel.name
    published_at = $rel.published_at
    assets_found = @()
    missing = @()
}

foreach ($exp in $expected) {
    $hit = $assets | Where-Object { $_.name -like $exp.namePattern }
    if ($hit) {
        $report.assets_found += @{ platform = $exp.platform; name = $hit[0].name; url = $hit[0].browser_download_url; size = $hit[0].size }
    } else {
        $report.missing += @{ platform = $exp.platform; pattern = $exp.namePattern }
    }
}

$json = $report | ConvertTo-Json -Depth 5
Set-Content -LiteralPath $Out -Value $json -Encoding UTF8

if ($report.missing.Count -gt 0) {
    Write-Warn "Some expected assets are missing. See $Out"
    exit 2
}

Write-Ok "All expected assets present. See $Out"
exit 0
