import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  token: null | string;
  refresh: null | string;
  user: null | object;
};

const initialState: TInitialState = {
  token: null,
  refresh: null,
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storeUserInfo: (state, action) => {
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
      state.user = action.payload.user;
    },
    removeUserInfo: (state) => {
      state.token = null;
      state.refresh = null;
      state.user = null;
    }
  }
});

export const { storeUserInfo, removeUserInfo } = authSlice.actions;
export default authSlice.reducer;