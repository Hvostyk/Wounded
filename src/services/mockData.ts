import { Song } from "./types";

export const mockSongs: Song[] = [
    { id: 1, title: "Neon Pulse", artist: "CrimsonWave", duration: "3:42", album: "Digital Wounds", genre: "Synthwave", color: "#c2185b" },
    { id: 2, title: "Midnight Echo", artist: "Hollow Space", duration: "4:15", album: "Void Sessions", genre: "Ambient", color: "#7c3aed" },
    { id: 3, title: "Shattered Glass", artist: "Iron Circuit", duration: "2:58", album: "Broken Signal", genre: "Electronic", color: "#0891b2" },
    { id: 4, title: "Burn Slow", artist: "Ember & Ash", duration: "5:01", album: "After Flames", genre: "Indie", color: "#ea580c" },
    { id: 5, title: "Last Signal", artist: "CrimsonWave", duration: "3:33", album: "Digital Wounds", genre: "Synthwave", color: "#be123c" },
    { id: 6, title: "Deep Cuts", artist: "Void Walker", duration: "4:44", album: "Scar Tissue", genre: "Trip-Hop", color: "#475569" },
    { id: 7, title: "Red Thread", artist: "Ember & Ash", duration: "3:20", album: "After Flames", genre: "Indie", color: "#dc2626" },
    { id: 8, title: "Static Rain", artist: "Hollow Space", duration: "6:02", album: "Void Sessions", genre: "Ambient", color: "#6366f1" },
];

export const mockUsers: { login: string; password: string }[] = [{ login: "demo", password: "demo123" }];
