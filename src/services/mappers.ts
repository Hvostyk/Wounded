import { MusicPlaylist, PlaylistDto, Song, TrackDto } from "./types";

const fallbackAlbums = ["Uploaded Singles", "Night Sessions", "Signal Archive", "Open Wounds"];
const fallbackGenres = ["Electronic", "Ambient", "Indie", "Synthwave"];
const fallbackColors = ["#c2185b", "#7c3aed", "#0891b2", "#ea580c", "#2563eb", "#dc2626", "#0f766e", "#ca8a04"];

const formatDuration = (durationSeconds: number): string => {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const hashValue = (value: string): number => value.split("").reduce((accumulator, current, index) => accumulator + current.charCodeAt(0) * (index + 1), 0);

export const mapTrackToSong = (track: TrackDto): Song => {
    const hash = hashValue(track.trackId);

    return {
        id: track.trackId,
        title: track.title,
        artist: track.creatorUsername,
        duration: formatDuration(track.duration),
        durationSeconds: track.duration,
        album: fallbackAlbums[hash % fallbackAlbums.length],
        genre: fallbackGenres[hash % fallbackGenres.length],
        color: fallbackColors[hash % fallbackColors.length],
        status: track.status,
        manifestUrl: track.manifestUrl,
    };
};

export const mapPlaylist = (playlist: PlaylistDto): MusicPlaylist => ({
    id: playlist.playlistId,
    title: playlist.title,
    description: playlist.description ?? "",
    creatorId: playlist.creatorId,
    trackIds: playlist.trackIds,
});
