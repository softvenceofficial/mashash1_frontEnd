import { baseApi } from "../api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    customerCreate: build.mutation({
      query: (data) => ({
        url: "/customer/register",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    ownerCreate: build.mutation({
      query: (data) => ({
        url: "/owner/register",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["user"],
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
  useCustomerCreateMutation,
  useOwnerCreateMutation,
  useUserImageUpdateMutation,
} = userApi;
