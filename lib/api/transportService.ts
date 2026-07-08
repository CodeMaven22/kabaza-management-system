import { apiClient } from './client';

export type PersonRole = 'vehicle_owner' | 'driver';

export interface Person {
  id: number;
  full_name: string;
  email?: string;
  phone_number: string;
  national_id?: string;
  address?: string;
  photo?: string;
  role: PersonRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonCreatePayload {
  full_name: string;
  email?: string;
  phone_number: string;
  national_id?: string;
  address?: string;
  role: PersonRole;
}

// Legacy interfaces for backwards compatibility
export type Owner = Person;
export type Operator = Person;

export interface Vehicle {
  id: number;
  registration_number: string;
  sticker_code: string;
  owner: Owner;
  operator: Operator;
  vehicle_type: string;
  model: string;
  year: number;
  color: string;
  engine_number: string;
  chassis_number: string;
  status: 'active' | 'inactive' | 'suspended';
  qr_code?: string;
  qr_code_task_id?: string;
  pdf_certificate?: string;
  pdf_task_id?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Vehicle[];
}

export interface CreateVehicleRequest {
  vehicle_type: string;
  color: string;
  owner: number;
  operator: number;
  registration_number?: string;
  model?: string;
  year?: number;
  engine_number?: string;
  chassis_number?: string;
}

export interface CreateOwnerRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  national_id: string;
  address: string;
}

export interface CreateOperatorRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  national_id: string;
  license_number: string;
  license_expiry: string;
}

class TransportService {
  // VEHICLES
  async listVehicles(params?: { status?: string; search?: string; page?: number }) {
    return apiClient.get<VehicleListResponse>('/transport/vehicle/', { params });
  }

  async getVehicle(id: number) {
    return apiClient.get<Vehicle>(`/transport/vehicle/${id}/`);
  }

  async createVehicle(data: CreateVehicleRequest) {
    return apiClient.post<Vehicle>('/transport/vehicle/', data);
  }

  async updateVehicle(id: number, data: Partial<Vehicle>) {
    return apiClient.put<Vehicle>(`/transport/vehicle/${id}/`, data);
  }

  async deleteVehicle(id: number) {
    return apiClient.delete(`/transport/vehicle/${id}/`);
  }

  async searchVehicles(query: string) {
    return apiClient.get<VehicleListResponse>('/transport/vehicle/search/', {
      params: { q: query },
    });
  }

  // OWNERS
  async listOwners(params?: { page?: number }) {
    return apiClient.get<{ count: number; results: Owner[] }>('/transport/owners/', { params });
  }

  async getOwner(id: number) {
    return apiClient.get<Owner>(`/transport/owners/${id}/`);
  }

  async createOwner(data: CreateOwnerRequest) {
    return apiClient.post<Owner>('/transport/owners/', data);
  }

  async updateOwner(id: number, data: Partial<Owner>) {
    return apiClient.put<Owner>(`/transport/owners/${id}/`, data);
  }

  async deleteOwner(id: number) {
    return apiClient.delete(`/transport/owners/${id}/`);
  }

  // UNIFIED PERSON MANAGEMENT (Owners + Operators)
  async listPersons(params?: { role?: PersonRole; page?: number; search?: string }) {
    return apiClient.get<{ count: number; results: Person[] }>('/transport/persons/', { params });
  }

  async getPerson(id: number) {
    return apiClient.get<Person>(`/transport/persons/${id}/`);
  }

  async createPerson(data: PersonCreatePayload) {
    return apiClient.post<Person>('/transport/persons/', data);
  }

  async updatePerson(id: number, data: Partial<PersonCreatePayload>) {
    return apiClient.put<Person>(`/transport/persons/${id}/`, data);
  }

  async deletePerson(id: number) {
    return apiClient.delete(`/transport/persons/${id}/`);
  }

  // OPERATORS (Legacy - redirects to unified endpoint)
  async listOperators(params?: { page?: number }) {
    return apiClient.get<{ count: number; results: Operator[] }>('/transport/operators/', {
      params,
    });
  }

  async getOperator(id: number) {
    return apiClient.get<Operator>(`/transport/operators/${id}/`);
  }

  async createOperator(data: CreateOperatorRequest) {
    return apiClient.post<Operator>('/transport/operators/', data);
  }

  async updateOperator(id: number, data: Partial<Operator>) {
    return apiClient.put<Operator>(`/transport/operators/${id}/`, data);
  }

  async deleteOperator(id: number) {
    return apiClient.delete(`/transport/operators/${id}/`);
  }

  // QR CODE & PDF GENERATION
  async generateQRCode(vehicleId: number) {
    return apiClient.post<{ task_id: string; message: string }>(
      `/transport/vehicle/${vehicleId}/generate-qr/`,
      {}
    );
  }

  async generatePDF(vehicleId: number) {
    return apiClient.post<{ task_id: string; message: string }>(
      `/transport/vehicle/${vehicleId}/generate-pdf/`,
      {}
    );
  }

  async getTaskStatus(taskId: string) {
    return apiClient.get<{ status: string; result?: any; error?: string }>(
      `/transport/task-status/${taskId}/`
    );
  }

  async downloadPDF(vehicleId: number) {
    return apiClient.get(`/transport/download-pdf/${vehicleId}/`, {
      responseType: 'blob',
    });
  }

  async printSticker(vehicleId: number) {
    return apiClient.post(`/transport/print-sticker/${vehicleId}/`, {});
  }
}

export const transportService = new TransportService();
