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
  operatorId: string;
  status: 'active' | 'inactive' | 'suspended';
  expiryDate: string;
  qrCode?: string;
}

// Operator/Owner Types
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
  totalBikes: number;
}

// Payment Types
export interface Payment {
  id: string;
  bikeId: string;
  operatorId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'mobile_money' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
  receiptNumber: string;
  description: string;
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
  operatorId: string;
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
}
