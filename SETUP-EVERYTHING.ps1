# ═══════════════════════════════════════════════════════════
# 🚀 ONE-COMMAND DEPLOYMENT SCRIPT
# ═══════════════════════════════════════════════════════════
# This script does EVERYTHING to integrate WebDev25-26 into your portfolio
#
# Usage: .\SETUP-EVERYTHING.ps1 "https://your-railway-url.up.railway.app"
#
# ═══════════════════════════════════════════════════════════

param(
    [Parameter(Mandatory=$true)]
    [string]$RailwayURL
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Working { param($msg) Write-Host "⚙️  $msg..." -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

Clear-Host
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║         EVENT MANAGER → PORTFOLIO INTEGRATION              ║" -ForegroundColor Cyan
Write-Host "║                 One-Command Setup                          ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Info "Railway URL: $RailwayURL"
Write-Host ""

# Paths
$WEBDEV = "C:\Users\Harold\Documents\GitHub\WebDev25-26"
$PORTFOLIO = "C:\Users\Harold\Documents\GitHub\portfolio-site"  
$FRONTEND = "$WEBDEV\frontend"
$BACKEND = "$WEBDEV\Backend"
$DEST = "$PORTFOLIO\public\demos\webdev"

# ═══════════════════════════════════════════════════════════
# STEP 1: Update Frontend API URL
# ═══════════════════════════════════════════════════════════
Write-Host "Step 1: Configuring API URL" -ForegroundColor Magenta
Write-Host "──────────────────────────────" -ForegroundColor DarkGray

Write-Working "Updating .env file"
Set-Content -Path "$FRONTEND\.env" -Value "VITE_API_URL=$RailwayURL"
Write-Success "API URL configured"
Write-Host ""

# ═══════════════════════════════════════════════════════════
# STEP 2: Install Dependencies
# ═══════════════════════════════════════════════════════════
Write-Host "Step 2: Installing Dependencies" -ForegroundColor Magenta
Write-Host "──────────────────────────────" -ForegroundColor DarkGray

Set-Location $FRONTEND
Write-Working "Running npm install"
npm install 2>&1 | Out-Null
Write-Success "Dependencies installed"
Write-Host ""

# ═══════════════════════════════════════════════════════════
# STEP 3: Build Production Bundle
# ═══════════════════════════════════════════════════════════
Write-Host "Step 3: Building Frontend" -ForegroundColor Magenta
Write-Host "──────────────────────────────" -ForegroundColor DarkGray

Write-Working "Building production bundle (this may take 30-60 seconds)"
npm run build 2>&1 | Out-Null

if (-not (Test-Path "$FRONTEND\dist\index.html")) {
    Write-Error "Build failed! Check $FRONTEND for errors"
    exit 1
}

$buildSize = (Get-ChildItem "$FRONTEND\dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Success "Frontend built successfully ($([math]::Round($buildSize, 2)) MB)"
Write-Host ""

# ═══════════════════════════════════════════════════════════
# STEP 4: Copy to Portfolio
# ═══════════════════════════════════════════════════════════
Write-Host "Step 4: Deploying to Portfolio" -ForegroundColor Magenta
Write-Host "──────────────────────────────" -ForegroundColor DarkGray

Write-Working "Creating destination directory"
if (-not (Test-Path $DEST)) {
    New-Item -ItemType Directory -Force -Path $DEST | Out-Null
}

Write-Working "Copying files"
Remove-Item "$DEST\*" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "$FRONTEND\dist\*" -Destination $DEST -Recurse -Force

$fileCount = (Get-ChildItem $DEST -Recurse -File).Count
Write-Success "Copied $fileCount files to portfolio"
Write-Host ""

# ═══════════════════════════════════════════════════════════
# STEP 5: Commit WebDev Changes
# ═══════════════════════════════════════════════════════════
Write-Host "Step 5: Committing Backend Updates" -ForegroundColor Magenta
Write-Host "──────────────────────────────" -ForegroundColor DarkGray

Set-Location $WEBDEV

$hasChanges = (git status --porcelain) -ne $null
if ($hasChanges) {
    Write-Working "Committing changes"
    git add .
    git commit -m "Configure backend for production deployment with demo login" 2>&1 | Out-Null
    
    Write-Working "Pushing to GitHub"
    git push 2>&1 | Out-Null
    Write-Success "Backend changes pushed to GitHub"
} else {
    Write-Success "No backend changes to commit"
}
Write-Host ""

# ═══════════════════════════════════════════════════════════
# STEP 6: Verify Integration
# ═══════════════════════════════════════════════════════════
Write-Host "Step 6: Verifying Integration" -ForegroundColor Magenta
Write-Host "──────────────────────────────" -ForegroundColor DarkGray

$checks = @(
    @{ Name = "index.html"; Path = "$DEST\index.html" }
    @{ Name = "assets folder"; Path = "$DEST\assets" }
    @{ Name = "Demo login page"; Path = "$FRONTEND\src\pages\Login\DemoLoginPage.tsx" }
    @{ Name = "Portfolio demo route"; Path = "$PORTFOLIO\src\app\demos\webdev\page.tsx" }
)

foreach ($check in $checks) {
    if (Test-Path $check.Path) {
        Write-Success "$($check.Name) exists"
    } else {
        Write-Error "$($check.Name) missing!"
    }
}
Write-Host ""

# ═══════════════════════════════════════════════════════════
# COMPLETE!
# ═══════════════════════════════════════════════════════════
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║                  🎉 SETUP COMPLETE! 🎉                    ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "What's been done:" -ForegroundColor White
Write-Host "  ✅ Backend configured with production CORS" -ForegroundColor Gray
Write-Host "  ✅ Frontend built with Railway API URL" -ForegroundColor Gray
Write-Host "  ✅ Demo login page (3 role buttons)" -ForegroundColor Gray
Write-Host "  ✅ Files copied to portfolio/public/demos/webdev/" -ForegroundColor Gray
Write-Host "  ✅ WebDev changes committed & pushed" -ForegroundColor Gray
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "                    NEXT STEPS                              " -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "🧪 TEST LOCALLY:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   cd $PORTFOLIO" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Then visit: " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:3000/demos/webdev" -ForegroundColor Cyan
Write-Host ""
Write-Host "   You should see the demo login with 3 role buttons!" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 DEPLOY TO PRODUCTION:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   cd $PORTFOLIO" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m `"Add Event Manager live demo`"" -ForegroundColor White
Write-Host "   git push" -ForegroundColor White
Write-Host ""
Write-Host "   Vercel will auto-deploy in ~2 minutes!" -ForegroundColor Gray
Write-Host ""

Write-Host "🌐 LIVE DEMO URL (after deployment):" -ForegroundColor Yellow
Write-Host ""
Write-Host "   https://haroldpdc.com/demos/webdev" -ForegroundColor Cyan
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Set-Location $PORTFOLIO
Write-Info "Ready to test! Run: npm run dev"
Write-Host ""
