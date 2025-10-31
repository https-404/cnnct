import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./auth.state";

const initialState : AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthTokens = (state: { auth: AuthState }) => ({
  accessToken: state.auth.accessToken,
  refreshToken: state.auth.refreshToken,
});
export const selectAuthState = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
