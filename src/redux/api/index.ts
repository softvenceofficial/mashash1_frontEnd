import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { endpoint }) => {
    const skipAuthEndpoints = ["userLogin", "userSignUp", "forgotPassword", "verifyOTPPassword"];

    if (skipAuthEndpoints.includes(endpoint)) {
      return headers;
    }

    const stored = localStorage.getItem("persist:userInfo");
    if (!stored) return headers;

    try {
      const parsed = JSON.parse(stored);
      const accessToken = parsed.token ? JSON.parse(parsed.token) : null;

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
    } catch (error) {
      console.error("Error parsing auth token:", error);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    localStorage.removeItem("persist:userInfo");
    window.location.href = "/auth/signin";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["auth", "user", "book", "recent-work", "previous-work", "trash", "subscription"],
});
