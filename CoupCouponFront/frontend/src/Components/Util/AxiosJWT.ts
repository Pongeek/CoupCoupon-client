import axios from "axios";
import { updateTokenAction } from "../Redux/AuthReducer";
import { store } from "../Redux/store";


const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
    request => {
        const token = store.getState().auth.token || sessionStorage.getItem("jwt");
        console.log('Token from store or sessionStorage:', token);
        if (token && !request.headers.Authorization) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        console.log("request.headers.Authorization axiosJWT: ", request.headers.Authorization);
        return request;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosJWT.interceptors.response.use(
    response => {
        const newToken = response.headers.authorization?.split(" ")[1]; // Remove 'Bearer' prefix if present
        if (newToken) {
            console.log("response.headers.authorization axiosJWT: ", newToken);
            store.dispatch(updateTokenAction(newToken));
            sessionStorage.setItem("jwt", newToken);
        }
        return response;
    },
    error => {
        if (error.response && error.response.headers.authorization) {
            console.log("error.response.headers.authorization axiosJWT: ", error.response.headers.authorization);
        }
        return Promise.reject(error);
    }
);

export default axiosJWT;


