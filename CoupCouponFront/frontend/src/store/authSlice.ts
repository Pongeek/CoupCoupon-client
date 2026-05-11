import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../types';

const initialState: AuthState = {
  id: 0,
  email: '',
  name: '',
  userType: '',
  token: '',
  isLoggedIn: false,
};

/**
 * Rehydrate auth state from localStorage on app startup.
 * Returns the persisted state or the default initial state.
 */
function loadPersistedAuth(): AuthState {
  try {
    const persisted = localStorage.getItem('auth');
    if (persisted) {
      return JSON.parse(persisted) as AuthState;
    }
  } catch {
    localStorage.removeItem('auth');
  }
  return initialState;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadPersistedAuth(),
  reducers: {
    login(state, action: PayloadAction<AuthState>) {
      const user = action.payload;
      state.id = user.id;
      state.email = user.email;
      state.name = user.name;
      state.userType = user.userType;
      state.token = user.token;
      state.isLoggedIn = true;
      localStorage.setItem('auth', JSON.stringify(user));
    },

    logout(state) {
      state.id = 0;
      state.email = '';
      state.name = '';
      state.userType = '';
      state.token = '';
      state.isLoggedIn = false;
      localStorage.removeItem('auth');
      localStorage.removeItem('refreshToken');
    },

    updateToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      // If token is cleared, log out
      if (!action.payload) {
        state.id = 0;
        state.email = '';
        state.name = '';
        state.userType = '';
        state.isLoggedIn = false;
        localStorage.removeItem('auth');
        return;
      }
      // Persist updated token
      try {
        const persisted = localStorage.getItem('auth');
        if (persisted) {
          const auth = JSON.parse(persisted);
          auth.token = action.payload;
          localStorage.setItem('auth', JSON.stringify(auth));
        }
      } catch {
        // Ignore serialization errors
      }
    },
  },
});

export const { login, logout, updateToken } = authSlice.actions;
export default authSlice.reducer;
