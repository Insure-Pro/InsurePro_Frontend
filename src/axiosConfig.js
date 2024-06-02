import axios from "axios";
import { store } from "./redux/store";
import {
  loginSuccess,
  logoutSuccess,
  refreshAccessToken,
} from "./redux/authSlice";

// Create an Axios instance
const axiosInstance = axios.create();

// Set up interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const MAIN_URL = process.env.REACT_APP_MAIN_URL;

    if (
      error.response &&
      error.response.status === 404 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await store
          .dispatch(refreshAccessToken())
          .unwrap();
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          store.dispatch(logoutSuccess());
          window.location.href = "/login";
        }
      } catch (refreshError) {
        console.log("Token refresh failed", refreshError);
        store.dispatch(logoutSuccess());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
