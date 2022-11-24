//to set this up, I copied: https://redux.js.org/tutorials/essentials/part-2-app-structure
import { MicExternalOff, PlaylistAddOutlined } from "@mui/icons-material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cocktail } from "../types/Cocktail";

// type Cocktail = {
// 	mixer1: number;
// 	cocktail?: {
// 		$id?: number;
// 		category?: string;
// 		extraIngredients?: string[];
// 		garnish?: string[];
// 		img?: string;
// 		liquor?: string;
// 		liquorParts?: number;
// 		mixer1?: string;
// 		mixer1Parts?: number;
// 		mixer2?: string;
// 		mixer2Parts?: number;
// 		mixer3?: string;
// 		mixer3Parts?: number;
// 		mixer4?: string;
// 		mixer4Parts?: number;
// 		name?: string;
// 		recipe?: string;
// 	};
// };

type CocktailsListState = {
  cocktails?: Cocktail[];
  public?: Cocktail[];
};

const initialState: CocktailsListState = {
  //cocktails: [],
  //public: [],
};

//This was really helpful when setting this up: https://redux-toolkit.js.org/usage/usage-with-typescript

export const cocktailsListSlice = createSlice({
  name: "cocktails",
  initialState,
  reducers: {
    setCocktailList: (state, action: PayloadAction<Cocktail[]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.cocktails = action.payload;

      // action.payload.map((cocktail: Cocktail) => {
      // 	let mixersList: string[] = [];
      // 	let mixersPerServingList: number[] = [];
      // 	cocktail.mixer1 && mixersList.push(cocktail.mixer1);
      // 	cocktail.mixer1Parts && mixersPerServingList.push(cocktail.mixer1Parts);
      // 	cocktail.mixer2 && mixersList.push(cocktail.mixer2);
      // 	cocktail.mixer2Parts && mixersPerServingList.push(cocktail.mixer2Parts);
      // 	cocktail.mixer3 && mixersList.push(cocktail.mixer3);
      // 	cocktail.mixer3Parts && mixersPerServingList.push(cocktail.mixer3Parts);
      // 	cocktail.mixer4 && mixersList.push(cocktail.mixer4);
      // 	cocktail.mixer4Parts && mixersPerServingList.push(cocktail.mixer4Parts);

      // 	cocktail.mixers = mixersList;
      // 	cocktail.mixersPerServing = mixersPerServingList;

      // 	return cocktail;
      // });
    },
  },
});

export const { setCocktailList } = cocktailsListSlice.actions;

export default cocktailsListSlice.reducer;
