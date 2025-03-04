import { CouponDetails } from "./CouponDetails";

export class CustomerDetails{
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public coupons: CouponDetails[] | undefined;

    constructor(id: number, firstName: string, lastName: string, email: string, password: string, coupons: CouponDetails[] | undefined){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.coupons = coupons;
    }
}
