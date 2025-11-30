import { baseApi } from "../api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUser: build.query({
      query: () => ({
        url: `/account/profile/`,
        method: "GET",
        credentials: "include",
        invalidatesTags: ["user"],
      }),
    }),

    userImageUpdate: build.mutation({
      query: (data) => ({
        url: "/update/user/image",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUserImageUpdateMutation,
} = userApi;
