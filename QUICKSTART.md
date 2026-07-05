# Quick Start Guide - 5 Minutes

## TL;DR - Fastest Way to Run the Project

### Prerequisites Installed?
- Node.js 18+ ✓
- Python 3.10+ ✓
- Git ✓

### 1. Frontend (Next.js)

```bash
# Navigate to project folder
cd kabaza-management-system

# Install dependencies (first time only)
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local - Set this ONE variable:
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev

# Open browser: http://localhost:3000
```

### 2. Backend (Django)

In a **new terminal**:

```bash
# Navigate to Django folder
cd kabaza-backend

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies (first time only)
pip install -r requirements.txt

# Setup database
python manage.py migrate
python manage.py createsuperuser  # Create admin user

# Start server
python manage.py runserver 0.0.0.0:8000

# Open browser: http://localhost:8000/admin
```

### 3. Celery (Optional - for async tasks)

In a **third terminal**:

```bash
cd kabaza-backend
source venv/bin/activate  # macOS/Linux

# Start Celery worker
celery -A kabaza_project worker -l info
```

## Common Commands

### Frontend Commands
```bash
npm run dev       # Development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Check code quality
```

### Backend Commands
```bash
python manage.py migrate           # Apply database migrations
python manage.py createsuperuser   # Create admin user
python manage.py runserver         # Start dev server
python manage.py collectstatic     # Collect static files
```

## Default Login Credentials

After running `python manage.py createsuperuser`, you'll create your own credentials.

Example test accounts (create via Django admin):
- Username: `admin_user` Password: `SecurePass123!`
- Username: `finance_officer` Password: `SecurePass123!`
- Username: `traffic_officer` Password: `SecurePass123!`

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/api/docs (if enabled)

## Stopping Servers

```bash
# Terminal 1 (Frontend): Ctrl + C
# Terminal 2 (Backend): Ctrl + C
# Terminal 3 (Celery): Ctrl + C
```

## Next Steps

1. ✓ [Test the system](./TESTING.md)
2. ✓ [Deploy to production](./DEPLOYMENT.md)
3. ✓ [Review security](./SECURITY.md)

## Troubleshooting

### "Port already in use"
```bash
# Frontend on different port
npm run dev -- -p 3001

# Backend on different port
python manage.py runserver 0.0.0.0:8001
```

### "Cannot find module"
```bash
npm install  # Frontend
pip install -r requirements.txt  # Backend
```

### "Database errors"
```bash
python manage.py migrate
python manage.py migrate --run-syncdb  # Force sync
```

## Full Setup Instructions

For detailed setup: see [SETUP.md](./SETUP.md)
