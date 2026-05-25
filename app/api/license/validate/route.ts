import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  key: z.string().min(1),
  activation_id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { valid: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { key, activation_id } = parsed.data;

  try {
    const response = await fetch(
      "https://api.polar.sh/v1/customer-portal/license-keys/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          key,
          organizationId: process.env.POLAR_ORGANIZATION_ID,
          activationId: activation_id,
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { valid: false, plan: "free", expires_at: null },
        { status: 200 },
      );
    }

    const data = await response.json();
    const isLifetime = data.benefit?.properties?.activationLimit === 5;

    return NextResponse.json({
      valid: data.status === "granted",
      plan: isLifetime ? "lifetime" : "pro",
      expires_at: data.expiresAt ?? null,
    });
  } catch {
    return NextResponse.json(
      { valid: false, plan: "free", expires_at: null },
      { status: 200 },
    );
  }
}
