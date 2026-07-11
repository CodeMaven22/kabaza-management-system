# Download and Setup Guide

## Option 1: Download from v0 (Recommended)

### Step 1: Download the ZIP File
1. Click the **Download ZIP** button in the v0 UI (top right corner)
2. Extract the ZIP file to your desired location
3. Open a terminal in the extracted folder

### Step 2: Verify All Files Are Present

After extracting, ensure you have these key directories:
```
kabaza-management-system/
├── app/
├── components/
├── lib/
├── public/
├── styles/
├── package.json
├── package-lock.json
├── tsconfig.json
├── tailwind.config.ts
├── README.md
├── .env.example
└── .gitignore
```

If any directories are missing, they may not have been included in the download. In that case, use **Option 2** (Git clone).

### Step 3: Install Dependencies

```bash
npm install
```

This command will:
- Install all Node.js dependencies listed in `package.json`
- Create a `node_modules` folder
- Generate a `package-lock.json` file (if not already present)

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your backend API URL:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

### Step 5: Run the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

---

## Option 2: Clone from GitHub

### Prerequisites
- Git installed on your machine
- GitHub account with access to the repository

### Steps

```bash
# Clone the repository
git clone https://github.com/CodeMaven22/kabaza-management-system.git

# Navigate to the project
cd kabaza-management-system

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local

# Edit .env.local with your API URL (if needed)
# nano .env.local  (or use your preferred editor)

# Start development server
npm run dev
```

---

## Option 3: Using shadcn CLI (Advanced)

If you're starting a new project with the shadcn CLI:

```bash
npx shadcn-cli@latest init my-app
cd my-app

# Then copy the project files from the downloaded ZIP into this new project
# Or use git to pull the latest code from the repository
```

---

## What's Included in the Download

The ZIP file contains:
- ✅ All React/Next.js components
- ✅ API integration services
- ✅ Tailwind CSS configuration
- ✅ TypeScript types and interfaces
- ✅ Utility functions and hooks
- ✅ Configuration files (tsconfig.json, next.config.js, tailwind.config.ts)
- ✅ Package.json with all dependencies listed
- ✅ Documentation files

### What's NOT Included (will be created locally)
- ❌ `node_modules/` - created by `npm install`
- ❌ `.next/` - created when building/running dev server
- ❌ `.env.local` - you create this from `.env.example`
- ❌ `package-lock.json` - created by npm (may be regenerated)

---

## Troubleshooting Downloads

### Issue: ZIP is incomplete or missing files

**Solution 1 - Re-download:**
1. Clear your browser cache
2. Go back to v0.app
3. Click Download ZIP again

**Solution 2 - Use Git Clone:**
```bash
git clone https://github.com/CodeMaven22/kabaza-management-system.git
```

### Issue: npm install fails

**Clean reinstall:**
```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Issue: `NEXT_PUBLIC_API_BASE_URL` is undefined

**Solution:**
1. Ensure `.env.local` file exists in the project root
2. Add the environment variable:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```
3. Restart the dev server: `npm run dev`

### Issue: Port 3000 is already in use

Run on a different port:
```bash
npm run dev -- -p 3001
```

---

## Next Steps After Setup

1. **Start the backend**: Ensure your Django backend is running on the configured API URL
2. **Login**: Use your backend credentials to log in
3. **Navigate**: Use the sidebar to access different domains (Transport, Finance, System)
4. **Make changes**: Edit files in the `app/` and `components/` directories

---

## File Structure Explanation

```
app/                 → Next.js pages and routes
├── finance/         → Finance domain pages
├── transport/       → Transport domain pages
├── system/          → System admin pages
└── page.tsx         → Home page

components/          → React components
├── finance/         → Finance-specific components
├── transport/       → Transport-specific components
├── shared/          → Shared layouts and components
└── ui/              → shadcn/ui components

lib/                 → Utilities and services
├── api/            → API client and services
├── hooks/          → Custom React hooks
└── utils/          → Helper functions

public/             → Static assets (images, icons, etc.)
styles/             → Global CSS and Tailwind config
```

---

## Development Workflow

### Make Changes
Edit any file in `app/`, `components/`, or `lib/`. Changes hot-reload automatically.

### Build for Production
```bash
npm run build
npm run start
```

### Run Tests (if configured)
```bash
npm run test
```

### Check for Linting Issues
```bash
npm run lint
```

---

## Common Commands

```bash
npm run dev              # Start development server
npm run build            # Create production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm install              # Install dependencies
npm update               # Update all dependencies
npm audit fix            # Fix security vulnerabilities
```

---

## Support

If you encounter issues:
1. Check the `.env.example` file for required variables
2. Verify your backend API is running and accessible
3. Check browser console (F12) for errors
4. Refer to the main [README.md](./README.md) for more information

