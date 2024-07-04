import { CouponDetails } from "../Model/CouponDetails";

export class CouponsState{
    coupons: CouponDetails[] = [];
}

export enum CouponsActionType{
    getAllCoupons = "getAllCoupons",
}

export interface CouponsAction{
    type: CouponsActionType;
    payload?: any;
}

export function getAllCouponsAction(coupons: CouponDetails[]): CouponsAction{
    return {type: CouponsActionType.getAllCoupons, payload: coupons};
}

export function CouponsReducer(currentState: CouponsState = new CouponsState(), action: CouponsAction): CouponsState{
    const newState = {...currentState};
    switch(action.type){
        case CouponsActionType.getAllCoupons:
            newState.coupons = [...newState.coupons, ...action.payload];
            break;
    }
    return newState;
}