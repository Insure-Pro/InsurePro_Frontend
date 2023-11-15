import axios from "axios";
import { store } from "./redux/store";
import { loginSuccess, logoutSuccess } from "./redux/authSlice";

// Create an Axios instance
const axiosInstance = axios.create();

// Set up interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // console.log("Attempting token refresh", error.response);
      const refreshToken = localStorage.getItem("refreshToken");
      const originalRequest = error.config;
      try {
        zzzzzzzzzz;
        // const refreshToken = store.getState().auth.refreshToken;
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
        console.log("Token refresh failed", refreshError);
        store.dispatch(logoutSuccess());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
