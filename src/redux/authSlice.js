import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const accessToken = state.auth.accessToken;
    const refreshToken = state.auth.refreshToken;
    const MAIN_URL = process.env.REACT_APP_MAIN_URL;
    // Check for refresh token expiration here
    const refreshTokenExpiry = localStorage.getItem("refreshTokenExpiry"); // Assuming you store expiry time in localStorage
    //토큰 만료 시간을 localStorage에서 가져옴
    const currentTime = Date.now();

    if (
      refreshTokenExpiry &&
      currentTime > parseInt(refreshTokenExpiry) - 29 * 60 * 1000
    ) {
      // 현재 시간이 리프레시 토큰 만료 시간보다 29분 더 짧은 경우

      dispatch(logoutSuccess()); // 로그아웃 액션 디스패치
      localStorage.clear(); // 로컬 스토리지 클리어
      window.location.href = "/login"; // 사용자를 로그인 페이지로 리디렉션
      return;
    }

    if (!accessToken || !refreshToken) {
      throw new Error("No access or refresh token available");
    }

    const decodedToken = jwtDecode(accessToken);
    const decodedTokenTime = Date.now() / 1000;

    if (decodedToken.exp < decodedTokenTime) {
      const response = await axios.patch(
        `${MAIN_URL}/employee/authorization`,
        null,
        { headers: { Refresh: refreshToken } },
      );

      if (response.status === 204) {
        // Return new token
        return response.headers["authorization"].split(" ")[1];
      } else {
        throw new Error("Failed to refresh token");
      }
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true" ? true : false,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
  },
  reducers: {
    loginSuccess: (state, action) => {
      // console.log("Login successful", action.payload);
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", "true");

      // Check if payload is provided and contains accessToken and refreshToken
      if (
        action.payload &&
        action.payload.accessToken &&
        action.payload.refreshToken
      ) {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      } else {
        // Handle case where payload is not provided or missing tokens
        console.error("Payload missing or incomplete in loginSuccess action");
      }
    },
    logoutSuccess: (state) => {
      // console.log("Logout action triggered");
      state.isLoggedIn = false;
      localStorage.setItem("isLoggedIn", "false");
      state.accessToken = null;
      state.refreshToken = null;
    },

    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      // Update state with new token
      state.accessToken = action.payload;
      state.isLoggedIn = true;
      state.isLoading = false;
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      // Handle case where refresh token is invalid or expired
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
    });
  },
});
// 액션 생성자와 리듀서를 내보냄
export const { loginSuccess, logoutSuccess, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;
