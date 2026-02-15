import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import childrenReducer from "./slices/childrenSlice";
import aiContextReducer from "./slices/aiContextSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    children: childrenReducer,
    aiContext: aiContextReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
