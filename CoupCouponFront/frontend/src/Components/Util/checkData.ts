import { jwtDecode } from "jwt-decode";
import { store } from "../Redux/store"
import { loginAction } from "../Redux/AuthReducer";

type jwtData = {
    "id": number,
    "userType": string,
    "name": string,
    "sub": string,
    "iat": number,
    "exp": number
}

export const checkData = () => {
    console.log("store.getState().auth.token in checkData ", store.getState().auth.token);
    if (store.getState().auth.token.length < 10) {
        try {
            const JWT = sessionStorage.getItem("jwt");
            if (JWT) {
                const decoded_jwt = jwtDecode<jwtData>(JWT);
                console.log("decoded_jwt in checkData ", decoded_jwt);

                let myAuth = {
                    id: decoded_jwt.id,
                    email: decoded_jwt.sub,
                    userType: decoded_jwt.userType,
                    name: decoded_jwt.name,
                    token: JWT,
                    isLoggedIn: true
                };

                console.log("myAuth in checkData ", myAuth);

                store.dispatch(loginAction(myAuth));
            }
        } catch (err) {
            console.log(err);
        }
    }
};