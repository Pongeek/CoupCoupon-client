import { useEffect } from "react";
import "./ThankYouPage.css";

import { useNavigate, useParams } from "react-router-dom";

export function ThankYouPage(): JSX.Element {
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login");
        }, 5000); // Redirect after 5 seconds
    }, []);

    return (
        <div className="ThankYouPage">
            <h1>Thank You, {params.name}!</h1>
            <p>Your registration was successful.</p>
            <p>You will be redirected to the login page shortly.</p>
        </div>
    );
}
