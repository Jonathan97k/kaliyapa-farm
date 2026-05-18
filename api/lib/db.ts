import type { Client } from "@libsql/client/http";

let _client: Client | null = null;
let _clientPromise: Promise<Client> | null = null;
let _initError: Error | null = null;

async function getClient(): Promise<Client> {
  if (_initError) throw _initError;
  if (_client) return _client;
  if (_clientPromise) return _clientPromise;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    _initError = new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
    throw _initError;
  }

  _clientPromise = (async () => {
    try {
      const { createClient } = await import("@libsql/client/http");
      const client = createClient({ url, authToken });
      _client = client;
      return client;
    } catch (e) {
      _initError = e as Error;
      throw e;
    }
  })();

  return _clientPromise;
}

export const turso = new Proxy({} as Client, {
  get(_target, prop) {
    return async (...args: unknown[]) => {
      const client = await getClient();
      const value = (client as Record<string | symbol, unknown>)[prop];
      if (typeof value === 'function') {
        return value.apply(client, args);
      }
      return value;
    };
  },
});

export async function initializeDb(): Promise<void> {
  const db = await getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      images TEXT NOT NULL DEFAULT '[]',
      features TEXT NOT NULL DEFAULT '[]',
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    ALTER TABLE services ADD COLUMN images TEXT NOT NULL DEFAULT '[]'
  `).catch(() => {});

  await db.execute(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      interest TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      text TEXT NOT NULL,
      image TEXT,
      created_at DATETIME DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    )
  `);
}
