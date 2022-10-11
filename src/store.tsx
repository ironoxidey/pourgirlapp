//when setting up, I referenced this: https://redux-toolkit.js.org/tutorials/typescript
import { configureStore } from '@reduxjs/toolkit';
import groceriesSlice from './reducers/groceriesSlice';
import cocktailListSlice from './reducers/cocktailListSlice';
import appSlice from './reducers/appSlice';

export const store = configureStore({
	reducer: {
		groceries: groceriesSlice,
		cocktails: cocktailListSlice,
		app: appSlice,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
