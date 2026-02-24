import { createSlice } from "@reduxjs/toolkit";

export type theme = "light" | "dark";

const initialState = { value: "light" as theme };

export const themeSLice = createSlice({
    name: "theme",
    initialState: initialState,
    reducers: {
        themeMode: state => {
            state.value = state.value === "light" ? "dark" : "light";
        },
    },
});

export const { themeMode } = themeSLice.actions;

export default themeSLice.reducer;
