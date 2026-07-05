# 🚀 START HERE - Complete Installation Guide

Welcome to **Kabaza Management System**! This document will guide you through everything you need to run this project on your local computer.

## ⚡ Super Quick Start (2 Minutes)

If you're in a hurry, here's the absolute minimum:

```bash
# 1. Install Node.js and Python (download from their websites)

# 2. Frontend
cd kabaza-management-system
npm install
cp .env.local.example .env.local
npm run dev

# 3. Backend (new terminal)
cd ../kabaza-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Then open:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

**Done!** Your system is running.

---

## 📋 What This Document Covers

This guide explains what packages you need to download and install to run this project locally on your computer. It includes everything from system requirements to troubleshooting.

---

## 🎯 Quick Navigation

### I just want to start immediately
→ Go to **[QUICKSTART.md](./QUICKSTART.md)** (5-minute setup)

### I want step-by-step detailed instructions
→ Go to **[SETUP.md](./SETUP.md)** (comprehensive guide)

### I want a checklist to verify my setup
→ Go to **[INSTALLATION-CHECKLIST.md](./INSTALLATION-CHECKLIST.md)** (verification list)

### I want to understand the requirements
→ Go to **[REQUIREMENTS.md](./REQUIREMENTS.md)** (detailed list of everything)

### I want a visual diagram
→ Go to **[INSTALLATION-FLOW.txt](./INSTALLATION-FLOW.txt)** (ASCII diagrams)

### I want a quick reference
→ Go to **[PACKAGES-SUMMARY.txt](./PACKAGES-SUMMARY.txt)** (TL;DR version)

---

## 🔧 What You Need to Install

### Before You Start
Make sure you have these 4 things installed on your computer:

| Item | Check Command | Download Link |
|------|---------------|---------------|
| **Node.js 18+** | `node --version` | https://nodejs.org/ |
| **Python 3.10+** | `python --version` | https://www.python.org/ |
| **Git** | `git --version` | https://git-scm.com/ |
| **npm** | `npm --version` | Comes with Node.js |

That's it! Everything else installs automatically.

### Optional (Recommended)
- **Docker** - For Redis and PostgreSQL
- **VSCode** - Code editor
- **Postman** - API testing

---

## 📦 What Gets Installed

When you run the installation commands, here's what happens:

### Frontend (~200MB download, 2-5 minutes)
```
47 npm packages including:
  - Next.js (React framework)
  - React (UI library)
  - Tailwind CSS (styling)
  - shadcn/ui (components)
  - Zod (form validation)
  - SWR (data fetching)
  - Recharts (analytics)
  - And 40+ more...
```

### Backend (~100MB download, 1-3 minutes)
```
30+ Python packages including:
  - Django (web framework)
  - Django REST Framework (APIs)
  - Celery (background jobs)
  - Redis (caching)
  - JWT (authentication)
  - QRcode (QR generation)
  - ReportLab (PDF generation)
  - And 20+ more...
```

**Total:** ~600MB download, ~1.3GB after installation

---

## 📱 System Requirements

### Minimum Hardware
- **RAM:** 4GB
- **Storage:** 2GB free space
- **Internet:** Stable connection
- **CPU:** Dual-core

### Operating Systems
✅ macOS 10.15+
✅ Windows 10+
✅ Ubuntu 18.04+

---

## 🚀 Installation Steps

### Step 1: Download This Project
```bash
git clone <your-repo-url>
cd kabaza-management-system
```

### Step 2: Install Frontend Dependencies
```bash
npm install
cp .env.local.example .env.local
# Edit .env.local: Set NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 3: Install Backend Dependencies
```bash
cd ../kabaza-backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Create login account
```

### Step 4: Run Both Servers

**Terminal 1 - Frontend:**
```bash
cd kabaza-management-system
npm run dev
# Opens http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd kabaza-backend
source venv/bin/activate
python manage.py runserver
# Opens http://localhost:8000
```

**Done!** Both servers are running.

---

## ✅ Verify It Works

1. Open http://localhost:3000 in your browser
2. You should see the login page
3. Login with the superuser credentials you created
4. You should see the dashboard

If you see the dashboard, **congratulations!** Everything is working.

---

## 📚 Next Steps

After installation is successful:

1. **Read the documentation:**
   - [QUICKSTART.md](./QUICKSTART.md) - Quick reference
   - [SETUP.md](./SETUP.md) - Detailed instructions
   - [SECURITY.md](./SECURITY.md) - Security best practices

2. **Run tests:**
   - See [TESTING.md](./TESTING.md) for integration tests

3. **Deploy:**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"
**Solution:** Node.js is not installed. Download from https://nodejs.org/

### Problem: "Port 3000 already in use"
**Solution:** Run frontend on different port:
```bash
npm run dev -- -p 3001
```

### Problem: "ModuleNotFoundError: No module named 'django'"
**Solution:** Make sure virtual environment is activated:
```bash
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

### Problem: "Cannot find module 'next'"
**Solution:** Reinstall npm packages:
```bash
rm -rf node_modules package-lock.json
npm install
```

For more troubleshooting, see individual documentation files.

---

## 📞 Getting Help

1. **Quick questions?** → See [QUICKSTART.md](./QUICKSTART.md)
2. **Detailed setup?** → See [SETUP.md](./SETUP.md)
3. **Verification needed?** → See [INSTALLATION-CHECKLIST.md](./INSTALLATION-CHECKLIST.md)
4. **Specific issue?** → See [REQUIREMENTS.md](./REQUIREMENTS.md) troubleshooting
5. **Visual guide?** → See [INSTALLATION-FLOW.txt](./INSTALLATION-FLOW.txt)

---

## 🎯 Key Files Reference

| File | Purpose | Time |
|------|---------|------|
| 00-START-HERE.md | This file - overview | 5 min read |
| QUICKSTART.md | Minimal setup | 5 min setup |
| SETUP.md | Detailed setup | 15 min setup |
| REQUIREMENTS.md | What's needed | 10 min read |
| INSTALLATION-CHECKLIST.md | Verification | As you go |
| INSTALLATION-FLOW.txt | Visual diagrams | 5 min read |
| PACKAGES-SUMMARY.txt | Package list | 5 min read |
| TESTING.md | How to test | 20 min read |
| DEPLOYMENT.md | Production setup | 30 min read |
| SECURITY.md | Security guide | 20 min read |

---

## ⏱️ Estimated Timeline

| Task | Time | Notes |
|------|------|-------|
| Install Node.js & Python | 10 min | First time only |
| Clone project | 2 min | Uses git |
| npm install | 5 min | ~200MB download |
| pip install | 3 min | ~100MB download |
| Database setup | 2 min | Django migrations |
| Create superuser | 1 min | Login credentials |
| Start servers | 1 min | Both should run |
| Total | ~25 min | One-time setup |

---

## ✨ Summary

To run **Kabaza Management System** locally:

1. ✅ Install 4 things: Node.js, Python, Git, npm
2. ✅ Run: `npm install` (frontend)
3. ✅ Run: `pip install -r requirements.txt` (backend)
4. ✅ Run: `npm run dev` (terminal 1)
5. ✅ Run: `python manage.py runserver` (terminal 2)
6. ✅ Open: http://localhost:3000
7. ✅ Login with your credentials

**Time:** ~25 minutes first time
**Storage:** ~1.3GB
**Network:** ~600MB download

---

## 🎉 Ready?

Choose your path:

- **⚡ I want to go FAST** → [QUICKSTART.md](./QUICKSTART.md)
- **📖 I want DETAILED steps** → [SETUP.md](./SETUP.md)
- **✅ I want to VERIFY** → [INSTALLATION-CHECKLIST.md](./INSTALLATION-CHECKLIST.md)
- **📚 I want to UNDERSTAND** → [REQUIREMENTS.md](./REQUIREMENTS.md)

**Good luck! 🚀**
