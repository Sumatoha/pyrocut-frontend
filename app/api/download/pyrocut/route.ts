import { type NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_DOWNLOADS = 3;
const downloadCounts = new Map<string, { count: number; resetAt: number }>();

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const now = Date.now();
  const entry = downloadCounts.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= MAX_DOWNLOADS) {
      return NextResponse.json(
        { error: "Too many downloads. Try again later." },
        { status: 429 },
      );
    }
    downloadCounts.set(ip, { ...entry, count: entry.count + 1 });
  } else {
    downloadCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  }

  const supabase = await createServiceClient();

  const { data: release } = await supabase
    .from("releases")
    .select("dmg_url, version")
    .eq("channel", "stable")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!release) {
    return NextResponse.json(
      { error: "No release available" },
      { status: 404 },
    );
  }

  return NextResponse.redirect(release.dmg_url);
}
