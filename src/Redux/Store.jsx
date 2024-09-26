// store.jsx
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice"; // Make sure the path is correct
import sidebarReducer from "./Slice/sidebarSlice";
const store = configureStore({
  reducer: {
    auth: authReducer, // It should be "auth" and not "user"
    sidebar: sidebarReducer, // Add sidebar reducer here
  },
});

export default store;
