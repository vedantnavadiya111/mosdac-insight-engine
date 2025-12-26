# 🚀 ISRO SagarMegh AI - Setup Guide

## ✅ Completed Steps

### 1. Dependencies Installation ✓
All dependencies have been successfully installed:
- **Client** (Next.js): 400 packages installed via pnpm
- **Extension** (Chrome): 242 packages installed via pnpm
- **Server** (FastAPI): 78 Python packages installed via pip

### 2. Environment Variables ✓
Environment files have been created with templates:

#### Server (`.env`)
Location: `c:\isro-mosdac-ai\isro-sagarmegh-ai\server\.env`

**Required configurations:**
- `DATABASE_URL`: PostgreSQL database connection string
- `QDRANT_URL`: Qdrant vector database URL (default: http://localhost:6333)
- `GEMINI_API_KEY`: **⚠️ REQUIRED** - Get from https://makersuite.google.com/app/apikey
- `JWT_SECRET_KEY`: **⚠️ REQUIRED** - Generate a random string (e.g., `openssl rand -hex 32`)
- `ENCRYPTION_KEY`: **⚠️ REQUIRED** - Generate 32-byte key for encrypting MOSDAC credentials

#### Client (`.env.local`)
Location: `c:\isro-mosdac-ai\isro-sagarmegh-ai\client\.env.local`

**Required configurations:**
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)
- `NEXTAUTH_SECRET`: **⚠️ REQUIRED** - Generate random string for NextAuth
- `NEXTAUTH_URL`: Frontend URL (default: http://localhost:3000)

#### Extension (`.env`)
Location: `c:\isro-mosdac-ai\isro-sagarmegh-ai\extension\.env`

**Configuration:**
- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)

---

## 📋 Next Steps - Before Running

### 1. Generate Secret Keys

Run these commands in PowerShell to generate secure keys:

```powershell
# Generate JWT Secret (32 bytes hex)
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$jwt_secret = [System.BitConverter]::ToString($bytes) -replace '-'
Write-Host "JWT_SECRET_KEY=$jwt_secret"

# Generate Encryption Key (32 bytes hex)
$bytes2 = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes2)
$enc_key = [System.BitConverter]::ToString($bytes2) -replace '-'
Write-Host "ENCRYPTION_KEY=$enc_key"

# Generate NextAuth Secret
$bytes3 = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes3)
$nextauth_secret = [System.BitConverter]::ToString($bytes3) -replace '-'
Write-Host "NEXTAUTH_SECRET=$nextauth_secret"
```

### 2. Get Google Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste into `server/.env` → `GEMINI_API_KEY`

### 3. Setup PostgreSQL Database

**Option A: Local Installation**
```powershell
# Install PostgreSQL from https://www.postgresql.org/download/windows/
# After installation, create database:
createdb mosdac_ai
```

**Option B: Docker**
```powershell
docker run --name mosdac-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mosdac_ai -p 5432:5432 -d postgres:15
```

Update `DATABASE_URL` in `server/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mosdac_ai
```

### 4. Setup Qdrant Vector Database

**Using Docker (Recommended):**
```powershell
docker run -p 6333:6333 -p 6334:6334 -v C:\qdrant_storage:/qdrant/storage:z qdrant/qdrant
```

### 5. Initialize Database Tables

Once PostgreSQL is running:
```powershell
cd c:\isro-mosdac-ai\isro-sagarmegh-ai\server
python -c "from app.db.base import Base; from app.db.session import engine; Base.metadata.create_all(bind=engine)"
```

---

## 🎯 Running the Application

### Start All Services

**Terminal 1 - Backend Server:**
```powershell
cd c:\isro-mosdac-ai\isro-sagarmegh-ai\server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend will be available at: http://localhost:8000

**Terminal 2 - Frontend Client:**
```powershell
cd c:\isro-mosdac-ai\isro-sagarmegh-ai\client
pnpm dev
```
Frontend will be available at: http://localhost:3000

**Terminal 3 - Build Extension (One-time):**
```powershell
cd c:\isro-mosdac-ai\isro-sagarmegh-ai\extension
pnpm build
```

### Load Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select: `c:\isro-mosdac-ai\isro-sagarmegh-ai\extension\dist`

---

## 🧪 Testing the Setup

### Backend Health Check
```powershell
curl http://localhost:8000/
```

### Frontend Access
Open browser: http://localhost:3000

### API Documentation
Open browser: http://localhost:8000/docs

---

## 📊 Optional: Data Scraping

To populate the vector database with MOSDAC documentation:

```powershell
cd c:\isro-mosdac-ai\isro-sagarmegh-ai\server
python scripts/run_scraper.py
```

---

## 🔍 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready`
- Check connection string in `server/.env`
- Verify database exists: `psql -l`

### Qdrant Connection Issues
- Ensure Qdrant is running: `curl http://localhost:6333`
- Check Qdrant logs in Docker

### Port Already in Use
- Frontend (3000): Change port in `pnpm dev -- --port 3001`
- Backend (8000): Change port in uvicorn command `--port 8001`

### Import Errors
- Reinstall dependencies
- Check Python version: `python --version` (should be 3.9+)

---

## 📁 Project URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Qdrant Dashboard**: http://localhost:6333/dashboard

---

## 🎉 You're All Set!

Once all services are running, you can:
1. Register a new user account
2. Login to the dashboard
3. Chat with the AI assistant
4. Download MOSDAC datasets
5. Use the Chrome extension on any website

For more information, see the main README.md file.
