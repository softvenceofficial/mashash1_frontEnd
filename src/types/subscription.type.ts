export interface Plan {
  id: number;
  name: string;
  price_usd: string;
  image_limit: number;
  stripe_product_id: string;
  stripe_price_id: string;
  is_active: boolean;
  created_at: string;
}

export interface CheckoutRequest {
  plan_id: number;
}

export interface CheckoutResponse {
  checkout_url: string;
  plan: {
    name: string;
    price_usd: number;
    image_limit: number;
  };
}

export interface SubscriptionStatus {
  has_subscription: boolean;
  plan: string | null;
  status: string;
  image_limit: number;
  images_used: number;
  images_remaining: number;
  credit_balance: number;
  current_period_end: string;
  can_generate_image: boolean;
}
