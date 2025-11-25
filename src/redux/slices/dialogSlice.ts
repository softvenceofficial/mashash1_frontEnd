import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type DialogState = {
  [key: string]: boolean | undefined;
};

const initialState: DialogState = {};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<string>) => {
      state[action.payload] = true;
    },
    closeDialog: (state, action: PayloadAction<string>) => {
      state[action.payload] = false;
    },
    resetDialog: (state, action: PayloadAction<string>) => {
      state[action.payload] = undefined;
    },
    setDialog: (state, action: PayloadAction<{ key: string; value: boolean | undefined }>) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { openDialog, closeDialog, resetDialog, setDialog } = dialogSlice.actions;
export default dialogSlice.reducer;