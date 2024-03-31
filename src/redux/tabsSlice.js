import { createSlice } from "@reduxjs/toolkit";

export const tabsSlice = createSlice({
  name: "tabs",
  initialState: {
    currentTab: "전체", // 기본값
  },
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    resetTab: (state) => {
      state.currentTab = "전체"; // 기본값으로 재설정
    },
  },
});

export const { setCurrentTab, resetTab } = tabsSlice.actions;

export default tabsSlice.reducer;
