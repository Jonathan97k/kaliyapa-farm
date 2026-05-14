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
- **Backend**: Firebase (Firestore + Auth)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure Firebase in .env.local
# Add your Firebase configuration:
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_domain
# VITE_FIREBASE_PROJECT_ID=your_project
# VITE_FIREBASE_STORAGE_BUCKET=your_bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# VITE_FIREBASE_APP_ID=your_app_id

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Admin Setup

Admin access is managed through Firebase Firestore. To grant admin privileges to a user:

### Step 1: Get the User's UID

1. Have the user sign in through the application's authentication system
2. Go to Firebase Console → Authentication → Users tab
3. Find the user and copy their UID (User ID)

### Step 2: Add User to Admins Collection

1. Go to Firebase Console → Firestore Database
2. Navigate to the `admins` collection
3. Create a new document with the user's UID as the document ID
4. No additional fields are required - the document ID alone grants admin access

### Security Note

Admin access is now managed entirely through the Firestore `admins` collection. This approach:
- Eliminates hardcoded admin emails from the codebase
- Allows adding/removing admins without code changes
- Supports multiple admins
- Keeps sensitive information out of public repositories

### Firestore Rules

The `isAdmin()` function in `firestore.rules` checks:
- User is signed in
- Email is verified
- User's UID exists in the `admins` collection

## Project Structure

```
kaliyapa-farmstead/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Gallery.tsx
│   │   ├── Home.tsx
│   │   └── Services.tsx
│   ├── context/          # React contexts
│   ├── lib/              # Utilities (Firebase config)
│   ├── constants.ts      # Site constants
│   └── index.css          # Global styles
├── public/
├── firebase-blueprint.json
├── firestore.rules
└── package.json
```

## Features

- Modern, responsive design with premium aesthetic
- Bento grid layout for service showcase
- WhatsApp integration for direct contact
- Admin dashboard for managing services and inquiries
- Firebase backend for data persistence
- SEO optimized with meta tags
- Accessibility features (skip links, ARIA labels)

## Contact

**Kaliyapa Farmstead**
- Phone: +265 993 02 70 68
- Location: Lifidzi, Salima, Malawi (15km from Kamuzu Road)
- Email: info@kaliyapafarmstead.com

---

*Excellence in Agricultural Luxury Since 2008*