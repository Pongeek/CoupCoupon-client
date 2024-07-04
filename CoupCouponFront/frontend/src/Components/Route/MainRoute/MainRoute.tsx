import { Route, Routes } from "react-router-dom";
import "./MainRoute.css";
import { Home } from "../../Pages/Home/Home";
import { Page404 } from "../../Pages/Page404/Page404";
import { LoginPage } from "../../Pages/LoginPage/LoginPage";
import { RegisterPage } from "../../Pages/RegisterPage/RegisterPage";
import { Main } from "../../Layout/Main/Main";
import { AdminMenu } from "../../Pages/Admin/AdminMenu/AdminMenu";
import { CustomerMenu } from "../../Pages/Customer/CustomerMenu/CustomerMenu";
import { ThankYouPage } from "../../Pages/Customer/ThankYouPage/ThankYouPage";
import { GetAllCustomers } from "../../Pages/Admin/GetAllCustomers/GetAllCustomers";
import { GetAllCompanies } from "../../Pages/Admin/GetAllCompanies/GetAllCompanies";
import { GetAllCoupons } from "../../Pages/Admin/GetAllCoupons/GetAllCoupons";
import { CompanyMenu } from "../../Pages/Company/CompanyMenu/CompanyMenu";

export function MainRoute(): JSX.Element {
    return (
        <div className="MainRoute">
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/home" element={<Home/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/adminMenu/:id" element={<AdminMenu/>} />
                <Route path="/companyMenu/:id" element={<CompanyMenu/>} />
                <Route path="/customerMenu/:id" element={<CustomerMenu/>} />
                <Route path="/thankYouPage/:name" element={<ThankYouPage/>} />
                <Route path="/adminMenu/:id/customers" element={<GetAllCustomers/>} />
                <Route path="/adminMenu/:id/companies" element={<GetAllCompanies/>} />
                <Route path="/adminMenu/:id/coupons" element={<GetAllCoupons/>} />
                <Route path="*" element={<Page404/>}/>
            </Routes>
        </div>
    );
}
