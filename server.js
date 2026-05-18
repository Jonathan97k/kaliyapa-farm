import express from 'express';
import cors from 'cors';
import { turso, initializeDb } from './api/lib/db.ts';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-in-production');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { payload } = await jwtVerify(authHeader.split(' ')[1], JWT_SECRET);
    req.admin = { id: payload.id, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Auth
app.post('/api/auth', async (req, res) => {
  await initializeDb();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const result = await turso.execute({ sql: 'SELECT id, email, password_hash FROM admins WHERE email = ?', args: [email] });
  if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, result.rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = await new SignJWT({ id: result.rows[0].id, email: result.rows[0].email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  res.json({ token, email: result.rows[0].email });
});

// Services
app.get('/api/services', async (req, res) => {
  await initializeDb();
  const result = await turso.execute('SELECT * FROM services ORDER BY created_at DESC');
  const services = result.rows.map(row => ({ ...row, features: JSON.parse(row.features) }));
  res.json(services);
});

app.post('/api/services', verifyToken, async (req, res) => {
  const { title, description, image, features } = req.body;
  const id = crypto.randomUUID();
  await turso.execute({ sql: 'INSERT INTO services (id, title, description, image, features) VALUES (?, ?, ?, ?, ?)', args: [id, title, description, image, JSON.stringify(features || [])] });
  res.status(201).json({ id });
});

app.put('/api/services', verifyToken, async (req, res) => {
  const { id, title, description, image, features } = req.body;
  await turso.execute({ sql: 'UPDATE services SET title = ?, description = ?, image = ?, features = ?, updated_at = datetime(\'now\') WHERE id = ?', args: [title, description, image, JSON.stringify(features || []), id] });
  res.json({ success: true });
});

app.delete('/api/services', verifyToken, async (req, res) => {
  const { id } = req.query;
  await turso.execute({ sql: 'DELETE FROM services WHERE id = ?', args: [id] });
  res.json({ success: true });
});

// Inquiries
app.get('/api/inquiries', verifyToken, async (req, res) => {
  const result = await turso.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, interest, message } = req.body;
  const id = crypto.randomUUID();
  await turso.execute({ sql: 'INSERT INTO inquiries (id, name, email, phone, interest, message) VALUES (?, ?, ?, ?, ?, ?)', args: [id, name, email, phone || '', interest, message] });
  res.status(201).json({ id });
});

app.delete('/api/inquiries', verifyToken, async (req, res) => {
  const { id } = req.query;
  await turso.execute({ sql: 'DELETE FROM inquiries WHERE id = ?', args: [id] });
  res.json({ success: true });
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  const result = await turso.execute('SELECT * FROM gallery_images ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/gallery', verifyToken, async (req, res) => {
  const { url, category, title } = req.body;
  const id = crypto.randomUUID();
  await turso.execute({ sql: 'INSERT INTO gallery_images (id, url, category, title) VALUES (?, ?, ?, ?)', args: [id, url, category, title] });
  res.status(201).json({ id });
});

app.put('/api/gallery', verifyToken, async (req, res) => {
  const { id, url, category, title } = req.body;
  await turso.execute({ sql: 'UPDATE gallery_images SET url = ?, category = ?, title = ? WHERE id = ?', args: [url, category, title, id] });
  res.json({ success: true });
});

app.delete('/api/gallery', verifyToken, async (req, res) => {
  const { id } = req.query;
  await turso.execute({ sql: 'DELETE FROM gallery_images WHERE id = ?', args: [id] });
  res.json({ success: true });
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
  const result = await turso.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/testimonials', verifyToken, async (req, res) => {
  const { name, role, text, image } = req.body;
  const id = crypto.randomUUID();
  await turso.execute({ sql: 'INSERT INTO testimonials (id, name, role, text, image) VALUES (?, ?, ?, ?, ?)', args: [id, name, role, text, image || null] });
  res.status(201).json({ id });
});

app.put('/api/testimonials', verifyToken, async (req, res) => {
  const { id, name, role, text, image } = req.body;
  await turso.execute({ sql: 'UPDATE testimonials SET name = ?, role = ?, text = ?, image = ? WHERE id = ?', args: [name, role, text, image || null, id] });
  res.json({ success: true });
});

app.delete('/api/testimonials', verifyToken, async (req, res) => {
  const { id } = req.query;
  await turso.execute({ sql: 'DELETE FROM testimonials WHERE id = ?', args: [id] });
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
