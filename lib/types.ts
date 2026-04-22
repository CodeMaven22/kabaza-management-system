// Owner Types (Bike Owner)
export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  address: string;
  city: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  totalBikes: number;
}

// Operator/Rider Types
export interface Operator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  address: string;
  city: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  licenseNumber: string;
  licenseExpiryDate: string;
  qrCode?: string;
}

// Operator License Types
export interface OperatorLicense {
  id: string;
  operatorId: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'suspended';
  qrCode: string;
}

// Bike Registration Types
export interface Bike {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  color: string;
  engineNumber: string;
  chassisNumber: string;
  registrationDate: string;
  ownerId: string;
  operatorId: string;
  status: 'active' | 'inactive' | 'suspended';
  expiryDate: string;
  qrCode?: string;
}

// Payment Types
export interface Payment {
  id: string;
  bikeId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'mobile_money' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
  receiptNumber: string;
  description: string;
  paymentType: 'registration' | 'renewal' | 'monthly' | 'annual';
  year?: number;
  month?: number;
}

// Payment History
export interface PaymentHistory {
  bikeId: string;
  payments: Payment[];
}

// Receipt Types
export interface Receipt {
  id: string;
  paymentId: string;
  receiptNumber: string;
  generatedAt: string;
}

// Fine Types
export interface Fine {
  id: string;
  bikeId: string;
  amount: number;
  reason: string;
  status: 'paid' | 'unpaid';
  issuedBy: string;
  issuedDate: string;
}

// User & Role Types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password?: string; // Only for display/form purposes
  roleId: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalBikes: number;
  activeBikes: number;
  totalOperators: number;
  activeOperators: number;
  totalRevenue: number;
  pendingPayments: number;
}

// Form Data Types
export interface BikeFormData {
  make: string;
  model: string;
  color: string;
  engineNumber: string;
  chassisNumber: string;
  ownerId: string;
  operatorId: string;
}

export interface OwnerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  address: string;
  city: string;
}

export interface OperatorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  address: string;
  city: string;
}

export interface PaymentFormData {
  bikeId: string;
  amount: number;
  paymentMethod: 'cash' | 'mobile_money' | 'bank_transfer';
  description: string;
  paymentType: 'registration' | 'renewal' | 'monthly' | 'annual';
  year?: number;
  month?: number;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
  roleId: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface ReceiptFormData {
  paymentId: string;
}

export interface FineFormData {
  bikeId: string;
  amount: number;
  reason: string;
}
