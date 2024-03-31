import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const navbarSlice = createSlice({
  name: "navbar",
  initialState: { showNavItem: false, showDateBar: false },
  reducers: {
    setShowDateBar: (state) => {
      state.showDateBar = true;
    },
    setCloseDateBar: (state) => {
      state.showDateBar = false;
    },

    toggleNavItem: (state) => {
      state.showNavItem = !state.showNavItem;
    },
    setNavItemOff: (state) => {
      state.showNavItem = false;
    },
    setNavItemOn: (state) => {
      state.showNavItem = true;
    },
  },
});

// Export the actions
export const {
  toggleNavItem,
  setNavItemOff,
  setNavItemOn,
  setShowDateBar,
  setCloseDateBar,
} = navbarSlice.actions;
export default navbarSlice.reducer;
