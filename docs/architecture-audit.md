# Architecture and security audit

Date: 2026-10-17

## Baseline

The repository is a two-application monorepo. `portfolio-backend/` is an Express 4 and Mongoose API deployed to a VPS with PM2. `portfolio-fronend/` (the existing misspelling is retained to avoid silently breaking Vercel settings) is a React 19/Vite application deployed separately. The public app and CMS read and write one portfolio document. Project records are embedded Mongoose subdocuments and their `_id` values are part of the API contract.

Before refactoring, the existing three backend tests, JavaScript syntax check, and Vite production build passed. The first sandbox attempt could not spawn Node/esbuild workers (`EPERM`); the same commands passed outside that process restriction.

## Critical findings confirmed

- `POST /api/auth/register` was anonymous, while new users defaulted to `admin`. This allowed immediate privilege escalation.
- `portfolio-backend/atlas-credentials.env` was tracked. Its contents were not read. Any real values in it must be treated as compromised.
- Server startup automatically provisioned an admin from environment values, increasing the blast radius of leaked deployment configuration.
- `GET /api/portfolio` inserted default content, so a read had database side effects.
- Whole-document writes accepted unrestricted request properties and returned raw internal errors.
- Upload checks trusted request MIME/extension values and did not verify decoded image dimensions/content.
- The admin token and portfolio API response were persisted in `localStorage`, leaving sensitive bearer credentials available to persistent browser scripts.
- CORS, request size, rate limiting, security headers, error handling, validation, and graceful shutdown were incomplete or distributed.
- Public and admin UI state, auth, API calls, cache behavior, and mutations were combined in `DataContext`.
- The 3,500-line stylesheet made the public visual system difficult to maintain.

## Implemented checkpoints

1. Security boundary: registration disabled, role default changed to editor, admin provisioning restricted to `scripts/upsert-admin.js`, revocable MongoDB sessions with HttpOnly cookies and CSRF, active-account enforcement, auth/upload/API rate limits, Helmet, strict credentialed CORS, safe errors and request limits.
2. Data safety: reads no longer write; an idempotent seed script was added; portfolio and project DTOs whitelist fields; reset is disabled by default and requires an explicit confirmation header; Mongoose optimistic concurrency and timestamps were enabled.
3. Media safety: local persistent-disk storage is explicit; uploaded bytes are decoded for type and dimensions; size/count/pixel limits and managed-path deletion are enforced. Existing `/uploads/...` URLs remain valid and no media was migrated.
4. Backend structure: Express composition and bootstrap were split from auth, portfolio, media, configuration, validation, repository/service and shared middleware concerns. Old import paths are compatibility shims.
5. Frontend structure: a credentialed Axios/CSRF client, TanStack Query server state, explicit public/admin routes, lazy-loaded admin bundle, feature-scoped auth API, reusable motion primitives, and split token/global/public/admin/motion CSS were introduced.
6. Experience: Phase 2 reduces the hero to two highlights, moves supporting metrics below the fold, consolidates contact, adds a visibly transforming floating nav and progress line, and provides shared one-time reveal, text, tilt, float, light-reflection and parallax primitives with RTL/reduced-motion support.
7. User management: administrators can create real MongoDB users, assign roles/status, reset passwords and revoke sessions. Editors retain content/media permissions but cannot manage users or reset the portfolio. Self-lockout and final-active-admin checks are enforced.

## Outstanding manual security actions

Do not deploy until all credentials that may have appeared in `atlas-credentials.env` are rotated. Rotate the MongoDB database user's password and any other real token/key that the file contained; remove unused Atlas users; review Atlas access logs and network allowlists; and verify the VPS and GitHub secrets contain only the new values. The file is removed from the current Git index and ignored, but it remains in earlier public commits.

Historical removal is intentionally not performed here. Coordinate a maintenance window, create a mirror backup, use `git filter-repo` (or an equivalent reviewed procedure), force-push every affected branch/tag, and have every collaborator re-clone. History cleanup does not replace credential rotation.

## Verification limits

No production database, VPS, Vercel account, or production credential was accessed. Admin login, database-backed CRUD, real upload persistence, browser interaction, and deployed cross-origin behavior require the manual staging checklist in `docs/deployment.md`.

## Final automated verification

- `npm test` in `portfolio-backend`: 18/18 passing.
- `npm run syntax:check` in `portfolio-backend`: passing.
- `npm test` in `portfolio-fronend`: 4/4 passing across navbar scroll/hash behavior, reduced motion, and accessible project-dialog interactions.
- `npm run build` in `portfolio-fronend`: passing with Vite 6.4.4.
- Full `npm audit --audit-level=high` against the official npm registry: zero known vulnerabilities in both applications.
- Existing JPEG content was decoded successfully by the hardened image inspection dependency.
- `git diff --check`: passing (Git reports only the repository's existing Windows line-ending normalization warnings).

Vitest/jsdom interaction coverage is configured. A controlled browser tool and disposable MongoDB instance were not available, so production-backed cookie, real database CRUD, visual regression, and browser-performance checks are not claimed; use the documented staging checklist.
