import { configureStore } from "@reduxjs/toolkit";
import { logout } from "../../../src/app/authSlice";
import favoritesReducer from "../../../src/app/favoritesSlice";
import { MusicPlaylist, Song } from "../../../src/services/types";
import { woundedApi } from "../../../src/services/woundedApi";

const makeStore = () =>
    configureStore({
        reducer: {
            favorites: favoritesReducer,
            [woundedApi.reducerPath]: woundedApi.reducer,
        },
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(woundedApi.middleware),
    });

const favoriteSongs: Song[] = [
    {
        id: "track-1",
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
        id: "track-2",
        title: "B",
        artist: "Y",
        duration: "4:00",
        durationSeconds: 240,
        album: "BL",
        genre: "Pop",
        color: "#0f0",
        status: "ready",
        manifestUrl: null,
    },
];

const playlists: MusicPlaylist[] = [
    {
        id: "playlist-1",
        title: "Focus",
        description: "",
        creatorId: "user-1",
        trackIds: ["track-1"],
    },
];

describe("favoritesSlice", () => {
    const createQueryFulfilledAction = <Payload>(endpointName: string, payload: Payload) => ({
        type: `${woundedApi.reducerPath}/executeQuery/fulfilled`,
        payload,
        meta: {
            arg: {
                endpointName,
            },
        },
    });

    it("initial state has empty favorites and playlists", () => {
        const store = makeStore();
        expect(store.getState().favorites.favoriteIds).toHaveLength(0);
        expect(store.getState().favorites.playlists).toHaveLength(0);
    });

    it("stores favorite ids from the API payload", () => {
        const store = makeStore();
        store.dispatch(createQueryFulfilledAction("getFavoriteSongs", favoriteSongs));
        expect(store.getState().favorites.favoriteIds).toEqual(["track-1", "track-2"]);
    });

    it("stores playlists from the API payload", () => {
        const store = makeStore();
        store.dispatch(createQueryFulfilledAction("getPlaylists", playlists));
        expect(store.getState().favorites.playlists).toEqual(playlists);
    });

    it("resets state on logout", () => {
        const store = makeStore();
        store.dispatch(createQueryFulfilledAction("getFavoriteSongs", favoriteSongs));
        store.dispatch(createQueryFulfilledAction("getPlaylists", playlists));
        store.dispatch(logout());
        expect(store.getState().favorites.favoriteIds).toEqual([]);
        expect(store.getState().favorites.playlists).toEqual([]);
    });
});
