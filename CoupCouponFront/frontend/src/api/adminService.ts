import client from './client';
import type { Company, Customer, Coupon, Page } from '../types';

export const adminService = {
  // ── Companies ───────────────────────────────────────────────

  getCompanies(page?: number, size?: number): Promise<Page<Company>> {
    return client
      .get<Page<Company>>('/admin/companies', { params: { page, size } })
      .then((r) => r.data);
  },

  getCompany(id: number): Promise<Company> {
    return client.get<Company>(`/admin/companies/${id}`).then((r) => r.data);
  },

  addCompany(company: Omit<Company, 'id' | 'coupons'>): Promise<void> {
    return client.post('/admin/companies', company).then(() => undefined);
  },

  updateCompany(id: number, company: Company): Promise<void> {
    return client.put(`/admin/companies/${id}`, company).then(() => undefined);
  },

  deleteCompany(id: number): Promise<void> {
    return client.delete(`/admin/companies/${id}`).then(() => undefined);
  },

  // ── Customers ───────────────────────────────────────────────

  getCustomers(page?: number, size?: number): Promise<Page<Customer>> {
    return client
      .get<Page<Customer>>('/admin/customers', { params: { page, size } })
      .then((r) => r.data);
  },

  getCustomer(id: number): Promise<Customer> {
    return client.get<Customer>(`/admin/customers/${id}`).then((r) => r.data);
  },

  addCustomer(customer: Omit<Customer, 'id' | 'coupons'>): Promise<void> {
    return client.post('/admin/customers', customer).then(() => undefined);
  },

  updateCustomer(id: number, customer: Customer): Promise<void> {
    return client.put(`/admin/customers/${id}`, customer).then(() => undefined);
  },

  deleteCustomer(id: number): Promise<void> {
    return client.delete(`/admin/customers/${id}`).then(() => undefined);
  },

  // ── Coupons ─────────────────────────────────────────────────

  getCoupons(): Promise<Coupon[]> {
    return client.get<Coupon[]>('/admin/coupons').then((r) => r.data);
  },

  deleteCoupon(id: number): Promise<void> {
    return client.delete(`/admin/coupons/${id}`).then(() => undefined);
  },
};
