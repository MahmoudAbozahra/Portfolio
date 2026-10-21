# Application architecture

## Runtime topology

The React/Vite frontend remains a separate Vercel deployment. It calls the Express API on the VPS through `VITE_API_URL`. MongoDB remains the system of record. Images remain on the VPS persistent filesystem under `UPLOADS_DIR` and are served from `/uploads`; that directory must be backed up with the database.

## Backend boundaries

`src/app.js` composes middleware and routes only. `src/server.js` validates startup requirements, connects MongoDB, starts HTTP, and performs graceful shutdown. Configuration is read from `src/config/env.js`.

Modules follow route → service → repository/model direction:

- `modules/auth`: login, HttpOnly cookie sessions, CSRF binding, current-user retrieval, logout, password changes, and session revocation. Public registration always returns `403`.
- `modules/users`: administrator-only user creation, listing, role/status changes, password resets, and session revocation with self-lockout and final-admin safeguards.
- `modules/portfolio`: public read, whitelisted portfolio updates, project CRUD, and guarded reset.
- `modules/media`: Multer boundary, decoded-content validation, local storage adapter, scoped deletion, avatar/project association.
- `shared`: typed application errors, authorization, rate limits, async transport handling, sanitized API error responses.

The existing API roots and portfolio/project document shape remain compatible. Old `routes/*` and `middleware/*` modules export the new implementation to avoid breaking internal imports.

## Authentication and authorization

Authentication uses random opaque session tokens. Only a SHA-256 hash is stored in MongoDB; the browser receives the raw value exclusively in an HttpOnly cookie. Session records have TTL expiry, per-session CSRF binding, user-agent metadata, and explicit revocation. Password changes rotate the current session and revoke all older sessions. Deactivation or role changes revoke the affected user's sessions.

The API returns a deterministic per-session CSRF token after login and `/auth/me`; the frontend keeps it only in module memory and sends it as `X-CSRF-Token` on mutations. CORS allows credentials only from the exact configured origins. Production cross-site deployments require HTTPS, `Secure`, and `SameSite=None`; a shared custom parent domain permits the more robust `Lax` configuration. Server middleware—not React route state—is the authorization boundary. Editors can manage portfolio content and media; only administrators can manage users or invoke a configured portfolio reset.

## Frontend boundaries

`src/lib/apiClient.js` owns the API base URL, credentials, in-memory CSRF header, timeout, session-expiry notification, and media URL resolution. `DataContext` restores the cookie session through `/auth/me` and remains a compatibility facade over TanStack Query and focused portfolio operations. User/account calls live in `features/auth/authApi.js`; language remains separate.

`App.jsx` defines `/` and `/admin`. Admin code is lazy loaded. The CMS uses a responsive sidebar, role-aware navigation, real Users & Roles workflows, and Account Settings. Public presentation components read the API document and do not hard-code portfolio records. Reusable section, stagger, text, tilt, aurora, and progress motion lives under `components/motion`. CSS tokens, globals, motion, Phase 2 public composition, and CMS overrides are split under `styles/`.

## Data lifecycle

`GET /api/portfolio` returns the stored document or an in-memory default without inserting. `npm run portfolio:seed` performs an idempotent insert only when no portfolio exists. All writes require an active database user, a live database session, valid CSRF, and an allowed role. Updates pass through allowlisted DTOs. Existing project `_id` values and image URLs are preserved.
