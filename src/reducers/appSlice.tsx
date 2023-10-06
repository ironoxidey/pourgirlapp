//to set this up, I copied: https://redux.js.org/tutorials/essentials/part-2-app-structure
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  cocktailsUpdate: number;
  rightToMakeChanges: string;
};

const initialState: AppState = {
  cocktailsUpdate: 0,
  rightToMakeChanges: "FORM",
};

//This was really helpful when setting this up: https://redux-toolkit.js.org/usage/usage-with-typescript

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCocktailsUpdate: (state, action: PayloadAction<number>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.cocktailsUpdate = state.cocktailsUpdate + 1;
    },
    setRightToMakeChanges: (state, action: PayloadAction<string>) => {
      state.rightToMakeChanges = action.payload;
    },
  },
});

export const { setCocktailsUpdate, setRightToMakeChanges } = appSlice.actions;

export default appSlice.reducer;
