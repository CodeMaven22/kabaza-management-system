import { z } from 'zod';

// Common patterns
const phonePattern = /^(\+?265|0)[1-9]\d{8}$/; // Malawi phone numbers
const nationalIdPattern = /^\d{1,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_-]{3,20}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ============ Authentication Schemas ============

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const RegisterSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(usernamePattern, 'Username can only contain letters, numbers, hyphens, and underscores'),
  email: z.string()
    .email('Invalid email address'),
  first_name: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters'),
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordPattern, 'Password must contain uppercase, lowercase, number, and special character'),
});

export const ChangePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordPattern, 'Password must contain uppercase, lowercase, number, and special character'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

// ============ Transport Schemas ============

export const OwnerRegistrationSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone_number: z.string()
    .regex(phonePattern, 'Invalid Malawi phone number'),
  national_id: z.string()
    .regex(nationalIdPattern, 'National ID must contain only numbers'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(1, 'City is required'),
});

export const OperatorRegistrationSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone_number: z.string()
    .regex(phonePattern, 'Invalid Malawi phone number'),
  license_number: z.string().min(1, 'License number is required'),
  license_expiry: z.string().refine((date) => new Date(date) > new Date(), 'License must not be expired'),
});

export const VehicleRegistrationSchema = z.object({
  registration_number: z.string()
    .min(1, 'Registration number is required')
    .toUpperCase(),
  owner_id: z.number().min(1, 'Owner is required'),
  operator_id: z.number().min(1, 'Operator is required'),
  vehicle_type: z.enum(['bike', 'bicycle', 'motorcycle'], {
    errorMap: () => ({ message: 'Invalid vehicle type' }),
  }),
  color: z.string().min(1, 'Color is required'),
  engine_number: z.string().optional(),
  chassis_number: z.string().optional(),
});

// ============ Finance Schemas ============

export const PaymentSchema = z.object({
  vehicle_id: z.number().min(1, 'Vehicle is required'),
  amount: z.number()
    .positive('Amount must be greater than 0')
    .multipleOf(0.01, 'Amount must have valid decimal places'),
  payment_method: z.enum(['cash', 'bank_transfer', 'mobile_money'], {
    errorMap: () => ({ message: 'Invalid payment method' }),
  }),
  transaction_reference: z.string()
    .min(1, 'Transaction reference is required'),
  notes: z.string().optional(),
});

export const FineSchema = z.object({
  vehicle_id: z.number().min(1, 'Vehicle is required'),
  violation_type: z.enum(['speeding', 'no_registration', 'no_license', 'overload', 'other'], {
    errorMap: () => ({ message: 'Invalid violation type' }),
  }),
  amount: z.number()
    .positive('Amount must be greater than 0'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  issued_by: z.number().optional(),
});

export const FineReversalSchema = z.object({
  fine_id: z.number().min(1, 'Fine is required'),
  reason: z.string()
    .min(20, 'Reason must be at least 20 characters'),
  approved_by: z.number().optional(),
});

// ============ Helper Functions ============

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type OwnerRegistration = z.infer<typeof OwnerRegistrationSchema>;
export type OperatorRegistration = z.infer<typeof OperatorRegistrationSchema>;
export type VehicleRegistration = z.infer<typeof VehicleRegistrationSchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
export type FineInput = z.infer<typeof FineSchema>;
export type FineReversalInput = z.infer<typeof FineReversalSchema>;

/**
 * Validate and return sanitized data
 */
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown) {
  try {
    return {
      success: true,
      data: schema.parse(data),
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = Object.fromEntries(
        error.errors.map((e) => [e.path.join('.'), e.message])
      );
      return {
        success: false,
        data: null,
        errors: fieldErrors,
      };
    }
    return {
      success: false,
      data: null,
      errors: { _general: 'Validation failed' },
    };
  }
}
