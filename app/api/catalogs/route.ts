import { NextResponse } from "next/server";
import { getAuthUser, getDbAsync, getProfile } from "@/lib/supabase/db";
import { mapCatalogRow, catalogToRow } from "@/lib/db/map-cms";
import type { CatalogItem } from "@/lib/data/catalogs";

export async function GET() {
  try {
    const db = await getDbAsync();

    const { data, error } = await db
      .from("catalogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ catalogs: (data || []).map(mapCatalogRow) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const profile = await getProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = (await request.json()) as CatalogItem & { fileUrl?: string };
    const db = await getDbAsync();
    const row = catalogToRow(body);

    const { data, error } = await db.from("catalogs").insert(row).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ catalog: mapCatalogRow(data) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
