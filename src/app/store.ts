import { configureStore } from "@reduxjs/toolkit";
import { woundedApi } from "../services/woundedApi";
import authReducer from "./authSlice";
import favoritesReducer from "./favoritesSlice";
import filterReducer from "./filterSlice";
import playerReducer from "./playerSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
    reducer: {
        [woundedApi.reducerPath]: woundedApi.reducer,
        theme: themeReducer,
        auth: authReducer,
        player: playerReducer,
        favorites: favoritesReducer,
        filter: filterReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(woundedApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
