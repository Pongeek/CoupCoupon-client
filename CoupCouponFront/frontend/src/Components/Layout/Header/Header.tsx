import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./Header.css";
import { store } from "../../Redux/store";
import { useState, useEffect } from "react";
import { logoutAction } from "../../Redux/AuthReducer";
import BlueLogo from "../../assests/BlueLogo.png";
import { checkData } from "../../Util/checkData";
import { getCompaniesAction, getCouponsAction, getCustomersAction } from "../../Redux/AdminReducer";
import { getCustomerCouponsAction } from "../../Redux/CustomerReducer";
import { resetStoreAction } from "../../Redux/ResetStore";

/**
 * Header component that displays the navigation bar and handles user authentication.
 * @returns {JSX.Element} The rendered Header component.
 */
export function Header(): JSX.Element {
    // State to track if the user is logged in and the user type
    const [isLogged, setLogged] = useState(store.getState().auth.isLoggedIn);
    const [userType, setUserType] = useState(store.getState().auth.userType);

    // Subscribe to store updates to track authentication state and user type
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setLogged(store.getState().auth.isLoggedIn);
            setUserType(store.getState().auth.userType);
        });
        return () => unsubscribe();
    }, []);

    const navigate = useNavigate();

    // Effect to check data or navigate to home based on login status
    useEffect(() => {
        if (isLogged) {
            checkData();
        } else {
            navigate("/");
        }
    }, [isLogged, navigate]);

    // Handle authentication button click (login/logout)
    const handleAuthButtonClick = () => {
        if (isLogged) {
            sessionStorage.removeItem("jwt");
            store.dispatch(logoutAction());
            store.dispatch(resetStoreAction()); // Dispatch the reset action
            setLogged(false);
            navigate("/login");
        } else {
            navigate("/login");
        }
    };

    // Handle logo click to navigate to the appropriate menu based on user type
    const handleLogoClick = () => {
        switch (userType) {
            case "ADMIN":
                navigate(`/adminMenu/${store.getState().auth.id}`);
                window.location.reload();
                break;
            case "COMPANY":
                navigate(`/companyMenu/${store.getState().auth.id}`);
                window.location.reload();
                break;
            case "CUSTOMER":
                navigate(`/customerMenu/${store.getState().auth.id}`);
                window.location.reload();
                break;
        }
    };

    // Render the navigation menu based on user type
    const renderMenu = () => {
        let menuItems: any[];
        switch (userType) {
            case "ADMIN":
                menuItems = [
                    { name: "Customers", path: `/adminMenu/${store.getState().auth.id}/customers` },
                    { name: "Companies", path: `/adminMenu/${store.getState().auth.id}/companies` },
                    { name: "Coupons", path: `/adminMenu/${store.getState().auth.id}/coupons` },
                ];
                break;
            case "COMPANY":
                menuItems = [];
                break;
            case "CUSTOMER":
                menuItems = [
                    { name: "Home", path: `/customerMenu/${store.getState().auth.id}` },
                    { name: "MyCoupons", path: `/customerMenu/${store.getState().auth.id}/coupons` },
                ];
                break;
            default:
                menuItems = [];
        }

        return (
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    };

    return (
        <div className="Header">
            <img src={BlueLogo} alt="CoupCoupon Logo" className="LogoHeader" onClick={handleLogoClick} />
            {isLogged && <div className="Menu">{renderMenu()}</div>}
            <div className="auth-buttons">
                <div className="AuthButton">
                    <button type="button" onClick={handleAuthButtonClick} style={{ color: isLogged ? "red" : "blue" }}>
                        {isLogged ? "Logout" : "Login"}
                    </button>
                </div>
                {!isLogged && (
                    <div className="Register">
                        <button type="button" onClick={() => navigate("/register")}>
                            Register
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}