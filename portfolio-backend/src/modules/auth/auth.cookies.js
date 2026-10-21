const env = require('../../config/env');

const cookieOptions = () => ({
  httpOnly: true,
  secure: env.sessionCookieSecure,
  sameSite: env.sessionCookieSameSite,
  domain: env.sessionCookieDomain,
  path: '/',
  maxAge: env.sessionTtlMs
});

const setSessionCookie = (res, token) => res.cookie(env.sessionCookieName, token, cookieOptions());
const clearSessionCookie = (res) => res.clearCookie(env.sessionCookieName, { ...cookieOptions(), maxAge: undefined });

module.exports = { setSessionCookie, clearSessionCookie };
