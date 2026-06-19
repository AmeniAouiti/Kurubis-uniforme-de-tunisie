import { NextResponse } from "next/server";
import { getDbAsync } from "@/lib/supabase/db";
import { SUPER_ADMIN, isSuperAdminEmail } from "@/lib/admin/super-admin";

/**
 * Créer le super admin via Postman :
 * POST http://localhost:3000/api/admin/bootstrap
 * (URL sans ?paramètres — le secret va dans l’onglet Headers)
 * Header: x-bootstrap-secret: kurubis-bootstrap-2026
 * Body (JSON, optionnel) :
 * { "email", "password", "firstName", "lastName" }
 */
function readBootstrapSecret(request: Request) {
  const fromHeader = request.headers.get("x-bootstrap-secret")?.trim();
  if (fromHeader) return fromHeader;

  // Secours en dev si le secret est mis dans l’URL par erreur (onglet Params)
  if (process.env.NODE_ENV === "development") {
    const url = new URL(request.url);
    return (
      url.searchParams.get("x-bootstrap-secret")?.trim() ||
      url.searchParams.get("bootstrap_secret")?.trim() ||
      null
    );
  }

  return null;
}

export async function POST(request: Request) {
  const secret = readBootstrapSecret(request);
  const expected = (process.env.ADMIN_BOOTSTRAP_SECRET || "kurubis-bootstrap-2026").trim();

  if (!secret) {
    return NextResponse.json(
      {
        error: "Header manquant : ajoutez x-bootstrap-secret",
        hint: `Postman → onglet Headers (pas Params). URL : http://localhost:3000/api/admin/bootstrap sans ?. Valeur : ${expected}`,
      },
      { status: 403 }
    );
  }

  if (secret !== expected) {
    return NextResponse.json(
      {
        error: "Secret invalide (header x-bootstrap-secret)",
        hint: `Vérifiez ADMIN_BOOTSTRAP_SECRET dans .env.local (actuellement : ${expected}). Redémarrez le serveur après modification.`,
      },
      { status: 403 }
    );
  }

  let db;
  try {
    db = await getDbAsync();
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : String(e),
        hint: "Ajoutez SUPABASE_DB_PASSWORD dans .env.local",
      },
      { status: 500 }
    );
  }

  if (!db) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local" },
      { status: 500 }
    );
  }

  let body: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  } = {};

  try {
    const text = await request.text();
    if (text) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const email = (body.email || SUPER_ADMIN.email).toLowerCase();
  const password = body.password || SUPER_ADMIN.defaultPassword;
  const firstName = body.firstName || SUPER_ADMIN.firstName;
  const lastName = body.lastName || SUPER_ADMIN.lastName;

  if (!isSuperAdminEmail(email)) {
    return NextResponse.json(
      { error: `Seul ${SUPER_ADMIN.email} peut être créé via cette route` },
      { status: 400 }
    );
  }

  // Utilisateur Auth existant ?
  const { data: listData } = await db.auth.admin.listUsers({ perPage: 1000 });
  let authUser = listData?.users?.find((u) => u.email?.toLowerCase() === email);

  if (!authUser) {
    const { data: created, error: createError } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName },
    });

    if (createError || !created.user) {
      return NextResponse.json(
        { error: createError?.message || "Impossible de créer l'utilisateur Auth" },
        { status: 500 }
      );
    }
    authUser = created.user;
  } else {
    await db.auth.admin.updateUserById(authUser.id, {
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName },
    });
  }

  const { error: profileError } = await db.from("profiles").upsert(
    {
      id: authUser.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role: "admin",
      status: "actif",
    },
    { onConflict: "id" }
  );

  if (profileError) {
    return NextResponse.json(
      {
        error: profileError.message,
        hint: "Exécutez supabase/schema.sql dans Supabase SQL Editor d'abord",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Super admin créé. Connectez-vous sur /connexion",
    user: {
      id: authUser.id,
      email,
      firstName,
      lastName,
      role: "admin",
    },
    login: {
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/connexion`,
      email,
      password: "•••••••• (celui envoyé dans le body)",
    },
  });
}
