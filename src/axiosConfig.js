import axios from "axios";
import { store } from "./redux/store";
import { loginSuccess, logout } from "./redux/authSlice";

// Create an Axios instance
const axiosInstance = axios.create();

// Set up interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const originalRequest = error.config;
      try {
        const refreshToken = store.getState().auth.refreshToken;
        const response = await axiosInstance.patch(
          "https://www.insurepro.kro.kr/v1/employee/authorization",
          null,
          { headers: { Refresh: refreshToken } }
        );

        if (response.status === 204) {
          const newAccessToken =
            response.headers["authorization"].split(" ")[1];
          store.dispatch(
            loginSuccess({
              accessToken: newAccessToken,
              refreshToken,
            })
          );
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;