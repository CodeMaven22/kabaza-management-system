import { apiClient } from './client';

// Types
export interface Payment {
  id: number;
  receipt_number: string;
  vehicle_id: number;
  amount: number;
  payment_method: 'CASH' | 'CHECK' | 'BANK_TRANSFER' | 'MOBILE_MONEY';
  payment_date: string;
  collected_by: number;
  status: 'PENDING' | 'COMPLETED' | 'CORRECTED' | 'REVERSED';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Fine {
  id: number;
  vehicle_id: number;
  fine_amount: number;
  fine_type: 'TRAFFIC_VIOLATION' | 'REGISTRATION_EXPIRED' | 'INSURANCE_EXPIRED' | 'OTHER';
  issued_by: number;
  issue_date: string;
  status: 'OPEN' | 'PAID' | 'CONFISCATED' | 'DISPUTED';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Receipt {
  id: number;
  payment_id: number;
  receipt_number: string;
  receipt_date: string;
  amount: number;
  pdf_status: 'PENDING' | 'GENERATED' | 'FAILED';
  pdf_url: string | null;
  celery_task_id: string | null;
  created_at: string;
}

export interface Verification {
  id: number;
  query_type: 'QR_CODE' | 'STICKER_CODE';
  query_value: string;
  vehicle_found: boolean;
  vehicle_id?: number;
  registration_number?: string;
  owner_name?: string;
  status?: string;
  outstanding_fines?: number;
  last_payment?: string;
  verified_at: string;
}

export interface FinancialStats {
  total_revenue: number;
  total_fines_issued: number;
  total_fines_paid: number;
  payment_methods_breakdown: Record<string, number>;
  fine_types_breakdown: Record<string, number>;
  weekly_revenue_trend: Array<{ date: string; amount: number }>;
  monthly_revenue_trend: Array<{ month: string; amount: number }>;
  outstanding_fines_count: number;
  confiscated_vehicles_count: number;
}

export interface PaymentListResponse {
  results: Payment[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface FineListResponse {
  results: Fine[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Finance API Service
export const financeService = {
  // ==================== PAYMENTS ====================
  async getAllPayments(filters?: {
    status?: string;
    payment_method?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
  }): Promise<PaymentListResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.payment_method) params.append('payment_method', filters.payment_method);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.page) params.append('page', filters.page.toString());

    return apiClient.get(`/api/finance/payments/?${params.toString()}`);
  },

  async getPaymentById(id: number): Promise<Payment> {
    return apiClient.get(`/api/finance/payments/${id}/`);
  },

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    return apiClient.post('/api/finance/payments/', data, {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCsrfToken(),
    });
  },

  async updatePayment(id: number, data: Partial<Payment>): Promise<Payment> {
    return apiClient.put(`/api/finance/payments/${id}/`, data, {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCsrfToken(),
    });
  },

  async correctPayment(id: number, correctionData: {
    new_amount: number;
    reason: string;
  }): Promise<Payment> {
    return apiClient.post(`/api/finance/payments/${id}/correct/`, correctionData, {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCsrfToken(),
    });
  },

  async reversePayment(id: number, reason: string): Promise<Payment> {
    return apiClient.post(
      `/api/finance/payments/${id}/reverse/`,
      { reason },
      {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
      }
    );
  },

  // ==================== FINES ====================
  async getAllFines(filters?: {
    status?: string;
    fine_type?: string;
    vehicle_id?: number;
    page?: number;
  }): Promise<FineListResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.fine_type) params.append('fine_type', filters.fine_type);
    if (filters?.vehicle_id) params.append('vehicle_id', filters.vehicle_id.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    return apiClient.get(`/api/finance/fines/?${params.toString()}`);
  },

  async getFineById(id: number): Promise<Fine> {
    return apiClient.get(`/api/finance/fines/${id}/`);
  },

  async createFine(data: Partial<Fine>): Promise<Fine> {
    return apiClient.post('/api/finance/fines/', data, {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCsrfToken(),
    });
  },

  async updateFineStatus(id: number, status: Fine['status']): Promise<Fine> {
    return apiClient.patch(
      `/api/finance/fines/${id}/`,
      { status },
      {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
      }
    );
  },

  async confiscateVehicle(id: number, reason: string): Promise<Fine> {
    return apiClient.post(
      `/api/finance/fines/${id}/confiscate/`,
      { reason },
      {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
      }
    );
  },

  // ==================== RECEIPTS ====================
  async getAllReceipts(filters?: { page?: number }): Promise<{ results: Receipt[]; count: number }> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());

    return apiClient.get(`/api/finance/receipts/?${params.toString()}`);
  },

  async getReceiptById(id: number): Promise<Receipt> {
    return apiClient.get(`/api/finance/receipts/${id}/`);
  },

  async generateReceipt(paymentId: number): Promise<Receipt> {
    return apiClient.post(
      `/api/finance/receipts/`,
      { payment_id: paymentId },
      {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
      }
    );
  },

  async checkReceiptStatus(taskId: string): Promise<{ status: string; result?: string; error?: string }> {
    return apiClient.get(`/api/finance/celery-tasks/${taskId}/`);
  },

  async downloadReceiptPDF(receiptId: number): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/receipts/${receiptId}/download/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to download receipt');
    return response.blob();
  },

  // ==================== VERIFICATION ====================
  async verifyVehicle(queryType: 'QR_CODE' | 'STICKER_CODE', queryValue: string): Promise<any> {
    const payload: any = {
      verification_method: queryType === 'QR_CODE' ? 'QR' : 'STICKER',
    };

    if (queryType === 'QR_CODE') {
      payload.qr_data = queryValue;
    } else {
      payload.sticker_code = queryValue;
    }

    return apiClient.post(
      '/api/finance/verify-vehicle/',
      payload,
      {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
      }
    );
  },

  // ==================== FINANCIAL STATS ====================
  async getFinancialStats(period?: 'week' | 'month' | 'year'): Promise<FinancialStats> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);

    return apiClient.get(`/api/finance/stats/?${params.toString()}`);
  },

  async getPaymentMethodStats(): Promise<Record<string, number>> {
    return apiClient.get('/api/finance/payment-methods-stats/');
  },

  async getFineTypeStats(): Promise<Record<string, number>> {
    return apiClient.get('/api/finance/fine-types-stats/');
  },
};

// Helper function to get CSRF token
function getCsrfToken(): string {
  const name = 'csrftoken';
  let cookieValue = '';
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
