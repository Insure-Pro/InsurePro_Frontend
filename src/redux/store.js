import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import customerReducer from "./customerSlice";
import authReducer from "./authSlice";
import navbarReducer from "./navbarSlice";
import main from "./modules/mainSlice";
import searchReducer from "./searchSlice";
// import contractReducer from "./modules/contractSlice";
const reducers = combineReducers({
  customer: customerReducer,
  auth: authReducer,
  navbar: navbarReducer,
  search: searchReducer,
});
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        "persist/PERSIST",
        "persist/REHYDRATE",
        "persist/REGISTER",
      ],
    },
  }),
  // ... other store setup options
});

export const persistor = persistStore(store);
