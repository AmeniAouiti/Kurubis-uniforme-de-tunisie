import { NextResponse } from "next/server";
import { getDbAsync } from "@/lib/supabase/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = await getDbAsync();

  const { data } = await db
    .from("catalogs")
    .select("file_url, file_name, title")
    .eq("download_slug", slug)
    .maybeSingle();

  if (data?.file_url) {
    return NextResponse.redirect(data.file_url);
  }

  return NextResponse.json({ error: "Catalogue introuvable" }, { status: 404 });
}
