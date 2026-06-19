import { NextResponse } from "next/server";
import { getAuthUser, getDbAsync } from "@/lib/supabase/db";
import { mapAddressRow, addressToRow } from "@/lib/db/map-address";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();
  const db = await getDbAsync();

  const { data: existing } = await db
    .from("user_addresses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!existing) return NextResponse.json({ error: "Adresse introuvable" }, { status: 404 });

  const updates = addressToRow(
    {
      type: body.type ?? existing.type,
      label: body.label ?? existing.label,
      street: body.street ?? existing.street,
      city: body.city ?? existing.city,
      postalCode: body.postalCode ?? existing.postal_code,
      country: body.country ?? existing.country,
      phone: body.phone ?? existing.phone,
      isDefault: body.isDefault ?? existing.is_default,
    },
    user.id
  );

  const { data, error } = await db
    .from("user_addresses")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ address: mapAddressRow(data) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const db = await getDbAsync();
  const { error } = await db
    .from("user_addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
