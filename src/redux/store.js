import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./customerSlice";
import main from "./modules/mainSlice";
// import contractReducer from "./modules/contractSlice";
const store = configureStore({
  reducer: {
    customer: customerReducer,
  },
});
// export const store = configureStore({
//   reducer: {
//     contract: contractReducer,
//   },
// });

export default store;
