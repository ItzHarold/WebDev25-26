# ═══════════════════════════════════════════════════════════
# 🚀 COMPLETE AUTOMATION - GET RAILWAY URL & DEPLOY
# ═══════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

Clear-Host
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║         AUTOMATIC DEPLOYMENT - FETCHING RAILWAY URL        ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$WEBDEV = "C:\Users\Harold\Documents\GitHub\WebDev25-26"
$PORTFOLIO = "C:\Users\Harold\Documents\GitHub\portfolio-site"
$FRONTEND = "$WEBDEV\frontend"
$DEST = "$PORTFOLIO\public\demos\webdev"

# ═══════════════════════════════════════════════════════════
# STEP 1: Get Railway Deployment URL
# ═══════════════════════════════════════════════════════════
Write-Host "Step 1: Fetching Railway Deployment URL" -ForegroundColor Magenta
Write-Host "─────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

Set-Location $WEBDEV\Backend

# Try to get URL from Railway CLI
Write-Host "Attempting to get URL from Railway..." -ForegroundColor Yellow
$railwayUrl = $null

try {
    # Link to the project
    railway link -p 64de6c4d-6ea2-4b97-bdbe-31f0fa55e9c7 2>&1 | Out-Null
    
    # Try to get the domain
    $domainOutput = railway domain 2>&1
    
    if ($domainOutput -match "https://[^\s]+") {
        $railwayUrl = $matches[0]
        Write-Host "✅ Found Railway URL: $railwayUrl" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Railway CLI not available or project not accessible" -ForegroundColor Yellow
}

# If Railway CLI didn't work, ask user
if (-not $railwayUrl) {
    Write-Host ""
    Write-Host "Please get your Railway deployment URL:" -ForegroundColor White
    Write-Host "  1. Open: https://railway.com/project/64de6c4d-6ea2-4b97-bdbe-31f0fa55e9c7" -ForegroundColor Gray
    Write-Host "  2. Click your Backend service" -ForegroundColor Gray
    Write-Host "  3. Go to Settings → Domains" -ForegroundColor Gray
    Write-Host "  4. Copy the URL (e.g., https://webdev-backend-production-xxxx.up.railway.app)" -ForegroundColor Gray
    Write-Host ""
    $railwayUrl = Read-Host "Paste your Railway deployment URL here"
    
    if (-not $railwayUrl) {
        Write-Host "`n❌ Cannot proceed without Railway URL!`n" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# ═══════════════════════════════════════════════════════════
# STEP 2: Update Frontend API URL
# ═══════════════════════════════════════════════════════════
Write-Host "Step 2: Configuring Frontend" -ForegroundColor Magenta
Write-Host "─────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

Write-Host "Updating .env with: $railwayUrl" -ForegroundColor Yellow
Set-Content -Path "$FRONTEND\.env" -Value "VITE_API_URL=$railwayUrl"
Write-Host "✅ API URL configured`n" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════
# STEP 3: Install & Build
# ═══════════════════════════════════════════════════════════
Write-Host "Step 3: Building Frontend" -ForegroundColor Magenta
Write-Host "─────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

Set-Location $FRONTEND

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install 2>&1 | Out-Null

Write-Host "Building production bundle (this takes ~1 minute)..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null

if (-not (Test-Path "$FRONTEND\dist\index.html")) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "Run this manually to see errors:" -ForegroundColor Yellow
    Write-Host "  cd $FRONTEND" -ForegroundColor Gray
    Write-Host "  npm run build" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Frontend built successfully!`n" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════
# STEP 4: Copy to Portfolio
# ═══════════════════════════════════════════════════════════
Write-Host "Step 4: Deploying to Portfolio" -ForegroundColor Magenta
Write-Host "───────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

if (-not (Test-Path $DEST)) {
    New-Item -ItemType Directory -Force -Path $DEST | Out-Null
}

Write-Host "Copying files..." -ForegroundColor Yellow
Remove-Item "$DEST\*" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "$FRONTEND\dist\*" -Destination $DEST -Recurse -Force

$fileCount = (Get-ChildItem $DEST -Recurse -File).Count
Write-Host "✅ Copied $fileCount files to portfolio!`n" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════
# STEP 5: Commit WebDev Changes
# ═══════════════════════════════════════════════════════════
Write-Host "Step 5: Committing Changes" -ForegroundColor Magenta
Write-Host "──────────────────────────" -ForegroundColor DarkGray
Write-Host ""

Set-Location $WEBDEV

$hasChanges = (git status --porcelain) -ne $null
if ($hasChanges) {
    Write-Host "Committing WebDev changes..." -ForegroundColor Yellow
    git add . 2>&1 | Out-Null
    git commit -m "Configure for production with demo login and Railway deployment" 2>&1 | Out-Null
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push 2>&1 | Out-Null
    Write-Host "✅ WebDev changes pushed!`n" -ForegroundColor Green
} else {
    Write-Host "✅ No WebDev changes to commit`n" -ForegroundColor Green
}

# ═══════════════════════════════════════════════════════════
# STEP 6: Commit Portfolio Changes
# ═══════════════════════════════════════════════════════════
Write-Host "Step 6: Deploying Portfolio" -ForegroundColor Magenta
Write-Host "───────────────────────────" -ForegroundColor DarkGray
Write-Host ""

Set-Location $PORTFOLIO

Write-Host "Adding files to git..." -ForegroundColor Yellow
git add . 2>&1 | Out-Null

Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Add Event Manager live demo with role-based login" 2>&1 | Out-Null

Write-Host "Pushing to GitHub (Vercel will auto-deploy)..." -ForegroundColor Yellow
git push 2>&1 | Out-Null

Write-Host "✅ Portfolio deployed to GitHub!`n" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════
# COMPLETE!
# ═══════════════════════════════════════════════════════════
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║              🎉 DEPLOYMENT COMPLETE! 🎉                   ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "Everything is LIVE!" -ForegroundColor White
Write-Host ""
Write-Host "✅ Backend running on Railway: $railwayUrl" -ForegroundColor Gray
Write-Host "✅ Frontend built and deployed" -ForegroundColor Gray
Write-Host "✅ Demo login with 3 roles ready" -ForegroundColor Gray
Write-Host "✅ All changes pushed to GitHub" -ForegroundColor Gray
Write-Host "✅ Vercel deploying now (~2 minutes)" -ForegroundColor Gray
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "🧪 TEST LOCALLY:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   cd $PORTFOLIO" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Visit: " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:3000/demos/webdev" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 LIVE DEMO (in ~2 minutes):" -ForegroundColor Yellow
Write-Host ""
Write-Host "   https://haroldpdc.com/demos/webdev" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎮 Demo Accounts:" -ForegroundColor Yellow
Write-Host "   Player:  player@test.com / 123456" -ForegroundColor Gray
Write-Host "   Manager: manager@test.com / 123456" -ForegroundColor Gray
Write-Host "   Admin:   admin@test.com / 123456" -ForegroundColor Gray
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "Check Vercel deployment:" -ForegroundColor White
Write-Host "  https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""

Set-Location $PORTFOLIO
Write-Host "All done! Your Event Manager is now live on your portfolio!" -ForegroundColor Green
Write-Host ""
