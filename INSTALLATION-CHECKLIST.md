# Installation Checklist

Use this checklist to ensure everything is installed correctly before running the project locally.

## Pre-Installation Requirements

### System Prerequisites
- [ ] Operating System: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- [ ] RAM: At least 4GB available
- [ ] Storage: At least 2GB free space
- [ ] Internet: Stable connection (for downloading packages)

## Step 1: Install Required Software

### Node.js Installation
- [ ] Download Node.js 18.17 or higher from https://nodejs.org/
- [ ] Run the installer
- [ ] **Verify**: Open terminal and run `node --version` → Should show v18.17+
- [ ] **Verify**: Run `npm --version` → Should show 9.0+

### Python Installation
- [ ] Download Python 3.10+ from https://www.python.org/
- [ ] Run the installer
- [ ] **Verify**: Open terminal and run `python --version` → Should show 3.10+
  - *Note: On macOS/Linux, you may need to use `python3`*
- [ ] **Verify**: Run `pip --version` → Should show 20.0+

### Git Installation
- [ ] Download Git from https://git-scm.com/
- [ ] Run the installer
- [ ] **Verify**: Open terminal and run `git --version` → Should show 2.34+

## Step 2: Prepare Project Files

### Clone Repository
- [ ] Navigate to desired folder: `cd ~/projects` (or your preferred location)
- [ ] Clone or download the project:
  ```bash
  git clone <your-repo-url>
  # OR download ZIP and extract
  ```
- [ ] **Verify**: Folder contains `package.json` and `app/` directory

## Step 3: Frontend Setup (Next.js)

### Install Dependencies
- [ ] Navigate to project: `cd kabaza-management-system`
- [ ] Run: `npm install`
  - **Takes:** 2-5 minutes
  - **Downloads:** ~200MB
  - **Result:** `node_modules/` folder created (~600MB)
- [ ] **Verify**: `node_modules/` folder exists with 1000+ files

### Environment Configuration
- [ ] Copy example file: `cp .env.local.example .env.local`
- [ ] Edit `.env.local`:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000/api
  ```
- [ ] **Verify**: File `.env.local` exists with API_URL set

### Test Frontend Build
- [ ] Run: `npm run build`
- [ ] **Verify**: `.next/` folder is created
- [ ] **Note**: First build takes 1-2 minutes

## Step 4: Backend Setup (Django)

### Create Project Folder
- [ ] Navigate to parent directory: `cd ..`
- [ ] Create backend folder or navigate to existing Django project
- [ ] **Verify**: Folder contains `manage.py` file

### Create Virtual Environment
- [ ] Run: `python3 -m venv venv` (macOS/Linux)
  - OR: `python -m venv venv` (Windows)
- [ ] **Verify**: `venv/` folder created

### Activate Virtual Environment
- [ ] **macOS/Linux**: Run `. venv/bin/activate`
  - Verify: Terminal shows `(venv)` prefix
- [ ] **Windows**: Run `venv\Scripts\activate`
  - Verify: Terminal shows `(venv)` prefix

### Install Python Dependencies
- [ ] Run: `pip install -r requirements.txt`
  - **Takes:** 1-3 minutes
  - **Downloads:** ~100MB
- [ ] **Verify**: No error messages in terminal

### Database Setup
- [ ] Run: `python manage.py migrate`
  - **Verify**: Message shows "Operations to perform" and "OK"
- [ ] Run: `python manage.py createsuperuser`
  - Enter username (e.g., `admin`)
  - Enter email (e.g., `admin@example.com`)
  - Enter password (e.g., `AdminPass123!`)
  - Enter password again
  - **Verify**: Message shows "Superuser created successfully"

### Verify Backend Installation
- [ ] Settings check: Django is running
  - Run: `python manage.py check`
  - **Verify**: "System check identified no issues"

## Step 5: Optional - Redis Setup (for Caching)

### Option A: Using Docker (Recommended)
- [ ] Install Docker from https://www.docker.com/
- [ ] Run: `docker run -d -p 6379:6379 redis:latest`
- [ ] **Verify**: `docker ps` shows Redis container running
- [ ] **Verify**: `redis-cli ping` returns `PONG`

### Option B: Manual Installation
- [ ] **macOS**: Run `brew install redis` then `redis-server`
- [ ] **Windows**: Use WSL2 and follow Ubuntu steps
- [ ] **Linux**: Run `sudo apt install redis-server` then `redis-server`
- [ ] **Verify**: `redis-cli ping` returns `PONG`

### Option C: Skip for Now
- [ ] Celery will still work with Django's default broker
- [ ] Add Redis later for better performance

## Step 6: Run the System

### Terminal 1 - Frontend
- [ ] Navigate to frontend: `cd kabaza-management-system`
- [ ] Run: `npm run dev`
- [ ] **Verify**: Message shows "Ready in X.XXs" and "Local: http://localhost:3000"
- [ ] **Verify**: Can open http://localhost:3000 in browser

### Terminal 2 - Backend
- [ ] Navigate to backend: `cd kabaza-backend`
- [ ] Activate venv if not already: `source venv/bin/activate`
- [ ] Run: `python manage.py runserver`
- [ ] **Verify**: Message shows "Starting development server at http://127.0.0.1:8000/"
- [ ] **Verify**: Can open http://localhost:8000/api in browser

### Terminal 3 - Celery (Optional)
- [ ] Navigate to backend: `cd kabaza-backend`
- [ ] Activate venv: `source venv/bin/activate`
- [ ] Run: `celery -A kabaza_project worker -l info`
- [ ] **Verify**: Worker starts and shows "ready to accept tasks"

## Step 7: Verify System is Running

### Test Frontend
- [ ] Open http://localhost:3000 in browser
- [ ] **Verify**: Login page displays
- [ ] **Verify**: No console errors (Open DevTools: F12)
- [ ] Try logging in with your superuser credentials

### Test Backend
- [ ] Open http://localhost:8000/api in browser
- [ ] **Verify**: JSON API root displays
- [ ] Open http://localhost:8000/admin in browser
- [ ] **Verify**: Django admin login page displays
- [ ] Login with superuser credentials from Step 4

### Test Database
- [ ] In Django admin, click "Users"
- [ ] **Verify**: Your superuser is listed
- [ ] In Django shell:
  ```bash
  python manage.py shell
  >>> from django.contrib.auth.models import User
  >>> User.objects.count()  # Should be >= 1
  >>> exit()
  ```

## Step 8: First-Time Customization

### Create Additional Test Users
- [ ] Go to http://localhost:8000/admin
- [ ] Click "Add User" button
- [ ] Create test user: `finance_officer` with password
- [ ] Create test user: `transport_officer` with password
- [ ] Create test user: `traffic_officer` with password

### Configure API Connection
- [ ] In frontend, verify `.env.local` has correct API_URL
- [ ] Test API call: Open browser console (F12)
- [ ] Try login - should see API call in Network tab

## Troubleshooting Checklist

### Frontend Issues
- [ ] `npm: command not found` → Reinstall Node.js
- [ ] `Port 3000 in use` → Run `npm run dev -- -p 3001`
- [ ] `Cannot find module` → Run `rm -rf node_modules && npm install`
- [ ] Blank page at localhost:3000 → Check browser console for errors
- [ ] API errors → Verify `.env.local` has correct `NEXT_PUBLIC_API_URL`

### Backend Issues
- [ ] `python: command not found` → Use `python3` or reinstall Python
- [ ] `ModuleNotFoundError` → Activate venv and reinstall: `pip install -r requirements.txt`
- [ ] `Port 8000 in use` → Run on different port: `python manage.py runserver 0.0.0.0:8001`
- [ ] Database errors → Run `python manage.py migrate --run-syncdb`
- [ ] `(venv)` not showing → Activate with `source venv/bin/activate`

### Permission Issues
- [ ] `Permission denied` on macOS/Linux → Run `chmod +x venv/bin/activate`
- [ ] `sqlite3` module not found → This is rarely an issue on Python 3.10+

## Post-Installation Steps

### Read Documentation
- [ ] Read [QUICKSTART.md](./QUICKSTART.md) - Quick reference
- [ ] Read [SETUP.md](./SETUP.md) - Detailed instructions
- [ ] Read [REQUIREMENTS.md](./REQUIREMENTS.md) - Package information
- [ ] Read [TESTING.md](./TESTING.md) - How to test
- [ ] Read [DEPLOYMENT.md](./DEPLOYMENT.md) - Production setup
- [ ] Read [SECURITY.md](./SECURITY.md) - Security best practices

### Make First Changes
- [ ] Change theme: Edit `components/` files
- [ ] Add new user role: Edit Django models
- [ ] Customize colors: Edit `tailwind.config.js`
- [ ] Add new API endpoint: Create in Django views

### Setup Development Environment
- [ ] Install VSCode from https://code.visualstudio.com/
- [ ] Install VSCode extensions:
  - [ ] ES7+ React/Redux/React-Native snippets
  - [ ] Python
  - [ ] Pylance
  - [ ] Tailwind CSS IntelliSense
  - [ ] Thunder Client (for API testing)
- [ ] Install Git GUI (optional):
  - [ ] GitHub Desktop or GitKraken

## Final Verification

### All Systems Running?
- [ ] Frontend: http://localhost:3000 ✅
- [ ] Backend API: http://localhost:8000/api ✅
- [ ] Django Admin: http://localhost:8000/admin ✅
- [ ] Can login to frontend ✅
- [ ] Can access Django admin ✅
- [ ] Database has data ✅

### Ready for Development?
- [ ] Project files downloaded ✅
- [ ] All software installed ✅
- [ ] Dependencies installed ✅
- [ ] Virtual environment activated ✅
- [ ] Environment variables configured ✅
- [ ] Database migrated ✅
- [ ] All services running ✅
- [ ] System tested ✅

### Ready for Backend Connection?
- [ ] Frontend and backend running locally ✅
- [ ] Can login successfully ✅
- [ ] API endpoints responding ✅
- [ ] Database queries working ✅
- [ ] Celery workers running (optional) ✅
- [ ] Redis running (optional) ✅

## 🎉 Success!

If all checkboxes are marked, your installation is complete and the system is ready for:
- Local development
- Integration testing
- Backend connection
- Production deployment

**Next Steps:**
1. Review [TESTING.md](./TESTING.md) to run integration tests
2. Review [SECURITY.md](./SECURITY.md) for security hardening
3. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
4. Start developing!

---

**Need Help?** Check the troubleshooting section above or refer to individual documentation files.
