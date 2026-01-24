import { baseApi } from "../api";
import { removeUserInfo, storeUserInfo } from "../slices/authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (data) => ({
        url: "/account/login/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth", "user"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (data.code === 200 && data.tokens) {
            dispatch(
              storeUserInfo({
                token: data.tokens.access,
                refresh: data.tokens.refresh,
                user: data.data,
              }),
            );
          }
        } catch (error) {
          console.log("Error storing user info:", error);
        }
      },
    }),

    userSignUp: build.mutation({
      query: (data) => ({
        url: "/account/signup/",
        method: "POST",
        body: data,
      }),
    }),

    googleLogin: build.mutation({
      query: (data) => ({
        url: "/account/google/login/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth", "user"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (data.code === 200 && data.tokens) {
            dispatch(
              storeUserInfo({
                token: data.tokens.access,
                refresh: data.tokens.refresh,
                user: data.data,
              }),
            );
          }
        } catch (error) {
          console.log("Error storing google user info:", error);
        }
      },
    }),

    forgotPassword: build.mutation({
      query: (data) => ({
        url: "/account/password/forgot/",
        method: "POST",
        body: data,
      }),
    }),

    verifyOTPPassword: build.mutation({
      query: (data) => ({
        url: `/account/password/verify-otp/`,
        method: "POST",
        body: data,
      }),
    }),

    resendOTP: build.mutation({
      query: (data) => ({
        url: `/resend-otp`,
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: build.mutation({
      query: (data) => ({
        url: `/account/password/reset/`,
        method: "POST",
        body: data,
      }),
    }),

    userLogout: build.mutation({
      query: () => ({
        url: "/account/logout/",
        method: "POST",
      }),
      invalidatesTags: ["auth", "user"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(removeUserInfo());
        } catch (error) {
          console.log("Error during logout:", error);
        }
      },
    }),
  }),
});

export const {
  useUserLoginMutation,
  useUserSignUpMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPPasswordMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useUserLogoutMutation,
} = authApi;