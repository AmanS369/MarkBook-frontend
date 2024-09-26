import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("token") || null,
  firebaseToken: localStorage.getItem("firebaseToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.firebaseToken = action.payload.firebaseToken;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("firebaseToken", action.payload.firebaseToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.firebaseToken = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("firebaseToken");
    },
    updateFirebaseToken: (state, action) => {
      state.firebaseToken = action.payload;
      localStorage.setItem("firebaseToken", action.payload);
    },
  },
});

export const { login, logout, updateFirebaseToken } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const isAuthenticated = (state) => state.auth.isAuthenticated;
export const TOKEN = (state) => state.auth.token;
export const FIREBASE_TOKEN = (state) => state.auth.firebaseToken;

export default authSlice.reducer;
