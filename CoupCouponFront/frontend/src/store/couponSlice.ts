import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Coupon } from '../types';

interface CouponState {
  /** Public coupons (used on landing page / public browse) */
  coupons: Coupon[];
}

const initialState: CouponState = {
  coupons: [],
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    /**
     * BUG FIX: Old reducer did `[...newState.coupons, ...action.payload]`
     * which appended new results to existing ones, causing duplicates on
     * every fetch. Now REPLACES the array entirely.
     */
    setCoupons(state, action: PayloadAction<Coupon[]>) {
      state.coupons = action.payload;
    },

    resetCoupons() {
      return initialState;
    },
  },
});

export const { setCoupons, resetCoupons } = couponSlice.actions;
export default couponSlice.reducer;
