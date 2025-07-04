# QCity NPM Self-Heal PowerShell Script
param(
    [switch]$ForceClean,
    [switch]$EssentialsOnly,
    [switch]$UpgradeAll,
    [switch]$DiagnosticsOnly
)
$LogFile = "logs/qcity_npm_selfheal.log"

function Log($msg) {
    $msg | Tee-Object -FilePath $LogFile -Append
}

Log "==== QCity NPM Self-Heal Run: $(Get-Date) ===="

Log "=== Disk Usage ==="
Get-PSDrive -Name (Get-Location).Path.Substring(0,1) | Select-Object Used,Free,Name | Out-String | Log

Log "=== Directory Permissions ==="
(Get-Acl . | Format-List | Out-String) | Log

Log "=== Node Version ==="
try { node -v | Log } catch { Log "Node not found" }

Log "=== NPM Version ==="
try { npm -v | Log } catch { Log "NPM not found" }

Log "=== Network Test ==="
try { Test-Connection -Count 2 registry.npmjs.org | Out-String | Log } catch { Log "Ping failed" }

if ($ForceClean) {
    Log "=== Force Clean Enabled ==="
    if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules | Out-Null }
    if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json | Out-Null }
    if (Test-Path yarn.lock) { Remove-Item -Force yarn.lock | Out-Null }
    if (Test-Path pnpm-lock.yaml) { Remove-Item -Force pnpm-lock.yaml | Out-Null }
    try { npm cache clean --force | Log } catch { Log "NPM cache clean failed" }
}

# Essentials list
$essentials = @('npm','yarn','pnpm','node-gyp','typescript','eslint','prettier','nodemon','pm2','npm-check-updates','ts-node','rimraf','cross-env','dotenv-cli','serve','http-server','concurrently','jest','mocha','nyc','tsc','webpack','vite')

function Ensure-Global($pkg) {
    Log "Ensuring $pkg is installed/upgraded..."
    Try-Install "npm install -g $pkg"
}

if ($EssentialsOnly) {
    foreach ($pkg in $essentials) { Ensure-Global $pkg }
    Log "=== Essentials Only Mode Complete ==="
    exit 0
}

foreach ($pkg in $essentials) { Ensure-Global $pkg }

if ($DiagnosticsOnly) {
    Log "=== Diagnostics Only Mode Complete ==="
    exit 0
}

function Try-Install {
    param([string]$cmd)
    Log "Running: $cmd"
    try {
        iex $cmd | Tee-Object -FilePath $LogFile -Append
        return $LASTEXITCODE
    } catch {
        Log "Failed: $cmd"
        return 1
    }
}

$installCmds = @(
    'npm ci',
    'npm install',
    'npm install --legacy-peer-deps',
    'npm install --force',
    'yarn install',
    'pnpm install'
)
$success = $false
$maxRetries = 3
foreach ($cmd in $installCmds) {
    $retries = 0
    while ($retries -lt $maxRetries) {
        $exit = Try-Install $cmd
        if ($exit -eq 0) {
            $success = $true
            break 2
        } else {
            Log "Install failed: $cmd. Cleaning up and retrying..."
            if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules | Out-Null }
            if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json | Out-Null }
            if (Test-Path yarn.lock) { Remove-Item -Force yarn.lock | Out-Null }
            if (Test-Path pnpm-lock.yaml) { Remove-Item -Force pnpm-lock.yaml | Out-Null }
            Try-Install "npm cache clean --force"
            Start-Sleep -Seconds (5 * ($retries+1))
            $retries++
        }
    }
}
if ($success) {
    Log "=== Dependency install succeeded ==="
} else {
    Log "=== All install strategies failed ==="
}

# Atomic/temp install
$tempDir = "node_modules_temp"
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path $tempDir | Out-Null
if (-not $EssentialsOnly -and -not $DiagnosticsOnly) {
    Log "=== Atomic Install to $tempDir ==="
    Try-Install "npm install --prefix $tempDir"
    if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
    Move-Item "$tempDir\node_modules" node_modules
    Remove-Item -Recurse -Force $tempDir
}

# Cloud offload (stub)
if ($env:CLOUD_OFFLOAD -eq "1") {
    Log "=== Offloading install/build to QCity cloud ==="
    # TODO: Implement real cloud API call
}

# Health monitor
Try-Install "npm outdated"
Try-Install "npm audit"
Try-Install "npm prune"

Log "=== NPM Audit ==="
$audit = npm audit 2>&1 | Tee-Object -FilePath $LogFile -Append
if ($LASTEXITCODE -ne 0) {
    Log "=== NPM Audit found issues or failed ==="
} else {
    Log "=== NPM Audit passed ==="
}

# --- Notification Section ---
$sendEmail = $false  # Set to $true to enable
if ($sendEmail) {
    $smtpServer = "smtp.example.com"
    $smtpFrom = "qcity@yourdomain.com"
    $smtpTo = "admin@yourdomain.com"
    $subject = "[QCity] NPM Self-Heal Run: $((Get-Date).ToString())"
    $body = "Status: $($LASTEXITCODE -eq 0 ? 'Success' : 'Failure')`nSee attached log."
    $attachment = $LogFile
    try {
        Send-MailMessage -From $smtpFrom -To $smtpTo -Subject $subject -Body $body -SmtpServer $smtpServer -Attachments $attachment
        Log "Email notification sent."
    } catch {
        Log "Failed to send email notification: $_"
    }
}

$sendApiNotification = $false  # Set to $true to enable
if ($sendApiNotification) {
    $apiUrl = "http://localhost:3000/api/qcity/notifications"
    $apiToken = "YOUR_JWT_TOKEN_HERE"
    $notifBody = @{
        type = "system"
        priority = $($LASTEXITCODE -eq 0 ? 'info' : 'high')
        message = "NPM Self-Heal completed. Status: $($LASTEXITCODE -eq 0 ? 'Success' : 'Failure')"
        channels = @("email")
    } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri $apiUrl -Method Post -Headers @{Authorization = "Bearer $apiToken"; 'Content-Type' = 'application/json'} -Body $notifBody
        Log "API notification sent."
    } catch {
        Log "Failed to send API notification: $_"
    }
}

Log "==== End of Run ====" 