import { apiClient } from './client';

export interface DashboardStats {
  total_revenue: number;
  total_vehicles: number;
  active_operators: number;
  pending_registrations: number;
  total_fines: number;
  collected_fines: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  collections: number;
}

export interface VehicleStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  by_type: { [key: string]: number };
}

export interface OperatorStats {
  total: number;
  active: number;
  inactive: number;
  suspension_count: number;
}

export interface FineStats {
  total_issued: number;
  total_amount: number;
  collected: number;
  outstanding: number;
  by_reason: { [key: string]: number };
}

export interface PaymentStats {
  total_payments: number;
  total_amount: number;
  by_payment_method: { [key: string]: number };
  by_status: { [key: string]: number };
}

export interface AnalyticsDashboard {
  period: string;
  stats: DashboardStats;
  revenue_trend: RevenueData[];
  vehicle_stats: VehicleStats;
  operator_stats: OperatorStats;
  fine_stats: FineStats;
  payment_stats: PaymentStats;
}

export interface TransportAnalytics {
  total_vehicles: number;
  active_vehicles: number;
  registration_pending: number;
  revenue_this_month: number;
  vehicles_registered_today: number;
}

export interface FinanceAnalytics {
  total_revenue: number;
  collected_today: number;
  outstanding_amount: number;
  total_fines: number;
  fine_collection_rate: number;
}

export interface SystemAnalytics {
  total_users: number;
  active_users: number;
  login_count_today: number;
  system_uptime: number;
  audit_logs_count: number;
}

class AnalyticsService {
  async getDashboard(startDate?: string, endDate?: string) {
    return apiClient.get<AnalyticsDashboard>('/analytics/dashboard/', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  }

  async getTransportAnalytics(period: string = 'month') {
    return apiClient.get<TransportAnalytics>('/analytics/transport/', {
      params: { period },
    });
  }

  async getFinanceAnalytics(period: string = 'month') {
    return apiClient.get<FinanceAnalytics>('/analytics/finance/', {
      params: { period },
    });
  }

  async getSystemAnalytics() {
    return apiClient.get<SystemAnalytics>('/analytics/system/');
  }

  async getRevenueChart(days: number = 30) {
    return apiClient.get<RevenueData[]>('/analytics/revenue-chart/', {
      params: { days },
    });
  }

  async getVehicleChart() {
    return apiClient.get<VehicleStats>('/analytics/vehicle-chart/');
  }

  async getFineChart() {
    return apiClient.get<FineStats>('/analytics/fine-chart/');
  }

  async getOperatorChart() {
    return apiClient.get<OperatorStats>('/analytics/operator-chart/');
  }

  async getUserActivityChart(days: number = 30) {
    return apiClient.get<{ date: string; count: number }[]>('/analytics/user-activity/', {
      params: { days },
    });
  }

  async exportDashboard(format: 'pdf' | 'csv' = 'pdf') {
    return apiClient.get(`/analytics/export/`, {
      params: { format },
      responseType: 'blob',
    });
  }
}

export const analyticsService = new AnalyticsService();
