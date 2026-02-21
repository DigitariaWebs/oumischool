import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import childrenReducer from "./slices/childrenSlice";
import aiContextReducer from "./slices/aiContextSlice";
import themeReducer from "./slices/themeSlice";
import workflowReducer from "./slices/workflowSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    children: childrenReducer,
    aiContext: aiContextReducer,
    theme: themeReducer,
    workflow: workflowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types that might have non-serializable values
        ignoredActions: [],
        // Ignore these field paths in all actions
        ignoredActionPaths: [],
        // Ignore these paths in the state
        ignoredPaths: [],
        // Increase the time threshold for warnings (default is 32ms)
        warnAfter: 128,
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
