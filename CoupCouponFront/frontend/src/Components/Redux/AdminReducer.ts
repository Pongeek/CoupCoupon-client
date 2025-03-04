import { CompanyDetails } from "../Model/CompanyDetails";
import { CouponDetails } from "../Model/CouponDetails";
import { CustomerDetails } from "../Model/CustomerDetails";

export class CustomerAndCompanyState{
    public customers : CustomerDetails[] = [];
    public companies : CompanyDetails[] = [];
    public coupons : CouponDetails[] = [];
}


export enum AdminActionType{
    getCustomers = "GetAllCustomers",
    getCompanies = "GetAllCompanies",
    getCoupons = "GetAllCoupons",
    getCompany = "GetCompany",
    getCustomer = "GetCustomer",
    addCustomer = "AddCustomer",
    addCompany = "AddCompany",
    updateCustomer = "UpdateCustomer",
    updateCompany = "UpdateCompany",
    deleteCustomer = "DeleteCustomer",
    deleteCompany = "DeleteCompany",
    deleteCoupon = "DeleteCoupon"
}

export interface AdminAction{
    type: AdminActionType;
    payload: any;
}

export function addCustomerAction(newCustomer:CustomerDetails):AdminAction{
    return {type: AdminActionType.addCustomer, payload: newCustomer};
}

export function addCompanyAction(newCompany:CompanyDetails):AdminAction{
    return {type: AdminActionType.addCompany, payload: newCompany};
}

export function updateCustomerAction(updatedCustomer:CustomerDetails,id:number):AdminAction{
    return {type: AdminActionType.updateCustomer, payload: {updatedCustomer,id}};
}

export function updateCompanyAction(updatedCompany:CompanyDetails,id:number):AdminAction{
    return {type: AdminActionType.updateCompany, payload: {updatedCompany,id}};
}

export function deleteCustomerAction(id:number):AdminAction{
    return {type: AdminActionType.deleteCustomer, payload: id};
}

export function deleteCompanyAction(id:number):AdminAction{
    return {type: AdminActionType.deleteCompany, payload: id};
}

export function getCustomersAction(customers: CustomerDetails[]):AdminAction{
    return {type: AdminActionType.getCustomers, payload: customers};
}

export function getCompaniesAction(companies: CompanyDetails[]):AdminAction{
    return {type: AdminActionType.getCompanies, payload: companies};
}

export function getCouponsAction(coupons: CouponDetails[]):AdminAction{
    return {type: AdminActionType.getCoupons, payload: coupons};
}

export function getOneCustomerAction(customer: CustomerDetails): AdminAction {
    return { type: AdminActionType.getCustomer, payload: customer };
}

export function getOneCompanyAction(company: CompanyDetails): AdminAction {
    return { type: AdminActionType.getCompany, payload: company }
}

export function deleteCouponAction(id:number):AdminAction{
    return {type: AdminActionType.deleteCoupon, payload: id};
}




export function AdminReducer(currentState: CustomerAndCompanyState = new CustomerAndCompanyState(),action: AdminAction): CustomerAndCompanyState {
    const newState = {...currentState};

    switch(action.type){
        case AdminActionType.addCompany:
            newState.companies = [...newState.companies, action.payload];
            break;

        case AdminActionType.addCustomer:
            newState.customers = [...newState.customers, action.payload];
            break;

        case AdminActionType.updateCompany:
            newState.companies = [...newState.companies].filter(company => company.id !== action.payload.id);
            newState.companies = [...newState.companies, action.payload];
            break;

        case AdminActionType.updateCustomer:
            newState.customers = [...newState.customers].filter(customer => customer.id !== action.payload.id);
            newState.customers = [...newState.customers, action.payload];
            break;

        case AdminActionType.getCompanies:
            newState.companies = action.payload;
            break;

        case AdminActionType.getCustomers:
            newState.customers = action.payload;
            break;

        case AdminActionType.getCoupons:
            newState.coupons = action.payload;
            break;

        case AdminActionType.getCompany:
            newState.companies = [...newState.companies, action.payload];
            break;

        case AdminActionType.getCustomer:
            newState.customers = [...newState.customers, action.payload];
            break;

        case AdminActionType.deleteCompany:
            newState.companies = [...newState.companies].filter(company => company.id !== action.payload);
            break;

        case AdminActionType.deleteCustomer:
            newState.customers = [...newState.customers].filter(customer => customer.id !== action.payload);
            break;

        case AdminActionType.deleteCoupon:
            newState.coupons = [...newState.coupons].filter(coupon => coupon.id !== action.payload);
            break;
    }
    return newState;
}

