import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCompaniesAction, getCouponsAction, getCustomersAction } from "../../../Redux/AdminReducer";
import { checkData } from "../../../Util/checkData";
import "./AdminMenu.css";
import { store } from "../../../Redux/store";
import axiosJWT from "../../../Util/AxiosJWT";
import { getAllCouponsAction } from "../../../Redux/CouponReducer";

/**
 * AdminMenu component that serves as the main dashboard for the admin.
 * It fetches and displays data related to customers, companies, and coupons.
 * @returns {JSX.Element} The rendered AdminMenu component.
 */
export function AdminMenu(): JSX.Element {
    // State for storing dashboard statistics
    const [stats, setStats] = useState({
        customers: 0,
        companies: 0,
        coupons: 0
    });

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        // Check initial data
        checkData();

        // Fetch all customers
        axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCustomers")
            .then((response) => {
                store.dispatch(getCustomersAction(response.data));
                setStats(prev => ({ ...prev, customers: response.data.length }));
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
                setStats(prev => ({ ...prev, coupons: coupons.length }));
            })
            .catch((error) => {
                console.error("Error getting all coupons:", error);
            });

        // Fetch all companies
        axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCompanies")
            .then((response) => {
                store.dispatch(getCompaniesAction(response.data));
                setStats(prev => ({ ...prev, companies: response.data.length }));
            })
            .catch((error) => {
                console.error("Error getting all companies:", error);
            });

    }, []);

    return (
        <div className="AdminMenu">
            <div className="admin-header">
                <h1>Welcome to Admin Dashboard</h1>
                <p className="admin-subtitle">Manage your entire platform in one place</p>
            </div>
            
            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-icon customers-icon">👥</div>
                    <div className="stat-content">
                        <h3>{stats.customers}</h3>
                        <p>Customers</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon companies-icon">🏢</div>
                    <div className="stat-content">
                        <h3>{stats.companies}</h3>
                        <p>Companies</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon coupons-icon">🎟️</div>
                    <div className="stat-content">
                        <h3>{stats.coupons}</h3>
                        <p>Coupons</p>
                    </div>
                </div>
            </div>
            
            <div className="admin-features">
                <div className="feature-card">
                    <div className="feature-icon">👤</div>
                    <h3>Customer Management</h3>
                    <p>Add, update, or remove customer profiles. Monitor customer activity and coupon purchases.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">🏢</div>
                    <h3>Company Management</h3>
                    <p>Register new companies, update existing profiles, and manage company access rights.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">🎟️</div>
                    <h3>Coupon Management</h3>
                    <p>Review and moderate all coupons across the platform. Remove expired or inappropriate offers.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Analytics Dashboard</h3>
                    <p>Track platform performance, user engagement, and coupon conversion rates in real-time.</p>
                </div>
            </div>
            
            <div className="quick-tips">
                <h3>Admin Quick Tips</h3>
                <p>
                    🔹 Use the navigation menu to access different sections<br/>
                    🔹 Click the CoupCoupon logo to return to this dashboard<br/>
                    🔹 Regular system maintenance improves performance
                </p>
            </div>
        </div>
    );
}