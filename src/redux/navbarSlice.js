import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const navbarSlice = createSlice({
  name: "navbar",
  initialState: { selectedTab: "전체" },
  reducers: {
    setAllCustomersState: (state) => {
      state.contractYn = null;
      state.age = "";
      state.sort = "latest";
      state.formattedDate = null;
      // You may need to reset other parts of the state as well
    },
    setContractCompleteState: (state) => {
      state.contractYn = true;
      //   state.age = "";
      //   state.sort = "latest";
      state.formattedDate = null;
      // You may need to reset other parts of the state as well
    },
    setMonthCustomersState: (state) => {
      state.contractYn = true;
      //   state.age = "";
      //   state.sort = "latest";
      state.formattedDate = null;
      // You may need to reset other parts of the state as well
    },

    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

// Export the actions
export const {
  setAllCustomersState,
  setContractCompleteState,
  setMonthCustomersState,
  setSelectedTab,
} = navbarSlice.actions;
export default navbarSlice.reducer;
