const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('ERROR: Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables first');
    process.exit(1);
  }

  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await turso.execute(`CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now'))
  )`);

  console.log('\n=== Create Admin User ===\n');

  const email = await question('Email: ');
  const password = await question('Password: ');

  if (!email || !password) {
    console.error('Email and password are required');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters');
    process.exit(1);
  }

  const existing = await turso.execute({
    sql: 'SELECT id FROM admins WHERE email = ?',
    args: [email],
  });

  if (existing.rows.length > 0) {
    console.error('An admin with this email already exists');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  await turso.execute({
    sql: 'INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)',
    args: [id, email, passwordHash],
  });

  console.log('\nAdmin user created successfully!');
  console.log(`Email: ${email}`);
  console.log('You can now login at /admin/login\n');

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
