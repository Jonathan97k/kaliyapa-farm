import { turso, initializeDb } from './lib/db';
import { verifyToken } from './lib/jwt';
import { validateGalleryInput } from './lib/validation';

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
    try {
      const result = await turso.execute('SELECT * FROM gallery_images ORDER BY created_at DESC');
      return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to fetch gallery images' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { url, category, title } = validateGalleryInput(body);
      const id = crypto.randomUUID();

      await turso.execute({
        sql: 'INSERT INTO gallery_images (id, url, category, title) VALUES (?, ?, ?, ?)',
        args: [id, url, category, title],
      });

      return new Response(JSON.stringify({ id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message || 'Failed to add image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (request.method === 'PUT') {
    try {
      const body = await request.json();
      const { url, category, title } = validateGalleryInput(body);
      const id = (body as Record<string, unknown>).id;

      if (!id || typeof id !== 'string') {
        return new Response(JSON.stringify({ error: 'ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await turso.execute({
        sql: 'UPDATE gallery_images SET url = ?, category = ?, title = ? WHERE id = ?',
        args: [url, category, title, id],
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message || 'Failed to update image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await turso.execute({
        sql: 'DELETE FROM gallery_images WHERE id = ?',
        args: [id],
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
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
