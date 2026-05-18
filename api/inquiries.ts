import { turso, initializeDb } from './lib/db';
import { verifyToken } from './lib/jwt';
import { validateInquiryInput } from './lib/validation';
import { rateLimit } from './lib/rateLimit';

export const config = {
  runtime: 'edge',
};

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
      const result = await turso.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
      return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to fetch inquiries' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (request.method === 'POST') {
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `inquiry:${clientIp}`;
    const limit = rateLimit(rateLimitKey, { windowMs: 60 * 60 * 1000, max: 5 });

    if (!limit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many inquiries. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const body = await request.json();
      const { name, email, phone, interest, message } = validateInquiryInput(body);
      const id = crypto.randomUUID();

      await turso.execute({
        sql: 'INSERT INTO inquiries (id, name, email, phone, interest, message) VALUES (?, ?, ?, ?, ?, ?)',
        args: [id, name, email, phone, interest, message],
      });

      return new Response(JSON.stringify({ id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message || 'Failed to submit inquiry' }), {
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
        sql: 'DELETE FROM inquiries WHERE id = ?',
        args: [id],
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to delete inquiry' }), {
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
