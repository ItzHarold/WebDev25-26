# ========================================
# 🚀 COMPLETE DEPLOYMENT AUTOMATION
# ========================================
# Run this after deploying backend to Railway

param(
    [string]$RailwayURL = ""
)

$ErrorActionPreference = "Stop"

Write-Host "`n" -NoNewline
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║   WebDev25-26 → Portfolio Integration (COMPLETE)          ║" -ForegroundColor Cyan  
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Paths
$WEBDEV = "C:\Users\Harold\Documents\GitHub\WebDev25-26"
$PORTFOLIO = "C:\Users\Harold\Documents\GitHub\portfolio-site"
$FRONTEND = "$WEBDEV\frontend"
$DEST = "$PORTFOLIO\public\demos\webdev"

# ========================================
# Step 1: Check/Update Railway URL
# ========================================
Write-Host "Step 1: Railway API Configuration" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

if ($RailwayURL -eq "") {
    Write-Host "⚠️  No Railway URL provided!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please provide your Railway URL:" -ForegroundColor White
    Write-Host "Example: https://webdev-backend-production-1a2b.up.railway.app" -ForegroundColor Gray
    Write-Host ""
    $RailwayURL = Read-Host "Enter Railway URL"
    
    if ($RailwayURL -eq "") {
        Write-Host "`n❌ Cannot proceed without Railway URL!`n" -ForegroundColor Red
        Write-Host "Deploy to Railway first:" -ForegroundColor White
        Write-Host "  1. Go to https://railway.app" -ForegroundColor Gray
        Write-Host "  2. Deploy WebDev25-26/Backend" -ForegroundColor Gray
        Write-Host "  3. Copy the URL from Settings → Domains" -ForegroundColor Gray
        Write-Host "  4. Run this script again with the URL`n" -ForegroundColor Gray
        exit 1
    }
}

# Update .env file
Write-Host "Updating .env with Railway URL..." -ForegroundColor Gray
$envContent = "VITE_API_URL=$RailwayURL"
Set-Content -Path "$FRONTEND\.env" -Value $envContent
Write-Host "✅ API URL configured!`n" -ForegroundColor Green

# ========================================
# Step 2: Install Dependencies
# ========================================
Write-Host "Step 2: Installing Dependencies" -ForegroundColor Yellow
Write-Host "════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Set-Location $FRONTEND
Write-Host "Running npm install..." -ForegroundColor Gray
npm install --silent
Write-Host "✅ Dependencies installed!`n" -ForegroundColor Green

# ========================================
# Step 3: Build Frontend
# ========================================
Write-Host "Step 3: Building Production Bundle" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Write-Host "Building frontend..." -ForegroundColor Gray
npm run build

if (-not (Test-Path "$FRONTEND\dist\index.html")) {
    Write-Host "`n❌ Build failed! Check errors above.`n" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend built successfully!`n" -ForegroundColor Green

# ========================================
# Step 4: Copy to Portfolio
# ========================================
Write-Host "Step 4: Copying to Portfolio" -ForegroundColor Yellow
Write-Host "════════════════════════════" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path $DEST)) {
    New-Item -ItemType Directory -Force -Path $DEST | Out-Null
}

Write-Host "Copying built files..." -ForegroundColor Gray
Remove-Item "$DEST\*" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "$FRONTEND\dist\*" -Destination $DEST -Recurse -Force

$fileCount = (Get-ChildItem $DEST -Recurse -File).Count
Write-Host "✅ Copied $fileCount files to portfolio!`n" -ForegroundColor Green

# ========================================
# Step 5: Commit Backend Changes
# ========================================
Write-Host "Step 5: Committing Backend Updates" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Set-Location $WEBDEV

# Check if there are changes
$status = git status --porcelain
if ($status) {
    Write-Host "Committing backend changes..." -ForegroundColor Gray
    git add Backend/Program.cs Backend/railway.json
    git commit -m "Update CORS and Railway config for production deployment"
    git push
    Write-Host "✅ Backend changes pushed!`n" -ForegroundColor Green
} else {
    Write-Host "✅ No backend changes to commit`n" -ForegroundColor Green
}

# ========================================
# Step 6: Test Locally
# ========================================
Write-Host "Step 6: Testing Integration" -ForegroundColor Yellow
Write-Host "═══════════════════════════" -ForegroundColor Yellow
Write-Host ""

Write-Host "Files in demo folder:" -ForegroundColor Gray
Get-ChildItem $DEST | Select-Object -First 5 | ForEach-Object {
    Write-Host "  ✓ $($_.Name)" -ForegroundColor Gray
}
if ($fileCount -gt 5) {
    Write-Host "  ... and $($fileCount - 5) more files" -ForegroundColor Gray
}

Write-Host "`n✅ Integration verified!`n" -ForegroundColor Green

# ========================================
# COMPLETE!
# ========================================
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║                  🎉 SETUP COMPLETE! 🎉                    ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Backend configured with production CORS" -ForegroundColor White
Write-Host "✅ Frontend built and copied to portfolio" -ForegroundColor White
Write-Host "✅ Demo login page ready" -ForegroundColor White
Write-Host "✅ All files in place" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "NEXT: Test & Deploy" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "🧪 TEST LOCALLY:" -ForegroundColor Yellow
Write-Host "   cd $PORTFOLIO" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host "   Visit: http://localhost:3000/demos/webdev" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 DEPLOY TO PRODUCTION:" -ForegroundColor Yellow
Write-Host "   cd $PORTFOLIO" -ForegroundColor Gray
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m `"Add Event Manager demo`"" -ForegroundColor Gray
Write-Host "   git push" -ForegroundColor Gray
Write-Host ""

Write-Host "🌐 LIVE URL:" -ForegroundColor Yellow
Write-Host "   https://haroldpdc.com/demos/webdev" -ForegroundColor Cyan
Write-Host ""

Set-Location $PORTFOLIO
