import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import "./LoginPage.css";
import axiosJWT from "../../Util/AxiosJWT";
import { jwtDecode } from "jwt-decode";
import { loginAction, updateTokenAction } from "../../Redux/AuthReducer";
import { store } from "../../Redux/store";
import BlueLogo from "../../assests/BlueLogo.png";
import { useState } from "react";
import { getCustomerCouponsAction, getCustomerDetailsAction } from "../../Redux/CustomerReducer";
import { getCouponsAction } from "../../Redux/AdminReducer";




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
        // Simple credentials object matching exactly what the backend expects
        const credentials = {
            email: data.email,
            password: data.password
        };
        
        console.log("Attempting login with:", credentials);

        // Clear any previous error message
        setInvalidLogin(null);

        axiosJWT.post("http://localhost:8080/CoupCouponAPI/Login/Login", credentials, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then((response) => {
            console.log("Login successful, full response:", response);
            
            if (!response.headers["authorization"] && !response.headers["Authorization"]) {
                console.error("No authorization header in response");
                setInvalidLogin("Login failed: No authorization token received");
                return;
            }

            // Handle case sensitivity in header names
            const authHeader = response.headers["authorization"] || response.headers["Authorization"];
            const JWT = authHeader.split(" ")[1];
            
            try {
                const decode_jwt = jwtDecode<jwtData>(JWT);
                console.log("Decoded JWT:", decode_jwt);
            
                let myAuth = {
                    id: decode_jwt.id,
                    email: decode_jwt.sub,
                    userType: decode_jwt.userType,
                    name: decode_jwt.name,
                    token: JWT,
                    isLoggedIn: true
                };

                console.log("Setting auth state:", myAuth);
                store.dispatch(loginAction(myAuth));

                if(myAuth.userType === "ADMIN"){
                    navigate(`/adminMenu/${myAuth.id}`);
                }
                else if(myAuth.userType === "COMPANY"){
                    navigate(`/companyMenu/${myAuth.id}`);
                }
                else if(myAuth.userType === "CUSTOMER"){
                    navigate(`/customerMenu/${myAuth.id}`);
                }
            } catch (error) {
                console.error("JWT decode error:", error);
                setInvalidLogin("Login failed: Invalid token format");
            }
        })
        .catch((error) => {
            console.error("Login error:", error);
            
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
                
                if (error.response.status === 400) {
                    setInvalidLogin("Invalid email or password. Make sure you're using an existing account.");
                } else if (error.response.status === 401) {
                    setInvalidLogin("Unauthorized: Please check your credentials");
                } else {
                    setInvalidLogin(`Error: ${error.response.data || "Unknown server error"}`);
                }
            } else if (error.request) {
                console.error("No response received:", error.request);
                setInvalidLogin("Server not responding. Please try again later.");
            } else {
                console.error("Error message:", error.message);
                setInvalidLogin(`Error: ${error.message}`);
            }
        });
    }


    return (
        <div className="LoginPage"> 
            <img src={BlueLogo} alt="CoupCoupon Logo" className="LogoHeader" onClick={() => navigate("/")}/>
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
