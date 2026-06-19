import { readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const { Pool } = pg;

let migratePromise = null;
let schemaReady = false;

const POOLER_REGIONS = [
  "eu-west-3",
  "eu-west-1",
  "eu-west-2",
  "eu-central-1",
  "us-east-1",
  "us-west-1",
  "ap-southeast-1",
  "ap-northeast-1",
  "sa-east-1",
];

function getProjectRef() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] || null;
}

/** Liste d'URLs à essayer (pooler IPv4 d'abord sur Windows) */
export function getDatabaseUrls() {
  const urls = [];
  const password = process.env.SUPABASE_DB_PASSWORD;
  const ref = getProjectRef();

  if (process.env.DATABASE_URL) {
    urls.push(process.env.DATABASE_URL.trim());
  }

  if (password && ref) {
    const enc = encodeURIComponent(password);
    const user = `postgres.${ref}`;

    const regions = process.env.SUPABASE_DB_REGION
      ? [process.env.SUPABASE_DB_REGION.trim()]
      : POOLER_REGIONS;

    for (const region of regions) {
      // Session pooler (IPv4) — recommandé Windows
      urls.push(`postgresql://${user}:${enc}@aws-0-${region}.pooler.supabase.com:5432/postgres`);
      urls.push(`postgresql://${user}:${enc}@aws-${region}.pooler.supabase.com:5432/postgres`);
      // Transaction pooler (secours)
      urls.push(`postgresql://${user}:${enc}@aws-0-${region}.pooler.supabase.com:6543/postgres`);
      urls.push(`postgresql://${user}:${enc}@aws-${region}.pooler.supabase.com:6543/postgres`);
    }

    // Direct (IPv6 uniquement sur plan gratuit)
    urls.push(`postgresql://postgres:${enc}@db.${ref}.supabase.co:5432/postgres`);
  }

  return [...new Set(urls)];
}

export function getDatabaseUrl() {
  return getDatabaseUrls()[0] || null;
}

function loadMigrationSql() {
  const files = ["setup-messaging.sql", "setup-cms.sql", "setup-user-profile.sql"];
  let sql = "";
  for (const file of files) {
    let content = readFileSync(join(process.cwd(), "supabase", file), "utf8");
    if (file === "setup-messaging.sql") {
      content = content.replace(/-- 6\. Vérification[\s\S]*$/, "");
    }
    sql += content + "\n";
  }
  if (!sql.includes("NOTIFY pgrst")) {
    sql += "\nNOTIFY pgrst, 'reload schema';";
  }
  return sql;
}

async function tableExists(pool, name) {
  const { rows } = await pool.query(`SELECT to_regclass($1) AS reg`, [`public.${name}`]);
  return rows[0]?.reg !== null;
}

function maskUrl(url) {
  return url.replace(/:([^:@/]+)@/, ":***@");
}

async function tryMigrateWithUrl(connectionString) {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 8000,
  });

  try {
    await pool.query(loadMigrationSql());
    console.log("[db] Schéma base de données synchronisé via", maskUrl(connectionString));
    return { ok: true };
  } finally {
    await pool.end().catch(() => {});
  }
}

export async function runMigrations() {
  const urls = getDatabaseUrls();
  if (!urls.length) {
    return {
      ok: false,
      error:
        "Ajoutez SUPABASE_DB_PASSWORD ou DATABASE_URL dans .env.local (Supabase → Connect → Session pooler)",
    };
  }

  let lastError = "Connexion impossible";

  for (const connectionString of urls) {
    try {
      const result = await tryMigrateWithUrl(connectionString);
      if (result.ok) {
        schemaReady = true;
        return { ok: true };
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      lastError = message;
      const retryable =
        message.includes("ENOTFOUND") ||
        message.includes("ECONNREFUSED") ||
        message.includes("ETIMEDOUT") ||
        message.includes("timeout") ||
        message.includes("Tenant or user not found") ||
        message.includes("password authentication failed");
      if (!retryable) {
        console.error("[db] Migration échouée:", message);
        return { ok: false, error: message };
      }
    }
  }

  console.error("[db] Migration échouée après toutes les URLs:", lastError);
  return {
    ok: false,
    error: `${lastError}. Copiez DATABASE_URL depuis Supabase → Connect → Session pooler dans .env.local`,
  };
}

export async function ensureSchema() {
  if (schemaReady) return { ok: true };

  if (!migratePromise) {
    migratePromise = runMigrations().finally(() => {
      migratePromise = null;
    });
  }

  return migratePromise;
}

export function isSchemaReady() {
  return schemaReady;
}
