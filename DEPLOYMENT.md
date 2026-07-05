# Kabaza Management System - Deployment Guide

## Pre-Deployment Testing Checklist

### 1. Environment Configuration
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Set `NEXT_PUBLIC_API_URL` pointing to your Django backend
- [ ] Verify all environment variables are set correctly
- [ ] Test API connectivity: `curl $NEXT_PUBLIC_API_URL/auth/me/`

### 2. Authentication Module Testing
- [ ] Login with valid credentials
- [ ] Logout and verify session is cleared
- [ ] Verify account status validation (suspended/deactivated)
- [ ] Rate limiting: Test failed login attempts (should lock after 5)
- [ ] Token refresh: Verify automatic refresh on expiration
- [ ] Password change functionality
- [ ] Permission-based UI rendering

### 3. Transport Module Testing
- [ ] Vehicle creation with automatic QR generation (Celery task)
- [ ] Owner registration and search
- [ ] Operator registration and list
- [ ] Vehicle search by registration/sticker code
- [ ] Vehicle detail view with complete information
- [ ] QR code display and sticker generation
- [ ] Pagination with large datasets (100+ records)
- [ ] Sorting by registration number, owner, status

### 4. Finance Module Testing
- [ ] Payment creation with amount validation
- [ ] Payment correction (reversal + new payment)
- [ ] Fine creation and status updates
- [ ] Fine reversal with approval workflow
- [ ] Vehicle verification (QR/sticker lookup)
- [ ] Fine auto-creation on verification failure
- [ ] Receipt generation and PDF download
- [ ] Financial dashboard loading and metrics

### 5. System Control Module Testing
- [ ] User list loading with backend data
- [ ] User search and filtering
- [ ] User role assignment
- [ ] User status change (active/suspended/deactivated)
- [ ] User deletion with audit logging
- [ ] Permission enforcement based on roles
- [ ] Audit log viewing

### 6. Performance Testing
- [ ] Page load time < 2 seconds (target)
- [ ] API response time < 1 second (avg)
- [ ] Pagination with 1000+ records loads smoothly
- [ ] SWR caching reduces API calls by 40%+
- [ ] Search endpoint returns in < 500ms

### 7. Error Handling Testing
- [ ] Network timeout handled gracefully
- [ ] Server 500 errors trigger retry (max 3 times)
- [ ] 429 rate limit shows user-friendly message
- [ ] 403 permission denied shown correctly
- [ ] Form validation shows field-level errors
- [ ] Duplicate payment prevention works

### 8. Security Testing
- [ ] CSRF tokens included in all POST/PUT/DELETE requests
- [ ] JWT tokens stored securely in sessionStorage
- [ ] Refresh token rotation working
- [ ] Input sanitization prevents XSS
- [ ] API rate limiting enforced (100 requests/minute)
- [ ] Audit logging captures all sensitive operations
- [ ] Role-based access control enforced on all endpoints

### 9. Data Validation Testing
- [ ] Phone number validation (Malawi format)
- [ ] Email validation rejects invalid formats
- [ ] Amount fields reject negative values
- [ ] Required fields show validation errors
- [ ] Password complexity enforced (8+ chars, mixed case, number, symbol)
- [ ] Date fields validate future dates where required

### 10. Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Responsive design works on all screen sizes

## Backend Checklist

### Django Configuration
- [ ] CORS enabled for frontend domain
  ```python
  CORS_ALLOWED_ORIGINS = [
      "http://localhost:3000",
      "https://yourdomain.com"
  ]
  ```

- [ ] Database migrations applied
  ```bash
  python manage.py migrate
  ```

- [ ] Celery workers running
  ```bash
  celery -A project_name worker -l info
  celery -A project_name beat -l info
  ```

- [ ] Redis running (for caching, sessions)
  ```bash
  redis-server
  ```

- [ ] Static files collected
  ```bash
  python manage.py collectstatic --noinput
  ```

- [ ] Environment variables set
  ```bash
  export SECRET_KEY=your-secret-key
  export DEBUG=False
  export ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
  ```

### API Endpoints Verification
- [ ] `/api/auth/login/` returns JWT tokens
- [ ] `/api/auth/me/` returns current user
- [ ] `/api/auth/token/refresh/` refreshes token
- [ ] `/api/users/` lists users with pagination
- [ ] `/api/transport/vehicle/` CRUD operations work
- [ ] `/api/transport/owners/` CRUD operations work
- [ ] `/api/finance/payments/` CRUD operations work
- [ ] `/api/finance/fines/` CRUD operations work

## Deployment Steps

### 1. Local Testing
```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the project
npm run build

# Start dev server
npm run dev

# Run type checking
npm run type-check
```

### 2. Vercel Deployment
```bash
# Push to main branch triggers automatic deployment
git add .
git commit -m "Deployment: Ready for production"
git push origin main

# OR manually deploy
vercel --prod
```

### 3. Environment Variables (Vercel)
Set in Vercel Project Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com/api`
- `NEXT_PUBLIC_ENABLE_SWR_CACHING` = `true`
- `NEXT_PUBLIC_MAX_RETRIES` = `3`
- Other config variables from `.env.local.example`

### 4. Post-Deployment Verification
- [ ] Frontend loads without errors
- [ ] Login works with backend
- [ ] Dashboard displays data
- [ ] No console errors
- [ ] Performance acceptable (LCP < 2.5s)
- [ ] All modules accessible
- [ ] Error handling works (test with broken API)

## Performance Optimization

### Implemented
- [x] SWR caching with smart revalidation
- [x] Pagination to limit data transfer
- [x] Error recovery with exponential backoff
- [x] Form validation before submission

### Recommended Additional
- [ ] Image optimization for avatars
- [ ] Implement Redis caching on backend
- [ ] CDN for static assets
- [ ] Database query optimization
- [ ] Implement search endpoint deduplication

## Monitoring & Logging

### Key Metrics to Track
- Page load time
- API response time
- Error rate
- 404/500 error frequency
- Authentication success rate
- Feature usage by role

### Logging Configuration
- Set `NEXT_PUBLIC_LOG_LEVEL=info` in production
- Set `NEXT_PUBLIC_ENABLE_DEBUG_LOGS=false` in production
- Monitor errors in Vercel Analytics

## Rollback Plan

If deployment fails:
1. Verify backend is still running
2. Check CORS configuration
3. Verify environment variables
4. Roll back to previous commit: `git revert HEAD`
5. Redeploy: `vercel --prod`

## Support & Troubleshooting

### Common Issues

**Login fails**
- Verify API URL is correct
- Check CORS configuration on backend
- Verify user exists in database
- Check JWT secret key matches

**Payments not loading**
- Verify Celery workers are running
- Check Redis connection
- Verify permissions for user role

**QR codes not generating**
- Verify Celery tasks are running
- Check task queue in Redis
- Monitor Celery logs

**Rate limiting issues**
- Verify rate limit config matches backend
- Check Redis connection for rate limiting
- Monitor API request frequency

## Success Metrics

Target metrics for efficient system:
- Page Load Time: < 2 seconds (avg)
- API Response Time: < 1 second (avg)
- Error Rate: < 1%
- Uptime: 99.5%+
- Successful Transactions: > 99%
