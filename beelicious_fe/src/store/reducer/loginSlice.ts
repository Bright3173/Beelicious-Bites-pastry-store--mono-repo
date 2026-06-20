import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setUserData: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
  },
});

export const { login, logout, setUserData } = loginSlice.actions;
export default loginSlice.reducer;
