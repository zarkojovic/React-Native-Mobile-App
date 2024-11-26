import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Profile = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  avatar?: string;
  accessToken: string;
};

interface AuthState {
  profile: null | Profile;
  pending: boolean;
}

const initalState: AuthState = {
  profile: null,
  pending: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initalState,
  reducers: {
    updateAuthState(state, { payload }: PayloadAction<AuthState>) {
      state.pending = payload.pending;
      state.profile = payload.profile;
    },
  },
});

export const { updateAuthState } = authSlice.actions;

export const getAuthState = createSelector(
  (state) => {
    return state;
  },
  (state) => state.auth
);

export default authSlice.reducer;
