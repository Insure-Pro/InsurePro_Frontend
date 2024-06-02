import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const refreshToken = state.auth.refreshToken;
    const MAIN_URL = process.env.REACT_APP_MAIN_URL;

    if (!refreshToken) {
      dispatch(logoutSuccess());
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.patch(
        `${MAIN_URL}/employee/authorization`,
        null,
        {
          headers: { Refresh: refreshToken },
        },
      );

      if (response.status === 204) {
        const newAccessToken = response.headers["authorization"].split(" ")[1];
        dispatch(loginSuccess({ accessToken: newAccessToken, refreshToken }));
        return newAccessToken;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.log("Refreshing token failed");
      dispatch(logoutSuccess());
      localStorage.clear();
      window.location.href = "/login";
      throw error;
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  },
  reducers: {
    loginSuccess: (state, action) => {
      console.log("Login successful");
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logoutSuccess: (state) => {
      console.log("Logout successful");
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      console.log("Token refreshed successfully");
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    });
    builder.addCase(refreshAccessToken.rejected, (state) => {
      console.log("Token refresh failed");
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.clear();
    });
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
