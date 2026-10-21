const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../app');
const { createAuthService, hashToken, sessionIsExpired } = require('../src/modules/auth/auth.service');
const { authorize, requireCsrf } = require('../src/shared/middleware/auth');
const { wouldRemoveFinalAdmin } = require('../src/modules/users/users.service');

const request = async (method, path, body) => {
  const server = await new Promise((resolve) => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  try {
    const payload = body ? JSON.stringify(body) : null;
    return await new Promise((resolve, reject) => {
      const req = http.request({ hostname: '127.0.0.1', port: server.address().port, method, path, headers: payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {} }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null }));
      });
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  } finally { server.close(); }
};

test('database session login and logout use revocable opaque sessions', async () => {
  const calls = { created: null, deleted: null };
  const fakeUser = { _id: 'u1', username: 'admin', email: 'admin@example.com', role: 'admin', active: true, comparePassword: async () => true, save: async () => {} };
  const service = createAuthService({
    findByLogin: async () => fakeUser,
    createSession: async (value) => { calls.created = value; return { _id: 's1', ...value }; },
    deleteSession: async (id) => { calls.deleted = id; },
    deleteSessionsForUser: async () => ({ deletedCount: 0 }),
    findUserById: async () => fakeUser
  });
  const result = await service.login({ username: 'admin', password: 'ValidPassword123' }, { userAgent: 'test' });
  assert.ok(result.sessionToken.length >= 40);
  assert.notEqual(calls.created.tokenHash, result.sessionToken);
  assert.equal(calls.created.tokenHash, hashToken(result.sessionToken));
  await service.logout('s1');
  assert.equal(calls.deleted, 's1');
});

test('inactive database users cannot establish a session', async () => {
  const fakeUser = { _id: 'u2', username: 'disabled', email: 'disabled@example.com', role: 'editor', active: false, comparePassword: async () => true, save: async () => {} };
  const service = createAuthService({ findByLogin: async () => fakeUser });
  await assert.rejects(() => service.login({ username: 'disabled', password: 'ValidPassword123' }), (error) => error.code === 'ACCOUNT_DISABLED');
});

test('expired sessions are rejected by the expiration boundary', () => {
  assert.equal(sessionIsExpired({ expiresAt: new Date(Date.now() - 1) }), true);
  assert.equal(sessionIsExpired({ expiresAt: new Date(Date.now() + 10_000) }), false);
});

test('role middleware blocks editor privilege escalation', () => {
  let error;
  authorize('admin')({ user: { role: 'editor' } }, {}, (value) => { error = value; });
  assert.equal(error.status, 403);
  assert.equal(error.code, 'FORBIDDEN');
});

test('editors retain permission to manage portfolio content', () => {
  let error = 'not-called';
  authorize('admin', 'editor')({ user: { role: 'editor' } }, {}, (value) => { error = value; });
  assert.equal(error, undefined);
});

test('CSRF middleware accepts only the token bound to the session', () => {
  const token = 'csrf-test-token';
  const requestWith = (value) => ({ session: { csrfTokenHash: hashToken(token) }, get: () => value });
  let accepted;
  requireCsrf(requestWith(token), {}, (error) => { accepted = error; });
  assert.equal(accepted, undefined);
  let rejected;
  requireCsrf(requestWith('wrong'), {}, (error) => { rejected = error; });
  assert.equal(rejected.code, 'CSRF_INVALID');
});

test('the final active administrator cannot be demoted or deactivated', () => {
  const target = { role: 'admin', active: true };
  assert.equal(wouldRemoveFinalAdmin({ target, nextRole: 'editor', nextActive: true, activeAdminCount: 1 }), true);
  assert.equal(wouldRemoveFinalAdmin({ target, nextRole: 'admin', nextActive: false, activeAdminCount: 1 }), true);
  assert.equal(wouldRemoveFinalAdmin({ target, nextRole: 'editor', nextActive: true, activeAdminCount: 2 }), false);
});

test('logout and user creation reject anonymous requests', async () => {
  const logout = await request('POST', '/api/auth/logout');
  const create = await request('POST', '/api/users', { username: 'attacker', email: 'attacker@example.com', password: 'AttackerPassword123', role: 'admin' });
  const update = await request('PATCH', '/api/users/not-a-user', { role: 'admin' });
  assert.equal(logout.status, 401);
  assert.equal(create.status, 401);
  assert.equal(create.body.code, 'AUTH_REQUIRED');
  assert.equal(update.status, 401);
});
