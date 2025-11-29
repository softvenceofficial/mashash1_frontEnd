import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState, endpoint }) => {
      void getState;
      const skipAuthEndpoints = ["userLogin", "userSignUp"];

      if (skipAuthEndpoints.includes(endpoint)) {
        return headers;
      }

      const stored = localStorage.getItem("persist:userInfo");
      if (!stored) return headers;

      const parsed = JSON.parse(stored);
        const accessToken = parsed.token ? JSON.parse(parsed.token) : null;

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["auth", "user"],
});
