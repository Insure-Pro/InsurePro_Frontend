import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const refreshToken = state.auth.refreshToken;
    const MAIN_URL = process.env.REACT_APP_MAIN_URL;

    if (!refreshToken) {
      dispatch(logoutSuccess());
      return;
    }

    try {
      const response = await axios.post(
        `${MAIN_URL}/employee/authorization`,
        null,
        {
          headers: { Refresh: refreshToken },
        },
      );

      if (response.status === 204) {
        const newAccessToken = response.headers["authorization"].split(" ")[1];
        return newAccessToken;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
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
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    });
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
