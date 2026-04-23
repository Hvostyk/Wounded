import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer, { addToPlaylist, createPlaylist, deletePlaylist, removeFromPlaylist, toggleFavorite } from "../../../src/app/favoritesSlice";

const makeStore = () => configureStore({ reducer: { favorites: favoritesReducer } });

describe("favoritesSlice", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("initial state has empty favorites and playlists", () => {
        const store = makeStore();
        expect(store.getState().favorites.favoriteIds).toHaveLength(0);
        expect(store.getState().favorites.playlists).toHaveLength(0);
    });

    it("toggleFavorite adds a song id", () => {
        const store = makeStore();
        store.dispatch(toggleFavorite(1));
        expect(store.getState().favorites.favoriteIds).toContain(1);
    });

    it("toggleFavorite removes an already-favorited song", () => {
        const store = makeStore();
        store.dispatch(toggleFavorite(1));
        store.dispatch(toggleFavorite(1));
        expect(store.getState().favorites.favoriteIds).not.toContain(1);
    });

    it("createPlaylist adds a playlist with correct name", () => {
        const store = makeStore();
        store.dispatch(createPlaylist("My List"));
        const playlists = store.getState().favorites.playlists;
        expect(playlists).toHaveLength(1);
        expect(playlists[0].name).toBe("My List");
        expect(playlists[0].songIds).toHaveLength(0);
    });

    it("deletePlaylist removes the playlist", () => {
        const store = makeStore();
        store.dispatch(createPlaylist("To Delete"));
        const id = store.getState().favorites.playlists[0].id;
        store.dispatch(deletePlaylist(id));
        expect(store.getState().favorites.playlists).toHaveLength(0);
    });

    it("addToPlaylist appends a song to the playlist", () => {
        const store = makeStore();
        store.dispatch(createPlaylist("Rock"));
        const id = store.getState().favorites.playlists[0].id;
        store.dispatch(addToPlaylist({ playlistId: id, songId: 5 }));
        expect(store.getState().favorites.playlists[0].songIds).toContain(5);
    });

    it("addToPlaylist does not add duplicates", () => {
        const store = makeStore();
        store.dispatch(createPlaylist("Rock"));
        const id = store.getState().favorites.playlists[0].id;
        store.dispatch(addToPlaylist({ playlistId: id, songId: 5 }));
        store.dispatch(addToPlaylist({ playlistId: id, songId: 5 }));
        expect(store.getState().favorites.playlists[0].songIds).toHaveLength(1);
    });

    it("removeFromPlaylist removes the song", () => {
        const store = makeStore();
        store.dispatch(createPlaylist("Rock"));
        const id = store.getState().favorites.playlists[0].id;
        store.dispatch(addToPlaylist({ playlistId: id, songId: 5 }));
        store.dispatch(removeFromPlaylist({ playlistId: id, songId: 5 }));
        expect(store.getState().favorites.playlists[0].songIds).toHaveLength(0);
    });
});
