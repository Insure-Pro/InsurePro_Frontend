import axios from "axios";
import { store } from "./redux/store";
import { loginSuccess, logoutSuccess } from "./redux/authSlice";

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
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          store.dispatch(logoutSuccess());
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${MAIN_URL}/employee/authorization`,
          null,
          {
            headers: { Refresh: refreshToken },
          },
        );

        if (response.status === 204) {
          const newAccessToken =
            response.headers["authorization"].split(" ")[1];
          store.dispatch(
            loginSuccess({ accessToken: newAccessToken, refreshToken }),
          );
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(logoutSuccess());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
