import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Company, Customer, Coupon } from '../types';

interface AdminState {
  companies: Company[];
  customers: Customer[];
  coupons: Coupon[];
}

const initialState: AdminState = {
  companies: [],
  customers: [],
  coupons: [],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // ── Companies ────────────────────────────────────────────

    setCompanies(state, action: PayloadAction<Company[]>) {
      state.companies = action.payload;
    },

    addCompany(state, action: PayloadAction<Company>) {
      state.companies.push(action.payload);
    },

    /**
     * BUG FIX: Old reducer used filter + push, which moved the item to the
     * end of the array and broke visual ordering. Now uses .map() to replace
     * the company in-place.
     */
    updateCompany(state, action: PayloadAction<Company>) {
      const idx = state.companies.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.companies[idx] = action.payload;
      }
    },

    deleteCompany(state, action: PayloadAction<number>) {
      state.companies = state.companies.filter(c => c.id !== action.payload);
    },

    // ── Customers ────────────────────────────────────────────

    setCustomers(state, action: PayloadAction<Customer[]>) {
      state.customers = action.payload;
    },

    addCustomer(state, action: PayloadAction<Customer>) {
      state.customers.push(action.payload);
    },

    /**
     * BUG FIX: Same filter + push pattern as updateCompany. Now uses .map().
     */
    updateCustomer(state, action: PayloadAction<Customer>) {
      const idx = state.customers.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.customers[idx] = action.payload;
      }
    },

    deleteCustomer(state, action: PayloadAction<number>) {
      state.customers = state.customers.filter(c => c.id !== action.payload);
    },

    // ── Coupons ──────────────────────────────────────────────

    setCoupons(state, action: PayloadAction<Coupon[]>) {
      state.coupons = action.payload;
    },

    deleteCoupon(state, action: PayloadAction<number>) {
      state.coupons = state.coupons.filter(c => c.id !== action.payload);
    },

    // ── Reset ────────────────────────────────────────────────

    resetAdmin() {
      return initialState;
    },
  },
});

export const {
  setCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  setCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setCoupons,
  deleteCoupon,
  resetAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;
