export type EntityId = string;

export type TrackStatus = "processing" | "ready";

export interface Song {
    id: EntityId;
    title: string;
    artist: string;
    duration: string;
    durationSeconds: number;
    album: string;
    genre: string;
    color: string;
    status: TrackStatus;
    manifestUrl: string | null;
}

export interface AuthCredentials {
    login: string;
    password: string;
}

export interface RegisterCredentials extends AuthCredentials {
    username: string;
    description?: string;
}

export interface AuthTokensResponse {
    accessToken: string;
    refreshToken: string;
}

export interface AuthSession extends AuthTokensResponse {
    login: string;
}

export interface Profile {
    userId: EntityId;
    username: string;
    description?: string;
}

export interface CreateProfileRequest {
    username: string;
    description?: string;
}

export interface UpdateProfileRequest {
    username?: string;
    description?: string;
}

export interface TrackDto {
    trackId: EntityId;
    title: string;
    creatorId: EntityId;
    creatorUsername: string;
    duration: number;
    status: TrackStatus;
    bucketName: string;
    objectPrefix: string;
    manifestObjectKey: string;
    manifestUrl: string;
}

export interface TracksResponse {
    tracks: TrackDto[];
}

export interface PlaylistDto {
    playlistId: EntityId;
    title: string;
    description?: string;
    creatorId: EntityId;
    trackIds: EntityId[];
}

export interface PlaylistsResponse {
    playlists: PlaylistDto[];
}

export interface MusicPlaylist {
    id: EntityId;
    title: string;
    description: string;
    creatorId: EntityId;
    trackIds: EntityId[];
}

export interface CreatePlaylistRequest {
    title: string;
    description?: string;
    trackIds?: EntityId[];
}

export interface UpdatePlaylistRequest {
    playlistId: EntityId;
    title?: string;
    description?: string;
    trackIds?: EntityId[];
}
