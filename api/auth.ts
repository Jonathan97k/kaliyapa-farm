import { turso, initializeDb } from './lib/db';
import { rateLimit } from './lib/rateLimit';
import { validateLoginInput } from './lib/validation';
import { createToken } from './lib/jwt';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitKey = `auth:${clientIp}`;
  const limit = rateLimit(rateLimitKey, { windowMs: 15 * 60 * 1000, max: 10 });

  if (!limit.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many login attempts. Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await initializeDb();
    const body = await request.json();
    const { email, password } = validateLoginInput(body);

    const result = await turso.execute({
      sql: 'SELECT id, email, password_hash FROM admins WHERE email = ?',
      args: [email],
    });

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const admin = result.rows[0];
    const bcrypt = await import('bcryptjs');
    const valid = await bcrypt.compare(password, admin.password_hash as string);

    if (!valid) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = await createToken({
      id: admin.id as string,
      email: admin.email as string,
    });

    const response = new Response(
      JSON.stringify({ email: admin.email }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

    response.headers.set('Set-Cookie', `admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);
    response.headers.append('Set-Cookie', `admin_email=${encodeURIComponent(admin.email as string)}; Path=/; Secure; SameSite=Strict; Max-Age=86400`);

    return response;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
