import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { authApiEndpoints } from "../services/auth.api.service";
import { IRoom } from "@/@types";

export interface IUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  is_admin: boolean;
  last_login: Date | null;
  profile_photo: string | null;
  createdAt: string;
  updatedAt: string;
  currentRoom: IRoom;
}

export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user?: IUser;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiEndpoints.verifyToken.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.accessToken = payload.accessToken;
          state.refreshToken = payload.refreshToken;
        }
      )
      .addMatcher(
        authApiEndpoints.getUserProfile.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
        }
      );
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
