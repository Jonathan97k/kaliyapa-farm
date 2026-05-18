require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { createClient } = require('@libsql/client');
const { SignJWT, jwtVerify } = require('jose');

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('ERROR: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required');
  process.exit(1);
}

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'fallback-secret-change-in-production') {
  console.error('ERROR: JWT_SECRET environment variable must be set to a strong random value');
  process.exit(1);
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const rateLimitStore = new Map();

function rateLimit(key, windowMs = 15 * 60 * 1000, max = 100) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  entry.count += 1;
  if (entry.count > max) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: max - entry.count };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) rateLimitStore.delete(key);
  }
}, 60 * 60 * 1000);

async function initializeDb() {
  await turso.execute(`CREATE TABLE IF NOT EXISTS admins (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at DATETIME DEFAULT (datetime('now')))`);
  await turso.execute(`CREATE TABLE IF NOT EXISTS services (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, image TEXT NOT NULL, images TEXT NOT NULL DEFAULT '[]', features TEXT NOT NULL DEFAULT '[]', created_at DATETIME DEFAULT (datetime('now')), updated_at DATETIME DEFAULT (datetime('now')))`);
  await turso.execute(`CREATE TABLE IF NOT EXISTS inquiries (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, interest TEXT NOT NULL, message TEXT NOT NULL, created_at DATETIME DEFAULT (datetime('now')))`);
  await turso.execute(`CREATE TABLE IF NOT EXISTS gallery_images (id TEXT PRIMARY KEY, url TEXT NOT NULL, category TEXT NOT NULL, title TEXT NOT NULL, created_at DATETIME DEFAULT (datetime('now')))`);
  await turso.execute(`CREATE TABLE IF NOT EXISTS testimonials (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, text TEXT NOT NULL, image TEXT, created_at DATETIME DEFAULT (datetime('now')))`);
  await turso.execute(`CREATE TABLE IF NOT EXISTS subscribers (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, created_at DATETIME DEFAULT (datetime('now')))`);
}

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const cookie = req.headers.cookie || '';
  let token = null;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    const match = cookie.match(/admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    req.admin = { id: payload.id, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
const DATA_URL_REGEX = /^data:(image|video)\/[a-zA-Z]+;base64,/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRequired(value, name, max) {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${name} is required`);
  }
  const trimmed = value.trim();
  if (DATA_URL_REGEX.test(trimmed) || URL_REGEX.test(trimmed)) return trimmed;
  if (max !== null && trimmed.length > max) {
    throw new Error(`${name} must be less than ${max} characters`);
  }
  return trimmed;
}

function isValidUrl(url) {
  if (typeof url !== 'string') return false;
  if (DATA_URL_REGEX.test(url)) return true;
  if (URL_REGEX.test(url)) return true;
  return false;
}

function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email) && email.length <= 254;
}

app.post('/api/auth', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.ip || 'unknown';
  const limit = rateLimit(`auth:${clientIp}`, 15 * 60 * 1000, 10);

  if (!limit.allowed) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  try {
    await initializeDb();
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });

    const result = await turso.execute({ sql: 'SELECT id, email, password_hash FROM admins WHERE email = ?', args: [email] });
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = await new SignJWT({ id: result.rows[0].id, email: result.rows[0].email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000,
      path: '/',
    });

    res.cookie('admin_email', result.rows[0].email, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000,
      path: '/',
    });

    res.json({ email: result.rows[0].email });
  } catch {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('admin_token', { path: '/' });
  res.clearCookie('admin_email', { path: '/' });
  res.json({ success: true });
});

  app.get('/api/services', async (req, res) => {
    try {
      await initializeDb();
      const result = await turso.execute('SELECT * FROM services ORDER BY created_at DESC');
      res.json(result.rows.map(r => {
        let images = [];
        try {
          const parsed = JSON.parse(r.images);
          images = Array.isArray(parsed) ? parsed : [];
        } catch {
          images = r.image ? [r.image] : [];
        }
        return { ...r, features: JSON.parse(r.features), images };
      }));
    } catch {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  app.post('/api/services', verifyToken, async (req, res) => {
    try {
      const { title, description, image, images, features } = req.body;
      const validatedTitle = validateRequired(title, 'Title', 200);
      const validatedDesc = validateRequired(description, 'Description', 5000);
      const validatedImage = validateRequired(image, 'Image URL', 2048);

      if (!isValidUrl(validatedImage)) return res.status(400).json({ error: 'Invalid image URL' });

      let validatedImages = [validatedImage];
      if (images) {
        if (!Array.isArray(images) || images.length > 15) {
          return res.status(400).json({ error: 'Images must be an array with max 15 items' });
        }
        validatedImages = images.map((img, i) => validateRequired(img, `Image ${i + 1}`, 2048));
        if (!validatedImages.includes(validatedImage)) {
          validatedImages.unshift(validatedImage);
        }
      }

      let validatedFeatures = [];
      if (features) {
        if (!Array.isArray(features) || features.length > 10) {
          return res.status(400).json({ error: 'Features must be an array with max 10 items' });
        }
        validatedFeatures = features.map((f, i) => validateRequired(f, `Feature ${i + 1}`, 500));
      }

      const id = crypto.randomUUID();
      await turso.execute({ sql: 'INSERT INTO services (id, title, description, image, images, features) VALUES (?, ?, ?, ?, ?, ?)', args: [id, validatedTitle, validatedDesc, validatedImage, JSON.stringify(validatedImages), JSON.stringify(validatedFeatures)] });
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/services', verifyToken, async (req, res) => {
    try {
      const { id, title, description, image, images, features } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });

      const validatedTitle = validateRequired(title, 'Title', 200);
      const validatedDesc = validateRequired(description, 'Description', 5000);
      const validatedImage = validateRequired(image, 'Image URL', 2048);

      if (!isValidUrl(validatedImage)) return res.status(400).json({ error: 'Invalid image URL' });

      let validatedImages = [validatedImage];
      if (images) {
        if (!Array.isArray(images) || images.length > 15) {
          return res.status(400).json({ error: 'Images must be an array with max 15 items' });
        }
        validatedImages = images.map((img, i) => validateRequired(img, `Image ${i + 1}`, 2048));
        if (!validatedImages.includes(validatedImage)) {
          validatedImages.unshift(validatedImage);
        }
      }

      let validatedFeatures = [];
      if (features) {
        if (!Array.isArray(features) || features.length > 10) {
          return res.status(400).json({ error: 'Features must be an array with max 10 items' });
        }
        validatedFeatures = features.map((f, i) => validateRequired(f, `Feature ${i + 1}`, 500));
      }

      await turso.execute({ sql: 'UPDATE services SET title = ?, description = ?, image = ?, images = ?, features = ?, updated_at = datetime(\'now\') WHERE id = ?', args: [validatedTitle, validatedDesc, validatedImage, JSON.stringify(validatedImages), JSON.stringify(validatedFeatures), id] });
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

app.delete('/api/services', verifyToken, async (req, res) => {
  if (!req.query.id) return res.status(400).json({ error: 'ID is required' });
  await turso.execute({ sql: 'DELETE FROM services WHERE id = ?', args: [req.query.id] });
  res.json({ success: true });
});

app.get('/api/inquiries', verifyToken, async (req, res) => {
  const result = await turso.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/inquiries', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.ip || 'unknown';
  const limit = rateLimit(`inquiry:${clientIp}`, 60 * 60 * 1000, 5);

  if (!limit.allowed) {
    return res.status(429).json({ error: 'Too many inquiries. Please try again later.' });
  }

  try {
    const { name, email, phone, interest, message } = req.body;

    if (!name || !email || !interest || !message) {
      return res.status(400).json({ error: 'Name, email, interest, and message are required' });
    }

    const validatedName = validateRequired(name, 'Name', 100);
    const validatedEmail = validateRequired(email, 'Email', 254);

    if (!isValidEmail(validatedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const validatedPhone = typeof phone === 'string' ? phone.trim().slice(0, 20) : '';
    const validatedInterest = validateRequired(interest, 'Interest', 200);
    const validatedMessage = validateRequired(message, 'Message', 5000);

    const id = crypto.randomUUID();
    await turso.execute({ sql: 'INSERT INTO inquiries (id, name, email, phone, interest, message) VALUES (?, ?, ?, ?, ?, ?)', args: [id, validatedName, validatedEmail, validatedPhone, validatedInterest, validatedMessage] });
    res.status(201).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/inquiries', verifyToken, async (req, res) => {
  if (!req.query.id) return res.status(400).json({ error: 'ID is required' });
  await turso.execute({ sql: 'DELETE FROM inquiries WHERE id = ?', args: [req.query.id] });
  res.json({ success: true });
});

app.get('/api/gallery', async (req, res) => {
  try {
    await initializeDb();
    const result = await turso.execute('SELECT * FROM gallery_images ORDER BY created_at DESC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

app.post('/api/gallery', verifyToken, async (req, res) => {
  try {
    const { url, category, title } = req.body;
    const validatedUrl = validateRequired(url, 'Image URL', 2048);
    const validatedCategory = validateRequired(category, 'Category', 200);
    const validatedTitle = validateRequired(title, 'Title', 200);

    if (!isValidUrl(validatedUrl)) return res.status(400).json({ error: 'Invalid URL' });

    const id = crypto.randomUUID();
    await turso.execute({ sql: 'INSERT INTO gallery_images (id, url, category, title) VALUES (?, ?, ?, ?)', args: [id, validatedUrl, validatedCategory, validatedTitle] });
    res.status(201).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/gallery', verifyToken, async (req, res) => {
  try {
    const { id, url, category, title } = req.body;
    if (!id) return res.status(400).json({ error: 'ID is required' });

    const validatedUrl = validateRequired(url, 'Image URL', 2048);
    const validatedCategory = validateRequired(category, 'Category', 200);
    const validatedTitle = validateRequired(title, 'Title', 200);

    if (!isValidUrl(validatedUrl)) return res.status(400).json({ error: 'Invalid URL' });

    await turso.execute({ sql: 'UPDATE gallery_images SET url = ?, category = ?, title = ? WHERE id = ?', args: [validatedUrl, validatedCategory, validatedTitle, id] });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/gallery', verifyToken, async (req, res) => {
  if (!req.query.id) return res.status(400).json({ error: 'ID is required' });
  await turso.execute({ sql: 'DELETE FROM gallery_images WHERE id = ?', args: [req.query.id] });
  res.json({ success: true });
});

app.get('/api/testimonials', async (req, res) => {
  try {
    await initializeDb();
    const result = await turso.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.post('/api/testimonials', verifyToken, async (req, res) => {
  try {
    const { name, role, text, image } = req.body;
    const validatedName = validateRequired(name, 'Name', 100);
    const validatedRole = validateRequired(role, 'Role', 100);
    const validatedText = validateRequired(text, 'Text', 2000);

    let validatedImage = null;
    if (image) {
      validatedImage = validateRequired(image, 'Image URL', 2048);
      if (!isValidUrl(validatedImage)) return res.status(400).json({ error: 'Invalid image URL' });
    }

    const id = crypto.randomUUID();
    await turso.execute({ sql: 'INSERT INTO testimonials (id, name, role, text, image) VALUES (?, ?, ?, ?, ?)', args: [id, validatedName, validatedRole, validatedText, validatedImage] });
    res.status(201).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/testimonials', verifyToken, async (req, res) => {
  try {
    const { id, name, role, text, image } = req.body;
    if (!id) return res.status(400).json({ error: 'ID is required' });

    const validatedName = validateRequired(name, 'Name', 100);
    const validatedRole = validateRequired(role, 'Role', 100);
    const validatedText = validateRequired(text, 'Text', 2000);

    let validatedImage = null;
    if (image) {
      validatedImage = validateRequired(image, 'Image URL', 2048);
      if (!isValidUrl(validatedImage)) return res.status(400).json({ error: 'Invalid image URL' });
    }

    await turso.execute({ sql: 'UPDATE testimonials SET name = ?, role = ?, text = ?, image = ? WHERE id = ?', args: [validatedName, validatedRole, validatedText, validatedImage, id] });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/testimonials', verifyToken, async (req, res) => {
  if (!req.query.id) return res.status(400).json({ error: 'ID is required' });
  await turso.execute({ sql: 'DELETE FROM testimonials WHERE id = ?', args: [req.query.id] });
  res.json({ success: true });
});

app.get('/api/subscribers', verifyToken, async (req, res) => {
  await initializeDb();
  try {
    const result = await turso.execute('SELECT * FROM subscribers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

app.post('/api/subscribers', async (req, res) => {
  await initializeDb();
  const clientIp = req.headers['x-forwarded-for'] || req.ip || 'unknown';
  const limit = rateLimit(`subscribe:${clientIp}`, 60 * 60 * 1000, 5);

  if (!limit.allowed) {
    return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  }

  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const validatedEmail = validateRequired(email, 'Email', 254);
    if (!isValidEmail(validatedEmail)) return res.status(400).json({ error: 'Invalid email format' });

    const existing = await turso.execute({ sql: 'SELECT id FROM subscribers WHERE email = ?', args: [validatedEmail] });
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'This email is already subscribed' });
    }

    const id = crypto.randomUUID();
    await turso.execute({ sql: 'INSERT INTO subscribers (id, email) VALUES (?, ?)', args: [id, validatedEmail] });
    res.status(201).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/subscribers', verifyToken, async (req, res) => {
  await initializeDb();
  if (!req.query.id) return res.status(400).json({ error: 'ID is required' });
  await turso.execute({ sql: 'DELETE FROM subscribers WHERE id = ?', args: [req.query.id] });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
