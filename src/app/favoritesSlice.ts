import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Playlist {
    id: string;
    name: string;
    songIds: number[];
}

interface FavoritesState {
    favoriteIds: number[];
    playlists: Playlist[];
}

const stored = localStorage.getItem("wounded_favorites");
const initialState: FavoritesState = stored ? (JSON.parse(stored) as FavoritesState) : { favoriteIds: [], playlists: [] };

const persist = (favoriteIds: number[], playlists: Playlist[]) => {
    localStorage.setItem(
        "wounded_favorites",
        JSON.stringify({
            favoriteIds,
            playlists: playlists.map(p => ({ id: p.id, name: p.name, songIds: Array.from(p.songIds) })),
        }),
    );
};

export const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        toggleFavorite: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            if (state.favoriteIds.includes(id)) {
                state.favoriteIds = state.favoriteIds.filter(fid => fid !== id);
            } else {
                state.favoriteIds.push(id);
            }
            persist(Array.from(state.favoriteIds), Array.from(state.playlists) as Playlist[]);
        },
        createPlaylist: (state, action: PayloadAction<string>) => {
            state.playlists.push({ id: Date.now().toString(), name: action.payload, songIds: [] });
            persist(Array.from(state.favoriteIds), Array.from(state.playlists) as Playlist[]);
        },
        deletePlaylist: (state, action: PayloadAction<string>) => {
            state.playlists = state.playlists.filter(p => p.id !== action.payload);
            persist(Array.from(state.favoriteIds), Array.from(state.playlists) as Playlist[]);
        },
        renamePlaylist: (state, action: PayloadAction<{ id: string; name: string }>) => {
            const p = state.playlists.find(pl => pl.id === action.payload.id);
            if (p) {
                p.name = action.payload.name;
                persist(Array.from(state.favoriteIds), Array.from(state.playlists) as Playlist[]);
            }
        },
        addToPlaylist: (state, action: PayloadAction<{ playlistId: string; songId: number }>) => {
            const p = state.playlists.find(pl => pl.id === action.payload.playlistId);
            if (p && !p.songIds.includes(action.payload.songId)) {
                p.songIds.push(action.payload.songId);
                persist(Array.from(state.favoriteIds), Array.from(state.playlists) as Playlist[]);
            }
        },
        removeFromPlaylist: (state, action: PayloadAction<{ playlistId: string; songId: number }>) => {
            const p = state.playlists.find(pl => pl.id === action.payload.playlistId);
            if (p) {
                p.songIds = p.songIds.filter(id => id !== action.payload.songId);
                persist(Array.from(state.favoriteIds), Array.from(state.playlists) as Playlist[]);
            }
        },
    },
});

export const { toggleFavorite, createPlaylist, deletePlaylist, renamePlaylist, addToPlaylist, removeFromPlaylist } = favoritesSlice.actions;
export default favoritesSlice.reducer;
