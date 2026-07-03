# Security Implementation Guide

## Overview
This document outlines the security measures implemented in the Kabaza Management System frontend.

## Authentication & Token Management

### JWT Token Lifecycle
- **Access Token**: Short-lived token (5-15 minutes) for API requests
- **Refresh Token**: Long-lived token for obtaining new access tokens
- **Storage**: Tokens stored in `sessionStorage` (cleared on browser close)
- **Automatic Refresh**: Tokens automatically refreshed 5 minutes before expiration

### Token Security Features
- Tokens are stored in sessionStorage (not localStorage) for enhanced security
- Automatic token refresh prevents user session interruption
- Failed token refresh clears all tokens and forces re-login
- Session persists only during browser session (cleared on close)

## Rate Limiting Protection

### Login Rate Limiting
- Backend implements `LoginRateThrottle` to prevent brute force attacks
- Frontend detects 429 (Too Many Requests) responses
- User is locked out for 60 seconds after multiple failed attempts
- Clear error messaging informs user about rate limiting

### Handling Rate Limits
```typescript
// Frontend automatically detects and handles rate limits
if (authError.includes('rate limit') || authError.includes('Too many')) {
  // Show countdown timer to user
  // Disable login form during lockout
}
```

## CSRF Protection

### Cross-Site Request Forgery Prevention
- CSRF token automatically extracted from `csrftoken` cookie
- Sent with all state-changing requests (POST, PUT, PATCH, DELETE)
- Backend validates CSRF token on all protected endpoints
- Django's built-in CSRF middleware handles token validation

### Implementation
```typescript
// API client automatically adds CSRF token
headers['X-CSRFToken'] = csrfToken;  // For POST/PUT/PATCH/DELETE
```

## Account Status Validation

### User Status Checks
- Login validates account status before allowing access
- Suspended accounts show message: "Account suspended. Contact administrator."
- Deactivated accounts show message: "Account deactivated. Contact administrator."
- System automatically logs out users with invalid status

## Role-Based Access Control (RBAC)

### Permission Matrix
```
Chief Executive: Full access to all modules
Director of Administration: User management, audit logs
ICT Officer: System management, user management
Finance Officer: Finance operations, payment/fine management
Revenue Officer: Fine management, revenue reporting
Revenue Collector: Payment collection, fine viewing
Registration Officer: Bike/owner/operator registration
Traffic Officer: Bike verification
Accounts Assistant: Finance operations, payment management
```

### Using Permissions in Components
```typescript
import { usePermissions } from '@/lib/hooks/usePermissions';

function MyComponent() {
  const { hasPermission, isAdmin } = usePermissions();

  if (!hasPermission('manage_users')) {
    return <div>Access Denied</div>;
  }

  return <AdminPanel />;
}
```

## Input Validation & Sanitization

### Frontend Validation
- All form inputs validated before submission
- Email format validation using HTML5 input type
- Username/password minimum length requirements
- Special characters escaped in display

### Backend Validation
- All inputs re-validated on backend
- SQL injection prevention via parameterized queries
- XSS prevention through serialization

## HTTP Security Headers

### Recommended Server Configuration
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Error Handling

### Secure Error Messages
- Generic error messages for authentication failures
- Detailed errors only shown to authenticated users
- Error details never exposed to potential attackers
- Sensitive information (tokens, IDs) never logged in browser console

### Example Error Handling
```typescript
// Bad: "User admin not found in database"
// Good: "Invalid username or password"

try {
  await authService.login({ username, password });
} catch (error) {
  // Show generic error to user
  setError('Invalid credentials');
  // Log detailed error to backend
  console.error('[v0] Auth error:', error);
}
```

## Session Management

### Session Lifecycle
1. User logs in with credentials
2. Backend validates and returns JWT tokens
3. Frontend stores tokens in sessionStorage
4. API client automatically includes token in requests
5. Backend validates token signature and expiration
6. Token automatically refreshed before expiration
7. User logs out or browser closes → sessionStorage cleared

### Session Timeouts
- Access token expiration: 5-15 minutes (set by backend)
- Refresh token expiration: 7-30 days (set by backend)
- Browser session timeout: On browser close (sessionStorage cleared)
- Inactive timeout: Handled by backend

## API Security

### Request Validation
- Content-Type validation for JSON endpoints
- Method validation (GET, POST, PUT, DELETE)
- Authorization header verification
- Token signature validation

### Response Validation
- Content-Type validation for responses
- JSON parsing with error handling
- Status code validation
- Response size limits

## Audit Logging

### Backend Audit Trail
- All sensitive operations logged by `AuditService`
- User actions tracked with:
  - User ID
  - Action type (LOGIN, CREATE_USER, DELETE_USER, etc.)
  - Module name (system, finance, transport)
  - Timestamp
  - IP address
  - Object ID (for object-specific actions)

### Audit Trail Usage
```typescript
// Backend example
AuditService.log_audit(
  user=request.user,
  action='CREATE_USER',
  module='system_control',
  description='User created',
  ip_address=get_client_ip(request),
  object_id=new_user.id
)
```

## Best Practices for Deployment

### Production Checklist
- [ ] Set `DEBUG = False` in Django settings
- [ ] Use strong SECRET_KEY in Django
- [ ] Configure ALLOWED_HOSTS for your domain
- [ ] Use HTTPS only
- [ ] Set secure cookies: `SESSION_COOKIE_SECURE = True`
- [ ] Set CSRF_COOKIE_SECURE = True
- [ ] Enable CSRF_COOKIE_HTTPONLY = True
- [ ] Configure CORS properly for frontend domain
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting on login endpoint
- [ ] Configure password validators
- [ ] Enable HSTS headers
- [ ] Regular security updates for dependencies
- [ ] Monitor audit logs regularly

### Environment Variables
Copy `.env.example` to `.env.local` and configure:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Security Updates

### Keeping Dependencies Secure
```bash
# Check for vulnerabilities
npm audit

# Update vulnerable packages
npm audit fix

# Check for outdated packages
npm outdated
```

## Reporting Security Issues

Please report security vulnerabilities to: [security contact]
Do not disclose vulnerabilities publicly until they are fixed.

## References
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [Django Security](https://docs.djangoproject.com/en/stable/topics/security/)
- [Next.js Security](https://nextjs.org/learn/seo/security)
