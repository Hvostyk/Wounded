export interface Song {
    id: number;
    title: string;
    artist: string;
    duration: string;
    album: string;
    genre: string;
    color: string;
}

export interface AuthCredentials {
    login: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    login: string;
}
