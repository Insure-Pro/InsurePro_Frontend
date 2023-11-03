import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./customerSlice";
import authReducer from "./authSlice";
import main from "./modules/mainSlice";
// import contractReducer from "./modules/contractSlice";
const store = configureStore({
  reducer: {
    customer: customerReducer,
    auth: authReducer,
  },
});
// export const store = configureStore({
//   reducer: {
//     contract: contractReducer,
//   },
// });

export default store;
