import axios from "axios";
import { loginAction, logoutAction } from "../Redux/AuthReducer";
import { store } from "../Redux/store";

const axiosJWT = axios.create({
    timeout: 10000,
});

axiosJWT.interceptors.request.use(
    request => {
        const token = store.getState().auth.token;
        if (token && !request.headers.Authorization) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
    },
    error => Promise.reject(error)
);

axiosJWT.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                store.dispatch(logoutAction());
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                const currentAuth = store.getState().auth;
                store.dispatch(loginAction({
                    ...currentAuth,
                    token: accessToken,
                }));
                localStorage.setItem("refreshToken", newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosJWT(originalRequest);
            } catch (refreshError) {
                store.dispatch(logoutAction());
                localStorage.removeItem("refreshToken");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosJWT;
