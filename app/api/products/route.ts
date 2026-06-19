import { NextResponse } from "next/server";
import { getAuthUser, getDbAsync, getProfile } from "@/lib/supabase/db";
import { mapProductRow, productToRow } from "@/lib/db/map-cms";
import { enrichProduct } from "@/lib/product-filters";
import type { Product } from "@/types";

export async function GET() {
  try {
    const user = await getAuthUser();
    const profile = user ? await getProfile(user.id) : null;
    const isAdmin = profile?.role === "admin";

    const db = await getDbAsync();

    const { data, error } = await db
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let products = (data || []).map((row) => enrichProduct(mapProductRow(row)));
    if (!isAdmin) {
      products = products.filter((p) => p.isVisible !== false);
    }
    return NextResponse.json({ products });
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

    const body = (await request.json()) as Product;
    const db = await getDbAsync();
    const row = productToRow(body);

    const { data, error } = await db.from("products").insert(row).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ product: enrichProduct(mapProductRow(data)) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
