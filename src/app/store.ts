import { configureStore } from "@reduxjs/toolkit";
import { woundedApi } from "../services/woundedApi";
import themeReducer from "./themeSlice";
export const store = configureStore({
    reducer: {
        [woundedApi.reducerPath]: woundedApi.reducer,
        theme: themeReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(woundedApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
