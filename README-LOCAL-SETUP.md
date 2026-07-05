# Local Development Setup - Complete Guide

## 📋 What You Need

### Essential Software
1. **Node.js 18+** - Run `node --version` to check
2. **Python 3.10+** - Run `python --version` to check  
3. **Git** - Run `git --version` to check
4. **npm** - Comes with Node.js

### That's it! Everything else is optional.

## 🚀 Quick Start (2 Commands)

### Terminal 1 - Frontend
```bash
cd kabaza-management-system
npm install
cp .env.local.example .env.local
npm run dev
# Frontend runs on http://localhost:3000
```

### Terminal 2 - Backend
```bash
cd kabaza-backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
# Backend runs on http://localhost:8000
```

**Done!** Your system is running locally.

## 📦 NPM Packages (Frontend) - What Gets Installed

When you run `npm install`, these are the main packages:

```
✓ next (16.2.0)            - React framework
✓ react (19.2.4)           - UI library
✓ tailwindcss (4.2.0)      - Styling
✓ @radix-ui/* (20 packages)- UI components
✓ react-hook-form (7.54.1) - Form handling
✓ zod (3.24.1)             - Data validation
✓ swr (2.4.2)              - Data fetching
✓ recharts (2.15.0)        - Charts
✓ jwt-decode (4.0.0)       - Auth token handling
✓ lucide-react (0.564.0)   - Icons
+ 30 more utility packages
───────────────────────────
= ~47 total npm packages
  ~600MB total size
```

**Total to download:** ~200MB
**Time:** 2-5 minutes (depends on internet)

## 🐍 Python Packages (Backend) - What Gets Installed

When you run `pip install -r requirements.txt`, these core packages are installed:

```
✓ Django (4.2+)                    - Web framework
✓ djangorestframework (3.14+)       - REST API
✓ django-cors-headers (4.0+)       - CORS handling
✓ djangorestframework-simplejwt    - JWT auth
✓ psycopg2-binary (2.9+)          - PostgreSQL driver (optional)
✓ celery (5.3+)                    - Async tasks
✓ redis (4.5+)                     - Caching
✓ reportlab (4.0+)                 - PDF generation
✓ qrcode (7.4+)                    - QR codes
✓ Pillow (9.5+)                    - Image processing
+ 15 more packages
───────────────────────────────
= ~30+ total packages
  ~100MB total size
```

**Total to download:** ~100MB
**Time:** 1-3 minutes (depends on internet)

## 🔧 Step-by-Step Setup

### Option A: Simple Setup (SQLite Database)

```bash
# 1. Frontend
cd kabaza-management-system
npm install
cp .env.local.example .env.local
# Edit .env.local: Set NEXT_PUBLIC_API_URL=http://localhost:8000/api

# 2. Backend (in new terminal)
cd kabaza-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# 3. Run Frontend (in first terminal)
npm run dev
```

### Option B: Advanced Setup (PostgreSQL + Redis)

**Requires:** Docker or native PostgreSQL/Redis

```bash
# Start Redis (in new terminal)
docker run -p 6379:6379 redis:latest

# Continue with same steps as Option A
# But configure Django to use PostgreSQL instead of SQLite
```

## 📂 Project Structure

```
kabaza-management-system/          Frontend (Next.js)
├── app/                           Pages
│   ├── login/                     Login page
│   ├── dashboard/                 Dashboard
│   ├── finance/                   Finance module
│   ├── transport/                 Transport module
│   └── system/                    System module
├── components/                    React components
│   ├── finance/
│   ├── transport/
│   ├── system/
│   ├── analytics/
│   └── ui/                        shadcn/ui components
├── lib/                           Utilities
│   ├── api/                       API services
│   ├── hooks/                     Custom React hooks
│   ├── validation/                Data validation
│   └── utils/                     Helper functions
└── package.json                   NPM dependencies

kabaza-backend/                    Backend (Django)
├── kabaza_project/                Django project
│   ├── settings.py                Configuration
│   ├── urls.py                    API routes
│   └── wsgi.py
├── users_domain/                  Users module
├── transport_domain/              Transport module
├── finance_domain/                Finance module
├── system_control/                System module
├── requirements.txt               Python dependencies
└── manage.py                      Django CLI
```

## 🌐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ENABLE_CELERY_POLLING=true
NEXT_PUBLIC_SWR_DEDUPE_INTERVAL=60000
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Backend (.env in Django project)
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
CELERY_BROKER_URL=redis://localhost:6379
CELERY_RESULT_BACKEND=redis://localhost:6379
```

## 🧪 Verify Installation

Run these commands to verify everything is installed:

```bash
# Frontend check
node --version         # Should be v18.17+
npm --version          # Should be 9.0+
npm list next          # Should show next@16.2.0

# Backend check
python --version       # Should be 3.10+
pip show Django        # Should show Django version
pip show djangorestframework

# Test running
npm run dev            # Frontend should start
python manage.py runserver  # Backend should start
```

## 🎯 Test Your Setup

### Test Frontend
1. Open http://localhost:3000
2. You should see the login page
3. Try entering test credentials

### Test Backend
1. Open http://localhost:8000/api
2. You should see the API root
3. Visit http://localhost:8000/admin for Django admin

### Test Database
```bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.all()  # Should list users
```

## ⚠️ Common Issues & Fixes

### "npm: command not found"
→ Install Node.js from https://nodejs.org/

### "python: command not found"  
→ Install Python from https://www.python.org/
→ Or use `python3` instead of `python`

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### "Port 8000 already in use"
```bash
python manage.py runserver 0.0.0.0:8001
```

### "ModuleNotFoundError: No module named 'django'"
```bash
source venv/bin/activate  # Make sure venv is activated
pip install -r requirements.txt  # Reinstall
```

### "Cannot find module 'next'"
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

For more details, see:
- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup
- **Detailed Setup**: [SETUP.md](./SETUP.md) - Complete guide with all options
- **Requirements**: [REQUIREMENTS.md](./REQUIREMENTS.md) - System & package requirements
- **Testing**: [TESTING.md](./TESTING.md) - How to test the system
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- **Security**: [SECURITY.md](./SECURITY.md) - Security best practices

## 🚀 Next Steps

1. ✅ Get the code (git clone or download)
2. ✅ Install Node.js, Python, Git
3. ✅ Run `npm install` (Frontend)
4. ✅ Run `pip install -r requirements.txt` (Backend)
5. ✅ Run `npm run dev` (Frontend)
6. ✅ Run `python manage.py runserver` (Backend)
7. ✅ Test at http://localhost:3000
8. ✅ Read [TESTING.md](./TESTING.md)
9. ✅ Deploy with [DEPLOYMENT.md](./DEPLOYMENT.md)

## 💬 Need Help?

1. Check if service is running: `localhost:3000` (frontend), `localhost:8000` (backend)
2. Check logs in terminal for error messages
3. Review [SETUP.md](./SETUP.md) for troubleshooting section
4. Ensure `.env.local` has correct `NEXT_PUBLIC_API_URL`
5. Ensure Django migrations ran: `python manage.py migrate`

## ✨ Summary

**What gets installed:**
- Frontend: 47 npm packages (~600MB)
- Backend: 30+ python packages (~100MB)
- Databases: Optional (SQLite by default, PostgreSQL for production)
- Cache: Optional (Redis via Docker)

**Estimated time:** 10-15 minutes for complete setup
**Total storage:** ~1.3GB after installation
**Internet required:** ~600MB download

**That's all!** Your Kabaza Management System is ready to run locally.
