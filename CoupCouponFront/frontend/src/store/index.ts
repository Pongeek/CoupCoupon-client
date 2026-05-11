import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from './authSlice';
import adminReducer, { resetAdmin } from './adminSlice';
import companyReducer, { resetCompany } from './companySlice';
import customerReducer, { resetCustomer } from './customerSlice';
import couponReducer, { resetCoupons } from './couponSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    company: companyReducer,
    customer: customerReducer,
    coupons: couponReducer,
  },
});

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Reset the entire store to initial state (e.g., on logout).
 * Replaces the old RESET_STORE action constant pattern.
 */
export function resetStore() {
  store.dispatch(logout());
  store.dispatch(resetAdmin());
  store.dispatch(resetCompany());
  store.dispatch(resetCustomer());
  store.dispatch(resetCoupons());
}

// Re-export slice actions — named exports to avoid collisions
// (deleteCoupon exists in adminSlice + companySlice, setCoupons in adminSlice + couponSlice)
export { login, logout, updateToken } from './authSlice';

export {
  setCompanies, addCompany, updateCompany, deleteCompany,
  setCustomers, addCustomer, updateCustomer, deleteCustomer,
  setCoupons as setAdminCoupons,
  deleteCoupon as deleteAdminCoupon,
  resetAdmin,
} from './adminSlice';

export {
  setCompanyProfile, setCompanyCoupons,
  addCoupon, updateCoupon,
  deleteCoupon as deleteCompanyCoupon,
  setCouponsByCategory, setCouponsByMaxPrice,
  resetCompany,
} from './companySlice';

export {
  setCustomerProfile, setMyCoupons, setAvailableCoupons,
  purchaseCoupon, setMyCouponsByCategory, setMyCouponsByMaxPrice,
  resetCustomer,
} from './customerSlice';

export {
  setCoupons as setPublicCoupons,
  resetCoupons,
} from './couponSlice';
