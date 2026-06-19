import { NextResponse } from "next/server";
import { getAuthUser, getDbAsync, getProfile } from "@/lib/supabase/db";
import { mapCatalogRow } from "@/lib/db/map-cms";
import type { CatalogItem } from "@/lib/data/catalogs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = (await request.json()) as Partial<CatalogItem> & { fileUrl?: string };
  const db = await getDbAsync();

  const updates: Record<string, unknown> = {};
  if (body.title != null) updates.title = body.title;
  if (body.subtitle != null) updates.subtitle = body.subtitle;
  if (body.description != null) updates.description = body.description;
  if (body.image != null) updates.image = body.image;
  if (body.downloadSlug != null) updates.download_slug = body.downloadSlug;
  if (body.href != null) updates.href = body.href;
  if (body.fileName != null) updates.file_name = body.fileName;
  if (body.fileUrl != null) updates.file_url = body.fileUrl;

  const { data, error } = await db.from("catalogs").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ catalog: mapCatalogRow(data) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const db = await getDbAsync();
  const { error } = await db.from("catalogs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
