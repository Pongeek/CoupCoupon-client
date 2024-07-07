import { CompanyDetails } from "../Model/CompanyDetails";
import { CouponDetails } from "../Model/CouponDetails";
import { CustomerDetails } from "../Model/CustomerDetails";
import { RESET_STORE } from "./ResetStore";

export class CustomerAndCouponState{
    public customers : CustomerDetails[] = [];
    public coupons : CouponDetails[] = [];
}

export enum CustomerAndCouponsActionType{
    addCoupon = "AddCoupon",
    deleteCoupon = "DeleteCoupon",
    updateCoupon = "UpdateCoupon",
    getCompanyCoupons = "GetCompanyCoupons",
    getCompanyDetails = "GetCompanyDetails",
    getCouponsByCategory = "GetCouponsByCategory",
    getCouponsByMaxPrice = "GetCouponsByMaxPrice"
}

export interface CustomerAndCouponAction{
    type: CustomerAndCouponsActionType | typeof RESET_STORE;
    payload: any;
}

export function addCouponAction(coupon:CouponDetails):CustomerAndCouponAction{
    return {type: CustomerAndCouponsActionType.addCoupon, payload: coupon};
}

export function deleteCouponAction(id:number):CustomerAndCouponAction{
    return {type: CustomerAndCouponsActionType.deleteCoupon, payload: id};
}

export function updateCouponAction(coupon:CouponDetails, id:number):CustomerAndCouponAction{
    return {type: CustomerAndCouponsActionType.updateCoupon, payload: {coupon, id}};
}

export function getCompanyCouponsAction(coupons:CouponDetails[]):CustomerAndCouponAction{
    return {type: CustomerAndCouponsActionType.getCompanyCoupons, payload: coupons};
}

export function getCompanyDetailsAction(company:CompanyDetails):CustomerAndCouponAction{
    return {type: CustomerAndCouponsActionType.getCompanyDetails, payload: company};
}

export function getCouponsByCategoryAction(coupons:CouponDetails[]):CustomerAndCouponAction{
    return {type: CustomerAndCouponsActionType.getCouponsByCategory, payload: coupons};
}

export function getCouponsByMaxPriceAction(coupons:CouponDetails[]):CustomerAndCouponAction{
    return {type: CustomerAndCouponsActionType.getCouponsByMaxPrice, payload: coupons};
}

export function CompanyReducer(currentState: CustomerAndCouponState = new CustomerAndCouponState(), action: CustomerAndCouponAction): CustomerAndCouponState {
    const newState = {...currentState};
    switch (action.type) {
        case CustomerAndCouponsActionType.addCoupon:
            newState.coupons = [...newState.coupons, action.payload];
            break;

        case CustomerAndCouponsActionType.deleteCoupon:
            newState.coupons = newState.coupons.filter(coupon => coupon.id !== action.payload);
            break;

        case CustomerAndCouponsActionType.updateCoupon:
            newState.coupons = [...newState.coupons.filter(coupon => coupon.id !== action.payload.id), action.payload];
            newState.coupons = [...newState.coupons,action.payload];
            break;

        case CustomerAndCouponsActionType.getCompanyCoupons:
            newState.coupons = [...newState.coupons, ...action.payload];
            break;

        case CustomerAndCouponsActionType.getCompanyDetails:
            newState.customers = [...newState.customers, action.payload];
            break;

        case CustomerAndCouponsActionType.getCouponsByCategory:
            newState.coupons = [...newState.coupons, ...action.payload];
            break;

        case CustomerAndCouponsActionType.getCouponsByMaxPrice:
            newState.coupons = [...newState.coupons, ...action.payload];
            break;

        case RESET_STORE:
            return new CustomerAndCouponState();
    }
    return newState;
}