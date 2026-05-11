import client from './client';
import type { Customer, Coupon } from '../types';

export const customerService = {
  purchaseCoupon(couponId: number): Promise<void> {
    return client
      .post(`/customer/coupons/${couponId}/purchase`)
      .then(() => undefined);
  },

  getMyCoupons(): Promise<Coupon[]> {
    return client.get<Coupon[]>('/customer/coupons').then((r) => r.data);
  },

  getCouponsByCategory(category: string): Promise<Coupon[]> {
    return client
      .get<Coupon[]>(`/customer/coupons/category/${encodeURIComponent(category)}`)
      .then((r) => r.data);
  },

  getCouponsByMaxPrice(price: number): Promise<Coupon[]> {
    return client
      .get<Coupon[]>(`/customer/coupons/max-price/${price}`)
      .then((r) => r.data);
  },

  getProfile(): Promise<Customer> {
    return client.get<Customer>('/customer/profile').then((r) => r.data);
  },

  getAvailableCoupons(): Promise<Coupon[]> {
    return client.get<Coupon[]>('/customer/available-coupons').then((r) => r.data);
  },
};
