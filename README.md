<div align="center">
  <img width="1200" height="475" alt="Kaliyapa Farmstead" src="https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=1200" />
</div>

# Kaliyapa Farmstead

Premium livestock farming website for goat, poultry, and piggery operations in Salima, Malawi.

## About

Kaliyapa Farmstead is a premier agricultural establishment redefining livestock farming through scientific precision and sustainable practices. Located in Lifidzi, Salima, Malawi, we specialize in:

- **Goat Farming** - Premium Boer goats and quality meat production
- **Poultry Farming** - Layer and broiler production with strict health standards
- **Piggery** - Professional breeding and quality livestock care

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Routing**: React Router v7
- **Database**: Turso (libSQL)
- **API**: Vercel Serverless Functions (Edge Runtime)
- **Auth**: JWT with bcrypt password hashing
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Turso database (create at [turso.tech](https://turso.tech))

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure Turso and JWT in .env.local:
# TURSO_DATABASE_URL=libsql://your-database.turso.io
# TURSO_AUTH_TOKEN=your_turso_auth_token
# JWT_SECRET=your_secure_random_secret

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Database Setup

### 1. Create a Turso Database

```bash
# Install Turso CLI
curl -sSf https://get.tur.so/install.sh | bash

# Login and create database
turso auth login
turso db create kaliyapa-farmstead

# Get connection details
turso db show kaliyapa-farmstead --url
turso db tokens create kaliyapa-farmstead
```

### 2. Seed the Database

The database tables are auto-created on first API call. To create an initial admin user:

```bash
# Use the Turso shell to insert an admin
turso db shell kaliyapa-farmstead

# Generate a bcrypt hash of your password first, then:
INSERT INTO admins (id, email, password_hash) VALUES ('admin-uuid', 'admin@example.com', '$2b$10$hashed_password');
```

You can generate a bcrypt hash using Node.js:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password', 10));"
```

### 3. Deploy to Vercel

Set the environment variables in your Vercel project settings:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `JWT_SECRET`

## Admin Access

- URL: `/admin/login`
- Authentication via email/password with JWT tokens
- Admin users are stored in the `admins` table in Turso

## Project Structure

```
kaliyapa-farmstead/
├── api/                    # Vercel serverless functions
│   ├── lib/
│   │   └── db.ts           # Turso database client
│   ├── auth.ts             # Authentication endpoint
│   ├── services.ts         # Services CRUD endpoint
│   └── inquiries.ts        # Inquiries CRUD endpoint
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Gallery.tsx
│   │   ├── Home.tsx
│   │   └── Services.tsx
│   ├── context/            # React contexts
│   ├── lib/                # Utilities
│   │   └── api.ts          # Frontend API client
│   ├── constants.ts        # Site constants
│   └── index.css           # Global styles
├── public/
└── package.json
```

## Features

- Modern, responsive design with premium aesthetic
- Bento grid layout for service showcase
- WhatsApp integration for direct contact
- Admin dashboard for managing services and inquiries
- Turso database for data persistence
- JWT-based authentication
- SEO optimized with meta tags
- Accessibility features (skip links, ARIA labels)
- Error boundary for graceful error handling

## Contact

**Kaliyapa Farmstead**
- Phone: +265 993 02 70 68
- Location: Lifidzi, Salima, Malawi (15km from Kamuzu Road)
- Email: lysonkaliyapa@gmail.com

---

*Excellence in Agricultural Luxury Since 2008*
