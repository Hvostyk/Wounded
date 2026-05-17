import { Song } from "../../../src/services/types";
import { filterSongs, getGreeting, uniqueValues } from "../../../src/utils/songUtils";

const songs: Song[] = [
    { id: 1, title: "Neon Pulse", artist: "CrimsonWave", duration: "3:42", album: "Digital Wounds", genre: "Synthwave", color: "#c2185b" },
    { id: 2, title: "Midnight Echo", artist: "Hollow Space", duration: "4:15", album: "Void Sessions", genre: "Ambient", color: "#7c3aed" },
    { id: 3, title: "Shattered Glass", artist: "Iron Circuit", duration: "2:58", album: "Broken Signal", genre: "Electronic", color: "#0891b2" },
    { id: 4, title: "Burn Slow", artist: "CrimsonWave", duration: "5:01", album: "Digital Wounds", genre: "Synthwave", color: "#ea580c" },
];

describe("filterSongs", () => {
    it("returns all songs when no filters active", () => {
        const result = filterSongs(songs, { genre: null, artist: null, album: null, search: "" });
        expect(result).toHaveLength(4);
    });

    it("filters by genre", () => {
        const result = filterSongs(songs, { genre: "Synthwave", artist: null, album: null, search: "" });
        expect(result).toHaveLength(2);
        expect(result.every(s => s.genre === "Synthwave")).toBe(true);
    });

    it("filters by artist", () => {
        const result = filterSongs(songs, { genre: null, artist: "CrimsonWave", album: null, search: "" });
        expect(result).toHaveLength(2);
    });

    it("filters by search query on title", () => {
        const result = filterSongs(songs, { genre: null, artist: null, album: null, search: "neon" });
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Neon Pulse");
    });

    it("composes multiple filters", () => {
        const result = filterSongs(songs, { genre: "Synthwave", artist: "CrimsonWave", album: null, search: "" });
        expect(result).toHaveLength(2);
    });

    it("returns empty when no matches", () => {
        const result = filterSongs(songs, { genre: null, artist: null, album: null, search: "zzz_notfound" });
        expect(result).toHaveLength(0);
    });
});

describe("uniqueValues", () => {
    it("returns sorted unique genres", () => {
        const result = uniqueValues(songs, "genre");
        expect(result).toEqual(["Ambient", "Electronic", "Synthwave"]);
    });

    it("returns sorted unique artists", () => {
        const result = uniqueValues(songs, "artist");
        expect(result).toEqual(["CrimsonWave", "Hollow Space", "Iron Circuit"]);
    });
});

describe("getGreeting", () => {
    it("returns a non-empty string", () => {
        expect(typeof getGreeting()).toBe("string");
        expect(getGreeting().length).toBeGreaterThan(0);
    });

    it("returns one of the three valid greetings", () => {
        const valid = ["Доброе утро", "Добрый день", "Добрый вечер"];
        expect(valid).toContain(getGreeting());
    });
});
