import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getDbAsync } from "@/lib/supabase/db";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const db = await getDbAsync();
  const { data, error } = await db.from("profiles").select("*").eq("id", user.id).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    profile: {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      company: data.company,
      phone: data.phone,
      avatarUrl: data.avatar_url,
    },
  });
}

export async function PATCH(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();
  const { firstName, lastName, company, phone, avatarUrl } = body;

  const db = await getDbAsync();
  const updates: Record<string, unknown> = {};
  if (firstName != null) updates.first_name = firstName;
  if (lastName != null) updates.last_name = lastName;
  if (company != null) updates.company = company;
  if (phone != null) updates.phone = phone;
  if (avatarUrl != null) updates.avatar_url = avatarUrl;

  const { error } = await db.from("profiles").update(updates).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const supabase = await createClient();
  await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
      company,
      phone,
      avatar_url: avatarUrl,
    },
  });

  return NextResponse.json({ ok: true });
}
