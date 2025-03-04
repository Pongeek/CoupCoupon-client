import { CouponDetails } from "./CouponDetails";

export class CompanyDetails{
    public id:number;
    public name:string;
    public email:string;
    public password:string;
    public coupons:CouponDetails[] | undefined;

    constructor(id:number, name:string, email:string, password:string, coupons:CouponDetails[] | undefined){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.coupons = coupons;
    }
}