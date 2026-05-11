import client from './client';
import type { Company, Coupon } from '../types';

export const companyService = {
  getCoupons(): Promise<Coupon[]> {
    return client.get<Coupon[]>('/company/coupons').then((r) => r.data);
  },

  addCoupon(coupon: Omit<Coupon, 'id'>): Promise<void> {
    return client.post('/company/coupons', coupon).then(() => undefined);
  },

  updateCoupon(id: number, coupon: Coupon): Promise<void> {
    return client.put(`/company/coupons/${id}`, coupon).then(() => undefined);
  },

  deleteCoupon(id: number): Promise<void> {
    return client.delete(`/company/coupons/${id}`).then(() => undefined);
  },

  getCouponsByCategory(category: string): Promise<Coupon[]> {
    return client
      .get<Coupon[]>(`/company/coupons/category/${encodeURIComponent(category)}`)
      .then((r) => r.data);
  },

  getCouponsByMaxPrice(price: number): Promise<Coupon[]> {
    return client
      .get<Coupon[]>(`/company/coupons/max-price/${price}`)
      .then((r) => r.data);
  },

  getProfile(): Promise<Company> {
    return client.get<Company>('/company/profile').then((r) => r.data);
  },
};
