# Deployment and operations

## Required pre-deployment actions

1. Rotate every credential that may have existed in the previously tracked Atlas environment file. Review Atlas database users, access logs, and network access.
2. Back up MongoDB and the complete persistent `uploads/` directory. Test restoration before the first deployment.
3. Keep the frontend root directory as `portfolio-fronend` in Vercel. The typo is intentionally retained.
4. Configure the VPS from `.env.example`. Set `CORS_ORIGINS` to the exact HTTPS frontend origin (no path). For unrelated Vercel/VPS domains use `SESSION_COOKIE_SECURE=true` and `SESSION_COOKIE_SAME_SITE=none`. Prefer custom frontend/API subdomains under one parent domain, where `SameSite=lax` is less exposed to third-party-cookie blocking.
5. Keep `ALLOW_PORTFOLIO_RESET=false` in production. Enable only for a planned, backed-up operation, then turn it off again.

## Backend rollout

From `portfolio-backend/`, run `npm ci`, `npm run syntax:check`, and `npm test`. Provision or rotate the first administrator explicitly with `npm run admin:upsert`; server startup never creates users. Existing users receive the active default without destructive migration, and the new `sessions` collection/indexes are created by Mongoose. If the portfolio database is empty, run `npm run portfolio:seed` once. Ensure PM2 can write to `UPLOADS_DIR`, then restart with updated environment values. Verify `/api/health` for liveness and `/api/health/ready` for database readiness.

The GitHub backend workflow installs locked dependencies, runs syntax/tests, restarts PM2, and now checks the readiness endpoint. Existing VPS path and PM2 process name are unchanged.

## First administrator on the current VPS

The repository's provisioning path remains `portfolio-backend/scripts/upsert-admin.js`, exposed as `npm run admin:upsert`. It is intentionally separate from server startup and public registration remains disabled.

1. Connect with the VPS account used by the deployment workflow: `ssh <vps-user>@<vps-host>`.
2. Enter the deployed checkout and backend: `cd /home/mahmoud/apps/Portfolio/portfolio-backend`.
3. Back up MongoDB and `/home/mahmoud/apps/Portfolio/portfolio-backend/uploads/` before changing production configuration.
4. Create or edit the backend `.env` with owner-only permissions (`chmod 600 .env`). Start from `.env.example`; never commit this file.
5. Set `NODE_ENV=production`, `PORT=5000`, `HOST=127.0.0.1`, the production `MONGODB_URI`, the persistent `UPLOADS_DIR`, and `ALLOW_PORTFOLIO_RESET=false`.
6. Set `CORS_ORIGINS` to the exact deployed frontend origin, for example `https://portfolio.example.com`, with no wildcard or path.
7. For HTTPS set `SESSION_COOKIE_SECURE=true`. Use `SESSION_COOKIE_SAME_SITE=lax` when the frontend and API are same-site subdomains such as `portfolio.example.com` and `api.example.com`. If they are genuinely cross-site, use `none`, test browser third-party-cookie restrictions, and keep HTTPS mandatory. Leave `SESSION_COOKIE_DOMAIN` empty for a host-only API cookie unless a reviewed deployment specifically requires a parent-domain cookie. Keep `SESSION_COOKIE_NAME` and `SESSION_TTL_HOURS` explicit.
8. Generate a unique password with a password manager or a command such as `openssl rand -base64 32`; do not place the generated value in shell history, chat, Git, or PM2 configuration output.
9. Temporarily load `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` into the protected `.env`, run `npm run admin:upsert`, then remove `ADMIN_PASSWORD` from `.env` after the command succeeds. The script hashes it with bcrypt and creates or updates only the matching administrator.
10. Restart the existing service with `pm2 restart portfolio-api --update-env`, then inspect `pm2 status` and `pm2 logs portfolio-api --lines 80 --nostream`.
11. Verify liveness with `curl -fsS http://127.0.0.1:5000/api/health` and database readiness with `curl -fsS http://127.0.0.1:5000/api/health/ready`. Both must return success before opening the frontend.
12. Sign in at `https://<frontend-origin>/admin`, confirm refresh preserves the session, and confirm logout invalidates it. In browser developer tools verify the session cookie is HttpOnly, Secure, has the intended SameSite value, and is not exposed to JavaScript.
13. Create additional administrators or editors from **Users & roles**. Normal account creation belongs there because it applies authorization, final-admin protection, activation controls, password reset, and session revocation. Reserve `admin:upsert` for first access or deliberate account recovery on the server.
14. Each user should immediately change their password in **Account settings** and use **Revoke other sessions** after credential changes or suspected exposure.

Do not run `portfolio:seed`, enable portfolio reset, or edit MongoDB documents merely to create an administrator.

## Frontend rollout

Set `VITE_API_URL` to the HTTPS API origin without a trailing slash. In Vercel use root `portfolio-fronend`, build command `npm run build`, and output `dist`. `vercel.json` rewrites client-side routes such as `/admin` to `index.html`.

## Staging acceptance checklist

- Public portfolio loads existing database content and every existing image/resume/social URL.
- English/Arabic toggle changes `lang` and `dir`; navigation and dialogs remain keyboard usable.
- Admin login sets an HttpOnly cookie; refresh restores `/auth/me`; logout deletes the database session; expiry and manual revocation return `401`.
- Admin can create an editor, update role/status, reset another user's password, and revoke sessions. Confirm self-demotion and removal of the final active admin return `409`.
- Editor can update portfolio content and media but receives `403` from user-management and reset operations.
- Personal, experience, project, skill, education, hero-stat, and contact edits persist without deleting unrelated fields.
- Create/update/delete a temporary project; upload valid JPEG/PNG/WebP/GIF files; confirm invalid content, oversized files, excessive dimensions, and unauthenticated uploads are rejected.
- Confirm old `/uploads/...` URLs still serve and backups include newly uploaded files.
- Treat MongoDB media URLs and the VPS `UPLOADS_DIR` as one dataset. If a URL returns 404, restore or synchronize the matching file from the uploads backup; do not delete the database record merely to hide the missing file.
- Check the exact Vercel origin succeeds while an unlisted Origin is rejected.
- Confirm production cookie attributes in browser developer tools and test the deployed origin in browsers with third-party-cookie restrictions.
- Test reduced motion, phone breakpoints, modal focus/Escape, and a Lighthouse production run.

## Rollback

Keep the pre-deploy database and upload snapshot together. Roll application code back through the normal Git/PM2 deployment, restore data only if a data-changing incident occurred, and never restore the compromised credential values. This refactor requires no database migration and does not move or rename existing media.
