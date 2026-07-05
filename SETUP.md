# Local Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

### Required Software
- **Node.js** (v18.17 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn/pnpm** (optional alternatives)
- **Git** - [Download](https://git-scm.com/)
- **Python 3.10+** - For Django backend (if running locally)
- **Django REST Framework** - Backend dependency

## Frontend Setup (Next.js Application)

### Step 1: Clone the Repository

```bash
# Clone your project
git clone <your-repo-url>
cd kabaza-management-system

# Or download the ZIP and extract it
```

### Step 2: Install Frontend Dependencies

```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your configuration:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_CELERY_POLLING=true
NEXT_PUBLIC_CELERY_POLL_INTERVAL=5000

# Caching & Performance
NEXT_PUBLIC_SWR_DEDUPE_INTERVAL=60000
NEXT_PUBLIC_CACHE_TTL=300000

# Timeout Settings
NEXT_PUBLIC_API_TIMEOUT=30000

# Rate Limiting
NEXT_PUBLIC_RATE_LIMIT_REQUESTS=100
NEXT_PUBLIC_RATE_LIMIT_WINDOW=60000

# Retry Settings
NEXT_PUBLIC_MAX_RETRIES=3
NEXT_PUBLIC_RETRY_DELAY=1000

# Pagination
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=20
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Step 5: Build for Production

```bash
npm run build
npm start
```

## Backend Setup (Django)

### Step 1: Clone Django Repository

```bash
git clone <your-django-repo-url>
cd kabaza-backend
```

### Step 2: Create Virtual Environment

```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Django Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Database Setup

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Step 5: Configure Django Settings

Ensure your Django `settings.py` includes:

```python
# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

# Celery Configuration (if using Celery)
CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'

# JWT Configuration
JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': timedelta(hours=24),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
}

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'login': '5/minute',
    }
}
```

### Step 6: Start Django Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```

The API will be available at: **http://localhost:8000/api**

### Step 7: Start Celery Worker (if using async tasks)

In a new terminal:

```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start Celery worker
celery -A kabaza_project worker -l info

# In another terminal, start Celery beat (for scheduled tasks)
celery -A kabaza_project beat -l info
```

## Optional: Redis Setup (for Caching & Celery)

### Using Docker (Recommended)

```bash
# Install Docker from: https://www.docker.com/products/docker-desktop

# Run Redis container
docker run -d -p 6379:6379 redis:latest

# Verify Redis is running
redis-cli ping  # Should return: PONG
```

### Without Docker (macOS)

```bash
# Install Redis using Homebrew
brew install redis

# Start Redis
redis-server
```

### Without Docker (Windows)

- Download WSL2 (Windows Subsystem for Linux)
- Follow Ubuntu installation steps above

## NPM Dependencies Overview

### Core Framework
- **next**: 16.2.0 - React framework
- **react**: 19.2.4 - UI library
- **react-dom**: 19.2.4 - DOM rendering

### UI Components & Styling
- **@radix-ui/**: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Forms & Validation
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **@hookform/resolvers**: Hook Form + Zod integration

### Data Fetching & Caching
- **swr**: Data fetching with caching
- **recharts**: Chart library for analytics

### Authentication
- **jwt-decode**: JWT token decoding

### Date & Time
- **date-fns**: Date utilities

### Other Utilities
- **qrcode.react**: QR code generation
- **sonner**: Toast notifications
- **clsx**: Utility for className management
- **next-themes**: Theme management
- **cmdk**: Command menu component

## Complete Installation Command

To install everything at once:

```bash
# Frontend
npm install

# Backend
cd ../kabaza-backend
pip install -r requirements.txt
python manage.py migrate

# Verify setup
npm run build  # Frontend build test
python manage.py runserver  # Backend test
```

## Verification Checklist

- [ ] Node.js v18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Python 3.10+ installed: `python --version`
- [ ] Virtual environment activated (backend)
- [ ] `.env.local` file created with API_URL
- [ ] Django migrations ran: `python manage.py migrate`
- [ ] Redis running (if using Celery)
- [ ] Frontend dev server starts: `npm run dev`
- [ ] Backend dev server starts: `python manage.py runserver`
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000/api

## Common Issues & Solutions

### Issue: "Cannot find module 'swr'"
**Solution:**
```bash
npm install swr --legacy-peer-deps
```

### Issue: "Django CORS error"
**Solution:** Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL in Django settings.py

### Issue: "JWT token expired"
**Solution:** Check JWT_EXPIRATION_DELTA in Django settings. Default is 24 hours.

### Issue: "Celery tasks not working"
**Solution:** Ensure Redis is running and CELERY_BROKER_URL is correctly configured.

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```

### Issue: "Port 8000 already in use"
**Solution:**
```bash
# Use a different port
python manage.py runserver 0.0.0.0:8001
```

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Support

For issues or questions:
1. Check [TESTING.md](./TESTING.md) for integration testing
2. Review [SECURITY.md](./SECURITY.md) for security best practices
3. Consult [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
