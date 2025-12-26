# ISRO SagarMegh AI - Quick Start Script
# This script helps you start all services easily

Write-Host "🚀 ISRO SagarMegh AI - Quick Start" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-CommandExists {
    param($command)
    $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
}

# Check PostgreSQL
Write-Host "✓ Checking PostgreSQL..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
if ($pgService -and $pgService.Status -eq "Running") {
    Write-Host "  ✓ PostgreSQL is running" -ForegroundColor Green
} else {
    Write-Host "  ✗ PostgreSQL is not running!" -ForegroundColor Red
    Write-Host "  Please start PostgreSQL service" -ForegroundColor Red
    exit 1
}

# Check if mosdac_ai database exists
Write-Host "✓ Checking database..." -ForegroundColor Yellow
$dbCheck = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname='mosdac_ai';" 2>$null
if ($dbCheck -match "1") {
    Write-Host "  ✓ Database 'mosdac_ai' exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ Database 'mosdac_ai' not found!" -ForegroundColor Red
    exit 1
}

# Check environment files
Write-Host "✓ Checking environment files..." -ForegroundColor Yellow
if (Test-Path "server\.env") {
    Write-Host "  ✓ server\.env exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ server\.env missing!" -ForegroundColor Red
}

if (Test-Path "client\.env.local") {
    Write-Host "  ✓ client\.env.local exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ client\.env.local missing!" -ForegroundColor Red
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "1. Initialize Database Tables" -ForegroundColor White
Write-Host "2. Start Backend Server (FastAPI)" -ForegroundColor White
Write-Host "3. Start Frontend Client (Next.js)" -ForegroundColor White
Write-Host "4. Build Chrome Extension" -ForegroundColor White
Write-Host "5. Start All Services (Backend + Frontend)" -ForegroundColor White
Write-Host "6. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Initializing database tables..." -ForegroundColor Yellow
        cd server
        python init_db.py
        cd ..
    }
    "2" {
        Write-Host ""
        Write-Host "Starting Backend Server..." -ForegroundColor Yellow
        Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Green
        Write-Host "API Docs at: http://localhost:8000/docs" -ForegroundColor Green
        Write-Host ""
        cd server
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    }
    "3" {
        Write-Host ""
        Write-Host "Starting Frontend Client..." -ForegroundColor Yellow
        Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Green
        Write-Host ""
        cd client
        pnpm dev
    }
    "4" {
        Write-Host ""
        Write-Host "Building Chrome Extension..." -ForegroundColor Yellow
        cd extension
        pnpm build
        Write-Host ""
        Write-Host "✓ Extension built successfully!" -ForegroundColor Green
        Write-Host "Load it in Chrome:" -ForegroundColor Cyan
        Write-Host "  1. Open chrome://extensions/" -ForegroundColor White
        Write-Host "  2. Enable 'Developer mode'" -ForegroundColor White
        Write-Host "  3. Click 'Load unpacked'" -ForegroundColor White
        Write-Host "  4. Select: $(Get-Location)\dist" -ForegroundColor White
    }
    "5" {
        Write-Host ""
        Write-Host "⚠️  This will open multiple terminal windows" -ForegroundColor Yellow
        Write-Host ""
        
        # Start Backend in new window
        Write-Host "Starting Backend Server..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; Write-Host 'Backend Server - http://localhost:8000' -ForegroundColor Green; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
        
        Start-Sleep -Seconds 3
        
        # Start Frontend in new window
        Write-Host "Starting Frontend Client..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; Write-Host 'Frontend Client - http://localhost:3000' -ForegroundColor Green; pnpm dev"
        
        Write-Host ""
        Write-Host "✓ Services started in separate windows!" -ForegroundColor Green
        Write-Host "  Backend: http://localhost:8000" -ForegroundColor Cyan
        Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
    }
    "6" {
        Write-Host "Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "Invalid choice!" -ForegroundColor Red
    }
}
