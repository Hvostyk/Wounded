import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const woundedApi = createApi({
    reducerPath: "woundedApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://wounded.com" }),
    endpoints: builder => ({
        // getWounded: builder.query<any, string>({
        //     query: name => `wounded/${name}`,
        // }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
// export const { useGetWounded } = woundedApi;
