import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Coupon, Customer } from '../types';

interface CustomerState {
  profile: Customer | null;
  /** Coupons the customer has already purchased */
  myCoupons: Coupon[];
  /** Coupons available for the customer to browse / purchase */
  availableCoupons: Coupon[];
}

const initialState: CustomerState = {
  profile: null,
  myCoupons: [],
  availableCoupons: [],
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerProfile(state, action: PayloadAction<Customer>) {
      state.profile = action.payload;
    },

    /**
     * BUG FIX: Old reducer did `[...newState.coupons, action.payload]` which
     * appended the available coupons array into customerCoupons(!).
     * Now properly REPLACES the myCoupons array.
     */
    setMyCoupons(state, action: PayloadAction<Coupon[]>) {
      state.myCoupons = action.payload;
    },

    /**
     * BUG FIX: Old reducer did `[...newState.coupons, action.payload]` which
     * appended to existing coupons. Now REPLACES entirely.
     */
    setAvailableCoupons(state, action: PayloadAction<Coupon[]>) {
      state.availableCoupons = action.payload;
    },

    /**
     * After purchasing, move the coupon from availableCoupons to myCoupons.
     */
    purchaseCoupon(state, action: PayloadAction<number>) {
      const couponId = action.payload;
      const coupon = state.availableCoupons.find(c => c.id === couponId);
      if (coupon) {
        state.myCoupons.push(coupon);
        // Decrement amount in available coupons or remove if 0
        const idx = state.availableCoupons.findIndex(c => c.id === couponId);
        if (idx !== -1) {
          const updated = { ...state.availableCoupons[idx] };
          updated.amount = Math.max(0, updated.amount - 1);
          if (updated.amount === 0) {
            state.availableCoupons.splice(idx, 1);
          } else {
            state.availableCoupons[idx] = updated;
          }
        }
      }
    },

    /**
     * BUG FIX: Old reducer appended filtered results. Now REPLACES.
     */
    setMyCouponsByCategory(state, action: PayloadAction<Coupon[]>) {
      state.myCoupons = action.payload;
    },

    /**
     * BUG FIX: Old reducer appended filtered results. Now REPLACES.
     */
    setMyCouponsByMaxPrice(state, action: PayloadAction<Coupon[]>) {
      state.myCoupons = action.payload;
    },

    resetCustomer() {
      return initialState;
    },
  },
});

export const {
  setCustomerProfile,
  setMyCoupons,
  setAvailableCoupons,
  purchaseCoupon,
  setMyCouponsByCategory,
  setMyCouponsByMaxPrice,
  resetCustomer,
} = customerSlice.actions;

export default customerSlice.reducer;
