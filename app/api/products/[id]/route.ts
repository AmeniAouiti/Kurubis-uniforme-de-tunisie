import { NextResponse } from "next/server";
import { getAuthUser, getDbAsync, getProfile } from "@/lib/supabase/db";
import { mapProductRow } from "@/lib/db/map-cms";
import { enrichProduct } from "@/lib/product-filters";
import type { Product } from "@/types";

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

  const body = (await request.json()) as Partial<Product> & { id?: string };
  const db = await getDbAsync();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.name != null) updates.name = body.name;
  if (body.slug != null) updates.slug = body.slug;
  if (body.description != null) updates.description = body.description;
  if (body.sku != null) updates.sku = body.sku;
  if (body.image != null) updates.image = body.image;
  if (body.categories != null) updates.categories = body.categories;
  if (body.metiers != null) updates.metiers = body.metiers;
  if (body.metierSubcategories != null) updates.metier_subcategories = body.metierSubcategories;
  if (body.tags != null) updates.tags = body.tags;
  if (body.price !== undefined) updates.price = body.price ?? null;
  if (body.isNew != null) updates.is_new = body.isNew;
  if (body.isBestSeller != null) updates.is_best_seller = body.isBestSeller;
  if (body.isVisible != null) updates.is_visible = body.isVisible;
  if (body.rating != null) updates.rating = body.rating;
  if (body.reviewCount != null) updates.review_count = body.reviewCount;
  if (body.features != null) updates.features = body.features;
  if (body.characteristics != null) updates.characteristics = body.characteristics;

  const { data, error } = await db.from("products").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ product: enrichProduct(mapProductRow(data)) });
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
  const { error } = await db.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
