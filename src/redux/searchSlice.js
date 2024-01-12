import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    showSearch: false,
  },
  reducers: {
    toggleSearch: (state) => {
      state.showSearch = !state.showSearch;
    },
    setSearchOff: (state) => {
      state.showSearch = false;
    },
  },
});

// Actions export
export const { toggleSearch, setSearchOff } = searchSlice.actions;

// Reducer export
export default searchSlice.reducer;
