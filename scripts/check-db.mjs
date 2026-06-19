import { readFileSync } from "node:fs";
import pg from "pg";
import { getDatabaseUrls, runMigrations } from "../lib/db/migrate.mjs";

try {
  const env = readFileSync(".env.local", "utf8");
  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.warn("No .env.local");
}

const urls = getDatabaseUrls();
console.log("URLs:", urls.length);
if (!urls.length) process.exit(1);

async function checkTables(label) {
  const pool = new pg.Pool({
    connectionString: urls[0],
    ssl: { rejectUnauthorized: false },
  });
  for (const t of ["products", "catalogs", "conversations", "profiles", "user_addresses"]) {
    const r = await pool.query("SELECT to_regclass($1) AS reg", [`public.${t}`]);
    console.log(`${label} ${t}:`, r.rows[0].reg);
  }
  await pool.end();
}

await checkTables("before");
const res = await runMigrations();
console.log("migrate:", res);
await checkTables("after");
