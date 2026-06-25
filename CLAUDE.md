# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Frontend** (run from repo root):
```bash
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # ESLint
```

**Backend** (run from `server/`):
```bash
npm run dev      # node --watch index.js (hot-reload, port 3001)
npm start        # node index.js
```

Both processes must run simultaneously during development. The Vite dev server proxies `/api/*` to `http://localhost:3001`, so the frontend always uses relative `/api` paths.

## Architecture

This is a split-process monorepo with no shared build toolchain between frontend and backend.

### Frontend (`src/`)
React 19 + TypeScript + Tailwind v4 + React Router v7, bundled by Vite. The developer has no knowledge in React or TypeScript, the most similar experience would be Vue 3.

- **Routing** (`src/App.tsx`): Three routes — `/login`, `/dashboard`, and a catch-all that redirects to `/login`. Auth guard on DashboardPage is a `useEffect` that reads `localStorage` on mount.
- **Auth state**: Persisted to `localStorage` under the key `lh_auth` as `{ name, email, token, ts }`. No React context or global store — each page reads/writes `localStorage` directly.
- **API layer** (`src/api/auth.ts`): Single Axios instance with `baseURL: '/api'`. All typed request/response interfaces live here alongside the call functions.
- **Components** (`src/components/login/`): All login UI is broken into focused components — `BrandMark`, `SocialButtons`, `InputField`, `PasswordStrength`, `SignInForm`, `RegisterForm`. `InputField` is a shared primitive used by both forms.
- **Design tokens** (`src/index.css`): Dark navy theme defined as CSS custom properties in a Tailwind v4 `@theme` block. All colors, fonts, and spacing variants are here. Tailwind utility classes reference these via `var(--color-*)` inline styles or the `@theme` token names (`bg-paper`, `text-ink`, etc.).

### Backend (`server/`)
Express 5 (CommonJS), runs as a separate Node process. The developer has no knowledge on NodeJS and how a full JavaScript application works.

- **Entry** (`server/index.js`): Mounts CORS (origin: `localhost:5173`), JSON body parser, and the auth router at `/api/auth`. Also exposes `GET /api/health`.
- **User store** (`server/db.js`): In-memory array — **not persisted across restarts**. Seeds a demo account (`demo@devforge.io` / `demo1234`) on startup. Intended to be swapped out for a real DB.
- **Auth routes** (`server/routes/auth.js`): `POST /api/auth/signin` and `POST /api/auth/register`. Issues 7-day JWTs signed with `process.env.JWT_SECRET`. Passwords hashed with bcryptjs (cost 10).
- **Environment**: Requires a `.env` file in `server/` with `JWT_SECRET` set.

### Key conventions
- The frontend is TypeScript; the backend is plain JavaScript (CommonJS `require`/`module.exports`).
- Inline SVGs are used throughout — no icon library.
- All images must exist in Cloudinary. Request image if not given.
- No test suite exists yet.

### Database
- NoSQL Database on Mongo DB.
- The developer has no knowledge on Mongo DB, the most similar is Firebase.

@.claude/hooks/after-build.md