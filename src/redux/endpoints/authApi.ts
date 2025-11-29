import { baseApi } from "../api";
import { storeUserInfo } from "../slices/authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (data) => ({
        url: "/account/login/",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            storeUserInfo({
              token: data.tokens.access,
              refresh: data.tokens.refresh,
              user: data.data,
            }),
          );
        } catch (error) {
          console.log("Error storing user info:", error);
        }
      },
    }),

    userSignUp: build.mutation({
      query: (data) => ({
        url: "/account/signup/",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    forgotPassword: build.mutation({
      query: (data) => ({
        url: "/account/password/forgot/",
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
  useUserSignUpMutation,
  useForgotPasswordMutation,
  useVerifyOTPPasswordMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useUserLogoutQuery,
} = authApi;
