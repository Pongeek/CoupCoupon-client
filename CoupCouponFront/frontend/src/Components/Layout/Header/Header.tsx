import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./Header.css";
import { store } from "../../Redux/store";
import { useState, useEffect } from "react";
import { logoutAction } from "../../Redux/AuthReducer";
import BlueLogo from "../../assests/BlueLogo.png";
import { checkData } from "../../Util/checkData";


export function Header(): JSX.Element {
    const [isLogged, setLogged] = useState(store.getState().auth.isLoggedIn);
    const [userType, setUserType] = useState(store.getState().auth.userType);
    
    

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {

            setLogged(store.getState().auth.isLoggedIn);
            setUserType(store.getState().auth.userType);
            
        });
        return () => unsubscribe();
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        if(isLogged){
            checkData();
        }else{
            navigate("/");
            
        }
    }, [isLogged,navigate]);

    const handleAuthButtonClick = () => {
        console.log("isLogged in handleAuthButtonClick ", isLogged);
        if (isLogged) {
            sessionStorage.removeItem("jwt");
            store.dispatch(logoutAction());
            setLogged(false);
            navigate("/login");
        } else {
            navigate("/login");
        }
    };

    const handleLogoClick = () => {
        switch (userType) {
            case "ADMIN":
                navigate(`/adminMenu/${store.getState().auth.id}`);
                break;
            case "COMPANY":
                navigate(`/companyMenu/${store.getState().auth.id}`);
                break;
            case "CUSTOMER":
                navigate(`/customerMenu/${store.getState().auth.id}`);
                break;
        }
    }

    const renderMenu = () => {
        let menuItems: any[];
        switch (userType) {
            case "ADMIN":
                menuItems = [
                    { name: "Customers", path: `/adminMenu/${store.getState().auth.id}/customers` },
                    { name: "Companies", path: `/adminMenu/${store.getState().auth.id}/companies` },
                    { name: "Coupons", path: `/adminMenu/${store.getState().auth.id}/coupons` },
                ]
                break;
            case "COMPANY":
                menuItems = []
                break;
            case "CUSTOMER":
                menuItems = [
                    { name: "Home", path: "/customer/home" },
                    { name: "Orders", path: "/customer/orders" },
                    { name: "Profile", path: "/customer/profile" },
                    { name: "Coupons", path: "/customer/coupons" },
                ]
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
            <img src={BlueLogo} alt="CoupCoupon Logo" className="LogoHeader" onClick={handleLogoClick}/>
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


