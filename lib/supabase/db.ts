import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdminEmail } from "@/lib/admin/super-admin";
import { linkConversationsToUser } from "@/lib/supabase/conversations";
import { ensureSchema } from "@/lib/db/migrate";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

/** DB client with service role — use only after getAuthUser() check */
export function getDb() {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local — voir supabase/README.md"
    );
  }
  return admin;
}

/** Ensure Postgres tables exist, then return service-role client */
export async function getDbAsync() {
  const schema = await ensureSchema();
  if (!schema.ok) {
    throw new Error(
      schema.error ||
        "Schéma DB manquant — ajoutez SUPABASE_DB_PASSWORD dans .env.local"
    );
  }
  return getDb();
}

export async function ensureProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const db = await getDbAsync();
  const email = user.email || "";
  const isAdmin = isSuperAdminEmail(email);

  await db.from("profiles").upsert(
    {
      id: user.id,
      email,
      first_name: (user.user_metadata?.first_name as string) || (isAdmin ? "raed" : ""),
      last_name: (user.user_metadata?.last_name as string) || (isAdmin ? "khemir" : ""),
      phone: (user.user_metadata?.phone as string) || null,
      company: (user.user_metadata?.company as string) || null,
      avatar_url: (user.user_metadata?.avatar_url as string) || null,
      role: isAdmin ? "admin" : "user",
      status: "actif",
    },
    { onConflict: "id" }
  );

  if (email) {
    await linkConversationsToUser(db, user.id, email);
  }
}

export async function getProfile(userId: string) {
  const db = await getDbAsync();
  const { data } = await db.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}
