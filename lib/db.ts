import "server-only"

import { Pool } from "pg"
import bcrypt from "bcryptjs"

/**
 * Postgres (Neon/Supabase) DB helper.
 *
 * This project previously used SQLite. We keep the same exported helpers:
 *   - dbGet(sql, params)
 *   - dbAll(sql, params)
 *   - dbRun(sql, params)
 *
 * so the rest of the code can stay almost unchanged.
 */

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.NEON_DATABASE_URL

if (!DATABASE_URL) {
  throw new Error(
    "Missing DATABASE_URL. Use your Neon pooled connection string (or Supabase connection string) in .env.local."
  )
}

// Supabase requires SSL in most environments.
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  // Reasonable defaults for serverless.
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
})

let didInit = false
let initPromise: Promise<void> | null = null

function toPgPlaceholders(sql: string): string {
  // Convert SQLite-style "?" placeholders to Postgres-style "$1, $2, ...".
  // Assumes callers only use ? for placeholders (true in this codebase).
  let i = 0
  return sql.replace(/\?/g, () => {
    i += 1
    return `$${i}`
  })
}

function stripTrailingSemicolon(sql: string): string {
  return sql.replace(/;\s*$/, "")
}

async function ensureInitialized(): Promise<void> {
  if (didInit) return
  if (!initPromise) initPromise = init()
  await initPromise
}

async function init(): Promise<void> {
  // 1) Make sure tables exist (user must run the SQL schema once).
  const { rows } = await pool.query(
    "SELECT to_regclass('public.patients') AS patients, to_regclass('public.staff') AS staff, to_regclass('public.sessions') AS sessions"
  )
  const r = rows?.[0]
  if (!r?.patients || !r?.staff || !r?.sessions) {
    throw new Error(
      "Database schema is missing. Run the provided schema.sql in Supabase SQL Editor, then restart the dev server."
    )
  }

  // 2) Seed default admin (same behavior as the old SQLite auto-init).
  const admin = await dbGet("SELECT id FROM staff WHERE username = ?", ["admin"])
  if (!admin) {
    const hashed = await bcrypt.hash("admin123", 10)
    await dbRun(
      `
      INSERT INTO staff (name, role, category, email, username, password_hash, phone, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        "Administrator",
        "admin",
        "Management",
        "admin@hospital.com",
        "admin",
        hashed,
        null,
        true,
      ]
    )
    // eslint-disable-next-line no-console
    console.log("✅ Default admin created: admin@hospital.com / admin123")
  }

  didInit = true
}

export async function dbGet(sql: string, params: any[] = []): Promise<any> {
  await ensureInitialized()
  const text = toPgPlaceholders(stripTrailingSemicolon(sql))
  const res = await pool.query(text, params)
  return res.rows?.[0] ?? null
}

export async function dbAll(sql: string, params: any[] = []): Promise<any[]> {
  await ensureInitialized()
  const text = toPgPlaceholders(stripTrailingSemicolon(sql))
  const res = await pool.query(text, params)
  return res.rows ?? []
}

export async function dbRun(
  sql: string,
  params: any[] = []
): Promise<{ lastID: number; changes: number }> {
  await ensureInitialized()

  let text = stripTrailingSemicolon(sql)
  const upper = text.trim().toUpperCase()

  // For compatibility with old code expecting lastID on INSERT.
  if (upper.startsWith("INSERT") && !upper.includes("RETURNING")) {
    text = `${text} RETURNING id`
  }

  text = toPgPlaceholders(text)
  const res = await pool.query(text, params)

  const changes = res.rowCount ?? 0
  const lastID = res.rows?.[0]?.id ? Number(res.rows[0].id) : 0
  return { lastID, changes }
}

export async function closePool() {
  await pool.end()
  didInit = false
  initPromise = null
}
