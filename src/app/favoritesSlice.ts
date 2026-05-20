import { createSlice } from "@reduxjs/toolkit";
import { MusicPlaylist } from "../services/types";
import { woundedApi } from "../services/woundedApi";
import { logout } from "./authSlice";

interface FavoritesState {
    favoriteIds: string[];
    playlists: MusicPlaylist[];
}

const initialState: FavoritesState = {
    favoriteIds: [],
    playlists: [],
};

export const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(logout, () => initialState);
        builder.addMatcher(woundedApi.endpoints.getFavoriteSongs.matchFulfilled, (state, action) => {
            state.favoriteIds = action.payload.map(song => song.id);
        });
        builder.addMatcher(woundedApi.endpoints.getPlaylists.matchFulfilled, (state, action) => {
            state.playlists = action.payload;
        });
    },
});

export default favoritesSlice.reducer;
