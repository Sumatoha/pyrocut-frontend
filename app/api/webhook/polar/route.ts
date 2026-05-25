import { Webhooks } from "@polar-sh/nextjs";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { welcomeProEmail, welcomeLifetimeEmail } from "@/lib/email/templates";

type SupabaseAdmin = Awaited<ReturnType<typeof createServiceClient>>;

async function linkOrStorePending(
  email: string,
  eventId: string,
  payload: Record<string, unknown>,
  handler: (userId: string, supabase: SupabaseAdmin) => Promise<void>,
) {
  const supabase = await createServiceClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (profile) {
    await handler(profile.id, supabase);
    return;
  }

  await supabase.from("pending_orders").upsert(
    {
      id: eventId,
      email,
      payload: payload as never,
      created_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
}

const handler = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onSubscriptionCreated: async (payload) => {
    const email = payload.data.customer.email;
    if (!email) return;

    const sub = payload.data;
    await linkOrStorePending(
      email,
      sub.id,
      sub as unknown as Record<string, unknown>,
      async (userId, supabase) => {
        await supabase.from("subscriptions").upsert(
          {
            id: sub.id,
            user_id: userId,
            status: "active",
            interval: sub.recurringInterval ?? "month",
            current_period_end: sub.currentPeriodEnd ?? null,
            canceled_at: null,
            polar_product_id: sub.productId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );

        await supabase
          .from("profiles")
          .update({ polar_customer_id: sub.customerId })
          .eq("id", userId);
      },
    );
  },

  onSubscriptionUpdated: async (payload) => {
    const sub = payload.data;
    const supabase = await createServiceClient();

    await supabase
      .from("subscriptions")
      .update({
        status: sub.status,
        current_period_end: sub.currentPeriodEnd ?? null,
        canceled_at: sub.canceledAt ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sub.id);
  },

  onSubscriptionCanceled: async (payload) => {
    const sub = payload.data;
    const supabase = await createServiceClient();

    await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        canceled_at: sub.canceledAt ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", sub.id);
  },

  onOrderCreated: async (payload) => {
    const order = payload.data;
    const email = order.customer.email;
    if (!email) return;

    const isLifetime = order.productId === process.env.POLAR_PRODUCT_LIFETIME;
    if (!isLifetime) return;

    await linkOrStorePending(
      email,
      order.id,
      order as unknown as Record<string, unknown>,
      async (userId, supabase) => {
        await supabase.from("lifetime_licenses").upsert(
          { id: order.id, user_id: userId },
          { onConflict: "id" },
        );

        await supabase
          .from("profiles")
          .update({ polar_customer_id: order.customerId })
          .eq("id", userId);
      },
    );
  },

  onCustomerCreated: async (payload) => {
    const customer = payload.data;
    if (!customer.email) return;

    const supabase = await createServiceClient();
    await supabase
      .from("profiles")
      .update({ polar_customer_id: customer.id })
      .eq("email", customer.email);
  },

  onCustomerUpdated: async (payload) => {
    const customer = payload.data;
    if (!customer.email) return;

    const supabase = await createServiceClient();
    await supabase
      .from("profiles")
      .update({ polar_customer_id: customer.id })
      .eq("email", customer.email);
  },

  onBenefitGrantCreated: async (payload) => {
    const grant = payload.data;
    const email = grant.customer.email;
    if (!email) return;

    if (grant.benefit.type !== "license_keys") return;

    const properties = grant.properties as Record<string, unknown> | null;
    const licenseKeyId = (properties?.licenseKeyId as string) ?? grant.id;
    const fullKey = (properties?.key as string) ?? "";
    const plan = grant.subscriptionId ? "pro" : "lifetime";
    const activationLimit = plan === "pro" ? 3 : 5;

    await linkOrStorePending(
      email,
      grant.id,
      grant as unknown as Record<string, unknown>,
      async (userId, supabase) => {
        await supabase.from("license_keys").upsert(
          {
            id: licenseKeyId,
            user_id: userId,
            key: fullKey,
            display_key: fullKey.replace(/.(?=.{4})/g, "•"),
            plan,
            activation_limit: activationLimit,
            expires_at: null,
          },
          { onConflict: "id" },
        );

        if (fullKey) {
          const template =
            plan === "lifetime"
              ? welcomeLifetimeEmail(fullKey)
              : welcomeProEmail(fullKey);
          sendEmail({
            to: email,
            subject:
              plan === "lifetime"
                ? "Welcome to Pyrocut — Lifetime"
                : "Welcome to Pyrocut Founder",
            html: template,
          }).catch(() => {});
        }
      },
    );
  },
});

export const POST = handler;
