import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Song } from "../services/types";

interface PlayerState {
    currentSong: Song | null;
    isPlaying: boolean;
    progress: number;
    volume: number;
}

const initialState: PlayerState = {
    currentSong: null,
    isPlaying: false,
    progress: 0,
    volume: 80,
};

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        playSong: (state, action: PayloadAction<Song>) => {
            if (state.currentSong?.id === action.payload.id) {
                state.isPlaying = !state.isPlaying;
            } else {
                state.currentSong = action.payload;
                state.isPlaying = true;
                state.progress = 0;
            }
        },
        togglePlay: state => {
            if (state.currentSong) state.isPlaying = !state.isPlaying;
        },
        setProgress: (state, action: PayloadAction<number>) => {
            state.progress = action.payload;
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload;
        },
        skipNext: (state, action: PayloadAction<Song[]>) => {
            const songs = action.payload;
            if (!state.currentSong || songs.length === 0) return;
            const idx = songs.findIndex(s => s.id === state.currentSong!.id);
            state.currentSong = songs[(idx + 1) % songs.length];
            state.isPlaying = true;
            state.progress = 0;
        },
        skipPrev: (state, action: PayloadAction<Song[]>) => {
            const songs = action.payload;
            if (!state.currentSong || songs.length === 0) return;
            const idx = songs.findIndex(s => s.id === state.currentSong!.id);
            state.currentSong = songs[(idx - 1 + songs.length) % songs.length];
            state.isPlaying = true;
            state.progress = 0;
        },
    },
});

export const { playSong, togglePlay, setProgress, setVolume, skipNext, skipPrev } = playerSlice.actions;
export default playerSlice.reducer;
