# Kabaza Management System

A comprehensive Next.js-based management system for vehicle registration, finance, and transport domain operations integrated with a Django backend API.

## Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Django REST Framework
- **Package Manager**: npm (converted from pnpm)
- **UI Components**: shadcn/ui

## Features

- **Transport Domain**: Vehicle registration, owner/operator management, vehicle verification with sticker codes
- **Finance Domain**: Payment management, subscription tracking, fine management with confiscation tracking
- **System Domain**: User management and role-based access control
- **API Integration**: Full backend integration with automatic request deduplication and rate limit handling

## Prerequisites

- Node.js 18+ (with npm)
- Git
- A running Django backend API

## Quick Start

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd kabaza-management-system
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies and create a `package-lock.json` file.

### 3. Configure Environment Variables

Create a `.env.local` file in the project root (copy `.env.example` if available):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
kabaza-management-system/
├── app/                          # Next.js App Router pages
│   ├── finance/                  # Finance domain pages
│   ├── transport/                # Transport domain pages
│   ├── system/                   # System administration pages
│   └── page.tsx                  # Home page
├── components/
│   ├── finance/                  # Finance components
│   ├── transport/                # Transport components
│   ├── shared/                   # Shared layouts and components
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api/                      # API services
│   │   ├── client.ts            # HTTP client with auth handling
│   │   ├── financeService.ts    # Finance API endpoints
│   │   ├── transportService.ts  # Transport API endpoints
│   │   ├── requestCache.ts      # Request deduplication utility
│   │   └── systemService.ts     # System API endpoints
│   ├── hooks/                    # Custom React hooks
│   └── utils/                    # Utility functions
├── public/                       # Static assets
├── styles/                       # Global styles
└── package.json                  # Dependencies
```

## Key Features

### Request Deduplication
Prevents throttling by automatically deduplicating concurrent identical API requests across components.

### Automatic Rate Limit Handling
Implements exponential backoff for 429 (Too Many Requests) responses with automatic retry logic.

### Role-Based Access Control
ProtectedRoute component enforces role-based page access.

### Responsive Design
Mobile-first design approach with Tailwind CSS utility classes.

## API Integration

All API calls are managed through service files:

- **financeService.ts** - Payments, subscriptions, fines, and verifications
- **transportService.ts** - Vehicles, owners, operators, and registrations
- **systemService.ts** - Users and system administration

## Development

### Code Style

- Use TypeScript for type safety
- Follow React hooks patterns
- Implement error boundaries for components
- Use semantic HTML with ARIA labels

### Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Troubleshooting

### Module not found errors
Ensure all dependencies are installed: `npm install`

### API connection errors
- Check that the backend server is running
- Verify `NEXT_PUBLIC_API_BASE_URL` is correctly configured
- Check browser console for detailed error messages

### Build errors
Clear cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Documentation

- [API Consistency Guide](./API-CONSISTENCY.md)
- [Setup Instructions](./SETUP.md)
- [Finance Enhancements](./FINANCE-ENHANCEMENTS.md)
- [Cleanup and Fixes](./CLEANUP-AND-FIXES.md)

## Contributing

When making changes:
1. Create a new branch for your feature
2. Make your changes with clear commit messages
3. Test thoroughly before pushing
4. Push to the repository

## Deployment

The project is configured for deployment on Vercel. Every commit to `main` triggers automatic deployment.

[Continue working on v0 →](https://v0.app/chat/projects/prj_8kHBZs1voU3vSRsPJeUgXqPL5vtX)

## Support

For issues or questions, refer to the documentation files in the project root or contact the development team.
