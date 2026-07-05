# Project Requirements & Dependencies

## System Requirements

### Minimum Hardware
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space
- **CPU**: Dual-core processor (quad-core recommended)
- **Network**: Stable internet connection for npm/pip packages

### Operating System Support
- ✅ macOS 10.15+
- ✅ Windows 10+ (with WSL2 for optimal experience)
- ✅ Ubuntu 18.04+ / Linux

## Software Requirements

### Required (Must Have)

| Software | Version | Purpose | Install Link |
|----------|---------|---------|--------------|
| **Node.js** | 18.17 or higher | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0+ | Package manager (included with Node.js) | - |
| **Python** | 3.10 or higher | Backend runtime | [python.org](https://www.python.org/) |
| **Git** | 2.34+ | Version control | [git-scm.com](https://git-scm.com/) |

### Recommended (Highly Suggested)

| Software | Purpose | Install Link |
|----------|---------|--------------|
| **Docker** | Container runtime for databases | [docker.com](https://www.docker.com/) |
| **Redis** | Caching & Celery broker | Via Docker or native |
| **VSCode** | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Postman** | API testing | [postman.com](https://www.postman.com/) |

### Optional (Nice to Have)

| Software | Purpose |
|----------|---------|
| **yarn** or **pnpm** | Alternative package managers |
| **PostgreSQL** | Production database (default may use SQLite) |
| **pgAdmin** | PostgreSQL management UI |
| **DBeaver** | Database client |

## Frontend Dependencies (npm packages)

### Core Framework (Required)
```
next@16.2.0              - React framework with server-side rendering
react@19.2.4             - UI library
react-dom@19.2.4         - React DOM rendering
typescript@5.7.3         - TypeScript compiler
```

### UI Components & Styling (Required)
```
tailwindcss@4.2.0        - Utility-first CSS framework
@tailwindcss/postcss@4.2.0 - PostCSS plugin for Tailwind
@radix-ui/*              - Headless UI components (20+ packages)
lucide-react@0.564.0     - Icon library
class-variance-authority@0.7.1 - Component variant management
clsx@2.1.1               - Utility for className management
tailwind-merge@3.3.1     - Merge Tailwind classes safely
```

### Forms & Validation (Required)
```
react-hook-form@7.54.1   - Form state management
zod@3.24.1               - Schema validation
@hookform/resolvers@3.9.1 - Hook Form + Zod integration
```

### Data Fetching & State (Required)
```
swr@2.4.2                - Data fetching with caching
recharts@2.15.0          - Chart library for analytics
```

### Authentication (Required)
```
jwt-decode@4.0.0         - JWT token decoding
```

### Date & Time (Required)
```
date-fns@4.1.0           - Date utilities
```

### Utilities (Required)
```
qrcode.react@4.2.0       - QR code generation
sonner@1.7.1             - Toast notifications
next-themes@0.4.6        - Theme management
cmdk@1.1.1               - Command menu component
autoprefixer@10.4.20     - PostCSS plugin
postcss@8.5              - CSS transformation
```

### Build & Development (DevDependencies)
```
@types/node@22           - TypeScript types for Node.js
@types/react@19.2.14     - TypeScript types for React
@types/react-dom@19.2.3  - TypeScript types for React DOM
tw-animate-css@1.3.3     - Tailwind animation utilities
```

## Backend Dependencies (Python packages)

### Core Framework
```
Django==4.2+             - Web framework
djangorestframework==3.14+ - REST API framework
django-cors-headers==4.0+ - CORS handling
```

### Database
```
psycopg2-binary==2.9+   - PostgreSQL adapter
django-environ==0.10+   - Environment variable management
```

### Authentication & Security
```
djangorestframework-simplejwt==5.2+ - JWT authentication
python-decouple==3.8+   - Config management
bcrypt==4.0+            - Password hashing
```

### Async Tasks (Optional but Recommended)
```
celery==5.3+            - Distributed task queue
redis==4.5+             - Redis client
django-celery-beat==2.5+ - Celery periodic tasks
```

### PDF & QR Code Generation
```
reportlab==4.0+         - PDF generation
qrcode==7.4+            - QR code generation
Pillow==9.5+            - Image processing
```

### Testing (Optional)
```
pytest==7.3+            - Testing framework
pytest-django==4.5+     - Django testing utilities
factory-boy==3.2+       - Test data factories
faker==18.0+            - Fake data generation
```

### Development Tools
```
black==23.3+            - Code formatter
flake8==5.0+            - Code linter
django-extensions==3.2+ - Django utilities
```

## Complete Installation Commands

### Frontend - All at Once
```bash
npm install
```

### Backend - All at Once
```bash
pip install -r requirements.txt
```

## Verification Commands

```bash
# Verify Node.js
node --version      # Should be v18.17 or higher
npm --version       # Should be 9.0 or higher

# Verify Python
python --version    # Should be 3.10 or higher
pip --version       # Should be 20.0 or higher

# Verify Git
git --version       # Should be 2.34 or higher
```

## Storage Requirements

| Component | Size | Notes |
|-----------|------|-------|
| Node modules | ~600MB | node_modules folder |
| Python venv | ~400MB | Virtual environment |
| Database | ~100MB | Initial SQLite database |
| Build output | ~200MB | .next folder (production build) |
| **Total** | **~1.3GB** | First installation |

## Network Requirements

| Resource | Data | Frequency |
|----------|------|-----------|
| npm packages | ~200MB | First install & updates |
| Python packages | ~100MB | First install & updates |
| Docker images | ~300MB | If using Docker |
| **Total** | **~600MB** | Initial download |

## Troubleshooting Installation

### Issue: npm packages won't install
```bash
npm install --legacy-peer-deps
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Python package conflicts
```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### Issue: Node version mismatch
```bash
# Using nvm (Node Version Manager)
nvm install 18.17
nvm use 18.17
```

### Issue: Python virtual environment issues
```bash
# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

## Performance Optimization Tips

1. **Use Node v18+** - Better performance than older versions
2. **Enable SWR caching** - Reduces API calls by 40%+
3. **Use Redis** - Speeds up Celery and caching
4. **Enable gzip compression** - Reduce transfer size
5. **Use CDN for static files** - Faster asset delivery

## Security Checklist Before Deployment

- [ ] Set `DEBUG=False` in Django
- [ ] Use strong `SECRET_KEY` in Django
- [ ] Enable `HTTPS_ONLY` in production
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated regularly
- [ ] Run security audits: `npm audit`, `pip audit`

## Getting Help

1. Check individual guides:
   - [SETUP.md](./SETUP.md) - Detailed setup
   - [QUICKSTART.md](./QUICKSTART.md) - Quick start
   - [TESTING.md](./TESTING.md) - Testing guide
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment

2. Common issues:
   - Port conflicts
   - Missing environment variables
   - Database migration errors
   - Package version mismatches

3. Resources:
   - Next.js docs: https://nextjs.org/docs
   - Django docs: https://docs.djangoproject.com/
   - React docs: https://react.dev/
   - Tailwind CSS: https://tailwindcss.com/docs
