import { baseApi } from "../api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUser: build.query({
      query: () => ({
        url: `/account/profile/`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    updateUserProfile: build.mutation({
      query: (data) => ({
        url: "/account/profile/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    deleteAccount: build.mutation({
      query: () => ({
        url: "/account/profile/delete/",
        method: "DELETE",
      }),
      invalidatesTags: ["auth", "user"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useDeleteAccountMutation,
} = userApi;
