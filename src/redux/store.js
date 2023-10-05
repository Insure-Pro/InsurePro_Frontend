import { configureStore } from "@reduxjs/toolkit";
import main from "./modules/mainSlice";
// import contractReducer from "./modules/contractSlice";
const store = configureStore({
  reducer: {
    main,
  },
});
// export const store = configureStore({
//   reducer: {
//     contract: contractReducer,
//   },
// });

export default store;
