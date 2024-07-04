import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCompaniesAction, getCouponsAction, getCustomersAction } from "../../../Redux/AdminReducer";
import { checkData } from "../../../Util/checkData";
import "./AdminMenu.css";
import { store } from "../../../Redux/store";
import axios from "axios";
import axiosJWT from "../../../Util/AxiosJWT";
import { getAllCouponsAction } from "../../../Redux/CouponReducer";

export function AdminMenu(): JSX.Element {

    useEffect(() => {
        checkData();
        axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCustomers")
        .then((response) => {
            store.dispatch(getCustomersAction(response.data));
        })
        .catch((error) => {
            console.error("Error getting all customers:", error);
        });

        axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCoupons")
        .then((response) => {
            const coupons = response.data.map((coupon: any) => ({
                ...coupon,
                startDate: coupon.startDate,
                endDate: coupon.endDate,
            }));
            store.dispatch(getCouponsAction(coupons));
        })
        .catch((error) => {
            console.error("Error getting all coupons:", error);
        });

        axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCompanies")
        .then((response) => {
            store.dispatch(getCompaniesAction(response.data));
        })
        .catch((error) => {
            console.error("Error getting all companies:", error);
        });


    }, []);
    



    return (
        <div className="AdminMenu">

        </div>
    );
}
