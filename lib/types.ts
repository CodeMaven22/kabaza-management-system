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

// Sticker Code Types
export interface StickerCode {
  id: string;
  bikeId: string;
  code: string; // Format: MH-K-XXXXXX
  issuedDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'used';
  verificationCount: number;
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
  status: 'active' | 'inactive' | 'suspended' | 'confiscated';
  expiryDate: string;
  qrCode?: string;
  stickerCode?: string;
  bikeType: 'bicycle' | 'motorbike';
  email?: string;
  photo?: string;
  receiptNumber?: string;
}

// Confiscation Types
export interface Confiscation {
  id: string;
  bikeId: string;
  reason: string;
  confiscatedDate: string;
  confiscatedBy: string;
  storageLocation: string;
  status: 'confiscated' | 'released' | 'auctioned';
  releaseDate?: string;
  fine?: number;
  notes?: string;
}

// Verification Types
export interface Verification {
  id: string;
  bikeId: string;
  type: 'qr_scan' | 'sticker_scan' | 'manual_entry';
  verifiedAt: string;
  verifiedBy: string;
  status: 'verified' | 'failed' | 'suspicious';
  notes?: string;
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
  status: 'paid' | 'unpaid' | 'cancelled';
  issuedBy: string;
  issuedDate: string;
  cancelledReason?: string;
  cancelledDate?: string;
}

// User & Role Types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export type UserRole = 
  | 'ICT_OFFICER' 
  | 'REVENUE_COLLECTOR' 
  | 'REVENUE_OFFICER' 
  | 'REGISTRATION_OFFICER' 
  | 'FINANCE_OFFICER' 
  | 'ACCOUNTS_ASSISTANT' 
  | 'DIRECTOR_OF_ADMINISTRATION' 
  | 'CHIEF_EXECUTIVE' 
  | 'TRAFFIC_OFFICER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password?: string; // Only for display/form purposes
  roleId: string;
  role: UserRole;
  nationalId: string;
  status: 'active' | 'inactive' | 'suspended' | 'deactivated';
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
  color: string;
  ownerId: string;
  operatorId: string;
  bikeType: 'bicycle' | 'motorbike';
  email?: string;
  photo?: string;
}

export interface OwnerFormData {
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  address: string;
  photo?: string;
}

export interface OperatorFormData {
  fullName: string;
  phoneNumber: string;
  address: string;
  nationalId: string;
  photo?: string;
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

// Finance Domain Types
export interface Subscription {
  id: string;
  bikeId: string;
  status: 'active' | 'expired';
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  paymentMethod: 'cash' | 'mobile_money' | 'bank_transfer';
  paidAmount: number;
  createdAt: string;
}

export interface BikeVerificationRequest {
  qrData?: string;
  stickerCode?: string;
}

export interface BikeVerificationResponse {
  bikeId: string;
  registrationNumber: string;
  owner: {
    id: string;
    fullName: string;
  };
  operator: {
    id: string;
    fullName: string;
  };
  color: string;
  subscriptionStatus: 'active' | 'expired';
  subscriptionEndDate: string;
  fines: {
    unpaidCount: number;
    totalAmount: number;
  };
  status: 'verified' | 'failed' | 'confiscated';
  message: string;
}

export interface PaymentFormDataFinance {
  bikeId: string;
  paymentMethod: 'cash' | 'mobile_money' | 'bank_transfer';
  paidAmount: number;
}

export interface FineFineFormData {
  fineId: string;
  paymentMethod: 'cash' | 'mobile_money' | 'bank_transfer';
  paidAmount: number;
  cancellationReason?: string;
}
