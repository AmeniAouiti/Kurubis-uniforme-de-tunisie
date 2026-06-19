import { NextResponse } from "next/server";
import { getAuthUser, getDbAsync, getProfile } from "@/lib/supabase/db";
import { mapAddressRow, addressToRow } from "@/lib/db/map-address";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const db = await getDbAsync();
  const { data, error } = await db
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("type")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ addresses: (data || []).map(mapAddressRow) });
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();
  const { type, label, street, city, postalCode, country, phone, isDefault } = body;

  if (!type || !street || !city || !postalCode) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const db = await getDbAsync();

  if (type === "billing") {
    await db.from("user_addresses").delete().eq("user_id", user.id).eq("type", "billing");
  }

  const { data, error } = await db
    .from("user_addresses")
    .insert(
      addressToRow(
        { type, label, street, city, postalCode, country, phone, isDefault },
        user.id
      )
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ address: mapAddressRow(data) });
}
