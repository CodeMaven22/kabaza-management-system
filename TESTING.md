# Integration Testing Guide

## Quick Start

### 1. Setup Test Environment
```bash
# Copy test env file
cp .env.local.example .env.test.local

# Edit to point to test backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=true
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Backend Setup
```bash
# Create test user
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> User.objects.create_user(
...     username='testuser',
...     password='TestPassword123!',
...     email='test@example.com',
...     first_name='Test',
...     last_name='User'
... )

# Start Celery worker
celery -A project_name worker -l info

# Start Celery beat
celery -A project_name beat -l info
```

## Module Testing Flows

### Module 1: Authentication

#### Test: Login with Valid Credentials
1. Navigate to `/login`
2. Enter username: `testuser`
3. Enter password: `TestPassword123!`
4. Click "Sign In"
5. **Expected**: Redirect to `/dashboard`, user info displayed
6. **Verify**: Token stored in sessionStorage

#### Test: Login Rate Limiting
1. Navigate to `/login`
2. Enter wrong password 5 times
3. On 6th attempt
4. **Expected**: "Too many login attempts" message, 60s lockout
5. **Verify**: Countdown timer visible

#### Test: Account Suspended
1. In Django admin, set user status to `suspended`
2. Try to login with valid credentials
3. **Expected**: "Your account has been suspended" message
4. **Verify**: Cannot proceed to dashboard

#### Test: Logout
1. From dashboard, click user menu → Logout
2. **Expected**: Redirect to login page, token cleared

### Module 2: Transport

#### Test: Create Vehicle
1. Navigate to `/transport/bikes`
2. Click "Add Vehicle"
3. Fill form:
   - Registration: `KA001ABC`
   - Owner: Select from dropdown
   - Operator: Select from dropdown
   - Type: Bike
   - Color: Red
4. Click "Register"
5. **Expected**: Success message, QR code generation started
6. **Verify**: 
   - Vehicle appears in list
   - Sticker code assigned
   - QR code generated (check Celery logs)

#### Test: Search Vehicles
1. Navigate to `/transport/bikes`
2. Search by registration: `KA001`
3. **Expected**: Vehicle KA001ABC appears in results
4. **Verify**: Search took < 500ms (check network tab)

#### Test: Pagination
1. Navigate to `/transport/bikes`
2. If > 20 vehicles exist
3. **Expected**: Pagination controls visible
4. Click page 2
5. **Expected**: New results loaded, URL changed to `?page=2`

### Module 3: Finance

#### Test: Create Payment
1. Navigate to `/finance/payments`
2. Click "New Payment"
3. Fill form:
   - Vehicle: Select bike
   - Amount: 5000
   - Method: Mobile Money
   - Reference: `MM123456`
4. Click "Record Payment"
5. **Expected**: Payment added to list, receipt available
6. **Verify**:
   - Total collected updated in dashboard
   - Payment visible in vehicle's payment history

#### Test: Issue Fine
1. Navigate to `/finance/fines`
2. Click "New Fine"
3. Fill form:
   - Vehicle: Select bike
   - Violation: Speeding
   - Amount: 10000
   - Description: "Exceeded speed limit in town"
4. Click "Issue Fine"
5. **Expected**: Fine created, status = "issued"
6. **Verify**: Fine appears in outstanding fines list

#### Test: Fine Reversal
1. From fine list, click fine → "Reverse"
2. Enter reason (min 20 chars)
3. Click "Request Reversal"
4. **Expected**: Status changed to "reversal_pending"
5. **Verify**: Appears in reversals pending list

#### Test: Vehicle Verification
1. Navigate to `/transport/verification`
2. Scan/enter QR code from vehicle
3. **Expected**: Vehicle details loaded
4. Click "Verify"
5. **Expected**: 
   - Verification timestamp recorded
   - Any outstanding fines shown
   - Auto-fine created if registration lapsed

### Module 4: System Control

#### Test: User Management
1. Navigate to `/system/users`
2. **Expected**: List of all users loaded
3. Search for user by name
4. **Expected**: Results filtered
5. Click user → Change Status
6. Change to "Suspended"
7. **Expected**: User status updated, audit log created
8. **Verify**: Suspended user cannot login

#### Test: Audit Logging
1. Perform action (payment, fine, user status)
2. Navigate to `/system/audit`
3. **Expected**: 
   - Action logged with timestamp
   - User who performed action shown
   - Details of change shown

## Error Scenario Testing

### Test: Network Timeout
1. In Network tab, set throttling to "Slow 3G"
2. Load `/transport/bikes`
3. **Expected**:
   - Loading spinner shows
   - "Request timed out" message after 30s
   - Retry button appears

### Test: 500 Server Error
1. Backend: Temporarily break a view
2. Try to load affected page
3. **Expected**:
   - "Server error. Please try again later"
   - Automatic retry after 1s, 2s, 4s
   - After 3 retries, error shown

### Test: 403 Permission Denied
1. Login as low-permission user (e.g., revenue collector)
2. Try to access admin-only page
3. **Expected**: "You do not have permission" message

### Test: Form Validation
1. Go to payment form
2. Leave amount field blank
3. Click "Record Payment"
4. **Expected**: "Amount is required" error
5. Enter negative amount
6. **Expected**: "Amount must be greater than 0" error
7. Enter text in amount field
8. **Expected**: "Amount must be a number" error

## Performance Testing

### Test: Page Load Time
1. Open DevTools → Performance tab
2. Load `/finance/analytics`
3. Record metrics:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
4. **Expected**:
   - FCP < 1.8s
   - LCP < 2.5s
   - CLS < 0.1

### Test: API Caching
1. Load `/transport/bikes`
2. Note API call count in Network tab
3. Navigate to another page, back to `/transport/bikes`
4. **Expected**: API call not made (cached)
5. Reload page (hard refresh)
6. **Expected**: Cache cleared, API called again

### Test: Large Dataset Pagination
1. Backend: Create 1000+ vehicle records
2. Load `/transport/bikes?page_size=100`
3. **Expected**:
   - Page loads in < 2s
   - 100 items displayed
   - Pagination controls responsive

## Security Testing

### Test: XSS Prevention
1. Go to vehicle registration
2. In registration field, enter: `<script>alert('xss')</script>`
3. Click "Register"
4. **Expected**: Script tags escaped, no alert shown

### Test: CSRF Protection
1. Open DevTools → Network tab
2. Create payment/fine
3. **Expected**: `X-CSRFToken` header in request
4. Request sent with valid token

### Test: Rate Limiting
1. Rapidly click "Record Payment" 50 times in 10 seconds
2. **Expected**: After ~30 requests, 429 Too Many Requests
3. **Verify**: Message shows "Rate limit exceeded"

## Rollback Testing

### Test: Version Rollback
1. Current version working normally
2. Deploy new version with bug
3. Rollback to previous commit: `git revert HEAD && git push`
4. Redeploy: `npm run build && npm start`
5. **Expected**: Previous version restored, no data loss

## Success Criteria

System is ready for production when:
- [ ] All authentication flows work
- [ ] All CRUD operations work for each module
- [ ] Permission-based access control enforced
- [ ] Error handling shows user-friendly messages
- [ ] Form validation prevents invalid data
- [ ] Pagination works with 1000+ records
- [ ] Celery tasks complete successfully
- [ ] Page load time < 2 seconds average
- [ ] No console errors in production build
- [ ] All security tests pass
