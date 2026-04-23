import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface FilterState {
    genre: string | null;
    artist: string | null;
    album: string | null;
    search: string;
}

const initialState: FilterState = { genre: null, artist: null, album: null, search: "" };

export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setGenre: (state, action: PayloadAction<string | null>) => {
            state.genre = action.payload;
        },
        setArtist: (state, action: PayloadAction<string | null>) => {
            state.artist = action.payload;
        },
        setAlbum: (state, action: PayloadAction<string | null>) => {
            state.album = action.payload;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        clearFilters: state => {
            state.genre = null;
            state.artist = null;
            state.album = null;
            state.search = "";
        },
    },
});

export const { setGenre, setArtist, setAlbum, setSearch, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;
