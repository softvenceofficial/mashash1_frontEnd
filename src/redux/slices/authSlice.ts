import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  token: null | string;
};

const initialState: TInitialState = {
  token: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storeUserInfo: (state, action) => {
      state.token = action.payload.token;
    },
    removeUserInfo: (state) => {
      state.token = null;
    }
  }
});

export const { storeUserInfo, removeUserInfo } = authSlice.actions;
export default authSlice.reducer;