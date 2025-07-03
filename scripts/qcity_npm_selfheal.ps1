# QCity NPM Self-Heal PowerShell Script
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

Log "=== Clean Up ==="
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules | Out-Null }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json | Out-Null }
try { npm cache clean --force | Log } catch { Log "NPM cache clean failed" }

Log "=== NPM Install (1st attempt) ==="
$install1 = npm install 2>&1 | Tee-Object -FilePath $LogFile -Append
if ($LASTEXITCODE -ne 0) {
    Log "=== NPM Install failed, retrying with --legacy-peer-deps ==="
    $install2 = npm install --legacy-peer-deps 2>&1 | Tee-Object -FilePath $LogFile -Append
}
if ($LASTEXITCODE -ne 0) {
    Log "=== NPM Install failed, retrying with --force ==="
    $install3 = npm install --force 2>&1 | Tee-Object -FilePath $LogFile -Append
}
if ($LASTEXITCODE -eq 0) {
    Log "=== NPM Install succeeded ==="
} else {
    Log "=== NPM Install failed after all attempts ==="
}

Log "=== NPM Audit ==="
$audit = npm audit 2>&1 | Tee-Object -FilePath $LogFile -Append
if ($LASTEXITCODE -ne 0) {
    Log "=== NPM Audit found issues or failed ==="
} else {
    Log "=== NPM Audit passed ==="
}

# --- Notification Section ---
# Email Notification (customize SMTP details)
$sendEmail = $true  # Set to $false to disable
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

# API Notification (customize API URL and token)
$sendApiNotification = $true  # Set to $false to disable
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