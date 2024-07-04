import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import "./LoginPage.css";
import axiosJWT from "../../Util/AxiosJWT";
import { jwtDecode } from "jwt-decode";
import { loginAction, updateTokenAction } from "../../Redux/AuthReducer";
import { store } from "../../Redux/store";
import WhiteLogo from "../../assests/WhiteLogo.png";
import { useState } from "react";
import { getCustomerCouponsAction, getCustomerDetailsAction } from "../../Redux/CustomerReducer";




type userDetails = {
    email: string;
    password: string;
    userType: string;
}

type jwtData = { 
    "id": number,
    "userType": string,
    "name": string,
    "sub": string,
    "iat": number,
    "exp": number
}

export function LoginPage(): JSX.Element {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<userDetails>();
    const [invalidLogin, setInvalidLogin] = useState<String | null>(null);

    const makeLogin: SubmitHandler<userDetails> = (data) => {

        let LoginDetails = {
            email: data.email,
            password: data.password,
        }
        

        axiosJWT.post("http://localhost:8080/CoupCouponAPI/Login/Login", LoginDetails)
        .then((response) => {

            const JWT = response.headers["authorization"].split(" ")[1];
            const decode_jwt = jwtDecode<jwtData>(JWT);
            console.log(decode_jwt);
        
            let myAuth = {
                id: decode_jwt.id,
                email: decode_jwt.sub,
                userType: decode_jwt.userType,
                name: decode_jwt.name,
                token: JWT,
                isLoggedIn: true
            };

            console.log("User ID: " + myAuth.id);

            if(myAuth.userType === "ADMIN"){
                store.dispatch(loginAction(myAuth));
                navigate(`/adminMenu/${myAuth.id}`);
            }
            else if(myAuth.userType === "COMPANY"){
                store.dispatch(loginAction(myAuth));
                navigate(`/companyMenu/${myAuth.id}`);
            }
            else if(myAuth.userType === "CUSTOMER"){
                store.dispatch(loginAction(myAuth));
                navigate(`/customerMenu/${myAuth.id}`);
            }
            
        })


        .catch((error) => {
            setInvalidLogin("Invalid email or password!");
        })


    }


    return (
        <div className="LoginPage"> 
            <img src={WhiteLogo} alt="CoupCoupon Logo" className="LogoHeader" onClick={() => navigate("/")}/>
            <div className="LoginPage Box">
                <div className="LoginTitle">
                    <h1>Log in</h1>
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>

            <div className="LoginForm">
                <form onSubmit={handleSubmit(makeLogin)}>
                    <label>Email Address</label> <br />
                    <input type="email" placeholder="Enter your email adress" {...register("email",{required:true,pattern:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i})} />
                    {errors.email?.type == "required" && <><br /> <span className="error-message" >Email is required</span></>} 
                    {errors.email?.type == "pattern" && <><br /> <span className="error-message">Invalid email format</span></>}
                    <br /><br />

                    <label>Password</label> <br />
                    <input type="password" placeholder="Enter your password" {...register("password",{required:true,minLength:5,maxLength:14})} />
                    {errors.password?.type == "required" && <><br /><span className="error-message">Password is required</span></>}
                    {errors.password?.type == "minLength" && <><br /><span className="error-message">Password must be 5 characters long</span></>}
                    {errors.password?.type == "maxLength" && <><br /><span className="error-message">Password must be 14 characters long</span></>}
                    <br /><br />

                    <button type="submit">Login</button>
                    {invalidLogin && <><br /><br /> <span className="invalid-error">{invalidLogin}</span></>}
                </form>
                
            </div>
        </div>
    </div>    
    );
}
