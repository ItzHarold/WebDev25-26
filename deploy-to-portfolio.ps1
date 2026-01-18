# ========================================
# WebDev25-26 → Portfolio Deployment Script
# ========================================
# This script automates the entire deployment process

Write-Host "`n🚀 WebDev25-26 Portfolio Integration Script`n" -ForegroundColor Cyan

# Configuration
$WEBDEV_PATH = "C:\Users\Harold\Documents\GitHub\WebDev25-26"
$PORTFOLIO_PATH = "C:\Users\Harold\Documents\GitHub\portfolio-site"
$FRONTEND_PATH = "$WEBDEV_PATH\frontend"
$BACKEND_PATH = "$WEBDEV_PATH\Backend"
$DEST_PATH = "$PORTFOLIO_PATH\public\demos\webdev"

# ========================================
# PHASE 1: Check Railway URL
# ========================================
Write-Host "📋 PHASE 1: Checking Railway Configuration..." -ForegroundColor Yellow

$envFile = "$FRONTEND_PATH\.env"
$envContent = Get-Content $envFile -Raw

if ($envContent -match "localhost:5079") {
    Write-Host "⚠️  WARNING: API URL still points to localhost!" -ForegroundColor Red
    Write-Host ""
    Write-Host "You need to:" -ForegroundColor White
    Write-Host "  1. Deploy backend to Railway (https://railway.app)" -ForegroundColor White
    Write-Host "  2. Get your Railway URL" -ForegroundColor White
    Write-Host "  3. Update $envFile" -ForegroundColor White
    Write-Host "  4. Change VITE_API_URL to your Railway URL" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Have you deployed to Railway and updated .env? (y/n)"
    
    if ($continue -ne "y") {
        Write-Host "`n❌ Deployment cancelled. Update .env first!`n" -ForegroundColor Red
        exit
    }
}

Write-Host "✅ Configuration looks good!`n" -ForegroundColor Green

# ========================================
# PHASE 2: Build Frontend
# ========================================
Write-Host "📋 PHASE 2: Building Frontend..." -ForegroundColor Yellow

Set-Location $FRONTEND_PATH

Write-Host "Installing dependencies..." -ForegroundColor Gray
npm install

Write-Host "Building production bundle..." -ForegroundColor Gray
npm run build

if (-not (Test-Path "$FRONTEND_PATH\dist")) {
    Write-Host "❌ Build failed! Check for errors above." -ForegroundColor Red
    exit
}

Write-Host "✅ Frontend built successfully!`n" -ForegroundColor Green

# ========================================
# PHASE 3: Copy to Portfolio
# ========================================
Write-Host "📋 PHASE 3: Copying files to portfolio..." -ForegroundColor Yellow

# Create destination directory
if (-not (Test-Path $DEST_PATH)) {
    New-Item -ItemType Directory -Force -Path $DEST_PATH | Out-Null
}

# Copy all files from dist to portfolio
Write-Host "Copying files..." -ForegroundColor Gray
Copy-Item -Path "$FRONTEND_PATH\dist\*" -Destination $DEST_PATH -Recurse -Force

Write-Host "✅ Files copied to portfolio!`n" -ForegroundColor Green

# ========================================
# PHASE 4: Verify Integration
# ========================================
Write-Host "📋 PHASE 4: Verifying integration..." -ForegroundColor Yellow

$indexExists = Test-Path "$DEST_PATH\index.html"
$assetsExist = Test-Path "$DEST_PATH\assets"

if ($indexExists -and $assetsExist) {
    Write-Host "✅ All files copied successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some files might be missing. Check $DEST_PATH" -ForegroundColor Yellow
}

Write-Host ""

# ========================================
# PHASE 5: Final Instructions
# ========================================
Write-Host "🎉 Integration Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Test locally:" -ForegroundColor Gray
Write-Host "     cd $PORTFOLIO_PATH" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host "     Visit: http://localhost:3000/demos/webdev" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Deploy to Vercel:" -ForegroundColor Gray
Write-Host "     cd $PORTFOLIO_PATH" -ForegroundColor Gray
Write-Host "     git add ." -ForegroundColor Gray
Write-Host "     git commit -m 'Add Event Manager demo'" -ForegroundColor Gray
Write-Host "     git push" -ForegroundColor Gray
Write-Host ""
Write-Host "Visit https://haroldpdc.com/demos/webdev when deployed! 🚀" -ForegroundColor Cyan
Write-Host ""

Set-Location $PORTFOLIO_PATH
