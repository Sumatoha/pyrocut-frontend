import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  key: z.string().min(1),
  label: z.string().min(1).max(255),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { key, label } = parsed.data;

  try {
    const response = await fetch(
      "https://api.polar.sh/v1/customer-portal/license-keys/activate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          key,
          organizationId: process.env.POLAR_ORGANIZATION_ID,
          label,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: (errorData as Record<string, string>).detail ?? "Activation failed" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({
      activation_id: data.id,
      label: data.label,
    });
  } catch {
    return NextResponse.json(
      { error: "Activation service unavailable" },
      { status: 503 },
    );
  }
}
