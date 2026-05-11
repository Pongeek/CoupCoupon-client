import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Coupon, Company } from '../types';

interface CompanyState {
  profile: Company | null;
  coupons: Coupon[];
}

const initialState: CompanyState = {
  profile: null,
  coupons: [],
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanyProfile(state, action: PayloadAction<Company>) {
      state.profile = action.payload;
    },

    /**
     * REPLACE all company coupons (not append).
     */
    setCompanyCoupons(state, action: PayloadAction<Coupon[]>) {
      state.coupons = action.payload;
    },

    addCoupon(state, action: PayloadAction<Coupon>) {
      state.coupons.push(action.payload);
    },

    /**
     * BUG FIX: Old reducer had a double-add bug — it first filtered + pushed,
     * then pushed AGAIN on the next line. Now uses findIndex + replace.
     */
    updateCoupon(state, action: PayloadAction<Coupon>) {
      const idx = state.coupons.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.coupons[idx] = action.payload;
      }
    },

    deleteCoupon(state, action: PayloadAction<number>) {
      state.coupons = state.coupons.filter(c => c.id !== action.payload);
    },

    /**
     * BUG FIX: Old reducer APPENDED filtered results to existing coupons.
     * Now REPLACES the array entirely. The component should handle merging
     * if needed (it doesn't — it always wants the filtered view).
     */
    setCouponsByCategory(state, action: PayloadAction<Coupon[]>) {
      state.coupons = action.payload;
    },

    /**
     * BUG FIX: Same append bug as getCouponsByCategory. Now REPLACES.
     */
    setCouponsByMaxPrice(state, action: PayloadAction<Coupon[]>) {
      state.coupons = action.payload;
    },

    resetCompany() {
      return initialState;
    },
  },
});

export const {
  setCompanyProfile,
  setCompanyCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  setCouponsByCategory,
  setCouponsByMaxPrice,
  resetCompany,
} = companySlice.actions;

export default companySlice.reducer;
