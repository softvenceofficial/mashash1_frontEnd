import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const storedData = localStorage.getItem("persist:userInfo");
      const accessToken = JSON.parse(storedData!).token;

      if (accessToken) headers.set("authorization", JSON.parse(accessToken));

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["auth", "user"],
});
