import { turso, initializeDb } from './lib/db';
import { verifyToken } from './lib/jwt';
import { validateRequiredString } from './lib/validation';
import { rateLimit } from './lib/rateLimit';



async function getAdminFromRequest(request: Request): Promise<{ id: string; email: string } | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const authHeader = request.headers.get('authorization');

  let token: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    return { id: payload.id as string, email: payload.email as string };
  } catch {
    return null;
  }
}

export default async function handler(request: Request) {
  await initializeDb();
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const result = await turso.execute('SELECT * FROM subscribers ORDER BY created_at DESC');
      return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to fetch subscribers' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (request.method === 'POST') {
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const limit = rateLimit(`subscribe:${clientIp}`, { windowMs: 60 * 60 * 1000, max: 5 });

    if (!limit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many attempts. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const body = await request.json();
      const email = validateRequiredString(body.email, 'Email', 254);

      const existing = await turso.execute({
        sql: 'SELECT id FROM subscribers WHERE email = ?',
        args: [email],
      });

      if (existing.rows.length > 0) {
        return new Response(JSON.stringify({ error: 'This email is already subscribed' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const id = crypto.randomUUID();
      await turso.execute({
        sql: 'INSERT INTO subscribers (id, email) VALUES (?, ?)',
        args: [id, email],
      });

      return new Response(JSON.stringify({ id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message || 'Failed to subscribe' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (request.method === 'DELETE') {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await turso.execute({
        sql: 'DELETE FROM subscribers WHERE id = ?',
        args: [id],
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to delete subscriber' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
