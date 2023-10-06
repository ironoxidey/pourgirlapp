//to set this up, I copied: https://redux.js.org/tutorials/essentials/part-2-app-structure
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cocktail } from "../types/Cocktail";
import { Wine } from "../types/Wine";
import { Beer } from "../types/Beer";
import { GroceryItem } from "../types/GroceryItem";

type GroceriesState = {
  cocktails: Cocktail[];
  wines: Wine[];
  beers: Beer[];
  items: GroceryItem[];
};

const initialState: GroceriesState = {
  cocktails: [],
  wines: [],
  beers: [],
  items: [],
};

//This was really helpful when setting this up: https://redux-toolkit.js.org/usage/usage-with-typescript

export const groceriesSlice = createSlice({
  name: "groceries",
  initialState,
  reducers: {
    addCocktail: (state, action: PayloadAction<Cocktail>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      console.log("reducer action.payload.index", action.payload.index);
      //console.log('reducer state.cocktails.length', state.cocktails.length);
      if (
        action.payload.index != undefined &&
        Number.isInteger(action.payload.index)
      ) {
        state.cocktails[action.payload.index] = action.payload;
      }
      // }
      //state.cocktails.push(action.payload);
    },
    updateCocktail: (state, action: PayloadAction<Cocktail>) => {
      state.cocktails = state.cocktails.map((cocktail) => {
        console.log("updating cocktail", action.payload);
        return cocktail.fieldID === action.payload.fieldID
          ? action.payload
          : cocktail;
      });
    },
    updateServings: (state, action: PayloadAction<Cocktail>) => {
      state.cocktails = state.cocktails.map((cocktail) => {
        console.log("updating cocktail", action.payload);
        return cocktail.fieldID === action.payload.fieldID
          ? { ...cocktail, servings: action.payload.servings }
          : cocktail;
      });
    },
    removeCocktail: (state, action) => {
      state.cocktails = state.cocktails.filter(
        (cocktail) => cocktail.fieldID !== action.payload.fieldID
      );

      //state.cocktails.splice(action.payload.index, 1);
    },
    addWine: (state, action: PayloadAction<Wine>) => {
      console.log("reducer action.payload.index", action.payload.index);
      //console.log('reducer state.cocktails.length', state.cocktails.length);
      if (
        action.payload.index != undefined &&
        Number.isInteger(action.payload.index)
      ) {
        state.wines[action.payload.index] = action.payload;
      }
      // }
      //state.cocktails.push(action.payload);
    },
    updateWine: (state, action: PayloadAction<Wine>) => {
      state.wines = state.wines.map((wine) => {
        console.log("updating wine", action.payload);
        return wine.fieldID === action.payload.fieldID ? action.payload : wine;
      });
    },
    removeWine: (state, action) => {
      state.wines = state.wines.filter(
        (wine) => wine.fieldID !== action.payload.fieldID
      );
    },
    addBeer: (state, action: PayloadAction<Beer>) => {
      console.log("reducer action.payload.index", action.payload.index);
      //console.log('reducer state.cocktails.length', state.cocktails.length);
      if (
        action.payload.index != undefined &&
        Number.isInteger(action.payload.index)
      ) {
        state.beers[action.payload.index] = action.payload;
      }
      // }
      //state.cocktails.push(action.payload);
    },
    updateBeer: (state, action: PayloadAction<Beer>) => {
      state.beers = state.beers.map((beer) => {
        console.log("updating beer", action.payload);
        return beer.fieldID === action.payload.fieldID ? action.payload : beer;
      });
    },
    removeBeer: (state, action) => {
      state.beers = state.beers.filter((beer) => {
        if (beer.fieldID !== action.payload.fieldID) {
          return beer;
        }
      });
    },
    setGroceryItemList: (state, action: PayloadAction<GroceryItem[]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.items = action.payload;
    },
  },
});

export const {
  addCocktail,
  removeCocktail,
  updateCocktail,
  updateServings,
  addWine,
  updateWine,
  removeWine,
  addBeer,
  updateBeer,
  removeBeer,
  setGroceryItemList,
} = groceriesSlice.actions;

export default groceriesSlice.reducer;
