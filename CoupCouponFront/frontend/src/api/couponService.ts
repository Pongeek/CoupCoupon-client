import client from './client';
import type { Coupon, Page } from '../types';

export interface CouponSearchParams {
  search?: string;
  category?: string;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export const couponService = {
  searchCoupons(params: CouponSearchParams): Promise<Page<Coupon>> {
    return client
      .get<Page<Coupon>>('/public/coupons', { params })
      .then((r) => r.data);
  },
};
