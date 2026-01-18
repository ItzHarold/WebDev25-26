# Deployment Script with URL Validation
param([string]$RailwayURL = "")

$ErrorActionPreference = "Stop"
$WEBDEV = "C:\Users\Harold\Documents\GitHub\WebDev25-26"
$PORTFOLIO = "C:\Users\Harold\Documents\GitHub\portfolio-site"
$FRONTEND = "$WEBDEV\frontend"
$DEST = "$PORTFOLIO\public\demos\webdev"

Write-Host "`nEvent Manager Deployment Starting...`n" -ForegroundColor Cyan

# Get Railway URL
if ($RailwayURL -eq "") {
    Write-Host "Enter your Railway deployment URL:" -ForegroundColor Yellow
    Write-Host "(e.g., webdev25-26-production.up.railway.app)`n" -ForegroundColor Gray
    $RailwayURL = Read-Host "Railway URL"
    if ($RailwayURL -eq "") {
        Write-Host "`nERROR: Railway URL is required!`n" -ForegroundColor Red
        exit 1
    }
}

# Add https:// if missing
if (-not $RailwayURL.StartsWith("http://") -and -not $RailwayURL.StartsWith("https://")) {
    $RailwayURL = "https://$RailwayURL"
    Write-Host "Added https:// prefix" -ForegroundColor Gray
}

Write-Host "`nUsing Railway URL: $RailwayURL`n" -ForegroundColor Green

# Update .env
Write-Host "Updating frontend API URL..." -ForegroundColor Yellow
Set-Content -Path "$FRONTEND\.env" -Value "VITE_API_URL=$RailwayURL"
Write-Host "Done!`n" -ForegroundColor Green

# Install and Build
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Set-Location $FRONTEND
npm install
Write-Host "`nDone!`n" -ForegroundColor Green

Write-Host "Building frontend (this takes about 1 minute)..." -ForegroundColor Yellow
npm run build

if (-not (Test-Path "$FRONTEND\dist\index.html")) {
    Write-Host "`nERROR: Build failed! Check the errors above.`n" -ForegroundColor Red
    exit 1
}
Write-Host "`nDone!`n" -ForegroundColor Green

# Copy to portfolio
Write-Host "Copying files to portfolio..." -ForegroundColor Yellow
if (-not (Test-Path $DEST)) {
    New-Item -ItemType Directory -Force -Path $DEST | Out-Null
}
Remove-Item "$DEST\*" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "$FRONTEND\dist\*" -Destination $DEST -Recurse -Force
$fileCount = (Get-ChildItem $DEST -Recurse -File).Count
Write-Host "Done! Copied $fileCount files`n" -ForegroundColor Green

# Commit WebDev changes
Write-Host "Committing WebDev changes..." -ForegroundColor Yellow
Set-Location $WEBDEV
$hasChanges = (git status --porcelain) -ne $null
if ($hasChanges) {
    git add .
    git commit -m "Configure for production deployment"
    git push
    Write-Host "Done!`n" -ForegroundColor Green
} else {
    Write-Host "No changes to commit`n" -ForegroundColor Green
}

# Commit Portfolio changes
Write-Host "Deploying to portfolio..." -ForegroundColor Yellow
Set-Location $PORTFOLIO
git add .
git commit -m "Add Event Manager live demo"
git push
Write-Host "Done!`n" -ForegroundColor Green

# Success
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Railway Backend: $RailwayURL" -ForegroundColor White
Write-Host "`nTest locally:" -ForegroundColor Yellow
Write-Host "  cd $PORTFOLIO" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  Visit: http://localhost:3000/demos/webdev`n" -ForegroundColor White

Write-Host "Live URL (in 2 minutes):" -ForegroundColor Yellow
Write-Host "  https://haroldpdc.com/demos/webdev`n" -ForegroundColor Cyan

Set-Location $PORTFOLIO
