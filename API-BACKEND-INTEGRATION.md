# Backend API Integration Guide

This document outlines all backend API endpoints and how they're integrated in the frontend.

## Base URL Configuration

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

All endpoints below are relative to this base URL.

---

## Authentication Endpoints

### System Control Module
Base: `/api/auth/` or `/api/`

| Endpoint | Method | Purpose | Frontend Service |
|----------|--------|---------|-----------------|
| `auth/login/` | POST | User login | `authService.login()` |
| `auth/register/` | POST | User registration | `authService.register()` |
| `auth/logout/` | POST | User logout | `authService.logout()` |
| `auth/me/` | GET | Get current user | `authService.getCurrentUser()` |
| `auth/change-password/` | POST | Change password | `authService.changePassword()` |
| `auth/token/refresh/` | POST | Refresh JWT token | JWT auto-refresh |

---

## Transport Domain - Persons Management

### Unified Persons Endpoint
Base: `/api/transport/`

**NEW: Unified endpoint for both owners and operators**

| Endpoint | Method | Purpose | Frontend Service |
|----------|--------|---------|-----------------|
| `persons/` | GET | List all persons (owners + drivers) | `transportService.listPersons()` |
| `persons/` | POST | Create new person (owner or driver) | `transportService.createPerson()` |
| `persons/<id>/` | GET | Get person details | `transportService.getPerson()` |
| `persons/<id>/` | PUT/PATCH | Update person | `transportService.updatePerson()` |
| `persons/<id>/` | DELETE | Delete/deactivate person | `transportService.deletePerson()` |

**Query Parameters for GET /persons/:**
```
?role=vehicle_owner        # Filter by vehicle owners
?role=driver               # Filter by drivers/operators
?page=1                    # Pagination
?search=john               # Search by name, email, or phone
```

### Legacy Endpoints (Still Supported)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `owners/` | GET/POST | List/create owners |
| `owners/<id>/` | GET/PUT/DELETE | Manage owner |
| `operators/` | GET/POST | List/create operators |
| `operators/<id>/` | GET/PUT/DELETE | Manage operator |

---

## Transport Domain - Vehicles

Base: `/api/transport/`

| Endpoint | Method | Purpose | Frontend Service |
|----------|--------|---------|-----------------|
| `vehicle/` | GET | List vehicles | `transportService.listVehicles()` |
| `vehicle/` | POST | Create vehicle | `transportService.createVehicle()` |
| `vehicle/<id>/` | GET | Get vehicle details | `transportService.getVehicle()` |
| `vehicle/<id>/` | PUT/PATCH | Update vehicle | `transportService.updateVehicle()` |
| `vehicle/<id>/` | DELETE | Deactivate vehicle | `transportService.deleteVehicle()` |
| `vehicle/search/` | GET | Search vehicles | `transportService.searchVehicles()` |
| `print-sticker/<id>/` | GET | Generate QR/sticker PDF | |
| `download-pdf/<id>/` | GET | Download vehicle PDF | |

---

## Finance Domain

Base: `/api/finance/`

| Endpoint | Method | Purpose | Frontend Service |
|----------|--------|---------|-----------------|
| `pay-fine/` | POST | Record fine payment | `financeService.payFine()` |
| `pay-subscription/` | POST | Record subscription payment | `financeService.paySubscription()` |
| `fines/` | GET | List fines | `financeService.listFines()` |
| `fines/<id>/` | GET | Get fine details | `financeService.getFine()` |
| `fines/<id>/update/` | PUT/PATCH | Update fine status | `financeService.updateFine()` |
| `fines/<id>/cancel/` | POST | Cancel fine | `financeService.cancelFine()` |
| `fines/<id>/release/` | POST | Release vehicle from fine | `financeService.releaseFine()` |
| `payments/` | GET | List payments | `financeService.listPayments()` |
| `payments/<id>/` | GET | Get payment details | `financeService.getPayment()` |
| `payments/<id>/update/` | PUT/PATCH | Update payment | `financeService.updatePayment()` |
| `vehicle-payments/<id>/details/` | GET | Get vehicle payment history | `financeService.getVehiclePayments()` |
| `verify-vehicle/` | GET | Verify vehicle QR code | `financeService.verifyVehicle()` |
| `receipts/<id>/print/` | GET | Generate receipt PDF | |

---

## Analytics Module

Base: `/api/analytics/`

| Endpoint | Method | Purpose | Frontend Service |
|----------|--------|---------|-----------------|
| `finance/` | GET | Finance analytics | `analyticsService.getFinanceAnalytics()` |
| `transport/` | GET | Transport analytics | `analyticsService.getTransportAnalytics()` |
| `system/` | GET | System analytics | `analyticsService.getSystemAnalytics()` |

---

## User Management

Base: `/api/`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `users/` | GET | List all users |
| `users/` | POST | Create user |
| `users/<id>/details/` | GET | Get user details |
| `users/<id>/update/` | PUT/PATCH | Update user |
| `users/<id>/delete/` | DELETE | Delete user |

---

## Permission System

All endpoints are protected by role-based access control (RBAC):

### Transport Domain Roles:
- `REGISTRATION_OFFICER` - Can create/update owners and drivers
- `ICT_OFFICER` - Can delete persons and vehicles
- `REVENUE_OFFICER` - Can view all persons

### Finance Domain Roles:
- `REVENUE_COLLECTOR` - Can record payments
- `REVENUE_OFFICER` - Can manage fines
- `FINANCE_OFFICER` - Can access analytics
- `ICT_OFFICER` - Can access all

### System Roles:
- `CHIEF_EXECUTIVE` - Full system access
- `ICT_OFFICER` - System administration
- Any authenticated user - Can view analytics

---

## Request/Response Format

### Standard Response Format
```json
{
  "id": 1,
  "full_name": "John Doe",
  "phone_number": "0987654321",
  "email": "john@example.com",
  "role": "vehicle_owner",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### List Response Format
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/transport/persons/?page=2",
  "previous": null,
  "results": [
    { /* person object */ },
    { /* person object */ }
  ]
}
```

### Error Response Format
```json
{
  "error": "Invalid credentials",
  "detail": "Detailed error message",
  "status": 400
}
```

---

## Authentication Headers

All requests (except login) must include:

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## CORS Configuration

The backend must have CORS enabled with:

```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Production domain
]

CORS_ALLOW_CREDENTIALS = True
```

---

## Rate Limiting

Most endpoints have rate limiting:
- Vehicle search: 30 requests per minute per user
- Login: 5 attempts per minute per IP
- Payment endpoints: 10 requests per minute per user

---

## Caching Strategy

SWR is configured with these cache times:

| Data Type | Cache Time | Revalidate |
|-----------|-----------|-----------|
| Persons list | 2 minutes | Background |
| Person detail | 5 minutes | Background |
| Vehicles list | 1 minute | Background |
| Finance data | 2 minutes | Background |
| Analytics | 5 minutes | Background |

---

## Common Integration Patterns

### Listing with Filters
```typescript
// List vehicle owners only
const response = await transportService.listPersons({ role: 'vehicle_owner' });

// List drivers with pagination
const response = await transportService.listPersons({ role: 'driver', page: 1 });

// Search persons
const response = await transportService.listPersons({ search: 'john' });
```

### Creating with Role
```typescript
// Create vehicle owner
const person = await transportService.createPerson({
  full_name: 'John Doe',
  phone_number: '0987654321',
  email: 'john@example.com',
  role: 'vehicle_owner',
});

// Create driver
const person = await transportService.createPerson({
  full_name: 'Jane Smith',
  phone_number: '0988765432',
  role: 'driver',
});
```

### Error Handling
```typescript
try {
  const person = await transportService.createPerson(data);
} catch (error) {
  if (error.status === 400) {
    console.log('Validation error:', error.message);
  } else if (error.status === 401) {
    console.log('Authentication required');
  } else if (error.status === 403) {
    console.log('Permission denied');
  }
}
```

---

## Migration Notes

### From Separate Endpoints to Unified
If you're migrating from the old separate endpoints:

**Old way:**
```typescript
// Fetch owners
await transportService.listOwners();
// Fetch operators
await transportService.listOperators();
```

**New way:**
```typescript
// Fetch all
await transportService.listPersons();
// Fetch by role
await transportService.listPersons({ role: 'vehicle_owner' });
await transportService.listPersons({ role: 'driver' });
```

The old endpoints still work for backwards compatibility but should be phased out.

---

## Testing the Integration

### Quick Test Commands
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# List persons
curl -X GET http://localhost:8000/api/transport/persons/ \
  -H "Authorization: Bearer <token>"

# Create person
curl -X POST http://localhost:8000/api/transport/persons/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John","phone_number":"0987654321","role":"vehicle_owner"}'
```

---

## Troubleshooting

### 404 Not Found
- Ensure backend is running on correct port (8000)
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify endpoint path is correct

### 403 Forbidden
- Check user role permissions
- Ensure JWT token is valid
- Verify token hasn't expired

### 400 Bad Request
- Check request payload format
- Verify all required fields are present
- Check field types match schema

### CORS Error
- Verify backend CORS configuration
- Check frontend origin is in CORS_ALLOWED_ORIGINS
- Ensure credentials are being sent correctly

---

**Last Updated:** January 2025
**Version:** 2.0 (Unified Persons Management)
