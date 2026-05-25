import { polar } from "./client";

type CreateCheckoutParams = {
  productId: string;
  customerEmail?: string;
  successUrl: string;
};

export async function createCheckoutSession({
  productId,
  customerEmail,
  successUrl,
}: CreateCheckoutParams) {
  const checkout = await polar.checkouts.create({
    products: [productId],
    successUrl,
    customerEmail,
  });

  return checkout;
}
