export class CouponDetails {
    public id:number;
    public companyID:number;
    public category:string;
    public title:string;
    public description:string;
    public startDate:string;
    public endDate:string;
    public amount:number;
    public price:number;
    public image:string;

    constructor(id:number,companyID:number,category:string,title:string,description:string,startDate:string,endDate:string,amount:number,price:number,image:string){
        this.id = id;
        this.companyID = companyID;
        this.category = category;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.amount = amount;
        this.price = price;
        this.image = image;
    }
}