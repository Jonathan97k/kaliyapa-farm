interface Column {
  name: string;
  decltype: string;
}

interface HranaRow {
  [column: string]: unknown;
}

export interface ResultSet {
  rows: HranaRow[];
  columns: string[];
}

let _initError: Error | null = null;
let _httpUrl: string | null = null;
let _authToken: string | null = null;

function initConfig(): void {
  if (_initError) throw _initError;
  if (_httpUrl && _authToken) return;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    _initError = new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
    throw _initError;
  }

  _httpUrl = url.replace(/^libsql:\/\//, 'https://');
  _authToken = authToken;
}

function toHranaValue(val: unknown): Record<string, unknown> {
  if (val === null || val === undefined) return { type: 'null' };
  if (typeof val === 'string') return { type: 'text', value: val };
  if (typeof val === 'number') return Number.isInteger(val) ? { type: 'integer', value: String(val) } : { type: 'float', value: String(val) };
  if (typeof val === 'bigint') return { type: 'integer', value: String(val) };
  return { type: 'text', value: String(val) };
}

async function pipeline(sql: string | { sql: string; args?: unknown[] }): Promise<ResultSet> {
  initConfig();

  let stmt: Record<string, unknown>;
  if (typeof sql === 'string') {
    stmt = { sql };
  } else {
    stmt = { sql: sql.sql };
    if (sql.args && sql.args.length > 0) {
      stmt.args = sql.args.map(toHranaValue);
    }
  }

  const response = await fetch(`${_httpUrl}/v2/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${_authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests: [{ type: 'execute', stmt }] }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Database error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const resultEntry = data.results?.[0];

  if (resultEntry?.type === 'error') {
    throw new Error(resultEntry.error?.message || 'Database query error');
  }

  const result = resultEntry?.response?.result;

  if (!result) {
    return { rows: [], columns: [] };
  }

  const cols: Column[] = result.cols || [];
  const rawRows: unknown[][] = result.rows || [];

  const rows = rawRows.map((rawRow) => {
    const row: HranaRow = {};
    cols.forEach((col, i) => {
      row[col.name] = rawRow[i];
    });
    return row;
  });

  return {
    rows,
    columns: cols.map((c) => c.name),
  };
}

export const turso = {
  execute: pipeline,
};

export async function initializeDb(): Promise<void> {
  await pipeline(`CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now'))
  )`);

  await pipeline(`CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    images TEXT NOT NULL DEFAULT '[]',
    features TEXT NOT NULL DEFAULT '[]',
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
  )`);

  try {
    await pipeline(`ALTER TABLE services ADD COLUMN images TEXT NOT NULL DEFAULT '[]'`);
  } catch { /* column may already exist */ }

  await pipeline(`CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    interest TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now'))
  )`);

  await pipeline(`CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now'))
  )`);

  await pipeline(`CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    image TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
  )`);

  await pipeline(`CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT (datetime('now'))
  )`);
}
