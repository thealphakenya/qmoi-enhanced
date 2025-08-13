# build-and-publish.ps1
Write-Host "=== Starting QMOI AI build and publish automation ==="

try {
    Write-Host "Running install-clean with build and publish..."
    npm run install-clean -- --run-builds --publish
    if ($LASTEXITCODE -ne 0) { throw "install-clean failed" }

    Write-Host "Building all Electron targets..."
    npm run build:electron:all
    if ($LASTEXITCODE -ne 0) { throw "Electron builds failed" }

    Write-Host "Building Android app..."
    npm run build:android
    if ($LASTEXITCODE -ne 0) { throw "Android build failed" }

    Write-Host "Building Windows installer..."
    npm run build-windows-installer
    if ($LASTEXITCODE -ne 0) { throw "Windows installer build failed" }

    Write-Host "Running QA autotest..."
    npm run qa:autotest
    if ($LASTEXITCODE -ne 0) { throw "QA autotest failed" }

    Write-Host "Build and publish completed successfully! ✅"
    exit 0
}
catch {
    Write-Error "Error during build/publish: $_"
    exit 1
}
