# Deepa's Vision — Design Spec
*Date: 2026-04-25*

## Overview
Full-stack Vedic astrology platform. Backend is complete (Express + TypeScript + MongoDB). This spec covers the frontend build and one backend fix (geocoding wire-up).

---

## Visual System — Warm Spiritual

| Token | Value | Use |
|---|---|---|
| Background | `#FAF7F2` | Page backgrounds |
| Card | `#FFF8F0` | Card surfaces |
| Primary | `#8B2635` | Buttons, active states, links |
| Accent | `#D4860B` | Gold highlights, icons, borders |
| Text | `#2C1810` | Body copy |
| Muted | `#9C7E6A` | Secondary text, placeholders |
| Border | `#E8D5C4` | Card borders, dividers |

**Typography:** Geist Sans (body), serif stack for display headings.  
**Motifs:** Subtle lotus/mandala SVG at low opacity on landing + auth pages.  
**Shadows:** `shadow-[0_2px_16px_rgba(139,38,53,0.08)]` for cards.

---

## Pages & Routes

### Public
| Route | Purpose |
|---|---|
| `/` | Landing — hero, 3 feature cards, CTA |
| `/auth/login` | Email + password login |
| `/auth/signup` | Name + email + password signup |

### Protected (USER + ADMIN)
| Route | Purpose |
|---|---|
| `/dashboard` | Profile summary card, quick-action buttons |
| `/profile/setup` | Create / edit birth details |
| `/chart` | View birth chart SVG + planetary positions table |
| `/dosha` | Select dosha type, generate report, view result + remedies |

### Admin-only
| Route | Purpose |
|---|---|
| `/admin` | User list table, total user count |

---

## State Management (Zustand)

```ts
// store/authStore.ts
interface AuthState {
  user: { _id: string; name: string; email: string; role: string } | null
  token: string | null
  isAuthenticated: boolean
  setAuth(user, token): void
  clearAuth(): void
}
```

Token persisted in `localStorage`. Axios instance in `lib/api.ts` reads token from store and injects `Authorization: Bearer <token>` header on every request.

---

## Route Protection

Next.js middleware (`middleware.ts`) reads token from localStorage is not available server-side — use a cookie approach:
- On login/signup success → store token in both `localStorage` AND an `httpOnly`-style cookie via `document.cookie` (JS-readable, not httpOnly, since we can't set httpOnly from client).
- `middleware.ts` reads the cookie and redirects unauthenticated users from `/dashboard`, `/chart`, `/dosha`, `/profile/setup` → `/auth/login`.
- Admin-only redirect: if role !== 'admin' and accessing `/admin` → `/dashboard`.

---

## Backend Fix — Geocoding

**File:** `Backend/astrology-api/src/controllers/profileController.ts`

The `geocodingHelper.ts` (Nominatim/OpenStreetMap) exists but is never called. Wire it into `createProfile` and `updateProfile`:
- Make `latitude` and `longitude` optional in `profileCreationSchema` (Joi validator).
- In `profileController.createProfile`, if lat/lon not in body, call `getCoordinates(city, country)`. If it returns null, respond 422 "Could not geocode birth city".
- Same for `updateProfile` when city/country change.

This means the frontend form needs only: `name`, `gender`, `dateOfBirth`, `timeOfBirth`, `city`, `state`, `country` — no manual coordinate input.

---

## Component Tree

```
app/
  layout.tsx              ← root layout, Providers wrapper
  page.tsx                ← landing
  auth/
    login/page.tsx
    signup/page.tsx
  dashboard/page.tsx
  profile/
    setup/page.tsx
  chart/page.tsx
  dosha/page.tsx
  admin/page.tsx
  middleware.ts

components/
  ui/
    Button.tsx
    Input.tsx
    Card.tsx
    Badge.tsx
    Spinner.tsx
  layout/
    Navbar.tsx
    Footer.tsx
  auth/
    AuthForm.tsx
  profile/
    ProfileForm.tsx
    ProfileCard.tsx
  chart/
    ChartViewer.tsx         ← renders SVG + planetary table
  dosha/
    DoshaSelector.tsx
    DoshaResult.tsx
  admin/
    UserTable.tsx

lib/
  api.ts                  ← axios instance with auth interceptor
  utils.ts                ← cn() helper

store/
  authStore.ts
```

---

## API Integration Map

| Frontend Action | Backend Endpoint | Method |
|---|---|---|
| Signup | `/api/auth/signup` | POST |
| Login | `/api/auth/signin` | POST |
| Get current user | `/api/user/me` | GET |
| Get my profile | `/api/profile` | GET |
| Create profile | `/api/profile/create` | POST |
| Update profile | `/api/profile` | PATCH |
| Generate birth chart | `/api/birth-chart/generate` | POST |
| Get my charts | `/api/birth-chart/user` | GET |
| Get chart by ID | `/api/birth-chart/:chartId` | GET |
| Get dosha types | `/api/dosha/types` | GET |
| Check dosha | `/api/dosha/check` | POST |
| Get my dosha reports | `/api/dosha/search` | GET |
| Get all users (admin) | `/api/user` | GET |

---

## Data Display — Birth Chart

The `chartData` from the API contains planetary positions. Display as:
1. SVG/image from `chartImage` field if present.
2. Fallback: table of planets with house, sign, degree from `chartData` JSON.

---

## Data Display — Dosha Report

Show per dosha:
- Present/Not Present badge
- Severity level (low/medium/high)
- Remedies list (if present)
- Raw summary text from API response

---

## Error Handling

- 401 responses → clear auth store + redirect to `/auth/login`
- 404 profile on `/dashboard` → redirect to `/profile/setup`
- Network errors → toast notification (simple inline banner, no library needed)

---

## Out of Scope

- Email delivery for forgot-password (token returned raw from API, acceptable for dev)
- Payment / subscription
- Multiple profiles per user (backend enforces one per user)
- Real-time features
