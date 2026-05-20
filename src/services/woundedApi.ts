import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../app/store";
import { getServiceUrl } from "./config";
import { mapPlaylist, mapTrackToSong } from "./mappers";
import {
    AuthCredentials,
    AuthSession,
    AuthTokensResponse,
    CreatePlaylistRequest,
    CreateProfileRequest,
    MusicPlaylist,
    PlaylistsResponse,
    Profile,
    RegisterCredentials,
    Song,
    TracksResponse,
    UpdatePlaylistRequest,
    UpdateProfileRequest,
} from "./types";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: "",
    credentials: "include",
    fetchFn: (...args) => {
        if (!globalThis.fetch) {
            return Promise.reject(new Error("Fetch is not available"));
        }

        return globalThis.fetch(...args);
    },
    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as RootState).auth.accessToken;

        if (accessToken) {
            headers.set("accessToken", accessToken);
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        headers.set("Content-Type", "application/json");

        return headers;
    },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    return result;
};

export const woundedApi = createApi({
    reducerPath: "woundedApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Profile", "Track", "Favorite", "Playlist"],
    endpoints: builder => ({
        login: builder.mutation<AuthSession, AuthCredentials>({
            query: credentials => ({
                url: getServiceUrl("auth", "/auth/login"),
                method: "POST",
                body: credentials,
            }),
            transformResponse: (response: AuthTokensResponse, _meta, arg) => ({
                login: arg.login,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            }),
        }),
        register: builder.mutation<AuthSession, RegisterCredentials>({
            async queryFn(credentials, _api, _extraOptions, baseQuery) {
                const registerResponse = await baseQuery({
                    url: getServiceUrl("auth", "/auth/register"),
                    method: "POST",
                    body: {
                        login: credentials.login,
                        password: credentials.password,
                    },
                });

                if (registerResponse.error) {
                    return { error: registerResponse.error };
                }

                const tokens = registerResponse.data as AuthTokensResponse;
                const createProfileBody: CreateProfileRequest = {
                    username: credentials.username,
                    description: credentials.description,
                };

                const profileResponse = await baseQuery({
                    url: getServiceUrl("profiles", "/profiles"),
                    method: "POST",
                    body: createProfileBody,
                    headers: {
                        accessToken: tokens.accessToken,
                        Authorization: `Bearer ${tokens.accessToken}`,
                    },
                });

                if (profileResponse.error) {
                    return { error: profileResponse.error };
                }

                return {
                    data: {
                        login: credentials.login,
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                    },
                };
            },
        }),
        getMyProfile: builder.query<Profile, void>({
            query: () => ({
                url: getServiceUrl("profiles", "/profiles/me"),
                method: "GET",
            }),
            providesTags: ["Profile"],
        }),
        updateMyProfile: builder.mutation<Profile, UpdateProfileRequest>({
            query: body => ({
                url: getServiceUrl("profiles", "/profiles/me"),
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Profile"],
        }),
        getSongs: builder.query<Song[], void>({
            query: () => ({
                url: getServiceUrl("music", "/music/me/uploads"),
                method: "GET",
            }),
            transformResponse: (response: TracksResponse) => response.tracks.map(mapTrackToSong),
            providesTags: ["Track"],
        }),
        uploadTrack: builder.mutation<void, { file: File; title: string }>({
            query: ({ file, title }) => {
                const formData = new FormData();
                formData.append("title", title);
                formData.append("file", file);

                return {
                    url: getServiceUrl("music", "/music/uploads"),
                    method: "POST",
                    body: formData,
                    // Важнейший момент: удаляем заголовок Content-Type,
                    // чтобы браузер сам выставил multipart/form-data с правильным boundary
                    headers: {
                        "Content-Type": undefined,
                    },
                };
            },
            // Автоматически обновляем список треков на клиенте после успешной загрузки
            invalidatesTags: ["Track"],
        }),
        getFavoriteSongs: builder.query<Song[], void>({
            query: () => ({
                url: getServiceUrl("music", "/music/me/favorites"),
                method: "GET",
            }),
            transformResponse: (response: TracksResponse) => response.tracks.map(mapTrackToSong),
            providesTags: ["Favorite"],
        }),
        addFavorite: builder.mutation<void, string>({
            query: trackId => ({
                url: getServiceUrl("music", "/music/me/favorites"),
                method: "POST",
                body: { trackId },
            }),
            invalidatesTags: ["Favorite"],
        }),
        removeFavorite: builder.mutation<void, string>({
            query: trackId => ({
                url: getServiceUrl("music", `/music/me/favorites/${trackId}`),
                method: "DELETE",
            }),
            invalidatesTags: ["Favorite"],
        }),
        getPlaylists: builder.query<MusicPlaylist[], void>({
            query: () => ({
                url: getServiceUrl("music", "/music/me/playlists"),
                method: "GET",
            }),
            transformResponse: (response: PlaylistsResponse) => response.playlists.map(mapPlaylist),
            providesTags: ["Playlist"],
        }),
        createPlaylist: builder.mutation<void, CreatePlaylistRequest>({
            query: body => ({
                url: getServiceUrl("music", "/music/playlists"),
                method: "POST",
                body,
            }),
            invalidatesTags: ["Playlist"],
        }),
        updatePlaylist: builder.mutation<void, UpdatePlaylistRequest>({
            query: ({ playlistId, ...body }) => ({
                url: getServiceUrl("music", `/music/playlists/${playlistId}`),
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Playlist"],
        }),
        deletePlaylist: builder.mutation<void, string>({
            query: playlistId => ({
                url: getServiceUrl("music", `/music/playlists/${playlistId}`),
                method: "DELETE",
            }),
            invalidatesTags: ["Playlist"],
        }),
    }),
});

export const {
    useAddFavoriteMutation,
    useCreatePlaylistMutation,
    useDeletePlaylistMutation,
    useGetFavoriteSongsQuery,
    useGetMyProfileQuery,
    useGetPlaylistsQuery,
    useGetSongsQuery,
    useLoginMutation,
    useRegisterMutation,
    useRemoveFavoriteMutation,
    useUpdateMyProfileMutation,
    useUpdatePlaylistMutation,
    useUploadTrackMutation,
} = woundedApi;
