import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import WhiteLogo from "../../assests/WhiteLogo.png";
import { useState } from "react";
import axiosJWT from "../../Util/AxiosJWT";
import { store } from "../../Redux/store";
import { addCustomerAction } from "../../Redux/AdminReducer";
import { CustomerDetails } from "../../Model/CustomerDetails";


type customerDetails = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}

export function RegisterPage(): JSX.Element {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<customerDetails>();
    const navigate = useNavigate();
    const [emailExistsError, setEmailExistsError] = useState<string | null>(null);
    const [customers, setCustomers] = useState<CustomerDetails[]>([]);


    const onSubmit: SubmitHandler<customerDetails> = (data) => {
        const checkEmailExists = axios.get(`http://localhost:8080/CoupCouponAPI/Login/IsEmailExist/${data.email}`)
        .then((response) => {
        
            if (response.data == true) {
                setEmailExistsError("Email already exists");
                return;

            }else{
                setEmailExistsError(null);

                let customerRegister = {
                    id: response.data.id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    password: data.password,
                    coupons: []
                }
                console.log(customerRegister);

                axios.post("http://localhost:8080/CoupCouponAPI/Login/CustomerRegister", customerRegister)
                .then((response) => {
                    // console.log("Register customer successfully",response.data);
                    store.dispatch(addCustomerAction(customerRegister));
                    setCustomers([...customers, customerRegister]);
                    navigate(`/thankYouPage/${data.firstName}`);
                })
                .catch((error) => {
                    console.log(error);
                });

                console.log(customerRegister);
                
            }
            
        })
        .catch((error) => {
            console.log(error);
        });


        //NEED TO CONTINUE TO DO THE REGISTER PAGE.
    };

    const password = watch("password");
    

    return (
        <div className="RegisterPage">
            <img src={WhiteLogo} alt="CoupCoupon Logo" className="LogoHeader" onClick={() => navigate("/")}/>
            <div className="RegisterPage Box">
                <div className="RegisterTitle">
                    <h1>Sign up</h1>
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>

                <div className="RegisterForm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label>Email Address</label>
                        <br />
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            {...register("email", {
                                required: true,
                                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                            })}
                        />
                        {errors.email?.type === "pattern" && <><br /> <span className="error-message">Invalid email format</span></>}
                        {errors.email?.type === "required" && <><br /><span className="error-message">Email is required</span></>}
                        {emailExistsError && <><br /><span className="error-message">{emailExistsError}</span></>}
                        <br /><br />

                        <label>First Name</label>
                        <br />
                        <input
                            type="text"
                            placeholder="Enter your first name"
                            {...register("firstName", {
                                required: true,
                                pattern: /^[a-zA-Z]+$/
                            })}
                        />
                        {errors.firstName?.type === "required" && <><br /> <span className="error-message">First name is required</span></>}
                        {errors.firstName?.type === "pattern" && <><br /> <span className="error-message">Invalid first name format</span></>}
                        <br /><br />

                        <label>Last Name</label>
                        <br />
                        <input
                            type="text"
                            placeholder="Enter your last name"
                            {...register("lastName", {
                                required: true,
                                pattern: /^[a-zA-Z]+$/
                            })}
                        />
                        {errors.lastName?.type === "required" && <><br /> <span className="error-message">Last name is required</span></>}
                        {errors.lastName?.type === "pattern" && <><br /> <span className="error-message">Invalid last name format</span></>}
                        <br /><br />

                        <label>Password</label>
                        <br />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                                minLength: 5,
                                maxLength: 14,
                                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/
                            })}
                        />
                        {errors.password?.type === "required" && <><br /> <span className="error-message">Password is required</span></>}
                        {errors.password?.type === "minLength" && <><br /> <span className="error-message">Password must be at least 5 characters long</span></>}
                        {errors.password?.type === "maxLength" && <><br /> <span className="error-message">Password must be no more than 14 characters long</span></>}
                        {errors.password?.type === "pattern" && <><br /> <span className="error-message">Password must contain at least one letter and one number</span></>}
                        <br /><br />

                        <label>Confirm Password</label>
                        <br />
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirmPassword", {
                                required: true,
                                validate: value => value === password || "Passwords do not match"
                            })}
                        />
                        {errors.confirmPassword?.type === "required" && <><br /> <span className="error-message">Confirm password is required</span></>}
                        {errors.confirmPassword?.type === "validate" && <><br /> <span className="error-message">{errors.confirmPassword.message}</span></>}
                        <br /><br />

                        <button type="submit">Sign up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}