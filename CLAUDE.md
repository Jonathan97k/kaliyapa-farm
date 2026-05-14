# Kaliyapa Farmstead Development Guide

## Project Overview

Premium livestock farming website showcasing goat, poultry, and piggery operations in Salima, Malawi.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Motion (animations)
- React Router v7
- Firebase (Firestore + Auth)

## Key Files

| File | Purpose |
|------|---------|
| `src/constants.ts` | Site-wide constants (services, testimonials, contact) |
| `src/components/Layout.tsx` | Main layout with WhatsApp floating button |
| `src/index.css` | Global styles and Tailwind config |
| `src/lib/firebase.ts` | Firebase configuration |

## Adding New Services

1. Add to `SERVICES` array in `src/constants.ts`
2. Update Firestore `services` collection for dynamic data
3. Image recommendations: 800px width, Unsplash preferred

## Admin Access

- URL: `/admin/login`
- Authentication via Firebase Auth
- Protected routes require admin role

## Deployment

```bash
npm run build  # Creates dist/ folder
```

Deploy `dist/` to Vercel, Netlify, or Firebase Hosting.

## Contact Integration

WhatsApp button auto-generates from `CONTACT_PHONE` in constants.