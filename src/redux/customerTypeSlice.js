// src/features/customerTypes/customerTypesSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const customerTypesSlice = createSlice({
  name: "customerTypes",
  initialState: {
    customerTypes: [],
  },
  reducers: {
    setCustomerTypes: (state, action) => {
      state.customerTypes = action.payload;
    },
  },
});

export const { setCustomerTypes } = customerTypesSlice.actions;

export default customerTypesSlice.reducer;
