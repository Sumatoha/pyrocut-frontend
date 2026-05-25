import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServiceClient();

  const { data: releases } = await supabase
    .from("releases")
    .select("*")
    .eq("channel", "stable")
    .order("published_at", { ascending: false })
    .limit(20);

  const items = (releases ?? [])
    .map(
      (r) => `
    <item>
      <title>Pyrocut ${r.version}</title>
      <sparkle:minimumSystemVersion>${r.min_os}</sparkle:minimumSystemVersion>
      <pubDate>${new Date(r.published_at).toUTCString()}</pubDate>
      <description><![CDATA[${r.notes_md ?? ""}]]></description>
      <enclosure
        url="${r.dmg_url}"
        sparkle:edSignature="${r.ed_signature}"
        sparkle:version="${r.version}"
        type="application/octet-stream"
      />
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">
  <channel>
    <title>Pyrocut Updates</title>
    <link>https://pyrocut.app</link>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
