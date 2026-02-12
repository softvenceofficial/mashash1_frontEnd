import { baseApi } from "../api";
import type { Plan, CheckoutRequest, CheckoutResponse, SubscriptionStatus } from "@/types";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPlans: build.query<Plan[], void>({
      query: () => ({
        url: "/plans/",
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),

    createCheckoutSession: build.mutation<CheckoutResponse, CheckoutRequest>({
      query: (data) => ({
        url: "/subscriptions/checkout/",
        method: "POST",
        body: data,
      }),
    }),

    getMySubscription: build.query<SubscriptionStatus, void>({
      query: () => ({
        url: "/subscriptions/me/",
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
  }),
});

export const {
  useGetAllPlansQuery,
  useCreateCheckoutSessionMutation,
  useGetMySubscriptionQuery,
} = subscriptionApi;
