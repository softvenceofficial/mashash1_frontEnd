import { baseApi } from "../api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    forgotPassword: build.mutation({
      query: (data) => ({
        url: "/forget-password",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    verifyOTPPassword: build.mutation({
      query: (data) => ({
        url: `/verify-otp-password`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    resendOTP: build.mutation({
      query: (data) => ({
        url: `/resend-otp`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    resetPassword: build.mutation({
      query: (data) => ({
        url: `/reset-password`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    userLogout: build.query({
      query: () => ({
        url: "/user/logout",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUserLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPPasswordMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useUserLogoutQuery,
} = authApi;
