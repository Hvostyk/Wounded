import { configureStore } from "@reduxjs/toolkit";
import playerReducer, { playSong, setProgress, setVolume, skipNext, skipPrev, togglePlay } from "../../../src/app/playerSlice";
import { Song } from "../../../src/services/types";

const songs: Song[] = [
    {
        id: "1",
        title: "A",
        artist: "X",
        duration: "3:00",
        durationSeconds: 180,
        album: "AL",
        genre: "Rock",
        color: "#f00",
        status: "ready",
        manifestUrl: null,
    },
    {
        id: "2",
        title: "B",
        artist: "Y",
        duration: "4:00",
        durationSeconds: 240,
        album: "AL",
        genre: "Pop",
        color: "#0f0",
        status: "ready",
        manifestUrl: null,
    },
    {
        id: "3",
        title: "C",
        artist: "Z",
        duration: "2:00",
        durationSeconds: 120,
        album: "BL",
        genre: "Jazz",
        color: "#00f",
        status: "ready",
        manifestUrl: null,
    },
];

const makeStore = () => configureStore({ reducer: { player: playerReducer } });

describe("playerSlice", () => {
    it("initial state has no song and volume 80", () => {
        const store = makeStore();
        const { currentSong, isPlaying, volume } = store.getState().player;
        expect(currentSong).toBeNull();
        expect(isPlaying).toBe(false);
        expect(volume).toBe(80);
    });

    it("playSong sets current song and starts playing", () => {
        const store = makeStore();
        store.dispatch(playSong(songs[0]));
        expect(store.getState().player.currentSong?.id).toBe("1");
        expect(store.getState().player.isPlaying).toBe(true);
    });

    it("playSong on same song toggles isPlaying", () => {
        const store = makeStore();
        store.dispatch(playSong(songs[0]));
        store.dispatch(playSong(songs[0]));
        expect(store.getState().player.isPlaying).toBe(false);
    });

    it("togglePlay does nothing without a song", () => {
        const store = makeStore();
        store.dispatch(togglePlay());
        expect(store.getState().player.isPlaying).toBe(false);
    });

    it("togglePlay flips isPlaying when song is set", () => {
        const store = makeStore();
        store.dispatch(playSong(songs[0]));
        store.dispatch(togglePlay());
        expect(store.getState().player.isPlaying).toBe(false);
    });

    it("setProgress updates progress", () => {
        const store = makeStore();
        store.dispatch(setProgress(42));
        expect(store.getState().player.progress).toBe(42);
    });

    it("setVolume updates volume", () => {
        const store = makeStore();
        store.dispatch(setVolume(50));
        expect(store.getState().player.volume).toBe(50);
    });

    it("skipNext advances to next song with wrap", () => {
        const store = makeStore();
        store.dispatch(playSong(songs[2]));
        store.dispatch(skipNext(songs));
        expect(store.getState().player.currentSong?.id).toBe("1");
    });

    it("skipPrev goes to previous song with wrap", () => {
        const store = makeStore();
        store.dispatch(playSong(songs[0]));
        store.dispatch(skipPrev(songs));
        expect(store.getState().player.currentSong?.id).toBe("3");
    });
});
