import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    activeType: "All",
    selectedAge: "",
    selectedSort: "All",
    showOptions: null,
    selectedContractYn: null,
    showEditModal: false,
    selectedCustomer: null,
    formattedDate: "",
    selectedTab: "전체",
    userName: "",
    // ... 기타 필요한 상태들
  },
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    setActiveType: (state, action) => {
      state.activeType = action.payload;
    },
    setSelectedAge: (state, action) => {
      state.selectedAge = action.payload;
    },
    setSelectedSort: (state, action) => {
      state.selectedSort = action.payload;
    },
    setShowOptions: (state, action) => {
      state.showOptions = action.payload;
    },
    setSelectedContractYn: (state, action) => {
      state.selectedContractYn = action.payload;
    },
    setShowEditModal: (state, action) => {
      state.showEditModal = action.payload;
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    setFormattedDate: (state, action) => {
      state.formattedDate = action.payload;
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    // ... 기타 액션들
  },
});

export const {
  setCustomers,
  setActiveType,
  setSelectedAge,
  setSelectedSort,
  setShowOptions,
  setSelectedContractYn,
  setShowEditModal,
  setSelectedCustomer,
  setFormattedDate,
  setSelectedTab,
  setUserName,
} = customerSlice.actions;
export default customerSlice.reducer;
