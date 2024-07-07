import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCompaniesAction, getCouponsAction, getCustomersAction } from "../../../Redux/AdminReducer";
import { checkData } from "../../../Util/checkData";
import "./AdminMenu.css";
import { store } from "../../../Redux/store";
import axios from "axios";
import axiosJWT from "../../../Util/AxiosJWT";
import { getAllCouponsAction } from "../../../Redux/CouponReducer";

/**
 * AdminMenu component that serves as the main dashboard for the admin.
 * It fetches and displays data related to customers, companies, and coupons.
 * @returns {JSX.Element} The rendered AdminMenu component.
 */
export function AdminMenu(): JSX.Element {

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        // Check initial data
        checkData();

        // Fetch all customers
        axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCustomers")
            .then((response) => {
                store.dispatch(getCustomersAction(response.data));
            })
            .catch((error) => {
                console.error("Error getting all customers:", error);
            });

        // Fetch all coupons
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

        // Fetch all companies
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
            <h1>Admin Page</h1>
            <p>
                Welcome to the Admin Dashboard. As an admin, you have the ability to manage the entire platform.
                Here are some of the actions you can perform:
            </p>
            <ul>
                <li>Manage customers: Add, update, and delete customer information.</li>
                <li>Manage companies: Add, update, and delete company information.</li>
                <li>Manage coupons: Create, update, and delete coupons.</li>
                <li>View all customers, companies, and coupons.</li>
                <li>Ensure the smooth operation of the platform.</li>
            </ul>
            <p>
                Use the navigation menu to access different sections and perform the necessary actions.
                <br />Clicking on the CoupCoupon Logo will take you to the admin home page.
                <br />Thank you for keeping the platform running smoothly!
            </p>
        </div>
    );
}