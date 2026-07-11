# API Routes Consistency

## Overview
All API services now maintain consistency with the base API URL structure. The `apiClient` automatically prepends `/api` to all routes, so service methods should NOT include `/api` in their paths.

## Base URL Structure
- **Base API URL**: `NEXT_PUBLIC_API_URL/api`
- **Service paths**: Should NOT include `/api` prefix

## Correct Pattern
```typescript
// ✅ CORRECT
async getAllPayments(): Promise<PaymentListResponse> {
  return apiClient.get('/finance/payments/');
}

async createPayment(data: Partial<Payment>): Promise<Payment> {
  return apiClient.post('/finance/payments/', data);
}
```

## Incorrect Pattern
```typescript
// ❌ INCORRECT
async getAllPayments(): Promise<PaymentListResponse> {
  return apiClient.get('/api/finance/payments/');
}

async createPayment(data: Partial<Payment>): Promise<Payment> {
  return apiClient.post('/api/finance/payments/', data);
}
```

## Service Structure
All services follow this path pattern:

### Finance Service (`/finance/...`)
- `/finance/payments/`
- `/finance/fines/`
- `/finance/receipts/`
- `/finance/verify-vehicle/`
- `/finance/stats/`
- `/finance/payment-methods-stats/`
- `/finance/fine-types-stats/`

### Transport Service (`/transport/...`)
- `/transport/vehicles/`
- `/transport/persons/`
- `/transport/verification/`

### Auth Service (`/auth/...`)
- `/auth/login/`
- `/auth/register/`
- `/auth/me/`
- `/auth/logout/`
- `/auth/change-password/`

## How apiClient Works
The `apiClient` is configured to:
1. Prepend the base API URL from environment variables
2. Add `/api` prefix automatically
3. Handle authentication headers and CSRF tokens

Therefore, service methods only need to specify the endpoint path without `/api`.

## Status
✅ Fixed: financeService now uses consistent paths without `/api` prefix
✅ Verified: transportService already uses correct pattern
✅ Verified: authService already uses correct pattern
