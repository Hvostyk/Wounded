import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockSongs, mockUsers } from "./mockData";
import { AuthCredentials, AuthResponse, Song } from "./types";

export const woundedApi = createApi({
    reducerPath: "woundedApi",
    baseQuery: fakeBaseQuery(),
    endpoints: builder => ({
        getSongs: builder.query<Song[], void>({
            queryFn: () => ({ data: mockSongs }),
        }),
        login: builder.mutation<AuthResponse, AuthCredentials>({
            queryFn: ({ login, password }) => {
                const user = mockUsers.find(u => u.login === login && u.password === password);
                if (user) {
                    return { data: { token: `mock_${Date.now()}`, login } };
                }
                return { error: { status: 401, error: "Invalid credentials" } };
            },
        }),
        register: builder.mutation<AuthResponse, AuthCredentials>({
            queryFn: ({ login, password }) => {
                mockUsers.push({ login, password });
                return { data: { token: `mock_${Date.now()}`, login } };
            },
        }),
    }),
});

export const { useGetSongsQuery, useLoginMutation, useRegisterMutation } = woundedApi;
