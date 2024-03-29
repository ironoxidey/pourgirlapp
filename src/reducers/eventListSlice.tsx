//to set this up, I copied: https://redux.js.org/tutorials/essentials/part-2-app-structure
import { MicExternalOff, PlaylistAddOutlined } from "@mui/icons-material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "../types/Event";
import { Bartender } from "../types/Bartender";
import { ServicePackage } from "../types/ServicePackage";
import { GoogleCalEvent } from "../types/GoogleCalEvent";

type EventsListState = {
  events?: Event[];
  bartenders?: Bartender[];
  servicePackages?: ServicePackage[];
  googleCalEvents?: GoogleCalEvent[];
  theEvent?: Event;
};

const initialState: EventsListState = {
  //events: [],
  //bartenders: [],
  //googleCalEvents: [],
  theEvent: {},
};

//This was really helpful when setting this up: https://redux-toolkit.js.org/usage/usage-with-typescript

export const eventListSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEventsList: (state, action: PayloadAction<Event[]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.events = action.payload;

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
    setBartendersList: (state, action: PayloadAction<Bartender[]>) => {
      state.bartenders = action.payload;
    },
    setServicePackagesList: (
      state,
      action: PayloadAction<ServicePackage[]>
    ) => {
      state.servicePackages = action.payload;
    },
    setGoogleCalEventsList: (
      state,
      action: PayloadAction<GoogleCalEvent[]>
    ) => {
      state.googleCalEvents = action.payload;
    },
    setTheEvent: (state, action: PayloadAction<Event>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.theEvent = action.payload;

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

export const {
  setEventsList,
  setBartendersList,
  setServicePackagesList,
  setGoogleCalEventsList,
  setTheEvent,
} = eventListSlice.actions;

export default eventListSlice.reducer;
