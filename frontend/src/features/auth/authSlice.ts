import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import type { User } from '@/shared/types/user';

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  /** True only during the brief window between rehydrate dispatch and resolution. */
  isHydrated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called once on app boot — pulls token from storage into Redux so
     * RTK Query's `prepareHeaders` can attach it to subsequent requests.
     */
    rehydrateAuth(state) {
      state.accessToken = tokenStorage.get();
      state.isHydrated = true;
    },
    setCredentials(
      state,
      action: PayloadAction<{ accessToken: string; user: User }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      tokenStorage.set(action.payload.accessToken);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
      tokenStorage.clear();
    },
  },
});

export const { rehydrateAuth, setCredentials, setUser, logout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
