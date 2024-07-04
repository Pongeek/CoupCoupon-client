import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AuthReducer, rehydrateAuthState } from "./AuthReducer";
import { AdminReducer } from "./AdminReducer";
import { CompanyReducer } from "./CompanyReducer";
import { CustomerReducer } from "./CustomerReducer";
import { CouponsReducer } from "./CouponReducer";



const reducers = combineReducers({auth:AuthReducer,
    admin:AdminReducer,
    company:CompanyReducer,
    customer:CustomerReducer,
    coupons:CouponsReducer});

//combine all reducer to one single and happy store
export const store = configureStore({
    reducer: reducers,
    middleware: (getDefualtMiddleWare)=> getDefualtMiddleWare({serializableCheck:false})
});

store.dispatch(rehydrateAuthState()); // Rehydrate auth state on store initialization




