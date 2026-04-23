import { Song } from "../services/types";

export interface SongFilters {
    genre: string | null;
    artist: string | null;
    album: string | null;
    search: string;
}

export const getGreeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return "Доброе утро";
    if (h < 18) return "Добрый день";
    return "Добрый вечер";
};

export const filterSongs = (songs: Song[], filters: SongFilters): Song[] =>
    songs.filter(song => {
        if (filters.genre && song.genre !== filters.genre) return false;
        if (filters.artist && song.artist !== filters.artist) return false;
        if (filters.album && song.album !== filters.album) return false;
        if (filters.search) {
            const q = filters.search.toLowerCase();
            return song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q) || song.album.toLowerCase().includes(q);
        }
        return true;
    });

export const uniqueValues = (songs: Song[], key: keyof Pick<Song, "genre" | "artist" | "album">): string[] =>
    Array.from(new Set(songs.map(s => s[key]))).sort();
