import { Navigate } from "react-router-dom";
import "./Main.css";

export function Main(): JSX.Element {
    return <Navigate to="/home" replace />;
}